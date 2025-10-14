# 🐛 BUG TRACKER - PRIORITIZED
## Platformă ATSI PsyPlatform ATSI

**Data**: Octombrie 14, 2025  
**Total Bug-uri**: 23  
**Status**: OPEN - Await Fix

---

## 🔥 CRITICAL BUGS (5) - BLOCKERS PENTRU PRODUCȚIE

### 🔴 BUG-001: Parolă Goală Acceptată la Înregistrare
**Severitate**: CRITICAL  
**Status**: 🔴 OPEN  
**Descoperit în**: TC-004 (Testare înregistrare)

**Descriere**:
Sistemul acceptă înregistrarea cu parolă goală. Nu există validare JavaScript pentru lungimea minimă a parolei.

**Pași Reproducere**:
1. Deschide pagina "Autentificare" > Tab "Înregistrare"
2. Completează Nume și Email
3. Lasă câmpul Parolă gol
4. Click "Înregistrare"
5. Rezultat: Cont creat cu parolă goală

**Impact**: 
- Securitate compromisă
- Oricine poate accesa contul

**Soluție Propusă**:
```javascript
// În auth.js, funcția register()
if (!password || password.length < 8) {
    alert('Parola trebuie să aibă minim 8 caractere.');
    return;
}
```

**Fișiere de Modificat**:
- `auth.js` (linia ~132)
- `index.html` - Adaugă pattern validation

**Timp Estimat**: 2 ore  
**Prioritate**: 🔥 **URGENT**

---

### 🔴 BUG-004: Lipsa Sanitizării Input-urilor - XSS Vulnerability
**Severitate**: CRITICAL  
**Status**: 🔴 OPEN  
**Descoperit în**: Multiple test cases (TC-019, TC-105, TC-200-204)

**Descriere**:
Nu există sanitizare pentru input-urile utilizatorilor. Aplicația este vulnerabilă la atacuri XSS (Cross-Site Scripting) în:
- Nume utilizator
- Descriere psiholog
- Topic-uri forum
- Răspunsuri forum
- Recenzii

**Pași Reproducere**:
1. Crează topic forum cu titlu: `<script>alert('XSS')</script>Test`
2. Submit
3. Rezultat: Script-ul se execută

**Impact**: 
- **FOARTE GRAV** - Atacatori pot injecta cod malițios
- Pot fura sesiuni, cookie-uri, date utilizatori
- Pot redirecționa către site-uri malițioase

**Soluție Propusă**:
```javascript
// Implementează funcție de sanitizare
function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

// SAU folosește DOMPurify
// <script src="https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.min.js"></script>
const clean = DOMPurify.sanitize(dirtyInput);
```

**Fișiere de Modificat**:
- Toate fișierele care afișează user input
- `app.js` - Adaugă sanitizare în funcțiile de afișare
- `data.js` - Sanitizare la salvare
- `index.html` - Include DOMPurify library

**Timp Estimat**: 1-2 zile (implementare în toate locurile)  
**Prioritate**: 🔥 **URGENT - TOP PRIORITY**

---

### 🔴 BUG-010: Conținut Forum Nesanitizat
**Severitate**: CRITICAL  
**Status**: 🔴 OPEN  
**Descoperit în**: TC-105 (Testare forum)

**Descriere**:
Conținutul topic-urilor și răspunsurilor din forum nu este sanitizat - aceeași problemă ca BUG-004 dar specific pentru forum.

**Impact**: 
- Atacatori pot crea topic-uri cu cod malițios
- Cod malițios se execută pentru toți utilizatorii care vizualizează topic-ul

**Soluție**:
Aceeași ca BUG-004 - implementează DOMPurify

**Fișiere de Modificat**:
- `app.js` - funcțiile `submitNewTopic()`, `submitReply()`, `loadTopicDetail()`, `loadRepliesForTopic()`

**Timp Estimat**: 4 ore (parte din BUG-004)  
**Prioritate**: 🔥 **URGENT**

---

### 🔴 BUG-016: Parole Stocate în Plain Text
**Severitate**: CRITICAL  
**Status**: 🔴 OPEN  
**Descoperit în**: TC-195 (Security testing)

**Descriere**:
Parolele sunt stocate în plain text în localStorage. Oricine cu acces la localStorage (DevTools, malware, XSS) poate vedea toate parolele.

