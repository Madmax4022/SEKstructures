import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, supabaseConfigured } from './lib/supabase';
import { asegurarPerfil } from './lib/data';
import Login from './screens/Login';
import Proyectos from './screens/Proyectos';
import OnboardingProyecto from './screens/OnboardingProyecto';
import ProyectoDetalle from './screens/ProyectoDetalle';
import type { Proyecto } from './types/db';

type Vista = { v: 'proyectos' } | { v: 'onboarding' } | { v: 'detalle'; proyecto: Proyecto };

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [listo, setListo] = useState(false);
  const [vista, setVista] = useState<Vista>({ v: 'proyectos' });

  useEffect(() => {
    if (!supabase) {
      setListo(true);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setListo(true);
      if (data.session) void asegurarPerfil();
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (s) void asegurarPerfil();
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!supabaseConfigured) {
    return (
      <main className="centered">
        <div className="card" style={{ maxWidth: 420 }}>
          <p className="error">Supabase sin configurar</p>
          <p className="muted">
            Copia <code>.env.example</code> a <code>.env.local</code> con la URL y la anon key de tu
            proyecto, y aplica la migración de <code>supabase/migrations/</code>.
          </p>
        </div>
      </main>
    );
  }

  if (!listo) return <main className="centered"><p className="empty">Cargando…</p></main>;
  if (!session) return <Login />;

  return (
    <div className="shell">
      {vista.v === 'proyectos' && (
        <Proyectos
          onAbrir={(p) => setVista({ v: 'detalle', proyecto: p })}
          onNuevo={() => setVista({ v: 'onboarding' })}
          onSalir={() => void supabase?.auth.signOut()}
        />
      )}
      {vista.v === 'onboarding' && (
        <OnboardingProyecto
          onListo={(p) => setVista({ v: 'detalle', proyecto: p })}
          onCancelar={() => setVista({ v: 'proyectos' })}
        />
      )}
      {vista.v === 'detalle' && (
        <ProyectoDetalle proyecto={vista.proyecto} onVolver={() => setVista({ v: 'proyectos' })} />
      )}
    </div>
  );
}
