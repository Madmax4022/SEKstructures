import { useEffect, useState } from 'react';
import { supabase, supabaseConfigured } from './lib/supabase';

type Estado = 'sin-configurar' | 'verificando' | 'conectado' | 'error';

export default function App() {
  const [estado, setEstado] = useState<Estado>(supabaseConfigured ? 'verificando' : 'sin-configurar');
  const [detalle, setDetalle] = useState('');

  useEffect(() => {
    if (!supabase) return;
    supabase.auth
      .getSession()
      .then(() => setEstado('conectado'))
      .catch((e: Error) => {
        setEstado('error');
        setDetalle(e.message);
      });
  }, []);

  return (
    <main style={styles.main}>
      <h1 style={styles.h1}>SEK Estructuras</h1>
      <p style={styles.sub}>Etapa 0 — cimientos (modelo de datos + conexión)</p>
      <div style={styles.card}>
        {estado === 'sin-configurar' && (
          <>
            <p style={styles.badgeWarn}>Supabase sin configurar</p>
            <p>
              Copia <code>.env.example</code> a <code>.env.local</code> y define{' '}
              <code>VITE_SUPABASE_URL</code> y <code>VITE_SUPABASE_ANON_KEY</code> con los datos de
              tu proyecto Supabase. Luego aplica la migración{' '}
              <code>supabase/migrations/0001_esquema_inicial.sql</code>.
            </p>
          </>
        )}
        {estado === 'verificando' && <p>Verificando conexión…</p>}
        {estado === 'conectado' && <p style={styles.badgeOk}>Conectado a Supabase ✓</p>}
        {estado === 'error' && (
          <>
            <p style={styles.badgeWarn}>Error de conexión</p>
            <p>{detalle}</p>
          </>
        )}
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    fontFamily: 'system-ui, sans-serif',
    background: '#0d1420',
    color: '#e7eef7',
    padding: 24,
  },
  h1: { margin: 0, fontSize: 28 },
  sub: { margin: 0, color: '#9aabc2', fontFamily: 'ui-monospace, monospace', fontSize: 13 },
  card: {
    maxWidth: 520,
    background: '#141d2c',
    border: '1px solid #26344a',
    borderRadius: 14,
    padding: 20,
    lineHeight: 1.6,
  },
  badgeOk: { color: '#3e9b5f', fontWeight: 700 },
  badgeWarn: { color: '#df7333', fontWeight: 700 },
};
