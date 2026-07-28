import { useEffect, useState } from 'react';
import { borrarHallazgo, listarHallazgos, urlsFotos } from '../lib/data';
import { PLAZO } from '../lib/criterio';
import type { Hallazgo, Modulo, Proyecto } from '../types/db';

interface Props {
  proyecto: Proyecto;
  modulo: Modulo;
  inspeccionId: string;
  onNuevoHallazgo: (siguienteNumero: number) => void;
  onNoEvaluados: () => void;
  onInforme: () => void;
  onVolver: () => void;
}

const NIVELES = [5, 4, 3, 2, 1] as const;

export default function Inspeccion({ modulo, inspeccionId, onNuevoHallazgo, onNoEvaluados, onInforme, onVolver }: Props) {
  const [hallazgos, setHallazgos] = useState<Hallazgo[] | null>(null);
  const [filtro, setFiltro] = useState<'all' | number>('all');
  const [error, setError] = useState('');
  const [detalle, setDetalle] = useState<Hallazgo | null>(null);
  const [fotos, setFotos] = useState<string[] | null>(null);
  const [confirmando, setConfirmando] = useState(false);
  const [borrando, setBorrando] = useState(false);

  function cargar() {
    listarHallazgos(inspeccionId)
      .then(setHallazgos)
      .catch((e: Error) => setError(e.message));
  }
  useEffect(cargar, [inspeccionId]);

  function abrirDetalle(h: Hallazgo) {
    setDetalle(h);
    setConfirmando(false);
    setFotos(null);
    urlsFotos(h.id).then(setFotos).catch(() => setFotos([]));
  }

  async function eliminar() {
    if (!detalle) return;
    setBorrando(true);
    try {
      await borrarHallazgo(detalle.id);
      setDetalle(null);
      cargar();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
    setBorrando(false);
  }

  const visibles = hallazgos?.filter((h) => filtro === 'all' || h.nivel_riesgo === filtro) ?? null;

  return (
    <>
      <div className="appbar">
        <button className="iconbtn" aria-label="Volver" onClick={onVolver}>‹</button>
        <div className="grow">
          <div className="eyebrow">Inspección · {modulo.nombre}</div>
          <h1>Hallazgos {hallazgos ? `· ${hallazgos.length}` : ''}</h1>
        </div>
      </div>
      <div className="content">
        <p className="lead">
          Registra cada hallazgo con su síntoma y nivel de riesgo. La matriz se ordena sola por severidad.
        </p>
        {error && <p className="error">{error}</p>}
        {(hallazgos?.length ?? 0) > 3 && (<>
        <div className="sect">Filtrar por nivel de riesgo</div>
        <div className="filters">
          <button className="fchip all" aria-pressed={filtro === 'all'} onClick={() => setFiltro('all')}>Todos</button>
          {NIVELES.map((n) => (
            <button
              key={n}
              className="fchip"
              style={{ ['--c' as string]: `var(--risk-${n})` }}
              aria-pressed={filtro === n}
              onClick={() => setFiltro(n)}
            >
              <i className="cdot" />{n}
            </button>
          ))}
        </div>
        </>)}
        {visibles === null && !error && <p className="empty">Cargando…</p>}
        {visibles?.length === 0 && (
          <p className="empty">{filtro === 'all' ? 'Aún sin hallazgos. Registra el primero.' : 'Sin hallazgos en este nivel.'}</p>
        )}
        {visibles?.map((h) => (
          <div key={h.id} className="card tap" role="button" tabIndex={0}
               onClick={() => abrirDetalle(h)} onKeyDown={(e) => e.key === 'Enter' && abrirDetalle(h)}>
            <div className="row">
              <div className="stripe" style={{ background: `var(--risk-${h.nivel_riesgo})` }} />
              <div className="grow">
                <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
                  <span className="kv">#{String(h.numero).padStart(3, '0')}</span>
                  {h.origen === 'NORMADO'
                    ? <span className="tag norm">◆ Lista de verificación</span>
                    : <span className="tag">◇ Observación directa</span>}
                  {h.requiere_analisis_mayor && <span className="tag">Ing. estructural</span>}
                </div>
                <div className="title" style={{ marginTop: 6 }}>{h.descripcion}</div>
                <div className="muted">
                  {h.ubicacion} · {h.sintoma_principal}
                  {h.sintomas.length > 1 && <b> +{h.sintomas.length - 1}</b>}
                  {h.medida_guiada && ` · ${h.medida_guiada}`}
                </div>
                <div className="kv" style={{ marginTop: 7 }}>Plazo sugerido · {PLAZO[h.nivel_riesgo]}</div>
              </div>
              <div className="risk">
                <div className="meter" aria-hidden>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <i key={i} style={i <= h.nivel_riesgo ? { background: `var(--risk-${h.nivel_riesgo})` } : undefined} />
                  ))}
                </div>
                <div className={`badge r${h.nivel_riesgo}`}>{h.nivel_riesgo}</div>
              </div>
            </div>
          </div>
        ))}
        <div className="btnbar">
          <button className="btn primary" onClick={() => onNuevoHallazgo((hallazgos?.length ?? 0) + 1)}>
            + Nuevo hallazgo
          </button>
          <button className="btn ghost" onClick={onNoEvaluados}>Elementos no evaluados</button>
          <button className="btn ghost" onClick={onInforme}>Generar entregable →</button>
        </div>
      </div>

      {detalle && (
        <div className="sheetwrap" role="dialog" aria-modal="true" aria-label="Detalle del hallazgo">
          <div className="sheetbg" onClick={() => setDetalle(null)} />
          <div className="sheetcard">
            <div className="sheetgrip" />
            <div className="sheethead">
              <b>Hallazgo #{String(detalle.numero).padStart(3, '0')}</b>
              <button className="sheetx" onClick={() => setDetalle(null)} aria-label="Cerrar">✕</button>
            </div>

            <div className="row" style={{ gap: 10, margin: '10px 0 14px' }}>
              <div className={`badge r${detalle.nivel_riesgo}`}>{detalle.nivel_riesgo}</div>
              <div className="grow">
                <div className="title">{detalle.descripcion}</div>
                <div className="kv">{PLAZO[detalle.nivel_riesgo]}</div>
              </div>
            </div>

            {fotos === null && <p className="empty">Cargando evidencia…</p>}
            {fotos?.map((u) => (
              <img key={u} src={u} alt="Evidencia del hallazgo"
                   style={{ width: '100%', borderRadius: 12, marginBottom: 10, border: '1px solid var(--line)' }} />
            ))}
            {fotos?.length === 0 && <p className="empty">Sin fotografía registrada.</p>}

            <div className="card" style={{ marginTop: 4 }}>
              <div className="row" style={{ justifyContent: 'space-between' }}><span className="muted">Ubicación</span><b className="kv">{detalle.ubicacion}</b></div>
              <div className="row" style={{ justifyContent: 'space-between', marginTop: 8 }}><span className="muted">Elemento</span><b className="kv">{detalle.tipo_estructural ?? detalle.categoria_no_estructural ?? '—'}</b></div>
              <div className="row" style={{ justifyContent: 'space-between', marginTop: 8, gap: 12 }}><span className="muted">Síntomas</span><b className="kv" style={{ textAlign: 'right' }}>{detalle.sintomas.join(', ')}</b></div>
              {detalle.medida_guiada && (
                <div className="row" style={{ justifyContent: 'space-between', marginTop: 8 }}><span className="muted">Medida</span><b className="kv">{detalle.medida_guiada}</b></div>
              )}
              <div className="row" style={{ justifyContent: 'space-between', marginTop: 8 }}><span className="muted">Detectado</span><b className="kv">{detalle.origen === 'NORMADO' ? 'Lista de verificación' : 'Observación directa'}</b></div>
              {detalle.requiere_analisis_mayor && (
                <div className="row" style={{ justifyContent: 'space-between', marginTop: 8 }}><span className="muted">Bandera</span><b className="kv" style={{ color: 'var(--risk-4)' }}>Requiere ingeniero</b></div>
              )}
            </div>

            {!confirmando ? (
              <div className="btnbar">
                <button className="btn ghost" style={{ color: 'var(--risk-5)', borderColor: 'var(--risk-5)' }}
                        onClick={() => setConfirmando(true)}>
                  Eliminar hallazgo
                </button>
              </div>
            ) : (
              <>
                <div className="hint warn" style={{ marginTop: 14 }}>
                  <b>¿Eliminar el hallazgo #{String(detalle.numero).padStart(3, '0')}?</b> Se borra también su
                  evidencia fotográfica. Esta acción no se puede deshacer.
                </div>
                <div className="btnbar" style={{ marginTop: 0 }}>
                  <button className="btn primary" style={{ background: 'var(--risk-5)' }} disabled={borrando} onClick={eliminar}>
                    {borrando ? 'Eliminando…' : 'Sí, eliminar'}
                  </button>
                  <button className="btn ghost" onClick={() => setConfirmando(false)}>Cancelar</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
