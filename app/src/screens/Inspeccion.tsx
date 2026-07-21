import { useEffect, useState } from 'react';
import { listarHallazgos } from '../lib/data';
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

  useEffect(() => {
    listarHallazgos(inspeccionId)
      .then(setHallazgos)
      .catch((e: Error) => setError(e.message));
  }, [inspeccionId]);

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
          <div key={h.id} className="card">
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
    </>
  );
}
