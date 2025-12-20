import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { z } from 'zod';
import { serialize } from 'cookie';
import { loginLimiter, getIPKey, getUsernameIPkey } from '@/lib/rateLimiter';

// Credenciales válidas
// Credenciales válidas
const VALID_CREDENTIALS = {
  username: 'HotelCardenal',
  password: 'Contraseña123.'
};

// Esquema de validación
const loginSchema = z.object({
  username: z.string().min(1, 'El usuario es requerido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

// Función para obtener la IP del cliente
const getClientIP = (request: Request) => {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';
  return ip;
};

export async function POST(request: Request) {
  const ip = getClientIP(request);
  const ipKey = getIPKey(ip);
  let usernameIPkey: string | null = null;

  try {
    const body = await request.json();

    // Validar los datos de entrada
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: 'Datos de entrada inválidos', errors: result.error.flatten() },
        { status: 400 }
      );
    }

    const { username, password } = result.data;
    usernameIPkey = getUsernameIPkey(username, ip);

    // Verificar límites de intentos por IP
    const [resUsernameAndIP, resSlowByIP] = await Promise.all([
      loginLimiter.limiterConsecutiveFailsByUsernameAndIP.get(usernameIPkey),
      loginLimiter.limiterSlowBruteByIP.get(ipKey),
    ]);

    let retrySecs = 0;

    // Verificar si la IP está bloqueada
    if (resSlowByIP !== null && resSlowByIP.consumedPoints > loginLimiter.maxConsecutiveFailsByUsernameAndIP) {
      retrySecs = Math.round(resSlowByIP.msBeforeNext / 1000) || 1;
    } else if (resUsernameAndIP !== null && resUsernameAndIP.consumedPoints > loginLimiter.maxConsecutiveFailsByUsernameAndIP) {
      retrySecs = Math.round(resUsernameAndIP.msBeforeNext / 1000) || 1;
    }

    if (retrySecs > 0) {
      // Usuario bloqueado temporalmente
      return NextResponse.json(
        {
          message: `Demasiados intentos fallidos. Por favor, intente de nuevo en ${Math.ceil(retrySecs / 60)} minutos.`,
          retryAfter: retrySecs
        },
        {
          status: 429,
          headers: {
            'Retry-After': retrySecs.toString()
          }
        }
      );
    }

    // Verificar las credenciales
    if (username !== VALID_CREDENTIALS.username || password !== VALID_CREDENTIALS.password) {
      try {
        // Incrementar contador de intentos fallidos
        await Promise.all([
          loginLimiter.limiterSlowBruteByIP.consume(ipKey),
          loginLimiter.limiterConsecutiveFailsByUsernameAndIP.consume(usernameIPkey)
        ]);
      } catch (rlRejected) {
        if (rlRejected instanceof Error) {
          console.error('Error al incrementar contador de intentos fallidos:', rlRejected);
        }
      }

      const remainingAttempts = loginLimiter.maxConsecutiveFailsByUsernameAndIP -
        ((resUsernameAndIP?.consumedPoints || 0) + 1);

      return NextResponse.json(
        {
          message: `Credenciales inválidas. ${remainingAttempts > 0 ? `Intentos restantes: ${remainingAttempts}` : 'Cuenta bloqueada temporalmente.'}`,
          remainingAttempts: remainingAttempts
        },
        { status: 401 }
      );
    }

    // Si el inicio de sesión es exitoso, limpiar los contadores de intentos fallidos
    if (usernameIPkey) {
      await loginLimiter.limiterConsecutiveFailsByUsernameAndIP.delete(usernameIPkey);
    }

    // Crear una cookie de sesión segura
    const cookie = serialize('admin-session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 semana
      path: '/',
    });

    const response = NextResponse.json(
      {
        message: 'Inicio de sesión exitoso',
        remainingAttempts: loginLimiter.maxConsecutiveFailsByUsernameAndIP
      },
      { status: 200 }
    );

    // Establecer la cookie en la respuesta
    response.headers.set('Set-Cookie', cookie);

    return response;


  } catch (error) {
    console.error('Error en el servidor:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
