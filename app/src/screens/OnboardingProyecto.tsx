import { useState } from 'react';
import { crearProyectoConSecciones, SECCIONES_SUGERIDAS, TIPOS_EDIFICIO, type TipoEdificio } from '../lib/data';
import { BUILD_TAG } from '../lib/build';
import type { Proyecto } from '../types/db';

interface Props {
  onListo: (p: Proyecto) => void;
  onCancelar: () => void;
}

/**
 * Onboarding de proyecto en 3 pasos:
 * 1) datos del edificio → 2) tipo → 3) secciones sugeridas (chips) + propias.
 * Las secciones serán las unidades de inspección; el entregable se arma por sección.
 */
export default function OnboardingProyecto({ onListo, onCancelar }: Props) {
  const [paso, setPaso] = useState<1 | 2 | 3>(1);
  const [nombre, setNombre] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [tipo, setTipo] = useState<TipoEdificio>('Centro comercial');
  const [activas, setActivas] = useState<Set<string>>(new Set(SECCIONES_SUGERIDAS['Centro comercial']));
  const [propia, setPropia] = useState('');
  const [extras, setExtras] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  function elegirTipo(t: TipoEdificio) {
    setTipo(t);
    setActivas(new Set(SECCIONES_SUGERIDAS[t]));
    setExtras([]);
  }

  function toggle(sec: string) {
    const s = new Set(activas);
    if (s.has(sec)) s.delete(sec);
    else s.add(sec);
    setActivas(s);
  }

  function agregarPropia() {
    const v = propia.trim();
    if (!v) return;
    setExtras([...extras, v]);
    setActivas(new Set(activas).add(v));
    setPropia('');
  }

  const seleccionadas = [...SECCIONES_SUGERIDAS[tipo], ...extras].filter((s) => activas.has(s));

  async function crear() {
    setGuardando(true);
    setError('');
    try {
      const p = await crearProyectoConSecciones(nombre.trim(), ubicacion.trim(), seleccionadas);
      onListo(p);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setGuardando(false);
    }
  }

  return (
    <>
      <div className="appbar">
        <button className="iconbtn" aria-label="Cancelar" onClick={onCancelar}>‹</button>
        <div className="grow">
          <div className="eyebrow">Nuevo proyecto</div>
          <h1>{paso === 1 ? 'El edificio' : paso === 2 ? 'Tipo de edificio' : 'Secciones a auditar'}</h1>
        </div>
        <span className="step-pill">{paso} de 3</span>
      </div>
      <div className="content">
        {error && <p className="error">{error} <span className="kv">· build {BUILD_TAG}</span></p>}

        {paso === 1 && (
          <>
            <p className="lead">Datos generales del edificio o proyecto que vas a auditar.</p>
            <label className="f">
              <span>Nombre del proyecto</span>
              <input className="in" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Torre Central" />
            </label>
            <label className="f">
              <span>Ubicación</span>
              <input className="in" value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} placeholder="Ciudad, dirección…" />
            </label>
            <div className="btnbar">
              <button className="btn primary" disabled={!nombre.trim()} onClick={() => setPaso(2)}>Continuar →</button>
            </div>
          </>
        )}

        {paso === 2 && (
          <>
            <p className="lead">Según el tipo, la app te sugiere las secciones típicas — incluidas las que suelen olvidarse.</p>
            <div className="seg wrap">
              {TIPOS_EDIFICIO.map((t) => (
                <button key={t} aria-pressed={t === tipo} onClick={() => elegirTipo(t)}>{t}</button>
              ))}
            </div>
            <div className="btnbar">
              <button className="btn primary" onClick={() => setPaso(3)}>Continuar →</button>
            </div>
          </>
        )}

        {paso === 3 && (
          <>
            <div className="hint">
              <b>Estas secciones serán tus unidades de inspección</b> — cada informe se arma por sección, y las
              no inspeccionadas quedan visibles como alcance pendiente. Activa o desactiva con un toque.
            </div>
            <div className="chips">
              {[...SECCIONES_SUGERIDAS[tipo], ...extras].map((s) => (
                <button key={s} className="chip" aria-pressed={activas.has(s)} onClick={() => toggle(s)}>{s}</button>
              ))}
            </div>
            <div className="sect">Agregar sección propia</div>
            <div className="row">
              <input
                className="in" value={propia} placeholder="Ej. Muro anclado costado norte"
                onChange={(e) => setPropia(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && agregarPropia()}
              />
              <button className="btn ghost" style={{ width: 'auto', flex: '0 0 auto' }} onClick={agregarPropia}>+</button>
            </div>
            <div className="btnbar">
              <button className="btn primary" disabled={guardando || seleccionadas.length === 0} onClick={crear}>
                {guardando ? 'Creando…' : `Crear proyecto con ${seleccionadas.length} secciones`}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
