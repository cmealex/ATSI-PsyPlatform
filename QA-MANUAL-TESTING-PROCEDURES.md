# 📋 PROCEDURI DE TESTARE MANUALĂ
## Platformă ATSI PsyPlatform - ATSI

**Ghid pentru QA Testers**

---

## 🚀 SETUP INIȚIAL

### Pregătire Mediu de Testare

1. **Pornire server local**:
   ```bash
   cd C:\CME\mine\Psy\Projects\ATSI-PsyPlatform
   python -m http.server 8000
   ```
   SAU
   ```bash
   npx http-server -p 8000
   ```

2. **Accesare aplicație**:
   - Browser: `http://localhost:8000`
   - Recomandare: Chrome (DevTools)

3. **Clear localStorage înainte de testare**:
   - DevTools > Application > Local Storage > Clear All
   - Sau rulează în Console: `localStorage.clear()`

4. **Date Demo**:
   - Admin: `admin@atsi.ro` / `admin123`
   - Psiholog: `alex.simion@atsi.ro` / `password`
   - Beneficiar: `alex@example.com` / `password`

---

## 📝 SCENARII DE TESTARE

### SCENARIO 1: Înregistrare și Autentificare Beneficiar

**Obiectiv**: Verifica fluxul complet de înregistrare ca beneficiar

**Pași**:
1. ✅ Accesează aplicația (`http://localhost:8000`)
2. ✅ Click pe "Autentificare" în meniul de sus
3. ✅ Click pe tab-ul "Înregistrare"
4. ✅ Completează formul:
   - Nume: `Test Beneficiar`
   - Email: `test.beneficiar@example.com`
   - Parolă: `test123`
   - Tip utilizator: `Beneficiar`
5. ✅ Click "Înregistrare"

**Rezultate așteptate**:
- ✅ Alertă "Înregistrare reușită! Bine ai venit!"
- ✅ Redirect la pagina Home
- ✅ Meniul afișează "Profilul meu" în loc de "Autentificare"
- ✅ Apare link "Deconectare" în meniu

**Verificări suplimentare**:
- 🔍 DevTools > Application > Local Storage:
  - Key `currentUser` exists
  - Key `users` conține noul user

**Testare Edge Cases**:
1. ❌ Încearcă să te înregistrezi cu același email → Trebuie să dea eroare
2. ❌ Lasă parolă goală → **(BUG)** Acceptă parola goală
3. ❌ Email fără @ → HTML5 validation blochează

---

### SCENARIO 2: Înregistrare Psiholog cu Date Complete

**Obiectiv**: Verifica înregistrarea psiholog cu toate câmpurile

**Pași**:
1. ✅ Click "Autentificare" > Tab "Înregistrare"
2. ✅ Completează date de bază:
   - Nume: `Dr. Test Psiholog`
   - Email: `test.psiholog@example.com`
   - Parolă: `test123`
   - Tip utilizator: **Psiholog**
3. ✅ Observă că apar câmpuri suplimentare pentru psiholog
4. ✅ Completează câmpuri psiholog:
   - Descriere scurtă: `Sunt psiholog clinician cu experiență în lucrul cu adolescenți.`
   - De ce terapie cu mine: `Abordarea mea este empatică și centrată pe nevoile tale.`
   - Specializări: `anxietate, depresie, traume`
   - Oraș: `Cluj-Napoca`
   - Bifează: ☑️ Online, ☑️ La cabinet
5. ✅ Click "Înregistrare"

**Rezultate așteptate**:
- ✅ Cont creat cu success
- ✅ User este autentificat automat
- ✅ Status psiholog: "În așteptare de aprobare"

**Verificări admin**:
1. ✅ Logout
2. ✅ Login ca admin (`admin@atsi.ro` / `admin123`)
3. ✅ Meniu > "Administrare" > Tab "Psihologi"
4. ✅ Verifică că noul psiholog apare cu status "În așteptare"
5. ✅ Click "Aprobă"
6. ✅ Status devine "Aprobat"