**Pași Reproducere**:
1. Înregistrează un user
2. Deschide DevTools > Application > Local Storage
3. Click pe key "users"
4. Rezultat: Toate parolele vizibile în clar

**Impact**: 
- **EXTREM DE GRAV**
- Breach complet de securitate
- Încălcare GDPR
- Risc legal major

**Soluție Propusă**:
⚠️ **NECESITĂ BACKEND** - Nu poate fi rezolvat doar client-side
```javascript
// Backend (Node.js cu bcrypt)
const bcrypt = require('bcrypt');
const saltRounds = 10;

// La înregistrare
const hashedPassword = await bcrypt.hash(password, saltRounds);

// La login
const match = await bcrypt.compare(password, user.hashedPassword);
```

**Fișiere de Modificat**:
- **NECESITĂ IMPLEMENTARE BACKEND COMPLETĂ**
- Fișiere frontend: `auth.js`, `data.js`

**Timp Estimat**: 3-5 zile (backend implementation)  
**Prioritate**: 🔥 **URGENT - NECESITĂ BACKEND**

---

### 🔴 BUG-020: Nu Există Sanitizare Generală
**Severitate**: CRITICAL  
**Status**: 🔴 OPEN

**Descriere**:
Lipsește sanitizare centralizată pentru input-uri. Același tip de vulnerabilitate ca BUG-004 și BUG-010, dar problemă sistemică.

**Soluție**:
Implementează funcție centralizată de sanitizare și folosește-o peste tot unde se afișează user-generated content.

**Timp Estimat**: Inclus în BUG-004  
**Prioritate**: 🔥 **URGENT**

---

## 🟠 HIGH PRIORITY BUGS (7)

### 🟠 BUG-002: Câmpuri Obligatorii Psiholog Nu Sunt Validate
**Severitate**: HIGH  
**Status**: 🟠 OPEN  
**Descoperit în**: TC-008-011

**Descriere**:
Psihologii se pot înregistra fără să completeze câmpurile obligatorii (descriere, specializări, oraș, tip sesiune).

**Soluție**:
```javascript
// În auth.js, funcția register() pentru psihologi
if (userType === 'therapist' || userType === 'psiholog') {
    if (!therapistData.description || !therapistData.description.trim()) {
        alert('Descrierea este obligatorie pentru psihologi.');
        return;
    }
    if (!therapistData.why || !therapistData.why.trim()) {
        alert('Câmpul "De ce terapie cu mine?" este obligatoriu.');
        return;
    }
    if (!therapistData.specializations || therapistData.specializations.length === 0) {
        alert('Te rugăm să adaugi cel puțin o specializare.');
        return;
    }
    if (!therapistData.city || !therapistData.city.trim()) {
        alert('Orașul este obligatoriu.');
        return;
    }
    if (!therapistData.online && !therapistData.office) {
        alert('Te rugăm să selectezi cel puțin un tip de sesiune (Online sau La cabinet).');
        return;
    }
}
```

**Fișiere de Modificat**: `auth.js`  
**Timp Estimat**: 1 oră  
**Prioritate**: 🟠 **HIGH**

---

### 🟠 BUG-007: Filtre Fără Rezultate Nu Afișează Mesaj
**Severitate**: HIGH (UX)  
**Status**: 🟠 OPEN  
**Descoperit în**: TC-053

**Descriere**:
Când filtrele nu returnează niciun terapeut, pagina rămâne goală fără mesaj explicativ.

**Soluție**:
```javascript
// În app.js, funcția setupFilters()
// După aplicarea filtrelor
const visibleCards = document.querySelectorAll('.therapist-card[style="display: block"]');
const therapistsList = document.getElementById('therapists-list');

if (visibleCards.length === 0) {
    // Afișează mesaj
    const noResults = document.createElement('div');
    noResults.className = 'no-results';
    noResults.innerHTML = `
        <p>Nu am găsit terapeuți cu criteriile selectate.</p>
        <button class="btn secondary-btn" id="reset-filters">Resetează filtrele</button>
    `;
    therapistsList.appendChild(noResults);
} else {
    // Șterge mesajul dacă există
    const noResults = therapistsList.querySelector('.no-results');
    if (noResults) noResults.remove();
}
```

**Fișiere de Modificat**: 
- `app.js` (funcția `setupFilters()`)
- `styles.css` (stiluri pentru `.no-results`)

