# Ghid de Utilizare - ATSI PsyPlatform

## Prezentare Generală

**ATSI PsyPlatform** conectează tinerii din medii vulnerabile cu psihologi profesioniști care oferă servicii gratuite. Aplicația este construită cu HTML, CSS și JavaScript, utilizând Supabase pentru stocarea datelor.

## Tehnologii Utilizate

- **HTML5** - Structura aplicației
- **CSS3** - Stilizare și design responsive
- **JavaScript (Vanilla)** - Logică aplicație
- **Supabase** - Bază de date PostgreSQL în cloud

## Cum să Pornești Aplicația

### Varianta 1: Deschidere Directă
1. Navigați în folderul proiectului
2. Deschideți fișierul `index.html` într-un browser web modern (Chrome, Firefox, Edge, Safari)

### Varianta 2: Server Local (Recomandat)
Pentru funcționalitate completă, folosiți un server local:

**Cu Python:**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Cu Node.js (http-server):**
```bash
npx http-server -p 8000
```

**Cu PHP:**
```bash
php -S localhost:8000
```

Apoi accesați: `http://localhost:8000`

## Tipuri de Utilizatori și Acces

### 1. Administrator

**Date de autentificare:**
- Email: `admin@atsi.ro`
- Parolă: `admin123`

**Capabilități:**
- ✅ Gestionare utilizatori (adăugare, editare, ștergere)
- ✅ Aprobare psihologi noi
- ✅ Moderare recenzii
- ✅ Vizualizare toate programările
- ✅ Acces la statistici complete
- ✅ Panou de administrare dedicat

**Cum să accesezi panoul admin:**
1. Autentifică-te cu datele de mai sus
2. Click pe "Administrare" în meniul de navigare
3. Folosește tab-urile pentru a naviga între secțiuni

### 2. Psiholog

**Exemple de conturi (toți cu parola: `password`):**
- `alex.simion@atsi.ro` - București
- `flavia.teculeasa@atsi.ro` - București
- `barbu.mihai@atsi.ro` - Cluj-Napoca

**Capabilități:**
- ✅ Profil public cu informații profesionale
- ✅ Gestionare programări
- ✅ Editare profil și disponibilitate
- ✅ Vizualizare recenzii primite
- ✅ Acces la forum

**Cum să te înregistrezi ca psiholog:**
1. Click "Autentificare" → "Înregistrare"
2. Selectează "Psiholog" ca tip utilizator
3. Completează toate câmpurile obligatorii:
   - Nume complet
   - Email
   - Parolă
   - Descriere profesională
   - "De ce terapie cu mine?"
   - Specializări (separate prin virgulă)
   - Oraș
   - Tipuri sesiuni (online/cabinet)
4. Click "Înregistrare"
5. **IMPORTANT**: Contul va fi în așteptare până când un administrator îl aprobă

### 3. Beneficiar

**Exemple de conturi:**
- Email: `alex@example.com`, Parolă: `password`
- Email: `maria@example.com`, Parolă: `password`

**Capabilități:**
- ✅ Căutare și filtrare psihologi
- ✅ Rezervare ședințe
- ✅ Adăugare recenzii
- ✅ Participare la forum
- ✅ Acces la resurse educaționale

**Cum să folosești platforma ca beneficiar:**
1. Înregistrează-te selectând "Beneficiar"
2. Navighează la "Terapeuți"
3. Folosește filtrele pentru a găsi psihologi potriviți:
   - Oraș
   - Tip sesiune (online/cabinet)
   - Gen
   - Specializare
4. Click pe un psiholog pentru a vedea profilul complet
5. Selectează o dată și oră disponibilă
6. Click "Programează ședință"
7. După ședință, poți lăsa o recenzie

## Funcționalități Principale

### 1. Sistem de Autentificare
- Înregistrare cu validare email unic
- Autentificare cu email și parolă
- Sesiune persistentă (localStorage)
- Deconectare

### 2. Gestionare Psihologi

#### Pentru Psihologi:
- Creare profil complet cu:
  - Fotografie
  - Descriere profesională
  - Specializări
  - Informații de contact
  - Disponibilitate (zile și ore)
- Editare profil
- Vizualizare programări

#### Pentru Beneficiari:
- Căutare avansată cu filtre multiple
- Vizualizare profil detaliat
- Sistem de recenzii cu rating
- Calendar disponibilitate în timp real

#### Pentru Admin:
- Aprobare psihologi noi
- Editare/ștergere psihologi
- Vizualizare listă completă

### 3. Sistem de Programări

**Cum funcționează:**
1. Beneficiarul selectează un psiholog
2. Alege o dată din calendarul afișat (urmatorele 7 zile)
3. Selectează un interval orar disponibil
4. Click "Programează ședință"
5. Programarea este înregistrată instant
6. Ambele părți pot vedea programarea în "Profilul meu" → "Programări"