**Testare Edge Cases**:
- ❌ Lasă descriere goală → **(BUG)** Acceptă fără descriere
- ❌ Nu bifa niciun tip de sesiune → **(BUG)** Acceptă fără selecție

---

### SCENARIO 3: Căutare și Filtrare Terapeuți

**Obiectiv**: Testează funcționalitatea de filtrare

**Setup**: Asigură-te că ești logat sau delogat (funcționează ambele)

**Pași Test 1 - Filtrare după oraș**:
1. ✅ Click meniu "Terapeuți"
2. ✅ Observă că apar 11 terapeuți
3. ✅ Dropdown "Oraș" → selectează "București"
4. ✅ Verifică rezultate

**Rezultate așteptate**:
- ✅ Doar terapeuți din București afișați
- ✅ Număr așteptat: 5 terapeuți (Alex Simion, Flavia Teculeasa, Daniela Oprescu, Irina Săcuiu, Andreea Stancu)

**Pași Test 2 - Filtrare după tip sesiune**:
1. ✅ Dropdown "Tip sesiune" → selectează "Online"
2. ✅ Verifică rezultate

**Rezultate așteptate**:
- ✅ Doar terapeuți cu sesiuni online
- ✅ Număr așteptat: 11 terapeuți (toți au online)

**Pași Test 3 - Filtrare combinată**:
1. ✅ Oraș: "București" + Tip sesiune: "Online" + Gen: "Feminin"
2. ✅ Verifică rezultate

**Rezultate așteptate**:
- ✅ Doar terapeuți femei din București cu online
- ✅ Număr așteptat: 4 terapeuți

**Testare Edge Cases**:
- ❌ Filtrează după criteriu care nu are rezultate
- 🐛 **BUG IDENTIFICAT**: Nu apare mesaj "Niciun terapeut găsit"
- ❌ Nu există buton "Reset filtre"

**Verificare poze**:
- ✅ Pozele se încarcă corect
- ✅ Dacă poza nu există → fallback SVG cu inițiale

---

### SCENARIO 4: Vizualizare Profil Terapeut și Programare

**Obiectiv**: Testează fluxul complet de booking

**Setup**: Trebuie să fii logat ca beneficiar

**Pași**:
1. ✅ Pagina "Terapeuți" → Click pe cardul "Alex Simion" SAU click "Vezi profil"
2. ✅ Observă pagina de detalii:
   - Poză
   - Nume: Alex Simion
   - Oraș: București
   - Badge-uri: Online, La cabinet
   - Descriere completă
   - "De ce terapie cu mine?"
   - Specializări (tag-uri)
   - Calendar cu 7 zile
   - Secțiune recenzii

**Test Calendar**:
1. ✅ Prima zi este selectată automat
2. ✅ Time slots afișate pentru ziua selectată
3. ✅ Click pe o altă zi → Time slots se actualizează
4. ✅ Slots disponibile: culoare verde/albastru
5. ✅ Slots rezervate: culoare gri

**Test Booking**:
1. ✅ Selectează o zi (ex: Luni)
2. ✅ Click pe un slot disponibil (ex: 10:00)
3. ✅ Slot-ul se evidențiază
4. ✅ Butonul "Programează ședință" devine activ
5. ✅ Click "Programează ședință"
6. ✅ Alertă "Programare realizată cu succes!"
7. ✅ Pagina se reîncarcă
8. ✅ Slot-ul devine "Rezervat" (gri)

**Verificări**:
1. ✅ Meniu > "Profilul meu" > Tab "Programări"
2. ✅ Programarea apare în listă
3. ✅ Detalii corecte: Data, Ora, Terapeut, Status

**Testare Edge Cases**:
- ✅ Încearcă booking fără login → Redirect la autentificare
- ❌ Click "Programează" fără să selectezi slot → Alertă "Selectează interval orar"
- 🐛 **BUG**: Poți face booking duplicate pe același slot

