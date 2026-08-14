import Link from "next/link";

const features = [
  ["👤", "Skill Profile", "Tampilkan skill, portfolio, dan pengalaman."],
  ["🔎", "Smart Talent Search", "Cari talent sesuai skill dan budget."],
  ["📋", "Project Marketplace", "Buat project atau kirim penawaran."],
  ["🛡️", "Secure Payment", "Siapkan alur escrow untuk melindungi kedua pihak."],
  ["★", "Rating & Review", "Bangun reputasi dan kepercayaan."],
  ["🤝", "Anti-Joki", "Jaga marketplace dari jasa pengerjaan tugas akademik."],
];

export default function Home() {
  return (
    <main>
      <nav className="nav container">
        <Link href="/" className="brand">SKILL<span>X</span></Link>
        <div className="navlinks">
          <Link href="/marketplace">Marketplace</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/auth">Masuk</Link>
        </div>
      </nav>

      <section className="hero container">
        <div>
          <div className="eyebrow">MARKETPLACE TALENTA MAHASISWA</div>
          <h1>Ubah <span>Skill</span> Menjadi <b>Peluang.</b></h1>
          <p>Platform yang mempertemukan mahasiswa berbakat dengan pelanggan yang membutuhkan jasa digital & kreatif.</p>
          <div className="actions">
            <Link className="btn primary" href="/marketplace">Cari Talent</Link>
            <Link className="btn ghost" href="/dashboard">Mulai Jual Skill</Link>
          </div>
        </div>
        <div className="hero-card">
          <div className="code">&lt;/&gt;</div>
          <div className="code blue">&#123; &#125;</div>
          <div className="code yellow">&lt;?&gt;</div>
          <div className="hero-person">💻</div>
          <p>Skill → Portfolio → Project → Reputasi</p>
        </div>
      </section>

      <section className="container section">
        <div className="section-title">
          <span>FITUR UTAMA</span>
          <h2>Semua yang dibutuhkan untuk mulai.</h2>
        </div>
        <div className="feature-grid">
          {features.map(([icon, title, desc]) => (
            <article className="feature" key={title}>
              <div className="icon">{icon}</div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container section two-col">
        <div className="panel">
          <div className="tag red">MASALAH</div>
          <h2>Skill ada, tapi peluang sulit ditemukan.</h2>
          <ul>
            <li>Sulit menemukan klien pertama.</li>
            <li>Portfolio masih minim.</li>
            <li>Informasi freelance tersebar.</li>
            <li>Klien sulit menemukan talent mahasiswa yang terpercaya.</li>
          </ul>
        </div>
        <div className="panel green-panel">
          <div className="tag green">MODEL BISNIS</div>
          <h2>10% transaction fee</h2>
          <p>Untuk MVP ini fee hanya ditampilkan sebagai konsep. Integrasi pembayaran nyata dilakukan setelah legalitas bisnis dan payment provider siap.</p>
          <div className="mini-list">Premium Account · Boost Project · Advertising</div>
        </div>
      </section>

      <footer className="footer">SKILLX © 2026 — MVP</footer>
    </main>
  );
}
