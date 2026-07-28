import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, supabaseConfigured } from './lib/supabase';
import { asegurarPerfil } from './lib/data';
import Login from './screens/Login';
import Proyectos from './screens/Proyectos';
import OnboardingProyecto from './screens/OnboardingProyecto';
import ProyectoDetalle from './screens/ProyectoDetalle';
import Seguridad from './screens/Seguridad';
import Inspeccion from './screens/Inspeccion';
import NuevoHallazgo from './screens/NuevoHallazgo';
import NoEvaluados from './screens/NoEvaluados';
import Informe from './screens/Informe';
import type { Modulo, Proyecto } from './types/db';

type Vista =
  | { v: 'proyectos' }
  | { v: 'onboarding' }
  | { v: 'detalle'; proyecto: Proyecto }
  | { v: 'seguridad'; proyecto: Proyecto; modulo: Modulo }
  | { v: 'inspeccion'; proyecto: Proyecto; modulo: Modulo; inspeccionId: string }
  | { v: 'hallazgo'; proyecto: Proyecto; modulo: Modulo; inspeccionId: string; numero: number }
  | { v: 'unev'; proyecto: Proyecto; modulo: Modulo; inspeccionId: string }
  | { v: 'informe'; proyecto: Proyecto; modulo: Modulo; inspeccionId: string };

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [listo, setListo] = useState(false);
  const [vista, setVista] = useState<Vista>({ v: 'proyectos' });
  const [toast, setToast] = useState('');

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

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2600);
    return () => clearTimeout(t);
  }, [toast]);

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
        <ProyectoDetalle
          proyecto={vista.proyecto}
          onVolver={() => setVista({ v: 'proyectos' })}
          onInspeccionar={(m) => setVista({ v: 'seguridad', proyecto: vista.proyecto, modulo: m })}
          onReanudar={(m, id) => setVista({ v: 'inspeccion', proyecto: vista.proyecto, modulo: m, inspeccionId: id })}
        />
      )}
      {vista.v === 'seguridad' && (
        <Seguridad
          proyecto={vista.proyecto}
          modulo={vista.modulo}
          onIniciada={(id) =>
            setVista({ v: 'inspeccion', proyecto: vista.proyecto, modulo: vista.modulo, inspeccionId: id })}
          onCancelar={() => setVista({ v: 'detalle', proyecto: vista.proyecto })}
        />
      )}
      {vista.v === 'inspeccion' && (
        <Inspeccion
          proyecto={vista.proyecto}
          modulo={vista.modulo}
          inspeccionId={vista.inspeccionId}
          onNuevoHallazgo={(numero) =>
            setVista({ v: 'hallazgo', proyecto: vista.proyecto, modulo: vista.modulo, inspeccionId: vista.inspeccionId, numero })}
          onNoEvaluados={() => setVista({ v: 'unev', proyecto: vista.proyecto, modulo: vista.modulo, inspeccionId: vista.inspeccionId })}
          onInforme={() => setVista({ v: 'informe', proyecto: vista.proyecto, modulo: vista.modulo, inspeccionId: vista.inspeccionId })}
          onVolver={() => setVista({ v: 'detalle', proyecto: vista.proyecto })}
        />
      )}
      {vista.v === 'hallazgo' && (
        <NuevoHallazgo
          proyecto={vista.proyecto}
          modulo={vista.modulo}
          inspeccionId={vista.inspeccionId}
          numero={vista.numero}
          onGuardado={(msg) => {
            setToast(msg);
            setVista({ v: 'inspeccion', proyecto: vista.proyecto, modulo: vista.modulo, inspeccionId: vista.inspeccionId });
          }}
          onCancelar={() =>
            setVista({ v: 'inspeccion', proyecto: vista.proyecto, modulo: vista.modulo, inspeccionId: vista.inspeccionId })}
        />
      )}
      {vista.v === 'unev' && (
        <NoEvaluados inspeccionId={vista.inspeccionId}
          onVolver={() => setVista({ v: 'inspeccion', proyecto: vista.proyecto, modulo: vista.modulo, inspeccionId: vista.inspeccionId })} />
      )}
      {vista.v === 'informe' && (
        <Informe proyecto={vista.proyecto} modulo={vista.modulo} inspeccionId={vista.inspeccionId}
          onVolver={() => setVista({ v: 'inspeccion', proyecto: vista.proyecto, modulo: vista.modulo, inspeccionId: vista.inspeccionId })} />
      )}
      {toast && (
        <div className="toast" role="status"><span className="tk">✓</span><span>{toast}</span></div>
      )}
    </div>
  );
}