**Timp Estimat**: 2 ore  
**Prioritate**: 🟠 **HIGH**

---

### 🟠 BUG-008: Permite Programări Duplicate
**Severitate**: HIGH  
**Status**: 🟠 OPEN  
**Descoperit în**: TC-076

**Descriere**:
Sistemul permite aceluiași utilizator să rezerve același slot de mai multe ori.

**Soluție**:
```javascript
// În app.js, funcția bookSession()
bookSession: function() {
    if (!Auth.isLoggedIn()) {
        alert('Pentru a programa o ședință, te rugăm să te autentifici.');
        this.navigateTo('auth');
        return;
    }
    
    const selectedDate = document.getElementById('time-slots').getAttribute('data-selected-date');
    const selectedTimeSlot = document.querySelector('.time-slot.selected');
    
    if (!selectedTimeSlot) {
        alert('Te rugăm să selectezi un interval orar.');
        return;
    }
    
    const selectedTime = selectedTimeSlot.getAttribute('data-time');
    const therapistId = this.getTherapistIdFromCurrentPage();
    
    // VERIFICARE NOUĂ - previne duplicate
    const existingAppointments = TherapyData.getAppointmentsByUserId(Auth.currentUser.id);
    const duplicate = existingAppointments.find(app => 
        app.therapistId === therapistId && 
        app.date === selectedDate && 
        app.time === selectedTime
    );
    
    if (duplicate) {
        alert('Ai deja o programare la această dată și oră cu acest terapeut.');
        return;
    }
    
    // Restul codului...
}
```

**Fișiere de Modificat**: `app.js` (funcția `bookSession()`)  
**Timp Estimat**: 30 min  
**Prioritate**: 🟠 **HIGH**

---

### 🟠 BUG-014: Accesibilitate Insuficientă
**Severitate**: HIGH (A11y)  
**Status**: 🟠 OPEN  
**Descoperit în**: TC-181-185

**Descriere**:
Aplicația are probleme de accesibilitate:
- Lipsesc focus indicators vizibili
- Lipsesc alt text pentru multe imagini
- Lipsesc ARIA labels pentru elemente interactive

**Soluție**:
```css
/* În styles.css - Adaugă focus indicators */
a:focus, button:focus, input:focus, select:focus, textarea:focus {
    outline: 2px solid #0066cc;
    outline-offset: 2px;
}

.btn:focus {
    outline: 3px solid #0066cc;
    outline-offset: 2px;
}
```

```html
<!-- În index.html - Adaugă ARIA labels -->
<button class="mobile-menu-toggle" aria-label="Toggle navigation menu" aria-expanded="false">
    <span aria-hidden="true"></span>
    <span aria-hidden="true"></span>
    <span aria-hidden="true"></span>
</button>

<button id="book-session-btn" class="btn primary-btn" disabled aria-label="Book therapy session">
    Programează ședință
</button>
```

**Fișiere de Modificat**: 
- `styles.css` (focus indicators)
- `index.html` (ARIA labels)
- `app.js` (update aria-expanded states)

**Timp Estimat**: 4-6 ore  
**Prioritate**: 🟠 **HIGH**

---

### 🟠 BUG-017: Obiect User Complet în localStorage
**Severitate**: HIGH (Security)  
**Status**: 🟠 OPEN  
**Descoperit în**: TC-196

**Descriere**:
Întreg obiectul user (inclusiv parolă) este stocat în localStorage sub cheia `currentUser`. Acest lucru expune date sensibile.

**Soluție**:
⚠️ **NECESITĂ BACKEND** - Implementează JWT
```javascript
// Client-side - stochează doar token
localStorage.setItem('authToken', token);

// Backend - generează JWT
const jwt = require('jsonwebtoken');
const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '24h' });
```

**Fișiere de Modificat**: Necesită backend implementation  
**Timp Estimat**: 2-3 zile (cu backend)  
**Prioritate**: 🟠 **HIGH - NECESITĂ BACKEND**

---

### 🟠 BUG-018: Lipsă Rate Limiting
**Severitate**: HIGH (Security)  
**Status**: 🟠 OPEN  
**Descoperit în**: TC-197

**Descriere**:
Nu există rate limiting pentru încercări de login. Aplicația este vulnerabilă la brute force attacks.