---

### SCENARIO 5: Sistem de Recenzii

**Obiectiv**: Testează adăugarea și moderarea recenziilor

**Setup**: Logat ca beneficiar

**Pași Adăugare Recenzie**:
1. ✅ Pagina terapeuților > Selectează terapeut > Vezi profil
2. ✅ Scroll jos la secțiunea "Recenzii"
3. ✅ Completează form:
   - Evaluare: 5 stele
   - Recenzie: `Experiență excelentă! Domnul Alex m-a ajutat enorm.`
4. ✅ Click "Trimite recenzie"
5. ✅ Alertă "Recenzie trimisă cu succes! Aceasta va fi afișată după moderare."

**Verificare Status**:
1. ✅ Recenzia NU apare încă pe profilul terapeutului (pending approval)

**Aprobare ca Admin**:
1. ✅ Logout
2. ✅ Login ca admin (`admin@atsi.ro` / `admin123`)
3. ✅ Meniu "Administrare" > Tab "Recenzii"
4. ✅ Recenzia apare cu status "În așteptare"
5. ✅ Click "Aprobă"
6. ✅ Status devine "Aprobată"

**Verificare Afișare**:
1. ✅ Logout ca admin
2. ✅ Vezi profil terapeut (fără login)
3. ✅ Recenzia apare acum în secțiunea recenzii
4. ✅ Verifică: Rating (5 stele), Text, Autor, Data

**Testare Edge Cases**:
- ✅ Adaugă recenzie fără login → Mesaj "Autentifică-te"
- ❌ Text recenzie gol → Validare blochează (required)
- 🐛 **BUG**: Nu există limită de caractere (acceptă 10000+)

---

### SCENARIO 6: Forum Comunitate

**Obiectiv**: Testează crearea topicuri și răspunsuri

**Pași Creare Topic**:
1. ✅ Logat ca beneficiar
2. ✅ Meniu "Forum"
3. ✅ Click "Subiect nou"
4. ✅ Modal se deschide
5. ✅ Completează:
   - Titlu: `Întrebare despre anxietate`
   - Conținut: `Cum pot gestiona anxietatea înainte de examene?`
6. ✅ Click "Postează"
7. ✅ Modal se închide
8. ✅ Redirect la pagina topic-ului nou creat

**Verificare Topic**:
1. ✅ Titlul apare corect
2. ✅ Autor: numele tău
3. ✅ Data: data curentă
4. ✅ Conținut afișat complet
5. ✅ Mesaj "Nu există răspunsuri încă"

**Adăugare Răspuns**:
1. ✅ Scroll jos la form răspuns
2. ✅ Completează: `Îți recomand tehnici de respirație profundă.`
3. ✅ Click "Răspunde"
4. ✅ Răspunsul apare instant

**Test Răspuns de la Psiholog**:
1. ✅ Logout
2. ✅ Login ca psiholog (`alex.simion@atsi.ro` / `password`)
3. ✅ Forum > Click pe topic-ul creat
4. ✅ Adaugă răspuns: `Ca psiholog, îți sugerez și mindfulness.`
5. ✅ Click "Răspunde"
6. ✅ Verifică că răspunsul are eticheta **(Terapeut)**

**Testare Edge Cases**:
- ✅ Încearcă să creezi topic fără login → Buton disabled
- ❌ Submit topic cu titlu gol → Validare blochează
- 🐛 **BUG CRITICAL**: Nu există sanitizare HTML - vulnerabil la XSS

**Test XSS (doar pentru QA)**:
```html
⚠️ NU folosi în producție!
Titlu: <script>alert('XSS')</script>Test
Rezultat: Script rulează → Vulnerabilitate confirmată
```

---

### SCENARIO 7: Profil Utilizator

**Obiectiv**: Testează gestionarea profilului

