 "use client";

import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/dashboard");
    });
  }, [router]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setMessage("");
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: name } }
      });
      if (error) return setMessage(error.message);
      setMessage("Akun dibuat. Jika email confirmation aktif, cek email kamu.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return setMessage(error.message);
      router.push("/dashboard");
    }
  }

  return (
    <main className="auth-wrap">
      <div className="auth-card">
        <Link href="/" className="brand">SKILL<span>X</span></Link>
        <h1>{mode === "login" ? "Selamat datang kembali" : "Buat akun SKILLX"}</h1>
        <p className="muted">MVP marketplace jasa & talenta mahasiswa.</p>
        <form onSubmit={submit}>
          {mode === "signup" && <input placeholder="Nama lengkap" value={name} onChange={e => setName(e.target.value)} required />}
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password minimal 6 karakter" value={password} onChange={e => setPassword(e.target.value)} minLength={6} required />
          <button className="btn primary full">{mode === "login" ? "Masuk" : "Daftar"}</button>
        </form>
        {message && <div className="notice">{message}</div>}
        <button className="linkbtn" onClick={() => setMode(mode === "login" ? "signup" : "login")}>
          {mode === "login" ? "Belum punya akun? Daftar" : "Sudah punya akun? Masuk"}
        </button>
        <Link href="/" className="back">← Kembali</Link>
      </div>
    </main>
  );
}
