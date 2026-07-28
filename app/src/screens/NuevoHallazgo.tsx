import { useMemo, useState } from 'react';
import {
  CAT_E, CAT_NE, CATALOGO_E, CATALOGO_NE, MEDIDAS, PROB_OPTS, SEV_OPTS, SINTOMAS, SYM_COMBOS,
  SYM_LABEL, VERTICALES, computarNivel, PLAZO, sortSym,
} from '../lib/criterio';
import { comprimirImagen, crearHallazgo, subirFotos } from '../lib/data';
import type { Modulo, Proyecto } from '../types/db';

interface Props {
  proyecto: Proyecto;
  modulo: Modulo;
  inspeccionId: string;
  numero: number;
  onGuardado: (mensaje: string) => void;
  onCancelar: () => void;
}

function Icono({ svg }: { svg: string }) {
  return (
    <span
      className="ico"
      dangerouslySetInnerHTML={{
        __html: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${svg}</svg>`,
      }}
    />
  );
}

export default function NuevoHallazgo({ proyecto, modulo, inspeccionId, numero, onGuardado, onCancelar }: Props) {
  const [paso, setPaso] = useState<1 | 2>(1);
  // paso 1 — captura
  const [origen, setOrigen] = useState<'NORMADO' | 'NO_NORMADO'>('NO_NORMADO');
  const [tipo, setTipo] = useState<'ESTRUCTURAL' | 'NO_ESTRUCTURAL'>('ESTRUCTURAL');
  const [cat, setCat] = useState(CAT_E[0]);
  const [sintomas, setSintomas] = useState<string[]>([]);
  const [medida, setMedida] = useState<string | null>(null);
  const [ubicacion, setUbicacion] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [esLocal, setEsLocal] = useState(false);
  const [fotos, setFotos] = useState<File[]>([]);
  const [verCatalogo, setVerCatalogo] = useState(false);
  const [comprimiendo, setComprimiendo] = useState(false);
  // paso 2 — riesgo
  const [sev, setSev] = useState<number | null>(null);
  const [prob, setProb] = useState<number | null>(null);
  const [reglaDura, setReglaDura] = useState(false);
  const [vertical, setVertical] = useState<Record<string, boolean>>({});
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  const ordenadas = useMemo(() => sortSym(sintomas), [sintomas]);
  const nivel = computarNivel(sev, prob, reglaDura);
  const combos = SYM_COMBOS.filter((c) => c.req.every((k) => sintomas.includes(k)));
  const listoPaso1 = descripcion.trim().length > 0 && sintomas.length > 0 && fotos.length > 0 && !comprimiendo;

  function toggleSintoma(k: string) {
    const s = sintomas.includes(k) ? sintomas.filter((x) => x !== k) : [...sintomas, k];
    setSintomas(s);
    if (!s.includes('fisura')) setMedida(null);
  }

  async function guardar() {
    if (!nivel) return;
    setGuardando(true);
    setError('');
    try {
      const hallazgoId = await crearHallazgo({
        proyecto_id: proyecto.id,
        inspeccion_id: inspeccionId,
        numero,
        ubicacion: ubicacion.trim() || '—',
        es_local_comercial: esLocal,
        tipo_elemento: tipo,
        tipo_estructural: tipo === 'ESTRUCTURAL' ? cat : null,
        categoria_no_estructural: tipo === 'NO_ESTRUCTURAL' ? cat : null,
        sintoma_principal: SYM_LABEL[ordenadas[0]],
        sintomas: ordenadas.map((k) => SYM_LABEL[k]),
        medida_guiada: medida,
        descripcion: descripcion.trim(),
        origen,
        ref_norma: null,
        resultado_checklist: null,
        nivel_riesgo: nivel as 1 | 2 | 3 | 4 | 5,
        severidad: sev !== null ? SEV_OPTS[sev].enum : null,
        probabilidad: prob !== null ? PROB_OPTS[prob].enum : null,
        regla_dura: reglaDura,
        riesgo_justificacion: null,
        requiere_analisis_mayor: nivel >= 4,
        detalle_ingeniero:
          nivel === 4
            ? {
                soporta_carga: !!vertical.soporta_carga,
                atraviesa_elemento: !!vertical.atraviesa_elemento,
                deformacion_visible: !!vertical.deformacion_visible,
                crecio_recientemente: !!vertical.crecio_recientemente,
                patron_repetido: !!vertical.patron_repetido,
              }
            : null,
        responsable_sugerido: null,
        plazo_sugerido: PLAZO[nivel],
      });
      if (fotos.length) await subirFotos(proyecto.id, hallazgoId, fotos);
      onGuardado(`Hallazgo #${String(numero).padStart(3, '0')} registrado · nivel ${nivel}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setGuardando(false);
    }
  }

  return (
    <>
      <div className="appbar">
        <button className="iconbtn" aria-label="Atrás" onClick={() => (paso === 2 ? setPaso(1) : onCancelar())}>‹</button>
        <div className="grow">
          <div className="eyebrow">Nuevo hallazgo · {modulo.nombre}</div>
          <h1>{paso === 1 ? 'Registrar' : 'Clasificar riesgo'}</h1>
        </div>
        <span className="step-pill">{paso} de 2</span>
      </div>
      <div className="content">
        {error && <p className="error">{error}</p>}

        {paso === 1 && (
          <>
            <label className="f">
              <span>¿Cómo lo detectaste?</span>
              <div className="opts c2">
                <button type="button" className="opt" style={{ ['--c' as string]: '#2f8f9d' }}
                        aria-pressed={origen === 'NORMADO'} onClick={() => setOrigen('NORMADO')}>
                  <Icono svg='<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/><path d="M8.5 13.5l2 2 4-4"/>' />
                  <span>Aplicando la lista de verificación</span>
                </button>
                <button type="button" className="opt" style={{ ['--c' as string]: '#7a5cc4' }}
                        aria-pressed={origen === 'NO_NORMADO'} onClick={() => setOrigen('NO_NORMADO')}>
                  <Icono svg='<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>' />
                  <span>Observación directa en el recorrido</span>
                </button>
              </div>
            </label>
            {origen === 'NO_NORMADO' && (
              <div className="hint">
                Tu criterio basta para abrirlo. Si aplica una referencia normativa,
                <b> el ingeniero la ancla en gabinete</b> — no es tu tarea saberlo.
              </div>
            )}
            <label className="f">
              <span>Tipo de elemento</span>
              <div className="opts c2">
                <button type="button" className="opt" style={{ ['--c' as string]: '#34588f' }}
                        aria-pressed={tipo === 'ESTRUCTURAL'}
                        onClick={() => { setTipo('ESTRUCTURAL'); setCat(CAT_E[0]); }}>
                  <Icono svg='<path d="M4 21V6l8-3 8 3v15"/><path d="M4 21h16M9 21v-8h6v8M12 3v3"/>' />
                  <span>Estructural</span>
                </button>
                <button type="button" className="opt" style={{ ['--c' as string]: '#4e97a8' }}
                        aria-pressed={tipo === 'NO_ESTRUCTURAL'}
                        onClick={() => { setTipo('NO_ESTRUCTURAL'); setCat(CAT_NE[0]); }}>
                  <Icono svg='<path d="M9.5 18h5M10.5 21h3"/><path d="M12 3a6 6 0 0 0-3.8 10.6c.7.6 1.3 1.4 1.3 2.4h5c0-1 .6-1.8 1.3-2.4A6 6 0 0 0 12 3z"/>' />
                  <span>No estructural</span>
                </button>
              </div>
            </label>
            <label className="f">
              <span>{tipo === 'ESTRUCTURAL' ? 'Elemento estructural' : 'Categoría no estructural'}</span>
              <div className="row" style={{ gap: 8 }}>
                <select className="in" value={cat} onChange={(e) => setCat(e.target.value)}>
                  {(tipo === 'ESTRUCTURAL' ? CAT_E : CAT_NE).map((c) => <option key={c}>{c}</option>)}
                </select>
                <button type="button" className="infobtn" title="Ver catálogo con ejemplos"
                        aria-label="Ver catálogo con ejemplos" onClick={() => setVerCatalogo(true)}>ℹ</button>
              </div>
            </label>
            <label className="f">
              <span>Síntomas observables — marca todos los que veas</span>
              <div className="opts c3">
                {SINTOMAS.map((s) => (
                  <button key={s.k} type="button" className="opt sm"
                          aria-pressed={sintomas.includes(s.k)} onClick={() => toggleSintoma(s.k)}>
                    <Icono svg={s.svg} />
                    <span>{s.t}</span>
                  </button>
                ))}
              </div>
            </label>
            {ordenadas.length > 0 && (
              <div className="hint">
                {ordenadas.length > 1 && (
                  <>Principal <b>(lo ordena la app)</b>: <b>{SYM_LABEL[ordenadas[0]]}</b> · también:{' '}
                    {ordenadas.slice(1).map((k) => SYM_LABEL[k]).join(', ')}<br /></>
                )}
                ¿Ves dos problemas distintos? Regístralos como <b>dos hallazgos</b>.
              </div>
            )}
            {sintomas.includes('fisura') && (
              <label className="f">
                <span>Medida guiada — ¿qué entra en la fisura?</span>
                <div className="opts c2">
                  {MEDIDAS.map((m) => (
                    <button key={m.v} type="button" className="opt sm"
                            aria-pressed={medida === m.v} onClick={() => setMedida(m.v)}>
                      <span>{m.t}<span className="sub">{m.sub}</span></span>
                    </button>
                  ))}
                </div>
              </label>
            )}
            <label className="f">
              <span>Ubicación</span>
              <input className="in" value={ubicacion} onChange={(e) => setUbicacion(e.target.value)}
                     placeholder="Ej. Eje C-4, nivel sótano" />
            </label>
            <label className="check">
              <input type="checkbox" checked={esLocal} onChange={(e) => setEsLocal(e.target.checked)} />
              <div><div className="t">Está dentro de un local comercial / área privativa</div></div>
            </label>
            <label className="f">
              <span>Descripción de la condición</span>
              <textarea className="in" rows={3} value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)} placeholder="Qué se observó…" />
            </label>
            <label className="f">
              <span>Evidencia fotográfica — al menos una</span>
              {fotos.length > 0 && (
                <div className="thumbs">
                  {fotos.map((f, i) => (
                    <div key={i} className="thumb">
                      <img src={URL.createObjectURL(f)} alt={`Evidencia ${i + 1}`} />
                      <button type="button" className="thumbx" aria-label={`Quitar foto ${i + 1}`}
                              onClick={() => setFotos(fotos.filter((_, j) => j !== i))}>✕</button>
                      <span className="thumbkb">{Math.round(f.size / 1024)} KB</span>
                    </div>
                  ))}
                </div>
              )}
              <label className="btn ghost" style={{ cursor: 'pointer' }}>
                📷 {comprimiendo ? 'Optimizando…' : fotos.length ? 'Agregar otra fotografía' : 'Tomar fotografía'}
                <input type="file" accept="image/*" capture="environment" multiple style={{ display: 'none' }}
                       onChange={async (e) => {
                         const nuevas = Array.from(e.target.files ?? []);
                         if (!nuevas.length) return;
                         setComprimiendo(true);
                         const comprimidas: File[] = [];
                         for (const f of nuevas) comprimidas.push(await comprimirImagen(f));
                         setFotos((prev) => [...prev, ...comprimidas]);
                         setComprimiendo(false);
                         e.target.value = '';
                       }} />
              </label>
              {fotos.length > 0 && (
                <p className="tipline" style={{ margin: '8px 0 0' }}>
                  {fotos.length} {fotos.length === 1 ? 'fotografía' : 'fotografías'} · una general y un detalle suele ser lo ideal
                </p>
              )}
            </label>
            <div className="btnbar">
              <button className="btn primary" disabled={!listoPaso1} onClick={() => setPaso(2)}>
                Clasificar riesgo →
              </button>
              {!listoPaso1 && (
                <p className="tipline">
                  {sintomas.length === 0 ? 'Marca al menos un síntoma para continuar.'
                    : !descripcion.trim() ? 'Escribe una descripción para continuar.'
                    : 'Adjunta al menos una fotografía de evidencia.'}
                </p>
              )}
            </div>
          </>
        )}

        {paso === 2 && (
          <>
            <label className="f">
              <span>1 · ¿Qué pasaría si esto falla ahora?</span>
              <div className="opts c2">
                {SEV_OPTS.map((o) => (
                  <button key={o.i} type="button" className="opt" style={{ ['--c' as string]: o.c }}
                          aria-pressed={sev === o.i} onClick={() => setSev(o.i)}>
                    <Icono svg={o.svg} />
                    <span>{o.t}<span className="sub">{o.sub}</span></span>
                  </button>
                ))}
              </div>
            </label>
            <label className="f">
              <span>2 · ¿Hay señales de que está avanzando?</span>
              <div className="opts c3">
                {PROB_OPTS.map((o) => (
                  <button key={o.i} type="button" className="opt" style={{ ['--c' as string]: o.c }}
                          aria-pressed={prob === o.i} onClick={() => setProb(o.i)}>
                    <Icono svg={o.svg} />
                    <span>{o.t}</span>
                  </button>
                ))}
              </div>
            </label>
            <div className="hint">
              <b>Indicios en sitio:</b> fisura con bordes limpios y sin pintura adentro = activa · con pintura o
              suciedad adentro = antigua y estable · óxido que descascara o mancha húmeda = avanzando.
            </div>
            <label className="check warn">
              <input type="checkbox" checked={reglaDura} onChange={(e) => setReglaDura(e.target.checked)} />
              <div>
                <div className="t">Involucra gas, sistema contra incendios o riesgo de colapso</div>
                <div className="d">Regla dura: si se marca, el resultado es nivel 5 automáticamente.</div>
              </div>
            </label>

            {combos.map((c) => (
              <div key={c.msg} className="hint">
                <b>Combinación de síntomas:</b> {c.msg} — valora probabilidad <b>Alta</b>.
              </div>
            ))}

            {nivel ? (
              <div className={`result r${nivel}`}>
                <div className="n">{nivel}</div>
                <div className="lbl">{nivel >= 4 ? 'Crítico' : nivel >= 2 ? 'Moderado' : 'Menor'}</div>
                <div className="plazo">{PLAZO[nivel]}</div>
              </div>
            ) : (
              <p className="empty">Responde severidad y probabilidad para calcular el nivel.</p>
            )}
            {nivel === 5 && (
              <div className="hint warn">
                <b>Vía rápida nivel 5 — mitiga primero.</b> Acordonar, restringir acceso, cerrar válvulas si
                aplica, y notificar a la dirección técnica. El registro se completa después.
              </div>
            )}
            {nivel !== null && nivel >= 4 && (
              <p className="tipline">Se marcará <b>«requiere evaluación de ingeniero estructural»</b></p>
            )}
            {nivel === 4 && (
              <>
                <div className="sect">Detalle para el ingeniero — solo se pide en nivel 4</div>
                {VERTICALES.map((v) => (
                  <label key={v.k} className="check">
                    <input type="checkbox" checked={!!vertical[v.k]}
                           onChange={(e) => setVertical({ ...vertical, [v.k]: e.target.checked })} />
                    <div><div className="t">{v.t}</div><div className="d">{v.d}</div></div>
                  </label>
                ))}
              </>
            )}
            <p className="tipline">
              ¿Dudas entre dos niveles? <b>Marca el mayor</b> — el ingeniero lo ajustará con justificación registrada.
            </p>
            <div className="btnbar">
              <button className="btn primary" disabled={!nivel || guardando} onClick={guardar}>
                {guardando ? 'Guardando…' : nivel === 5 ? 'Guardar y activar protocolo' : 'Guardar hallazgo'}
              </button>
            </div>
          </>
        )}
      </div>

      {verCatalogo && (
        <div className="sheetwrap" role="dialog" aria-modal="true" aria-label="Catálogo de elementos">
          <div className="sheetbg" onClick={() => setVerCatalogo(false)} />
          <div className="sheetcard">
            <div className="sheetgrip" />
            <div className="sheethead">
              <b>{tipo === 'ESTRUCTURAL' ? 'Elementos estructurales' : 'Categorías no estructurales'}</b>
              <button className="sheetx" onClick={() => setVerCatalogo(false)} aria-label="Cerrar">✕</button>
            </div>
            <p className="muted" style={{ marginTop: 0 }}>
              Toca una categoría para elegirla. Si dudas, describe lo que ves y usa «Otro».
            </p>
            {(tipo === 'ESTRUCTURAL' ? CATALOGO_E : CATALOGO_NE).map((c) => (
              <div key={c.t} className="catitem" role="button" tabIndex={0}
                   onClick={() => { setCat(c.t); setVerCatalogo(false); }}
                   onKeyDown={(e) => e.key === 'Enter' && (setCat(c.t), setVerCatalogo(false))}
                   style={{ cursor: 'pointer' }}>
                <div className="ct">{c.t}{cat === c.t && ' ✓'}</div>
                <div className="cd">{c.d}</div>
                <div className="ce">Ej.: {c.ej}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
