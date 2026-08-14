 "use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

type Project = { id: string; owner_id: string; title: string; description: string; budget: number; skills: string[]; status: string };
type Profile = { id: string; full_name: string | null; headline: string | null; skills: string[] | null };

export default function Marketplace() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");

  async function load(q = "") {
    let req = supabase.from("projects").select("*").eq("status", "open").order("created_at", { ascending: false });
    if (q) req = req.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
    const { data, error } = await req;
    if (error) return setMessage(error.message);
    setProjects(data ?? []);
    const ids = [...new Set((data ?? []).map(p => p.owner_id))];
    if (ids.length) {
      const { data: ps } = await supabase.from("profiles").select("id,full_name,headline,skills").in("id", ids);
      const map: Record<string, Profile> = {};
      (ps ?? []).forEach(p => map[p.id] = p);
      setProfiles(map);
    }
  }

  useEffect(() => { load(); }, []);

  async function apply(projectId: string) {
    const { data } = await supabase.auth.getSession();
    if (!data.session) return window.location.href = "/auth";
    const note = window.prompt("Tulis penawaran singkat (opsional):") ?? "";
    const { error } = await supabase.from("applications").insert({
      project_id: projectId, applicant_id: data.session.user.id, cover_note: note
    });
    setMessage(error ? error.message : "Penawaran terkirim.");
  }

  return (
    <main>
      <nav className="nav container">
        <Link href="/" className="brand">SKILL<span>X</span></Link>
        <div className="navlinks"><Link href="/dashboard">Dashboard</Link><Link href="/auth">Masuk</Link></div>
      </nav>
      <section className="container marketplace">
        <div className="dash-head"><div><div className="eyebrow">PROJECT MARKETPLACE</div><h1>Cari project yang cocok.</h1><p className="muted">Filter berdasarkan kebutuhan dan skill.</p></div></div>
        <div className="search"><input placeholder="Cari: desain, website, video…" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && load(query)} /><button className="btn primary" onClick={() => load(query)}>Cari</button></div>
        {message && <div className="notice">{message}</div>}
        <div className="project-grid">
          {projects.map(p => {
            const owner = profiles[p.owner_id];
            return <article className="market-card" key={p.id}>
              <div className="status">OPEN</div>
              <h2>{p.title}</h2>
              <p>{p.description}</p>
              <div className="chips">{(p.skills ?? []).map(s => <span key={s}>{s}</span>)}</div>
              <div className="owner"><div className="avatar">{(owner?.full_name ?? "S").slice(0,1).toUpperCase()}</div><div><b>{owner?.full_name ?? "Pengguna"}</b><small>{owner?.headline ?? "Client"}</small></div></div>
              <div className="card-bottom"><b>Rp {p.budget.toLocaleString("id-ID")}</b><button className="btn small" onClick={() => apply(p.id)}>Kirim Penawaran</button></div>
            </article>
          })}
        </div>
        {projects.length === 0 && <div className="empty">Belum ada project yang cocok.</div>}
      </section>
    </main>
  );
}
