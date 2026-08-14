 "use client";

import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Profile = { id: string; full_name: string | null; headline: string | null; bio: string | null; skills: string[] | null; hourly_rate: number | null };
type Project = { id: string; title: string; description: string; budget: number; skills: string[]; status: string; created_at: string };

export default function Dashboard() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tab, setTab] = useState<"profile" | "project">("profile");
  const [msg, setMsg] = useState("");

  async function load() {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) return router.replace("/auth");
    const user = session.session.user;
    setUserId(user.id); setEmail(user.email ?? "");
    const { data: p } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    setProfile(p);
    const { data: ps } = await supabase.from("projects").select("*").eq("owner_id", user.id).order("created_at", { ascending: false });
    setProjects(ps ?? []);
  }

  useEffect(() => { load(); }, []);

  async function saveProfile(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setMsg("");
    if (!profile) return;
    const { error } = await supabase.from("profiles").update({
      full_name: profile.full_name, headline: profile.headline, bio: profile.bio,
      skills: profile.skills, hourly_rate: profile.hourly_rate
    }).eq("id", userId);
    setMsg(error ? error.message : "Profil tersimpan.");
  }

  async function createProject(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setMsg("");
    const form = new FormData(e.currentTarget);
    const antiJoki = form.get("antiJoki") === "on";
    if (!antiJoki) return setMsg("Centang pernyataan anti-joki terlebih dahulu.");
    const skills = String(form.get("skills") || "").split(",").map(s => s.trim()).filter(Boolean);
    const { error } = await supabase.from("projects").insert({
      owner_id: userId,
      title: String(form.get("title")),
      description: String(form.get("description")),
      budget: Number(form.get("budget")),
      skills,
      status: "open",
      academic_integrity_ack: true
    });
    if (error) return setMsg(error.message);
    setMsg("Project berhasil dibuat."); e.currentTarget.reset(); load();
  }

  async function logout() {
    await supabase.auth.signOut(); router.replace("/");
  }

  if (!profile) return <main className="loading">Memuat dashboard…</main>;

  return (
    <main>
      <nav className="nav container">
        <Link href="/" className="brand">SKILL<span>X</span></Link>
        <div className="navlinks"><Link href="/marketplace">Marketplace</Link><button className="linkbtn" onClick={logout}>Keluar</button></div>
      </nav>
      <section className="container dashboard">
        <div className="dash-head">
          <div><div className="eyebrow">DASHBOARD</div><h1>Halo, {profile.full_name || email.split("@")[0]} 👋</h1><p className="muted">{email}</p></div>
          <Link className="btn primary" href="/marketplace">Lihat Marketplace</Link>
        </div>

        <div className="tabs">
          <button className={tab === "profile" ? "active" : ""} onClick={() => setTab("profile")}>Skill Profile</button>
          <button className={tab === "project" ? "active" : ""} onClick={() => setTab("project")}>Buat Project</button>
        </div>

        {tab === "profile" ? (
          <form className="form-card" onSubmit={saveProfile}>
            <h2>Skill Profile</h2>
            <label>Nama<input value={profile.full_name ?? ""} onChange={e => setProfile({...profile, full_name: e.target.value})} /></label>
            <label>Headline<input placeholder="Contoh: UI/UX Designer & Frontend Developer" value={profile.headline ?? ""} onChange={e => setProfile({...profile, headline: e.target.value})} /></label>
            <label>Bio<textarea value={profile.bio ?? ""} onChange={e => setProfile({...profile, bio: e.target.value})} /></label>
            <label>Skills <small>pisahkan dengan koma</small><input value={(profile.skills ?? []).join(", ")} onChange={e => setProfile({...profile, skills: e.target.value.split(",").map(s => s.trim()).filter(Boolean)})} /></label>
            <label>Rate per jam (Rp)<input type="number" min="0" value={profile.hourly_rate ?? 0} onChange={e => setProfile({...profile, hourly_rate: Number(e.target.value)})} /></label>
            <button className="btn primary">Simpan Profil</button>
            {msg && <div className="notice">{msg}</div>}
          </form>
        ) : (
          <form className="form-card" onSubmit={createProject}>
            <h2>Project Marketplace</h2>
            <label>Judul<input name="title" placeholder="Contoh: Landing page untuk UMKM" required /></label>
            <label>Deskripsi<textarea name="description" placeholder="Jelaskan kebutuhan, output, dan deadline." required /></label>
            <label>Budget (Rp)<input name="budget" type="number" min="0" required /></label>
            <label>Skill yang dibutuhkan <small>pisahkan dengan koma</small><input name="skills" placeholder="Figma, UI/UX, Next.js" /></label>
            <label className="check"><input type="checkbox" name="antiJoki" /> Saya menyatakan project ini bukan permintaan untuk mengerjakan tugas/ujian akademik orang lain.</label>
            <button className="btn primary">Publish Project</button>
            {msg && <div className="notice">{msg}</div>}
          </form>
        )}

        <section className="my-projects">
          <h2>Project saya</h2>
          {projects.length === 0 ? <p className="muted">Belum ada project.</p> : projects.map(p => (
            <article className="project-row" key={p.id}>
              <div><b>{p.title}</b><p>{p.description.slice(0, 120)}{p.description.length > 120 ? "…" : ""}</p></div>
              <div className="price">Rp {p.budget.toLocaleString("id-ID")}<span>{p.status}</span></div>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
