import { query } from '@/lib/mysql';

export default async function TestDBPage() {
    let reservas: any[] = [];
    let error: string | null = null;
    let envInfo: any = {};

    try {
        const result = await query('SELECT * FROM reservas ORDER BY fecha_entrada DESC LIMIT 50');
        reservas = Array.isArray(result) ? result : [];
        envInfo = {
            host: process.env.MYSQL_HOST,
            db: process.env.MYSQL_DATABASE,
            user: process.env.MYSQL_USER
        };
    } catch (e: any) {
        error = e.message;
    }

    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
            <h1>Database Connectivity Test</h1>
            <div style={{ background: '#f0f0f0', padding: '1rem', borderRadius: '8px' }}>
                <p><strong>Host:</strong> {envInfo.host}</p>
                <p><strong>Database:</strong> {envInfo.db}</p>
                <p><strong>User:</strong> {envInfo.user}</p>
            </div>

            {error ? (
                <div style={{ color: 'red', marginTop: '1rem' }}>
                    <strong>Error:</strong> {error}
                </div>
            ) : (
                <div style={{ marginTop: '2rem' }}>
                    <h2>Reservas (Ultimas 50) - Count: {reservas.length}</h2>
                    <table border={1} cellPadding={10} style={{ borderCollapse: 'collapse', width: '100%' }}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Cliente</th>
                                <th>Entrada</th>
                                <th>Habitacion</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservas.map(r => (
                                <tr key={r.id}>
                                    <td>{r.id}</td>
                                    <td>{r.nombre_cliente}</td>
                                    <td>{String(r.fecha_entrada)}</td>
                                    <td>{r.habitacion_id}</td>
                                    <td>{r.estado}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
