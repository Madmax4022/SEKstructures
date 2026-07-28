import { useEffect, useState } from 'react';
import {
  agregarModulo, borrarModulo, listarInspecciones, listarModulos, renombrarModulo,
  type InspeccionResumen,
} from '../lib/data';
import type { Modulo, Proyecto } from '../types/db';

interface Props {
  proyecto: Proyecto;
  onVolver: () => void;
  /** Iniciar una inspección nueva (pasa por el checklist de seguridad). */
  onInspeccionar: (modulo: Modulo) => void;
  /** (A5) Retomar una inspección ya iniciada. */
  onReanudar: (modulo: Modulo, inspeccionId: string) => void;
}

export default function ProyectoDetalle({ proyecto, onVolver, onInspeccionar, onReanudar }: Props) {
  const [modulos, setModulos] = useState<Modulo[] | null>(null);
  const [nueva, setNueva] = useState('');
  const [error, setError] = useState('');
  // hoja de sección
  const [sel, setSel] = useState<Modulo | null>(null);
  const [insp, setInsp] = useState<InspeccionResumen[] | null>(null);
  const [editando, setEditando] = useState(false);
  const [nombreEdit, setNombreEdit] = useState('');
  const [confirmando, setConfirmando] = useState(false);
  const [ocupado, setOcupado] = useState(false);

  function cargar() {
    listarModulos(proyecto.id).then(setModulos).catch((e: Error) => setError(e.message));
  }
  useEffect(cargar, [proyecto.id]);

  function abrir(m: Modulo) {
    setSel(m);
    setInsp(null);
    setEditando(false);
    setConfirmando(false);
    setNombreEdit(m.nombre);
    setError('');
    listarInspecciones(m.id).then(setInsp).catch(() => setInsp([]));
  }

  async function agregar() {
    const v = nueva.trim();
    if (!v) return;
    try {
      await agregarModulo(proyecto.id, v);
      setNueva('');
      cargar();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  async function guardarNombre() {
    if (!sel || !nombreEdit.trim()) return;
    setOcupado(true);
    try {
      await renombrarModulo(sel.id, nombreEdit.trim());
      setSel({ ...sel, nombre: nombreEdit.trim() });
      setEditando(false);
      cargar();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
    setOcupado(false);
  }

  async function eliminarSeccion() {
    if (!sel) return;
    setOcupado(true);
    try {
      await borrarModulo(sel.id);
      setSel(null);
      cargar();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setConfirmando(false);
    }
    setOcupado(false);
  }

  const fecha = (s: string) =>
    new Date(s).toLocaleDateString('es-CR', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <>
      <div className="appbar">
        <button className="iconbtn" aria-label="Volver" onClick={onVolver}>‹</button>
        <div className="grow">
          <div className="eyebrow">Proyecto</div>
          <h1>{proyecto.nombre}</h1>
        </div>
      </div>
      <div className="content">
        <p className="lead">
          Secciones del edificio. Cada una es una unidad de inspección; las no inspeccionadas quedan
          visibles como alcance pendiente.
        </p>
        {error && !sel && <p className="error">{error}</p>}
        <div className="sect">Secciones {modulos ? `· ${modulos.length}` : ''}</div>
        {modulos === null && !error && <p className="empty">Cargando…</p>}
        {modulos?.length === 0 && <p className="empty">Sin secciones aún.</p>}
        {modulos?.map((m) => (
          <div key={m.id} className="card tap" role="button" tabIndex={0}
               onClick={() => abrir(m)} onKeyDown={(e) => e.key === 'Enter' && abrir(m)}>
            <div className="row">
              <div className="grow">
                <div className="title">{m.nombre}</div>
                <div className="kv">Toca para inspeccionar o ver historial</div>
              </div>
              <span className="kv">›</span>
            </div>
          </div>
        ))}
        <div className="sect">Agregar sección</div>
        <div className="row">
          <input className="in" value={nueva} placeholder="Nombre de la sección"
                 onChange={(e) => setNueva(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && agregar()} />
          <button className="btn ghost" style={{ width: 'auto', flex: '0 0 auto' }} onClick={agregar}>+</button>
        </div>
      </div>

      {sel && (
        <div className="sheetwrap" role="dialog" aria-modal="true" aria-label="Sección">
          <div className="sheetbg" onClick={() => setSel(null)} />
          <div className="sheetcard">
            <div className="sheetgrip" />
            <div className="sheethead">
              <b>{sel.nombre}</b>
              <button className="sheetx" onClick={() => setSel(null)} aria-label="Cerrar">✕</button>
            </div>
            {error && <p className="error" style={{ marginTop: 12 }}>{error}</p>}

            {editando ? (
              <>
                <label className="f" style={{ marginTop: 14 }}>
                  <span>Nuevo nombre de la sección</span>
                  <input className="in" value={nombreEdit} onChange={(e) => setNombreEdit(e.target.value)} />
                </label>
                <div className="btnbar" style={{ marginTop: 0 }}>
                  <button className="btn primary" disabled={ocupado || !nombreEdit.trim()} onClick={guardarNombre}>
                    {ocupado ? 'Guardando…' : 'Guardar nombre'}
                  </button>
                  <button className="btn ghost" onClick={() => setEditando(false)}>Cancelar</button>
                </div>
              </>
            ) : confirmando ? (
              <>
                <div className="hint warn" style={{ marginTop: 14 }}>
                  <b>¿Eliminar la sección «{sel.nombre}»?</b> Solo es posible si aún no tiene inspecciones registradas.
                </div>
                <div className="btnbar" style={{ marginTop: 0 }}>
                  <button className="btn primary" style={{ background: 'var(--risk-5)' }} disabled={ocupado} onClick={eliminarSeccion}>
                    {ocupado ? 'Eliminando…' : 'Sí, eliminar sección'}
                  </button>
                  <button className="btn ghost" onClick={() => setConfirmando(false)}>Cancelar</button>
                </div>
              </>
            ) : (
              <>
                <div className="sect" style={{ marginTop: 14 }}>Inspecciones de esta sección</div>
                {insp === null && <p className="empty">Cargando…</p>}
                {insp?.length === 0 && <p className="empty">Aún sin inspecciones.</p>}
                {insp?.map((i) => (
                  <div key={i.id} className="card tap" role="button" tabIndex={0}
                       onClick={() => onReanudar(sel, i.id)}
                       onKeyDown={(e) => e.key === 'Enter' && onReanudar(sel, i.id)}>
                    <div className="row">
                      <div className="grow">
                        <div className="title">{fecha(i.created_at)}</div>
                        <div className="muted">
                          {i.hallazgos} {i.hallazgos === 1 ? 'hallazgo' : 'hallazgos'} ·{' '}
                          {i.emitido
                            ? <span style={{ color: 'var(--ok)' }}>informe emitido</span>
                            : <span style={{ color: 'var(--risk-4)' }}>en curso</span>}
                        </div>
                      </div>
                      <span className="kv">{i.emitido ? 'ver' : 'continuar'} ›</span>
                    </div>
                  </div>
                ))}
                <div className="btnbar">
                  <button className="btn primary" onClick={() => onInspeccionar(sel)}>
                    + Iniciar inspección nueva
                  </button>
                  <div className="row" style={{ gap: 10 }}>
                    <button className="btn ghost" onClick={() => setEditando(true)}>Renombrar</button>
                    <button className="btn ghost" style={{ color: 'var(--risk-5)', borderColor: 'var(--risk-5)' }}
                            onClick={() => setConfirmando(true)}>
                      Eliminar
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