**Soluție**:
⚠️ **NECESITĂ BACKEND**
```javascript
// Backend - folosește express-rate-limit
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minute
    max: 5, // max 5 încercări
    message: 'Prea multe încercări de autentificare. Te rugăm să încerci din nou peste 15 minute.'
});

app.post('/api/login', loginLimiter, (req, res) => {
    // Login logic
});
```

**Fișiere de Modificat**: Necesită backend implementation  
**Timp Estimat**: 1 zi (cu backend)  
**Prioritate**: 🟠 **HIGH - NECESITĂ BACKEND**

---

### 🟠 BUG-019: Email Enumeration la Login
**Severitate**: MEDIUM spre HIGH (Security)  
**Status**: 🟠 OPEN  
**Descoperit în**: TC-199

**Descriere**:
Mesajele de eroare la login diferă între "email inexistent" și "parolă greșită", permițând atacatorilor să determine ce emailuri sunt înregistrate.

**Soluție**:
```javascript
// În auth.js, funcția login()
login: function(email, password) {
    const user = TherapyData.getUserByEmail(email);
    
    // ❌ GREȘIT:
    // if (!user) {
    //     alert('Email-ul nu există.');
    //     return;
    // }
    // if (user.password !== password) {
    //     alert('Parolă incorectă.');
    //     return;
    // }
    
    // ✅ CORECT:
    if (!user || user.password !== password) {
        alert('Credențiale invalide. Te rugăm să verifici email-ul și parola.');
        return;
    }
    
    // Restul codului...
}
```

**Fișiere de Modificat**: `auth.js` (funcția `login()`)  
**Timp Estimat**: 15 min  
**Prioritate**: 🟠 **HIGH**

---

## 🟡 MEDIUM PRIORITY BUGS (8)

### 🟡 BUG-003: Nu Există Indicator Vizual pentru Status Psiholog
**Severitate**: MEDIUM (UX)  
**Soluție**: Adaugă banner/message după înregistrare care să informeze psihologul că contul e "În așteptare de aprobare"  
**Timp**: 1 oră  

---

### 🟡 BUG-005: Meniul Mobil Nu Se Închide Automat
**Severitate**: MEDIUM (UX)  
**Soluție**: Adaugă event listener pentru închidere meniu după click pe link  
**Timp**: 30 min  

---

### 🟡 BUG-006: Lipsește Butonul Reset pentru Filtre
**Severitate**: MEDIUM (UX)  
**Soluție**: Adaugă buton "Resetează filtre" care setează toate dropdown-urile la valoarea default  
**Timp**: 1 oră  

---

### 🟡 BUG-009: Nu Există Limită de Caractere pentru Recenzii
**Severitate**: MEDIUM (Data Validation)  
**Soluție**: Adaugă `maxlength="1000"` la textarea și validare JavaScript  
**Timp**: 15 min  

---

### 🟡 BUG-011: Profilul Permite Salvarea cu Câmpuri Goale
**Severitate**: MEDIUM (Data Validation)  
**Soluție**: Validare în funcția `updateProfile()` pentru câmpuri obligatorii psiholog  
**Timp**: 30 min  

---

### 🟡 BUG-012: Layout Problematic pe Ecrane Foarte Mici (320px)
**Severitate**: MEDIUM (Responsive)  
**Soluție**: Adaugă media query specific pentru 320px cu font-size mai mic  
**Timp**: 1 oră  

---

### 🟡 BUG-013: Tabelele Admin Nu Au Scroll Horizontal pe Mobile
**Severitate**: MEDIUM (Responsive)  
**Soluție**: Wrap tabelele în div cu `overflow-x: auto`  
**Timp**: 30 min  

---

### 🟡 BUG-015: Feedback Vizual Limitat la Alert-uri Native
**Severitate**: MEDIUM (UX)  
**Soluție**: Implementează toast notifications modern system  
**Timp**: 3-4 ore  

---

## 🟢 LOW PRIORITY BUGS (3)

### 🟢 BUG-021: Console.log-uri cu Date Sensibile
**Severitate**: LOW (Production Clean-up)  
**Soluție**: Șterge/comentează toate console.log înainte de producție  
**Timp**: 30 min  

---

### 🟢 BUG-022: Imaginile Nu Sunt Optimizate
**Severitate**: LOW (Performance)  
**Soluție**: Compress imagini, convertește în WebP  
**Timp**: 2 ore  

