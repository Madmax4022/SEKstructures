import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { asegurarPerfil } from '../lib/data';

export default function Login() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [msg, setMsg] = useState<{ tipo: 'error' | 'ok'; texto: string } | null>(null);
  const [cargando, setCargando] = useState(false);

  async function entrar() {
    if (!supabase) return;
    setCargando(true);
    setMsg(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) setMsg({ tipo: 'error', texto: error.message });
    else await asegurarPerfil();
    setCargando(false);
  }

  async function crearCuenta() {
    if (!supabase) return;
    setCargando(true);
    setMsg(null);
    const { data, error } = await supabase.auth.signUp({ email, password: pass });
    if (error) setMsg({ tipo: 'error', texto: error.message });
    else if (data.session) await asegurarPerfil();
    else setMsg({ tipo: 'ok', texto: 'Cuenta creada. Si tu proyecto exige confirmación, revisa tu correo.' });
    setCargando(false);
  }

  return (
    <main className="centered">
      <div className="brandmark">
        <div className="glyph">🏗</div>
        <div>
          <h1>SEK Estructuras</h1>
          <div className="ver">Inspección · Etapa 1</div>
        </div>
      </div>
      <div className="card" style={{ width: '100%', maxWidth: 380 }}>
        {msg && <p className={msg.tipo === 'error' ? 'error' : 'okmsg'}>{msg.texto}</p>}
        <label className="f">
          <span>Correo</span>
          <input className="in" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="f">
          <span>Contraseña</span>
          <input className="in" type="password" autoComplete="current-password" value={pass} onChange={(e) => setPass(e.target.value)} />
        </label>
        <div className="btnbar" style={{ marginTop: 4 }}>
          <button className="btn primary" disabled={cargando || !email || !pass} onClick={entrar}>
            Entrar
          </button>
          <button className="btn ghost" disabled={cargando || !email || !pass} onClick={crearCuenta}>
            Crear cuenta
          </button>
        </div>
      </div>
    </main>
  );
}