**Statusuri programări:**
- 🟢 Confirmat
- 🔵 Finalizat
- 🔴 Anulat

### 4. Sistem de Recenzii

**Proces:**
1. Beneficiarul completează formularul de recenzie
2. Selectează rating (1-5 stele)
3. Scrie text recenzie
4. Submit → Recenzia merge la "În așteptare"
5. Administratorul moderează și aprobă
6. Recenzia apare pe profilul psihologului

### 5. Forum Comunitate

**Funcții:**
- Creare subiecte noi
- Răspunsuri la subiecte
- Vizualizare autor și dată
- Sortare cronologică

**Cum să folosești:**
1. Navighează la "Forum"
2. Click "Subiect nou"
3. Completează titlu și conținut
4. Click "Postează"
5. Alți utilizatori pot răspunde

### 6. Resurse Educaționale

**Articole disponibile:**
- Ce este terapia?
- Cum să te pregătești pentru prima ședință
- Gestionarea traumelor din copilărie
- Tehnici de relaxare

**Acces:**
- Click "Resurse" în meniu
- Selectează un articol
- Citește conținutul complet

## Panou de Administrare

### Accesare
- Disponibil doar pentru utilizatori cu rol "admin"
- Meniu: "Administrare" (vizibil doar pentru admin)

### Tab-uri disponibile:

#### 1. Utilizatori
- **Vizualizare**: Listă completă utilizatori cu ID, Nume, Email, Tip
- **Adăugare**: Click "Adaugă utilizator" → Completează formular → Salvează
- **Editare**: Click "Editează" pe utilizator → Modifică → Salvează
- **Ștergere**: Click "Șterge" → Confirmare

#### 2. Psihologi
- **Vizualizare**: Listă psihologi cu status aprobare
- **Aprobare**: Click "Aprobă" pentru psihologi în așteptare
- **Adăugare**: Click "Adaugă psiholog" → Formular complet → Salvează
- **Editare**: Click "Editează" → Modifică date → Salvează
- **Ștergere**: Click "Șterge" → Confirmare

#### 3. Recenzii
- **Vizualizare**: Toate recenziile cu status
- **Aprobare**: Click "Aprobă" pentru recenzii în așteptare
- **Ștergere**: Click "Șterge" pentru recenzii inadecvate

#### 4. Programări
- **Vizualizare**: Toate programările platformei
- **Detalii**: Beneficiar, Psiholog, Data, Ora, Status

#### 5. Statistici
- **Metrici afișate:**
  - Utilizatori totali
  - Număr beneficiari
  - Număr psihologi
  - Psihologi aprobați
  - Programări totale
  - Recenzii totale
  - Recenzii aprobate
  - Subiecte forum

## Psihologi Incluși

Platforma vine pre-populată cu 11 psihologi reali:

1. **Alex Simion** - București - Anxietate, Depresie, Traume
2. **Flavia Teculeasa** - București - Traume complexe, Tulburări emoționale
3. **Barbu Mihai** - Cluj-Napoca - Anxietate, Fobii, Management furie
4. **Daniela Oprescu** - București - Traume, Abandon, Atașament
5. **Ionuț Oprițescu** - Timișoara - Depresie, Anxietate, Identitate
6. **Irina Ignătescu** - Iași - Anxietate socială, Bullying
7. **Irina Săcuiu** - București - Depresie, Tulburări alimentare
8. **Miruna Vâlcu** - Brașov - Anxietate, Stres, Relații
9. **Oana Camelia Guraliuc** - Constanța - Traume, Reziliență
10. **Paul Mureșan** - Sibiu - Anxietate, Depresie, Atacuri de panică
11. **Andreea Stancu** - București - Traume complexe, Neglijare

Toți au:
- ✅ Profile complete
- ✅ Fotografii (din Date/Poze2/)
- ✅ Specializări multiple
- ✅ Disponibilitate setată
- ✅ Status aprobat

## Structura Fișierelor

```
ATSI-PsyPlatform/
│
├── index.html              # Pagina principală + toate template-urile
├── app.js                  # Logică aplicație și navigare
├── auth.js                 # Sistem autentificare
├── data.js                 # Gestionare date și localStorage
├── styles.css              # Stiluri principale
├── responsive.css          # Media queries pentru responsive
│
├── Date/                   # Folder cu date și poze
│   ├── Poze2/             # Fotografii psihologi
│   └── Descrieri...       # Documente Word cu descrieri
│
├── DATABASE-STRUCTURE.md   # Documentație bază de date
├── GHID-UTILIZARE.md      # Acest fișier
├── page-documentation.txt  # Documentație tehnică
└── README.md              # README proiect
```

## Fluxuri de Lucru Comune

### Flux 1: Programare Ședință

