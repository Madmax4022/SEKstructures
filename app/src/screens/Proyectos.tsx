import { useEffect, useState } from 'react';
import { listarProyectos } from '../lib/data';
import type { Proyecto } from '../types/db';

interface Props {
  onAbrir: (p: Proyecto) => void;
  onNuevo: () => void;
  onSalir: () => void;
}

export default function Proyectos({ onAbrir, onNuevo, onSalir }: Props) {
  const [proyectos, setProyectos] = useState<Proyecto[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    listarProyectos()
      .then(setProyectos)
      .catch((e: Error) => setError(e.message));
  }, []);

  return (
    <>
      <div className="appbar">
        <div className="grow">
          <div className="eyebrow">Proyectos</div>
          <h1>Inspecciones</h1>
        </div>
        <button className="iconbtn" aria-label="Cerrar sesión" title="Cerrar sesión" onClick={onSalir}>⎋</button>
      </div>
      <div className="content">
        <p className="lead">
          Cada proyecto es un edificio dividido en <b>secciones</b>. La app entrega el informe y se detiene.
        </p>
        {error && <p className="error">{error}</p>}
        {proyectos === null && !error && <p className="empty">Cargando…</p>}
        {proyectos?.length === 0 && <p className="empty">Aún no tienes proyectos. Crea el primero.</p>}
        {proyectos?.map((p) => (
          <div key={p.id} className="card tap" role="button" tabIndex={0}
               onClick={() => onAbrir(p)} onKeyDown={(e) => e.key === 'Enter' && onAbrir(p)}>
            <div className="row">
              <div className="grow">
                <div className="title">{p.nombre}</div>
                {p.ubicacion && <div className="muted">{p.ubicacion}</div>}
              </div>
              <span className="kv">›</span>
            </div>
          </div>
        ))}
        <div className="btnbar">
          <button className="btn primary" onClick={onNuevo}>+ Nuevo proyecto</button>
        </div>
      </div>
    </>
  );
}
