import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = ['/login', '/api/auth/login'];
const authPaths = ['/admin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get('admin-session')?.value;
  
  // Verificar si la ruta es pública
  const isPublicPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith(path + '/')) || 
    pathname === '/';
  
  // Verificar si la ruta requiere autenticación
  const isAuthPath = authPaths.some(path => 
    pathname === path || pathname.startsWith(path + '/'));
  
  // Si la ruta es de API de autenticación, permitir el acceso
  if (pathname.startsWith('/api/auth/')) {
    return NextResponse.next();
  }

  // Redirigir al login si no hay sesión y la ruta requiere autenticación
  if (!session && isAuthPath) {
    const loginUrl = new URL('/login', request.url);
    // Guardar la URL a la que intentaba acceder para redirigir después del login
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirigir al dashboard si hay sesión y está en una ruta pública
  if (session && isPublicPath && pathname !== '/admin') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|css|js)$).*)',
  ],
};