```
1. Beneficiar → Autentificare
2. Navighează la "Terapeuți"
3. Filtrează după criteriu (ex: București, Online)
4. Click pe psiholog → Vezi profil
5. Selectează dată din calendar
6. Click pe oră disponibilă
7. Click "Programează ședință"
8. Confirmare → Programare salvată
9. Vezi în "Profilul meu" → "Programări"
```

### Flux 2: Administrator Aprobă Psiholog

```
1. Admin → Autentificare (admin@atsi.ro)
2. Click "Administrare"
3. Tab "Psihologi"
4. Identifică psiholog cu status "În așteptare"
5. Verifică datele
6. Click "Aprobă"
7. Psihologul apare acum în lista publică
```

### Flux 3: Adăugare Recenzie

```
1. Beneficiar → Autentificare
2. Navighează la psihologul dorit
3. Scroll la "Adaugă o recenzie"
4. Selectează rating (1-5 stele)
5. Scrie textul recenziei
6. Click "Trimite recenzie"
7. Mesaj: "Va fi afișată după moderare"
8. Admin aprobă
9. Recenzia apare pe profil
```

## Caracteristici Responsive

Aplicația este complet responsivă:

### Desktop (>1024px)
- Layout cu 3 coloane pentru carduri
- Meniu complet vizibil
- Tabele largi pentru admin

### Tablet (768px - 1024px)
- Layout cu 2 coloane
- Meniu adaptat
- Carduri mai mici

### Mobile (<768px)
- Layout cu 1 coloană
- Meniu hamburger
- Butoane și formulare optimizate pentru touch
- Tabele scroll orizontal

## Limitări și Considerații

### ⚠️ Limitări Tehnice

1. **localStorage**
   - Limită ~5-10MB
   - Date locale la browser
   - Pot fi șterse de utilizator

2. **Securitate**
   - Parole plain text (DOAR DEMO!)
   - Nu există backend
   - Nu există validare server-side

3. **Performanță**
   - OK pentru <1000 înregistrări
   - Pentru mai mult → necesită backend

### 🚀 Pentru Producție Este Necesar:

- ✅ Backend real (Node.js, Python, PHP)
- ✅ Bază de date (PostgreSQL, MySQL)
- ✅ Hash parole (bcrypt)
- ✅ Autentificare JWT
- ✅ HTTPS
- ✅ Rate limiting
- ✅ Backup-uri
- ✅ Conformitate GDPR
- ✅ Sistem notificări (email, SMS)
- ✅ Upload poze real
- ✅ Sistem plăți (dacă aplicabil)

## Depanare (Troubleshooting)

### Problema: Nu pot să mă autentific
**Soluție:**
- Verifică email și parolă
- Încearcă să ștergi localStorage: F12 → Console → `localStorage.clear()` → Refresh

### Problema: Psihologii nu apar
**Soluție:**
- Verifică console pentru erori (F12)
- Asigură-te că ești pe pagina "Terapeuți"
- Verifică filtrele - resetează-le

### Problema: Nu pot face programare
**Soluție:**
- Trebuie să fii autentificat
- Selectează mai întâi o dată
- Apoi selectează o oră

### Problema: Administratorul nu vede panoul
**Soluție:**
- Verifică că ești autentificat cu admin@atsi.ro
- Apasă F5 pentru refresh
- Verifică că meniul "Administrare" este vizibil

### Reset complet aplicație:
```javascript
// Deschide Console (F12) și rulează:
localStorage.clear();
location.reload();
```

## Extinderi Viitoare Posibile

### Nivel 1 (Simplu)
- [ ] Mai multe limbi (EN, HU)
- [ ] Dark mode
- [ ] Export date (CSV, PDF)
- [ ] Print profil psiholog

### Nivel 2 (Mediu)
- [ ] Sistem mesagerie între utilizatori
- [ ] Notificări browser
- [ ] Calendar Google integration
- [ ] Upload poze profiluri

### Nivel 3 (Complex)
- [ ] Video call integrat
- [ ] Sistem plăți
- [ ] API pentru mobile app
- [ ] AI chatbot pentru suport
- [ ] Dashboard analytics avansat

## Suport

Pentru probleme tehnice sau întrebări:
1. Verifică acest ghid
2. Consultă `DATABASE-STRUCTURE.md` pentru detalii tehnice
3. Citește `page-documentation.txt` pentru structura codului

## Licență și Utilizare

Această aplicație este construită pentru **Asociația Tinerilor din Sistemul de Protecție (ATSI)** în scopul de a facilita accesul tinerilor vulnerabili la servicii de terapie pro bono.

---

**Versiune:** 1.0.0  
**Data:** Octombrie 2025  
**Tehnologii:** HTML5, CSS3, JavaScript (Vanilla)  
**Browser Support:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

