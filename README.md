# SKILLX MVP

Realisasi awal dari konsep poster SKILLX: marketplace jasa & talenta mahasiswa.

## Stack
- Next.js 16.2 + React 19 + TypeScript
- Supabase Auth + PostgreSQL + Row Level Security
- Vercel untuk deployment web

Next.js 16 membutuhkan Node.js 20.9+ menurut dokumentasi resmi Next.js.

## Fitur MVP
- Landing page mengikuti arah visual poster: navy, biru, ungu, cyan.
- Register/login email + password.
- Skill Profile: nama, headline, bio, skills, hourly rate.
- Project Marketplace.
- Pencarian project sederhana.
- Kirim penawaran ke project.
- Anti-joki acknowledgement saat membuat project.
- Database dengan RLS.
- Struktur reviews dan status project untuk dikembangkan.
- Konsep transaction fee 10% ditampilkan, tetapi pembayaran nyata BELUM diaktifkan.

## 1. Prasyarat
Install Node.js 20.9+ dan Git.

## 2. Buat Supabase
1. Buka https://supabase.com/dashboard
2. Create new project.
3. Catat Project URL dan Publishable Key dari Connect/API.
4. Di SQL Editor, jalankan isi `supabase/migrations/20260814000000_skillx_init.sql`.
5. Di Authentication > Providers, pastikan Email aktif.

## 3. Jalankan lokal
```bash
npm install
cp .env.example .env.local
```

Isi `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx
```

Lalu:
```bash
npm run dev
```

Buka http://localhost:3000

## 4. GitHub
```bash
git init
git add .
git commit -m "Initial SKILLX MVP"
git branch -M main
git remote add origin https://github.com/USERNAME/skillx-mvp.git
git push -u origin main
```

## 5. Deploy ke Vercel
1. Login ke https://vercel.com
2. Add New Project.
3. Import repository `skillx-mvp`.
4. Framework: Next.js (biasanya terdeteksi otomatis).
5. Tambahkan Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
6. Deploy.

Atau lewat CLI:
```bash
npm i -g vercel
vercel
vercel --prod
```

## 6. Setelah deploy
Di Supabase Authentication > URL Configuration:
- Site URL: URL Vercel kamu
- Redirect URLs: URL Vercel kamu

Jika menggunakan custom domain, tambahkan domain tersebut juga.

## 7. Roadmap produksi
Prioritas berikutnya:
1. Detail project + halaman profil talent.
2. Upload portfolio ke Supabase Storage.
3. Proposal dengan harga dan estimasi deadline.
4. Chat antara client dan freelancer.
5. Accept/reject proposal.
6. Status project: open → in_progress → completed.
7. Review setelah project selesai.
8. Moderasi laporan dan verifikasi akun.
9. Payment/escrow dengan payment provider yang legal dan webhook server-side.
10. Hitung transaction fee 10% hanya di server; jangan percaya nilai fee dari browser.
11. Admin dashboard.
12. Rate limiting, audit log, CAPTCHA/anti-bot, backup dan monitoring.

## Catatan penting
MVP ini sengaja tidak memproses uang sungguhan. Untuk fitur "Secure Payment", gunakan payment provider resmi dan lakukan verifikasi webhook di server. Sebelum membuka transaksi publik, siapkan badan usaha, kebijakan privasi, syarat layanan, mekanisme refund/dispute, serta aturan perlindungan data yang berlaku.
