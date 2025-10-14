# ATSI PsyPlatform

## 📋 Prezentare Generală

**ATSI PsyPlatform** este o aplicație web dezvoltată pentru **Asociația Tinerilor din Sistemul de Protecție (ATSI)**, care conectează tinerii din medii vulnerabile cu psihologi profesioniști care oferă servicii gratuite de terapie.

## 🎯 Obiective

- Facilitarea accesului tinerilor vulnerabili la servicii de sănătate mentală
- Conectarea beneficiarilor cu psihologi calificați care oferă servicii pro bono
- Gestionarea programărilor de terapie
- Crearea unei comunități de suport prin forum
- Oferirea de resurse educaționale despre sănătate mentală

## 🚀 Caracteristici Principale

### Pentru Beneficiari
- 🔍 Căutare și filtrare psihologi după oraș, specializare, gen, tip sesiune
- 📅 Sistem de programări online
- ⭐ Sistem de recenzii și rating
- 💬 Forum comunitar pentru discuții
- 📚 Acces la resurse educaționale

### Pentru Psihologi
- 👤 Profil profesional detaliat
- 📆 Gestionare disponibilitate și calendar
- 📋 Vizualizare programări
- 📊 Recenzii de la beneficiari

### Pentru Administratori
- 👥 Gestionare utilizatori (CRUD)
- ✅ Aprobare psihologi noi
- 🔍 Moderare recenzii
- 📊 Dashboard cu statistici complete
- 📅 Vizualizare toate programările

## 💻 Tehnologii

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Bază de date**: Supabase (PostgreSQL)
- **Autentificare**: Supabase Auth
- **Storage**: Supabase Storage (pentru fotografii)
- **Responsive**: Design complet responsive pentru mobile, tablet, desktop
- **Browser Support**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

## 📁 Structura Proiectului

```
ATSI-PsyPlatform/
├── index.html              # Pagina principală + template-uri
├── app.js                  # Logică aplicație (async/Supabase)
├── auth.js                 # Sistem autentificare (Supabase Auth)
├── data.js                 # Gestionare date (Supabase API)
├── supabase-config.js      # Configurație Supabase
├── supabase-schema.sql     # Schema bază de date
├── styles.css              # Stiluri principale
├── modern-ux.css           # Stiluri moderne UI/UX
├── modern-ux.js            # Interactivitate UX
├── responsive.css          # Media queries
├── Date/                   # Date și poze psihologi (backup local)
│   └── Poze2/             # Fotografii psihologi
├── DATABASE-STRUCTURE.md   # Documentație bază de date
├── GHID-UTILIZARE.md      # Ghid utilizare (RO)
├── START-HERE.md           # Ghid rapid de început
├── START-WITH-SUPABASE.md  # Setup Supabase
└── page-documentation.txt  # Documentație tehnică
```

## 🎓 Tipuri de Utilizatori

### 1. Administrator
- **Email**: admin@atsi.ro
- **Parolă**: admin123
- **Acces**: Panou complet de administrare

### 2. Psiholog
- **Înregistrare**: Publică cu aprobare admin
- **Exemple**: alex.simion@atsi.ro, flavia.teculeasa@atsi.ro
- **Parolă (exemple)**: password

### 3. Beneficiar
- **Înregistrare**: Publică, acces instant
- **Exemple**: alex@example.com, maria@example.com
- **Parolă (exemple)**: password

## 🏥 Psihologi Incluși

Platforma vine cu **11 psihologi** cu profile complete:

1. **Alex Simion** - București
2. **Flavia Teculeasa** - București  
3. **Barbu Mihai** - Cluj-Napoca
4. **Daniela Oprescu** - București
5. **Ionuț Oprițescu** - Timișoara
6. **Irina Ignătescu** - Iași
7. **Irina Săcuiu** - București
8. **Miruna Vâlcu** - Brașov
9. **Oana Camelia Guraliuc** - Constanța
10. **Paul Mureșan** - Sibiu
11. **Andreea Stancu** - București

Toți au:
- ✅ Profile complete cu poze
- ✅ Specializări multiple
- ✅ Disponibilitate setată
- ✅ Status aprobat

## 🚀 Instalare și Rulare

### Metoda 1: Deschidere Directă
```bash
# Deschide direct index.html în browser
open index.html
```

### Metoda 2: Server Local (Recomandat)

**Cu Python:**
```bash
python -m http.server 8000
# Accesează: http://localhost:8000
```

