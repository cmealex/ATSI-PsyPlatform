# 📁 Index Fișiere - ATSI PsyPlatform

## 🎯 Principale (START HERE)

| Fișier | Scop | Când să-l folosești |
|--------|------|---------------------|
| **`START-HERE.md`** | Ghid principal proiect | Prima dată când deschizi proiectul |
| **`START-WITH-SUPABASE.md`** | Quick-start Supabase | Setup inițial cu Supabase |

---

## 📋 Core Application Files

| Fișier | Scop |
|--------|------|
| `index.html` | Fișier principal HTML |
| `app.js` | Logica aplicației (async/Supabase) |
| `auth.js` | Autentificare utilizatori (Supabase Auth) |
| `data.js` | Management date (Supabase API) |
| `styles.css` | Stiluri principale |
| `modern-ux.css` | Stiluri moderne UI/UX |
| `modern-ux.js` | Interactivitate UX |
| `responsive.css` | Stiluri responsive mobile |

---

## 🔧 Supabase Configuration

| Fișier | Scop |
|--------|------|
| `supabase-config.js` | Configurație client Supabase (URL + Key) |
| `supabase-schema.sql` | Schema bază de date (CREATE TABLE) |

---


---

## 📖 Documentation

### Ghiduri pentru Utilizatori
| Fișier | Scop |
|--------|------|
| `README.md` | Overview general proiect |
| `GHID-UTILIZARE.md` | Ghid utilizare aplicație (RO) |
| `USAGE.md` | Ghid utilizare (EN) |
| `DEMO-CREDENTIALS.md` | Credențiale demo |

### Ghiduri Tehnice
| Fișier | Scop |
|--------|------|
| `SUPABASE-MIGRATION-GUIDE.md` | Ghid complet migrare la Supabase |
| `SUPABASE-IMPLEMENTATION-SUMMARY.md` | Rezumat tehnic implementare |
| `DATABASE-STRUCTURE.md` | Structura bazei de date |
| `page-documentation.txt` | Documentație tehnică pagini |

### Documentation Index & QA
| Fișier | Scop |
|--------|------|
| `QA-DOCUMENTATION-INDEX.md` | Index documentație QA |
| `QA-EXECUTIVE-SUMMARY.md` | Rezumat executiv QA |
| `QA-MANUAL-TESTING-PROCEDURES.md` | Proceduri testare manuală |
| `QA-TESTING-REPORT.md` | Raport testare |
| `QA-TESTING-COMPLETED.md` | Status testare completată |
| `QA-MANAGER-REVIEW.md` | Review manager |

---

## 📝 Project Management

| Fișier | Scop |
|--------|------|
| `SUMMARY.md` | Rezumat proiect |
| `CHANGELOG.md` | Istoric modificări |
| `IMPLEMENTATION-SUMMARY.md` | Rezumat implementare |
| `IMPLEMENTATION-SUMMARY-FINAL.md` | Rezumat final implementare |
| `FINAL-VERIFICATION-COMPLETE.md` | Verificare finală |
| `UX-ENHANCEMENTS-COMPLETE.md` | Îmbunătățiri UX completate |

---

## 🐛 Bug Tracking & Fixes

| Fișier | Scop |
|--------|------|
| `BUG-TRACKER-PRIORITIZED.md` | Tracker bug-uri prioritizate |
| `BUG-FIXES-COMPLETED.md` | Bug-uri rezolvate |
| `CRITICAL-BUGS-IMPLEMENTATION-COMPLETE.md` | Bug-uri critice rezolvate |
| `CRITICAL-BUGS-BACKEND-NEEDED.md` | Bug-uri care necesită backend |
| `CRITICAL-BUGS-WORKAROUNDS-IMPLEMENTED.md` | Workaround-uri implementate |

---


---

## 📂 Date (Data Folder)

