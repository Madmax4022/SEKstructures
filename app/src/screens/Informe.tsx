import { useEffect, useMemo, useState } from 'react';
import { contarFotos, emitirInforme, fotosComoDataUrl, listarHallazgos, listarNoEvaluados, obtenerPerfil, type NoEvaluado } from '../lib/data';
import { PLAZO } from '../lib/criterio';
import type { Hallazgo, Modulo, Proyecto } from '../types/db';

interface Props { proyecto: Proyecto; modulo: Modulo; inspeccionId: string; onVolver: () => void }

const NIVELES = [5, 4, 3, 2, 1] as const;

function csvMatriz(hallazgos: Hallazgo[]): string {
  const head = ['N°', 'Nivel', 'Descripción', 'Ubicación', 'Síntoma principal', 'Plazo sugerido',
    'Responsable', 'Estado', 'Fecha de cierre', 'Foto antes (S/N)', 'Foto después (S/N)',
    'Verificación en sitio (S/N)', 'Visto bueno profesional'];
  const filas = hallazgos.map((h) => [
    String(h.numero).padStart(3, '0'), h.nivel_riesgo, h.descripcion, h.ubicacion,
    h.sintoma_principal, PLAZO[h.nivel_riesgo], '', 'ABIERTO', '', '', '', '', '',
  ]);
  const esc = (v: unknown) => String(v).replace(/[\t\r\n]+/g, ' ');
  return [head, ...filas].map((f) => f.map(esc).join('\t')).join('\r\n');
}

/** UTF-16LE con BOM: la única codificación que Excel abre bien en cualquier región. */
function aUtf16le(texto: string): ArrayBuffer {
  const ab = new ArrayBuffer(texto.length * 2 + 2);
  const buf = new Uint8Array(ab);
  buf[0] = 0xff; buf[1] = 0xfe;
  for (let i = 0; i < texto.length; i++) {
    const c = texto.charCodeAt(i);
    buf[2 + i * 2] = c & 0xff;
    buf[3 + i * 2] = c >> 8;
  }
  return ab;
}

