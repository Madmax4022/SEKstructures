import { useState } from 'react';
import { SEGURIDAD_ITEMS } from '../lib/criterio';
import { crearInspeccion } from '../lib/data';
import type { Modulo, Proyecto } from '../types/db';

interface Props {
  proyecto: Proyecto;
  modulo: Modulo;
  onIniciada: (inspeccionId: string) => void;
  onCancelar: () => void;
}

/** Checklist ATS/EPP — obligatorio antes del recorrido (eje SSO, dictamen S1). */
export default function Seguridad({ proyecto, modulo, onIniciada, onCancelar }: Props) {
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [error, setError] = useState('');
  const [creando, setCreando] = useState(false);
  const todo = SEGURIDAD_ITEMS.every((i) => checks[i.k]);

  async function comenzar() {
    setCreando(true);
    setError('');
    try {
      const id = await crearInspeccion(proyecto.id, modulo.id, checks);
      onIniciada(id);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setCreando(false);
    }
  }

  return (
    <>
      <div className="appbar">
        <button className="iconbtn" aria-label="Cancelar" onClick={onCancelar}>‹</button>
        <div className="grow">
          <div className="eyebrow">{modulo.nombre}</div>
          <h1>Seguridad del inspector</h1>
        </div>
      </div>
      <div className="content">
        <div className="hint">
          <b>Antes de entrar.</b> Este checklist (ATS + EPP) es obligatorio para iniciar el recorrido —
          la app cuida al hallazgo, pero primero te cuida a ti.
        </div>
        {error && <p className="error">{error}</p>}
        {SEGURIDAD_ITEMS.map((i) => (
          <label key={i.k} className="check">
            <input
              type="checkbox"
              checked={!!checks[i.k]}
              onChange={(e) => setChecks({ ...checks, [i.k]: e.target.checked })}
            />
            <div>
              <div className="t">{i.t}</div>
              <div className="d">{i.d}</div>
            </div>
          </label>
        ))}
        <div className="btnbar">
          <button className="btn primary" disabled={!todo || creando} onClick={comenzar}>
            {creando ? 'Iniciando…' : 'Comenzar recorrido'}
          </button>
        </div>
      </div>
    </>
  );
}
