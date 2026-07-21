import { useEffect, useState } from 'react';
import { agregarNoEvaluado, listarNoEvaluados, type NoEvaluado } from '../lib/data';

const MOTIVOS = ['Acceso restringido / altura', 'Cielo / acabado que impide ver', 'Iluminación o clima', 'Sin registros del elemento oculto', 'Otro'];
const MEDIOS = ['Dron', 'Binoculares', 'Pértiga con cámara', 'Zoom óptico', 'Ninguno disponible'];

export default function NoEvaluados({ inspeccionId, onVolver }: { inspeccionId: string; onVolver: () => void }) {
  const [items, setItems] = useState<NoEvaluado[] | null>(null);
  const [desc, setDesc] = useState('');
  const [motivo, setMotivo] = useState(MOTIVOS[0]);
  const [medio, setMedio] = useState(MEDIOS[0]);
  const [error, setError] = useState('');

  function cargar() {
    listarNoEvaluados(inspeccionId).then(setItems).catch((e: Error) => setError(e.message));
  }
  useEffect(cargar, [inspeccionId]);

  async function agregar() {
    if (!desc.trim()) return;
    try {
      await agregarNoEvaluado(inspeccionId, desc.trim(), motivo, medio);
      setDesc('');
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
          <div className="eyebrow">Alcance real</div>
          <h1>No evaluados</h1>
        </div>
      </div>
      <div className="content">
        <div className="hint">
          <b>Mismo peso legal que un hallazgo.</b> Deja constancia de lo que no se pudo evaluar y con qué
          medio se intentó — delimita de qué responde el informe.
        </div>
        {error && <p className="error">{error}</p>}
        {items?.length === 0 && <p className="empty">Sin elementos no evaluados aún.</p>}
        {items?.map((u) => (
          <div key={u.id} className="card">
            <div className="title">{u.descripcion}</div>
            <div className="muted">{u.motivo} · Medio: {u.medio_intentado}</div>
          </div>
        ))}
        <div className="sect">Agregar elemento no evaluado</div>
        <div className="card">
          <label className="f"><span>Qué no se pudo evaluar</span>
            <input className="in" value={desc} onChange={(e) => setDesc(e.target.value)}
                   placeholder="Ej. Cubierta metálica sobre food court" />
          </label>
          <label className="f"><span>Motivo</span>
            <select className="in" value={motivo} onChange={(e) => setMotivo(e.target.value)}>
              {MOTIVOS.map((m) => <option key={m}>{m}</option>)}
            </select>
          </label>
          <label className="f"><span>Medio intentado</span>
            <select className="in" value={medio} onChange={(e) => setMedio(e.target.value)}>
              {MEDIOS.map((m) => <option key={m}>{m}</option>)}
            </select>
          </label>
          <button className="btn ghost" onClick={agregar} disabled={!desc.trim()}>+ Registrar</button>
        </div>
      </div>
    </>
  );
}