---

### 🟢 BUG-023: Lipsește Minification CSS/JS
**Severitate**: LOW (Performance)  
**Soluție**: Setup build process cu minification  
**Timp**: 2 ore  

---

## 📊 STATISTICI BUG-URI

| Severitate | Număr | % | Timp Total Estimat |
|------------|-------|---|-------------------|
| 🔴 CRITICAL | 5 | 22% | 5-7 zile* |
| 🟠 HIGH | 7 | 30% | 3-4 zile* |
| 🟡 MEDIUM | 8 | 35% | 2 zile |
| 🟢 LOW | 3 | 13% | 1 zi |
| **TOTAL** | **23** | **100%** | **11-14 zile** |

*Multe bug-uri CRITICAL și HIGH necesită backend implementation

---

## 🎯 PLAN DE ACȚIUNE RECOMANDAT

### Sprint 1 (Săptămâna 1) - CRITICAL
**Focus**: Backend MVP + Security Critical

- [ ] Setup backend (Node.js + Express + PostgreSQL)
- [ ] Implementare autentificare securizată (JWT + bcrypt)
- [ ] Fix BUG-001: Validare parole
- [ ] Fix BUG-004, BUG-010, BUG-020: Sanitizare input-uri (DOMPurify)
- [ ] Fix BUG-016: Hash parole (backend)

**Dezvoltatori Necesari**: 
- 1 Backend Developer (Senior)
- 1 Frontend Developer

**Rezultat**: Securitate de bază implementată

---

### Sprint 2 (Săptămâna 2) - HIGH
**Focus**: Bug-uri HIGH + Validare

- [ ] Fix BUG-002: Validare câmpuri psiholog
- [ ] Fix BUG-007: Mesaj filtre fără rezultate
- [ ] Fix BUG-008: Previne programări duplicate
- [ ] Fix BUG-014: Accesibilitate improvements
- [ ] Fix BUG-017: JWT implementation (backend)
- [ ] Fix BUG-018: Rate limiting (backend)
- [ ] Fix BUG-019: Email enumeration

**Dezvoltatori Necesari**: 
- 1 Frontend Developer
- 1 Backend Developer

**Rezultat**: Funcționalitate robustă

---

### Sprint 3 (Săptămâna 3) - MEDIUM + LOW
**Focus**: Polish + UX + Performance

- [ ] Fix toate bug-urile MEDIUM (8 bug-uri)
- [ ] Fix toate bug-urile LOW (3 bug-uri)
- [ ] Testing complet
- [ ] Code review
- [ ] Performance optimization

**Dezvoltatori Necesari**: 
- 1 Frontend Developer
- 1 QA Engineer

**Rezultat**: Production-ready application

---

## 📝 TRACKING PROGRESS

### Bug Status Legend
- 🔴 **OPEN** - Nefixat
- 🟡 **IN PROGRESS** - În lucru
- 🟢 **FIXED** - Fixat, în testing
- ✅ **VERIFIED** - Fixat și verificat de QA
- ❌ **CLOSED** - Închis (won't fix / duplicate)

### Update Log
Actualizează acest document după fiecare fix cu:
```markdown
**BUG-XXX** - Status: ✅ VERIFIED
Fixed by: [Nume Developer]
Date: [Data]
Commit: [Hash commit]
Verified by: [Nume QA]
```

---

## 📞 RAPORTARE BUG-URI NOI

Pentru bug-uri noi descoperite:

1. Adaugă în acest document cu următorul format:
   ```markdown
   ### 🔴 BUG-XXX: [Titlu Bug]
   **Severitate**: CRITICAL/HIGH/MEDIUM/LOW
   **Status**: 🔴 OPEN
   **Descoperit în**: [Test Case / Scenario]
   **Descriere**: [Descriere detaliată]
   **Pași Reproducere**: [Pași]
   **Impact**: [Impact]
   **Soluție Propusă**: [Cod sau descriere]
   **Fișiere de Modificat**: [Lista fișiere]
   **Timp Estimat**: [Estimare]
   **Prioritate**: [Prioritate]
   ```

2. Actualizează statisticile
3. Notifică QA Lead și Tech Lead

---

**Document Maintained by**: QA Team  
**Last Updated**: Octombrie 14, 2025  
**Version**: 1.0

