// MVP Landing Page - Ultra minimal for debugging
'use client';

export default function MVPHome() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #1e293b, #0f172a)', color: 'white', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>🚗 VehicleAuctions MVP</h1>
      <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>✅ Deployment successful!</p>

      <div style={{ marginBottom: '2rem' }}>
        <p style={{ color: '#cbd5e1', marginBottom: '1rem' }}>Environment Check:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>✅ Next.js running</li>
          <li>✅ Render deployment active</li>
          <li>✅ Client components working</li>
        </ul>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Quick Actions:</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <a href="/mvp/signup" style={{ padding: '0.75rem 1.5rem', background: '#2563eb', color: 'white', textDecoration: 'none', borderRadius: '0.5rem' }}>
            S'inscrire
          </a>
          <a href="/mvp/login" style={{ padding: '0.75rem 1.5rem', background: '#16a34a', color: 'white', textDecoration: 'none', borderRadius: '0.5rem' }}>
            Se connecter
          </a>
          <a href="/mvp/browse" style={{ padding: '0.75rem 1.5rem', background: '#7c3aed', color: 'white', textDecoration: 'none', borderRadius: '0.5rem' }}>
            Parcourir
          </a>
        </div>
      </div>
    </div>
  );
}