```
Date/
├── Poze/                                    # Poze terapeuți (backup)
├── Poze2/                                   # Poze terapeuți (principale)
│   ├── Alex Simion poza.jpg
│   ├── Flavia-Teculeasa-Profile-Photo-Bronze-320x320px.jpg
│   └── ... (alte poze)
├── Descrieri Psihoterapeuti_2025 AlexSimion.docx
├── Descrieri Psihoterapeuti_2025 Flavia.docx
└── Descrieri Psihoterapeuti_Model_2025.docx
```

---

## 🗂️ Utility Scripts

| Fișier | Scop |
|--------|------|
| `start-server.ps1` | PowerShell script pentru start server local |

---

## 🎨 Resources & Assets

| Fișier | Scop |
|--------|------|
| `FOTO-GUIDE.md` | Ghid pentru poze terapeuți |

---


---

## 🔥 Workflow Rapid

### 1️⃣ Setup Inițial
1. `START-HERE.md`
2. `START-WITH-SUPABASE.md`
3. Configurează `supabase-config.js`
4. Rulează `supabase-schema.sql` în Supabase

### 2️⃣ Import Terapeuți
1. Datele terapeuților sunt deja în Supabase
2. Pentru modificări, editează direct în Supabase Dashboard

### 3️⃣ Development
1. Deschide `index.html` în browser
2. Editează `app.js`, `auth.js`, `data.js` după nevoie
3. Verifică în browser Console (F12)

### 4️⃣ Testing
1. Vezi `QA-MANUAL-TESTING-PROCEDURES.md`
2. Testează fiecare funcționalitate
3. Documentează bug-uri în `BUG-TRACKER-PRIORITIZED.md`

### 5️⃣ Deployment
1. Verifică că totul funcționează local
2. Upload pe hosting (Netlify, Vercel, GitHub Pages)
3. Configurează environment variables

---

## 🎯 Files by Role

### 👨‍💻 Pentru Developeri
- `app.js`, `auth.js`, `data.js`
- `supabase-config.js`, `supabase-schema.sql`
- `SUPABASE-MIGRATION-GUIDE.md`
- `page-documentation.txt`

### 🎨 Pentru Designeri
- `styles.css`, `modern-ux.css`, `responsive.css`
- `modern-ux.js`
- `index.html` (structură HTML)

### 📊 Pentru Data Entry
- Supabase Dashboard pentru editare directă

### 👔 Pentru Manageri
- `README.md`, `START-HERE.md`
- `QA-EXECUTIVE-SUMMARY.md`
- `IMPLEMENTATION-SUMMARY-FINAL.md`
- `CHANGELOG.md`

### 🧪 Pentru QA Testers
- `QA-MANUAL-TESTING-PROCEDURES.md`
- `QA-TESTING-REPORT.md`
- `BUG-TRACKER-PRIORITIZED.md`

---

## 🔍 Găsești Rapid

| Caut... | Vezi fișierul... |
|---------|------------------|
| Cum să încep? | `START-HERE.md` |
| Setup Supabase | `START-WITH-SUPABASE.md` |
| Structura DB | `DATABASE-STRUCTURE.md` |
| Credențiale demo | `DEMO-CREDENTIALS.md` |
| Bug-uri cunoscute | `BUG-TRACKER-PRIORITIZED.md` |
| Testare | `QA-MANUAL-TESTING-PROCEDURES.md` |
| API Supabase | `data.js` + `SUPABASE-IMPLEMENTATION-SUMMARY.md` |
| Autentificare | `auth.js` |
| UI/UX | `styles.css`, `modern-ux.css` |

---

## 📌 Pinned Files

**Cele mai importante 5 fișiere:**

1. **`START-HERE.md`** - Începe aici
2. **`index.html`** - Aplicația
3. **`app.js`** - Logica principală
4. **`supabase-config.js`** - Configurație
5. **`START-WITH-SUPABASE.md`** - Setup Supabase

---

**Ultima actualizare:** 14 Octombrie 2025  
**Versiune:** 1.1 (După curățenie)  
**Total fișiere:** 45+