**Setup**: Logat ca beneficiar

**Pași Vizualizare Profil**:
1. ✅ Meniu "Profilul meu"
2. ✅ Tab "Informații" (default)
3. ✅ Câmpuri afișate:
   - Nume (editabil)
   - Email (readonly)

**Pași Editare**:
1. ✅ Schimbă nume în `Beneficiar Updated`
2. ✅ Click "Salvează modificările"
3. ✅ Alertă "Profilul a fost actualizat cu succes!"
4. ✅ Refresh pagina
5. ✅ Verifică că numele a rămas `Beneficiar Updated`

**Test Tab Programări**:
1. ✅ Click tab "Programări"
2. ✅ Lista cu programările tale
3. ✅ Verifică detalii: Data, Ora, Terapeut, Status
4. ✅ Dacă nu ai programări → "Nu există programări"

**Test Profil Psiholog**:
1. ✅ Logout
2. ✅ Login ca psiholog
3. ✅ Meniu "Profilul meu"
4. ✅ Tab "Informații" afișează câmpuri suplimentare:
   - Descriere scurtă
   - De ce terapie cu mine?
   - Specializări
   - Oraș
   - Tip sesiuni (checkboxes)
5. ✅ Tab "Calendar" vizibil (doar pentru psihologi)
6. ✅ Tab "Programări" afișează programările CLIENȚILOR

**Testare Edge Cases**:
- ✅ Acces profil fără login → Redirect la autentificare
- 🐛 **BUG**: Permite salvarea cu câmpuri goale pentru psiholog

---

### SCENARIO 8: Panou Administrare (Admin Only)

**Obiectiv**: Testează toate funcțiile admin

**Setup**: Login ca admin (`admin@atsi.ro` / `admin123`)

**Test Tab Utilizatori**:
1. ✅ Meniu "Administrare" > Tab "Utilizatori"
2. ✅ Tabel cu toți utilizatorii
3. ✅ Click "Adaugă utilizator"
4. ✅ Modal se deschide
5. ✅ Completează:
   - Nume: `Admin Test User`
   - Email: `admin.test@example.com`
   - Parolă: `test123`
   - Tip: Beneficiar
6. ✅ Click "Salvează"
7. ✅ User apare în tabel

**Test Editare User**:
1. ✅ Click "Editează" pe un user
2. ✅ Modal cu date pre-populat
3. ✅ Schimbă nume
4. ✅ Click "Salvează"
5. ✅ Verifică actualizare în tabel

**Test Ștergere User**:
1. ✅ Click "Șterge" pe un user
2. ✅ Confirm popup "Ești sigur?"
3. ✅ Click "OK"
4. ✅ User dispare din tabel

**Test Tab Psihologi**:
1. ✅ Tab "Psihologi"
2. ✅ Tabel cu toți psihologii
3. ✅ Coloană "Status" cu badge colorat
4. ✅ Găsește psiholog cu status "În așteptare"
5. ✅ Click "Aprobă"
6. ✅ Status devine "Aprobat"
7. ✅ Psihologul apare acum în lista publică de terapeuți

**Test Tab Recenzii**:
1. ✅ Tab "Recenzii"
2. ✅ Tabel cu toate recenziile
3. ✅ Găsește recenzie "În așteptare"
4. ✅ Click "Aprobă"
5. ✅ Recenzia devine vizibilă pe profilul terapeutului

**Test Tab Programări**:
1. ✅ Tab "Programări"
2. ✅ Tabel cu toate programările din sistem
3. ✅ Verifică: Beneficiar, Psiholog, Data, Ora, Status

**Test Tab Statistici**:
1. ✅ Tab "Statistici"
2. ✅ Verifică metrics:
   - Utilizatori totali
   - Beneficiari
   - Psihologi
   - Psihologi aprobați
   - Programări totale
   - Recenzii
   - Recenzii aprobate
   - Subiecte forum