export default function Informe({ proyecto, modulo, inspeccionId, onVolver }: Props) {
  const [hallazgos, setHallazgos] = useState<Hallazgo[]>([]);
  const [unev, setUnev] = useState<NoEvaluado[]>([]);
  const [fotos, setFotos] = useState(0);
  const [nombre, setNombre] = useState('');
  const [colegiatura, setColegiatura] = useState('');
  const [entregadoA, setEntregadoA] = useState('');
  const [emitido, setEmitido] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [emitiendo, setEmitiendo] = useState(false);
  const [preparando, setPreparando] = useState(false);

  useEffect(() => {
    listarHallazgos(inspeccionId).then(async (hs) => {
      setHallazgos(hs);
      setFotos(await contarFotos(hs.map((h) => h.id)));
    }).catch((e: Error) => setError(e.message));
    listarNoEvaluados(inspeccionId).then(setUnev).catch(() => {});
    obtenerPerfil().then((p) => { setNombre(p.nombre); setColegiatura(p.colegiatura_registro ?? ''); });
  }, [inspeccionId]);

  const resumen = useMemo(() => {
    const c: Record<string, number> = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };
    hallazgos.forEach((h) => { c[String(h.nivel_riesgo)]++; });
    return c;
  }, [hallazgos]);

  const declaracion = `Este informe cubre las etapas de inspección, clasificación de riesgo y presentación de resultados de la sección «${modulo.nombre}» del proyecto «${proyecto.nombre}». El monitoreo, cierre y verificación posteriores son responsabilidad del receptor; se anexa matriz de seguimiento para ese fin.`;


  async function imprimirInforme() {
    setPreparando(true);
    const galeria = await fotosComoDataUrl(hallazgos.map((h) => h.id)).catch(() => new Map<string, string[]>());
    const filas = hallazgos.map((h) => `<tr><td>${String(h.numero).padStart(3, '0')}</td><td class="n${h.nivel_riesgo}">${h.nivel_riesgo}</td><td>${h.descripcion}</td><td>${h.ubicacion}</td><td>${h.sintoma_principal}${h.sintomas.length > 1 ? ' +' + (h.sintomas.length - 1) : ''}</td><td>${PLAZO[h.nivel_riesgo]}</td></tr>`).join('');
    const unevFilas = unev.map((u) => `<li><b>${u.descripcion}</b> — ${u.motivo} (medio: ${u.medio_intentado})</li>`).join('');
    const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Informe de inspección — ${modulo.nombre}</title><style>
      body{font-family:Georgia,serif;color:#152238;margin:32px;line-height:1.5}
      h1{font-size:22px;margin:0}h2{font-size:14px;text-transform:uppercase;letter-spacing:1px;color:#54627b;margin:26px 0 8px;border-bottom:1px solid #c2cfe0;padding-bottom:4px}
      .meta{color:#54627b;font-size:13px;margin-top:4px}
      table{width:100%;border-collapse:collapse;font-size:12px;margin-top:6px}
      th,td{border:1px solid #c2cfe0;padding:6px 8px;text-align:left;vertical-align:top}
      th{background:#eaf0f7;font-size:11px;text-transform:uppercase}
      td.n5{background:#d6304a;color:#fff;font-weight:700;text-align:center}td.n4{background:#df7333;color:#fff;font-weight:700;text-align:center}
      td.n3{background:#c2890f;color:#fff;font-weight:700;text-align:center}td.n2{background:#3e9b5f;color:#fff;font-weight:700;text-align:center}td.n1{background:#3e77c4;color:#fff;font-weight:700;text-align:center}
      .sigrow{display:flex;gap:24px;margin-top:40px}
      .sigbox{flex:1;border:1.5px solid #152238;border-radius:8px;height:130px;position:relative;padding:10px 12px;font-size:12px}
      .sigbox .lab{text-transform:uppercase;letter-spacing:1px;font-size:10px;color:#54627b}
      .sigbox .line{position:absolute;bottom:44px;left:14px;right:14px;border-bottom:1px solid #152238}
      .sigbox .quien{position:absolute;bottom:10px;left:14px;right:14px;font-size:11.5px;color:#152238;line-height:1.4}
      .decl{font-size:12px;color:#54627b;border:1px solid #c2cfe0;padding:10px 12px;border-radius:6px}
      .eviditem{margin-bottom:18px;page-break-inside:avoid;break-inside:avoid}
      .evidcap{font-size:11.5px;color:#152238;margin-bottom:5px}
      .evidfotos{display:flex;gap:8px;flex-wrap:wrap}
      .evidfotos img{max-width:47%;max-height:230px;border:1px solid #c2cfe0;border-radius:4px;object-fit:cover}
    </style></head><body>
      <h1>Informe de inspección — ${proyecto.nombre}</h1>
      <div class="meta">Sección: ${modulo.nombre} · Emitido: ${emitido ?? new Date().toLocaleString('es-CR')} · Hallazgos: ${total} · No evaluados: ${unev.length} · Evidencia: ${fotos}/${total} fotos</div>
      <h2>Resumen por nivel de riesgo</h2>
      <table><tr><th>Nivel 5</th><th>Nivel 4</th><th>Nivel 3</th><th>Nivel 2</th><th>Nivel 1</th></tr>
      <tr><td>${resumen['5']}</td><td>${resumen['4']}</td><td>${resumen['3']}</td><td>${resumen['2']}</td><td>${resumen['1']}</td></tr></table>
      <h2>Matriz de hallazgos</h2>
      <table><tr><th>N°</th><th>Nivel</th><th>Descripción</th><th>Ubicación</th><th>Síntomas</th><th>Plazo sugerido</th></tr>${filas}</table>
      <h2>Evidencia fotográfica</h2>
      ${hallazgos.some((h) => (galeria.get(h.id) ?? []).length)
        ? hallazgos.filter((h) => (galeria.get(h.id) ?? []).length).map((h) => `
            <div class="eviditem">
              <div class="evidcap"><b>#${String(h.numero).padStart(3, '0')}</b> · Nivel ${h.nivel_riesgo} · ${h.ubicacion} — ${h.descripcion}</div>
              <div class="evidfotos">${(galeria.get(h.id) ?? []).map((src) => `<img src="${src}" alt="Evidencia del hallazgo ${h.numero}">`).join('')}</div>
            </div>`).join('')
        : '<p>Sin fotografías disponibles.</p>'}
      <h2>Elementos no evaluados (alcance real)</h2>
      ${unevFilas ? '<ul>' + unevFilas + '</ul>' : '<p>Ninguno registrado.</p>'}
      <h2>Declaración de alcance</h2>
      <p class="decl">${declaracion}</p>
      <div class="sigrow">
        <div class="sigbox"><span class="lab">Firma del profesional competente</span><span class="line"></span>
          <span class="quien">${nombre} · Colegiatura: ${colegiatura || '—'}<br>Sello de tiempo: ${emitido ?? '(borrador — sin emitir)'}</span></div>
        <div class="sigbox"><span class="lab">Recibido por</span><span class="line"></span>
          <span class="quien">${entregadoA || 'Nombre y fecha'}</span></div>
      </div>
    </body></html>`;
    const f = document.createElement('iframe');
    f.style.display = 'none';
    document.body.appendChild(f);
    f.srcdoc = html;
    f.onload = () => { f.contentWindow?.print(); setPreparando(false); setTimeout(() => f.remove(), 2000); };
  }

  function descargarMatriz() {
    const blob = new Blob([aUtf16le(csvMatriz(hallazgos))], { type: 'text/csv;charset=utf-16le' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `matriz-seguimiento-${modulo.nombre.replace(/\W+/g, '-')}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function emitir() {
    setEmitiendo(true);
    setError('');
    try {
      await emitirInforme({ inspeccionId, colegiatura: colegiatura.trim(), resumen, declaracion, entregadoA: entregadoA.trim() });
      setEmitido(new Date().toLocaleString('es-CR', { dateStyle: 'medium', timeStyle: 'short' }));
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
    setEmitiendo(false);
  }

  const total = hallazgos.length;
  return (
    <>
      <div className="appbar">
        <button className="iconbtn" aria-label="Volver" onClick={onVolver}>‹</button>
        <div className="grow">
          <div className="eyebrow">Resultados · {modulo.nombre}</div>
          <h1>Entregable</h1>
        </div>
      </div>
      <div className="content">
        <p className="lead">Resultados en blanco y negro, firmados, en manos del encargado. <b>La app entrega y se detiene aquí.</b></p>
        {error && <p className="error">{error}</p>}

        <div className="sect">Resumen por nivel de riesgo</div>
        <div style={{ display: 'flex', height: 16, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--line)', marginBottom: 12 }}>
          {NIVELES.map((n) => resumen[String(n)] > 0 && (
            <span key={n} style={{ width: `${(resumen[String(n)] / Math.max(total, 1)) * 100}%`, background: `var(--risk-${n})` }} />
          ))}
          {total === 0 && <span style={{ width: '100%', background: 'var(--line)' }} />}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 7, marginBottom: 6 }}>
          {NIVELES.map((n) => (
            <div key={n} className="card" style={{ textAlign: 'center', padding: '10px 4px', marginBottom: 0 }}>
              <div className={`badge r${n}`} style={{ margin: '0 auto 6px', width: 30, height: 30, fontSize: 15 }}>{n}</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 22, fontWeight: 700 }}>{resumen[String(n)]}</div>
            </div>
          ))}
        </div>

        <div className="sect">Contenido del informe</div>
        <div className="card">
          <div className="row" style={{ justifyContent: 'space-between' }}><span className="muted">Hallazgos registrados</span><b className="kv">{total}</b></div>
          <div className="row" style={{ justifyContent: 'space-between', marginTop: 8 }}><span className="muted">Elementos no evaluados</span><b className="kv">{unev.length}</b></div>
          <div className="row" style={{ justifyContent: 'space-between', marginTop: 8 }}><span className="muted">Evidencia fotográfica</span><b className="kv">{fotos} / {total}</b></div>
          <div className="row" style={{ justifyContent: 'space-between', marginTop: 8 }}><span className="muted">Declaración de alcance</span><b className="kv" style={{ color: 'var(--ok)' }}>Incluida</b></div>
        </div>

        <div className="sect">Firma del profesional competente</div>
        <div className="card" style={{ borderStyle: 'dashed' }}>
          <div className="title">{nombre || 'Profesional responsable'}</div>
          <label className="f" style={{ margin: '10px 0 0' }}>
            <span>Colegiatura / registro profesional</span>
            <input className="in" value={colegiatura} onChange={(e) => setColegiatura(e.target.value)} placeholder="Ej. CFIA IC-12345" />
          </label>
          <label className="f" style={{ margin: '12px 0 0' }}>
            <span>Entregado a</span>
            <input className="in" value={entregadoA} onChange={(e) => setEntregadoA(e.target.value)} placeholder="Ej. Administración del proyecto" />
          </label>
        </div>

        {emitido && (
          <div className="hint" style={{ borderColor: 'var(--ok)' }}>
            <b style={{ color: 'var(--ok)' }}>✓ Informe emitido y entregado</b><br />
            Sello de tiempo: {emitido} · registro inmutable en la base (cadena de custodia).
          </div>
        )}

        <div className="btnbar">
          <button className="btn ghost" onClick={imprimirInforme} disabled={total === 0 || preparando}>
            {preparando ? 'Preparando informe con fotos…' : '🖨 Informe — imprimir / guardar PDF'}
          </button>
          <button className="btn ghost" onClick={descargarMatriz} disabled={total === 0}>
            ⇩ Matriz de seguimiento (CSV para Excel)
          </button>
          <button className="btn primary" onClick={emitir} disabled={emitiendo || !!emitido || !colegiatura.trim() || total === 0}>
            {emitido ? 'Informe emitido ✓' : emitiendo ? 'Emitiendo…' : 'Emitir informe firmado'}
          </button>
          {!emitido && !colegiatura.trim() && <p className="tipline">Escribe tu colegiatura / registro para emitir.</p>}
        </div>
        <p className="tipline" style={{ marginTop: 18 }}>— La app entrega y se detiene aquí —<br />el seguimiento de la reparación es externo</p>
      </div>
    </>
  );
}