**Cu Node.js:**
```bash
npx http-server -p 8000
# Accesează: http://localhost:8000
```

**Cu PHP:**
```bash
php -S localhost:8000
# Accesează: http://localhost:8000
```

## 📖 Documentație

- **[GHID-UTILIZARE.md](GHID-UTILIZARE.md)** - Ghid complet de utilizare (Română)
- **[DATABASE-STRUCTURE.md](DATABASE-STRUCTURE.md)** - Structura bazei de date
- **[page-documentation.txt](page-documentation.txt)** - Documentație tehnică

## 🔧 Funcționalități Tehnice

### Sistem de Autentificare
- Înregistrare cu validare email unic
- Sesiune persistentă (localStorage)
- 3 roluri: admin, psiholog, beneficiar

### Bază de Date (Supabase/PostgreSQL)
- **users** - Toți utilizatorii (cu Supabase Auth)
- **therapists** - Psihologi cu date complete
- **appointments** - Programări
- **reviews** - Recenzii (cu moderare)
- **forum_topics** - Subiecte forum
- **forum_replies** - Răspunsuri forum
- **therapist_photos** - Fotografii psihologi (Supabase Storage)

### Sistem de Aprobare
- Psihologi noi → În așteptare → Admin aprobă
- Recenzii noi → În așteptare → Admin aprobă

## ⚠️ Status Actual

Această versiune folosește **Supabase** ca backend:
- ✅ Bază de date PostgreSQL (Supabase)
- ✅ Autentificare securizată (Supabase Auth)
- ✅ Storage pentru fotografii (Supabase Storage)
- ✅ API securizat (Row Level Security)
- ⚠️ Hash parole: Implementat în Supabase
- ❌ Notificări email/SMS (de implementat)

### Pentru Producție Completă Este Necesar:
- ✅ HTTPS (obligatoriu)
- ✅ Environment variables pentru credențiale
- ✅ Rate limiting
- ✅ Monitoring și logging
- ✅ Backup automat
- ✅ Conformitate GDPR completă
- ✅ Notificări email/SMS (Twilio/SendGrid)

## 🎨 Design și UX

- **Responsive**: Mobile-first design
- **Accesibilitate**: Structură semantică HTML
- **Performanță**: Fără dependințe externe
- **Browser Support**: Browsere moderne

## 📊 Statistici Platformă

Dashboard admin afișează:
- Utilizatori totali
- Număr beneficiari
- Număr psihologi
- Psihologi aprobați
- Programări totale
- Recenzii
- Subiecte forum

## 🔐 Securitate

**✅ IMPLEMENTAT:**
- Autentificare Supabase (hash-uire automată parole)
- Row Level Security (RLS) în PostgreSQL
- API Keys protejate
- Validare client-side și server-side

**⚠️ PENTRU PRODUCȚIE:**
- HTTPS obligatoriu
- Rate limiting avansat
- Conformitate GDPR completă
- Backup și disaster recovery
- Monitoring și alerting

## 🚀 Extinderi Viitoare

### Nivel 1 (Simplu)
- [ ] Multilingv (EN, HU)
- [ ] Dark mode
- [ ] Export date
- [ ] Print profil

### Nivel 2 (Mediu)
- [ ] Sistem mesagerie
- [ ] Notificări browser
- [ ] Integrare Google Calendar
- [ ] Upload poze

### Nivel 3 (Complex)
- [ ] Video call integrat
- [ ] Sistem plăți
- [ ] Mobile app (React Native)
- [ ] AI chatbot

## 👥 Echipa și Contribuții

Dezvoltat pentru **ATSI (Asociația Tinerilor din Sistemul de Protecție)**

## 📄 Licență

Acest proiect este dezvoltat pentru scopuri non-profit în beneficiul tinerilor din sistemul de protecție din România.

## 📞 Suport

Pentru probleme tehnice:
1. Consultă [GHID-UTILIZARE.md](GHID-UTILIZARE.md)
2. Verifică [DATABASE-STRUCTURE.md](DATABASE-STRUCTURE.md)
3. Citește documentația tehnică

---

**Versiune**: 1.2.0 (Supabase Migration Complete)  
**Data**: Octombrie 14, 2025  
**Status**: Production-Ready (cu Supabase backend)  
**Tehnologii**: HTML5, CSS3, JavaScript (Vanilla), Supabase (PostgreSQL + Auth + Storage)