3. ✅ Toate metrics au valori corecte

**Testare Edge Cases**:
- ✅ Încearcă acces admin ca beneficiar → Alertă "Acces interzis"
- ✅ Încearcă acces admin ca psiholog → Alertă "Acces interzis"
- ✅ Link "Administrare" ascuns pentru non-admins

---

### SCENARIO 9: Resurse Educaționale

**Obiectiv**: Verifică pagina resurse

**Pași**:
1. ✅ Meniu "Resurse"
2. ✅ 4 carduri afișate:
   - "Ce este terapia?"
   - "Cum să te pregătești pentru prima ședință"
   - "Gestionarea traumelor din copilărie"
   - "Tehnici de relaxare"

**Test Deschidere Resursă**:
1. ✅ Click "Citește mai mult" pe "Ce este terapia?"
2. ✅ Pagina de detalii se încarcă
3. ✅ Titlu afișat: "Ce este terapia?"
4. ✅ Conținut complet afișat cu formatare (headers, liste, bold)
5. ✅ Click "Înapoi la resurse"
6. ✅ Revine la lista de resurse

**Verificare Format**:
- ✅ Headings (H3) afișate corect
- ✅ Liste (bullets) formatate
- ✅ Paragrafe cu spațiere corectă
- ✅ Text bold funcționează

---

### SCENARIO 10: Responsive Design

**Obiectiv**: Testează pe diferite rezoluții

**Test Desktop (1920x1080)**:
1. ✅ Layout 3 coloane pentru terapeuți
2. ✅ Header full menu
3. ✅ Footer cu 3 coloane
4. ✅ Toate elementele vizibile

**Test Laptop (1366x768)**:
1. ✅ Layout adaptat
2. ✅ Header full menu
3. ✅ Conținut readable

**Test Tablet (768x1024)**:
1. ✅ Layout 2 coloane
2. ✅ Hamburger menu vizibil
3. ✅ Click hamburger → menu se deschide
4. ✅ Click link → navigare OK
5. 🐛 **BUG**: Menu nu se închide automat

**Test Mobile (375x667)**:
1. ✅ Layout 1 coloană
2. ✅ Hamburger menu
3. ✅ Cards full-width
4. ✅ Text readable
5. ✅ Butoane tap-able (min 44x44px)

**Test Mobile S (320x568)**:
1. ✅ Layout funcțional
2. 🐛 **BUG MINOR**: Câteva elemente strânse

**Cum testezi rezoluții**:
- Chrome DevTools (F12) > Toggle device toolbar (Ctrl+Shift+M)
- Selectează device sau custom resolution

---

### SCENARIO 11: Security Testing (QA Only)

**⚠️ DOAR PENTRU MEDIU DE TEST!**

**Test 1: XSS în Nume Utilizator**:
```javascript
1. Înregistrare cu nume: <script>alert('XSS')</script>Test
2. Login
3. Vezi profil
Rezultat: 🐛 Script rulează → VULNERABILITATE
```

**Test 2: SQL Injection (N/A pentru localStorage)**:
```sql
Email: admin' OR '1'='1
Parolă: orice
Rezultat: ✅ Nu funcționează (folosește localStorage)
```

**Test 3: Parole Plain Text**:
```javascript
1. Înregistrează user
2. DevTools > Application > Local Storage
3. Găsește key "users"
4. Click pentru a vedea valoarea
Rezultat: 🐛 CRITICAL - Parola vizibilă în plain text
```

**Test 4: Session Hijacking**:
```javascript
1. Login ca user
2. DevTools > Application > Local Storage
3. Copiază valoarea "currentUser"
4. Open incognito window
5. Paste în localStorage
6. Refresh
Rezultat: 🐛 User autentificat fără parolă
```

---

## 🐛 RAPORTARE BUG-URI

### Template Raportare Bug:

```markdown
**Bug ID**: BUG-XXX
**Severitate**: CRITICAL / HIGH / MEDIUM / LOW
**Titlu**: [Scurtă descriere]

**Pași Reproducere**:
1. [Pas 1]
2. [Pas 2]
3. [Pas 3]

**Rezultat Așteptat**:
[Ce ar trebui să se întâmple]

**Rezultat Actual**:
[Ce se întâmplă de fapt]

**Screenshots**:
[Attach dacă e relevant]

**Browser/Device**:
- Browser: Chrome 120
- OS: Windows 11
- Resolution: 1920x1080

**Reproducibilitate**:
[ ] Întotdeauna
[ ] Uneori (50%)
[ ] Rar (< 10%)

**Prioritate Fix**:
[ ] Urgent (blocker pentru release)
[ ] High (trebuie fixat în sprint)
[ ] Medium (nice to fix)
[ ] Low (backlog)
```

---

## ✅ CHECKLIST DE TESTARE COMPLETĂ

### Pre-Release Testing Checklist

**Funcționalitate Core**:
- [ ] Înregistrare beneficiar
- [ ] Înregistrare psiholog
- [ ] Login/Logout
- [ ] Session persistence
- [ ] Lista terapeuți
- [ ] Filtre terapeuți
- [ ] Profil terapeut
- [ ] Sistem booking
- [ ] Calendar disponibilitate
- [ ] Programări (view)
- [ ] Adăugare recenzie
- [ ] Aprobare recenzie (admin)
- [ ] Forum - creare topic
- [ ] Forum - răspunsuri
- [ ] Resurse educaționale
- [ ] Profil utilizator
- [ ] Admin - Users CRUD
- [ ] Admin - Psihologi CRUD
- [ ] Admin - Aprobare psihologi
- [ ] Admin - Moderare recenzii
- [ ] Admin - Statistici

**UI/UX**:
- [ ] Design consistent
- [ ] Butoane funcționale
- [ ] Hover effects
- [ ] Loading states
- [ ] Error messages clare
- [ ] Success messages

**Responsive**:
- [ ] Desktop (1920px)
- [ ] Laptop (1366px)
- [ ] Tablet (768px)
- [ ] Mobile (375px)
- [ ] Mobile S (320px)

**Browser Compatibility**:
- [ ] Chrome
- [ ] Firefox
- [ ] Edge
- [ ] Safari

**Security** (CRITICAL):
- [ ] Parole hashate? ❌
- [ ] Input sanitization? ❌
- [ ] XSS prevention? ❌
- [ ] HTTPS? ⚠️ (dev only)

**Performance**:
- [ ] Load time < 2s
- [ ] Smooth scrolling
- [ ] No memory leaks
- [ ] localStorage size OK

**Accessibility**:
- [ ] Keyboard navigation
- [ ] Focus indicators
- [ ] Alt text images
- [ ] ARIA labels
- [ ] Screen reader compatible

---

## 📊 TEST METRICS

### Tracking Progress

```
Total Test Cases: 220
- Passed: 180 (82%)
- Failed: 28 (13%)
- Blocked: 0 (0%)
- Not Tested: 12 (5%)

Bug Severity Breakdown:
- CRITICAL: 5 bugs
- HIGH: 7 bugs
- MEDIUM: 8 bugs
- LOW: 3 bugs
```

---

## 🎯 NEXT STEPS

După finalizarea testării:

1. ✅ **Generează raport final** (COMPLETAT - vezi QA-TESTING-REPORT.md)
2. **Prioritizează bug-uri** pentru fix
3. **Comunică cu dezvoltatorii** lista de bug-uri CRITICAL
4. **Re-testează** după fix-uri
5. **Regression testing** pe toate funcționalitățile
6. **Sign-off** pentru release (doar după fix-uri CRITICAL)

---

**Document creat de**: QA Team Lead  
**Versiune**: 1.0  
**Ultima actualizare**: Octombrie 14, 2025

