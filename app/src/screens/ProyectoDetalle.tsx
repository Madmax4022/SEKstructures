import { useEffect, useState } from 'react';
import { agregarModulo, listarModulos } from '../lib/data';
import type { Modulo, Proyecto } from '../types/db';

interface Props {
  proyecto: Proyecto;
  onVolver: () => void;
  onInspeccionar: (modulo: Modulo) => void;
}

export default function ProyectoDetalle({ proyecto, onVolver, onInspeccionar }: Props) {
  const [modulos, setModulos] = useState<Modulo[] | null>(null);
  const [nueva, setNueva] = useState('');
  const [error, setError] = useState('');

  function cargar() {
    listarModulos(proyecto.id)
      .then(setModulos)
      .catch((e: Error) => setError(e.message));
  }
  useEffect(cargar, [proyecto.id]);

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
        {error && <p className="error">{error}</p>}
        <div className="sect">Secciones {modulos ? `· ${modulos.length}` : ''}</div>
        {modulos === null && !error && <p className="empty">Cargando…</p>}
        {modulos?.length === 0 && <p className="empty">Sin secciones aún.</p>}
        {modulos?.map((m) => (
          <div key={m.id} className="card tap" role="button" tabIndex={0}
               onClick={() => onInspeccionar(m)} onKeyDown={(e) => e.key === 'Enter' && onInspeccionar(m)}>
            <div className="row">
              <div className="grow">
                <div className="title">{m.nombre}</div>
                <div className="kv">Toca para iniciar inspección</div>
              </div>
              <span className="kv">›</span>
            </div>
          </div>
        ))}
        <div className="sect">Agregar sección</div>
        <div className="row">
          <input
            className="in" value={nueva} placeholder="Nombre de la sección"
            onChange={(e) => setNueva(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && agregar()}
          />
          <button className="btn ghost" style={{ width: 'auto', flex: '0 0 auto' }} onClick={agregar}>+</button>
        </div>
      </div>
    </>
  );
}
