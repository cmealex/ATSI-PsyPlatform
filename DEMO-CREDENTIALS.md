# 🔐 Credențiale Demo - Platformă ATSI
## Pentru testare și demonstrație

**Versiune**: 1.2.0  
**Data**: Octombrie 14, 2025

---

## ⚠️ IMPORTANT

Toate parolele sample sunt acum **hash-uite** pentru securitate.

Utilizatorii demo pot face login cu parolele în **clar** (nehasp-uite), iar sistemul le va hash-ui automat pentru comparație.

---

## 👤 CONTURI DEMO DISPONIBILE

### 1. ADMIN
```
Email: admin@atsi.ro
Parolă: admin123
```
**Acces**: Panoul de administrare complet

---

### 2. PSIHOLOGI / TERAPEUȚI

Toți psihologii demo au aceeași parolă pentru simplitate:

```
Parolă (pentru toți): password
```

**Lista psihologi**:

| Nume | Email | Oraș |
|------|-------|------|
| Alex Simion | alex.simion@atsi.ro | București |
| Flavia Teculeasa | flavia.teculeasa@atsi.ro | București |
| Barbu Mihai | barbu.mihai@atsi.ro | Cluj-Napoca |
| Daniela Oprescu | daniela.oprescu@atsi.ro | București |
| Ionuț Oprițescu | ionut.opritescu@atsi.ro | București |
| Irina Ignătescu | irina.ignatescu@atsi.ro | București |
| Irina Săcuiu | irina.sacuiu@atsi.ro | București |
| Miruna Vâlcu | miruna.valcu@atsi.ro | București |
| Oana Camelia Guraliuc | oana.guraliuc@atsi.ro | București |
| Paul Mureșan | paul.muresan@atsi.ro | Cluj-Napoca |
| Andreea Stancu | andreea.stancu@atsi.ro | București |

---

### 3. BENEFICIARI

```
Parolă (pentru toți): password
```

**Lista beneficiari**:

| Nume | Email |
|------|-------|
| Alex Munteanu | alex@example.com |
| Maria Popa | maria@example.com |
| Ion Popescu | ion@example.com |

---

## 🔐 DETALII TEHNICE

### Hash-uri folosite:

```javascript
// Parolă: "password"
// Hash: "mc6bt1k"

// Parolă: "admin123"
// Hash: "h0g0qsf"
```

### Cum funcționează:

1. **La login**:
   - User introduce parola în clar (ex: "password")
   - Sistemul hash-uiește parola introdusă
   - Compară hash-ul cu hash-ul stocat în localStorage
   - Dacă match → login reușit

2. **La înregistrare**:
   - User introduce parolă nouă
   - Sistemul hash-uiește parola
   - Stochează hash-ul (NU parola în clar)

---

## 🧪 TESTARE

### Test 1: Login Admin
```
1. Accesează http://localhost:8000
2. Click pe "Autentificare"
3. Email: admin@atsi.ro
4. Parolă: admin123
5. Click "Autentifică-te"
6. → Ar trebui să vezi panoul admin
```

### Test 2: Login Psiholog
```
1. Accesează http://localhost:8000
2. Click pe "Autentificare"
3. Email: alex.simion@atsi.ro
4. Parolă: password
5. Click "Autentifică-te"
6. → Ar trebui să vezi profilul de terapeut
```

### Test 3: Login Beneficiar
```
1. Accesează http://localhost:8000
2. Click pe "Autentificare"
3. Email: alex@example.com
4. Parolă: password
5. Click "Autentifică-te"
6. → Ar trebui să vezi profilul de beneficiar
```

### Test 4: Rate Limiting
```
1. Încearcă login cu parolă greșită de 5 ori
2. → După a 5-a încercare, contul va fi blocat 15 minute
3. Mesaj: "Prea multe încercări eșuate..."
```

### Test 5: Înregistrare Nouă
```
1. Click pe "Înregistrare"
2. Completează formular
3. Parolă: minim 8 caractere
4. → Parola va fi hash-uită automat
```

---

## 📋 SCENARII DE TESTARE

### Scenariul 1: Flux Admin
1. Login ca admin
2. Accesează "Panou Admin"
3. Vezi lista utilizatori (toate tipurile)
4. Vezi lista programări
5. Aprobă/Respinge psihologi noi

### Scenariul 2: Flux Psiholog
1. Login ca psiholog
2. Editează profil
3. Vezi programări proprii
4. Răspunde la mesaje forum

### Scenariul 3: Flux Beneficiar
1. Login ca beneficiar
2. Caută psihologi (cu filtre)
3. Vezi profil psiholog
4. Rezervă sesiune
5. Lasă recenzie
6. Participă la forum

---

## ⚠️ NOTĂ SECURITATE

### Pentru DEMO:
✅ Aceste credențiale sunt **OK pentru testare**
✅ Parolele sunt hash-uite (mai bine decât plain text)

### Pentru PRODUCȚIE:
❌ **NU folosi aceste credențiale!**
❌ **NU folosi parole simple ca "password"!**
❌ Implementează backend cu bcrypt

**Vezi**: `CRITICAL-BUGS-BACKEND-NEEDED.md` pentru producție

---

## 🔄 RESET DATE DEMO

Dacă vrei să resetezi aplicația la starea inițială:

### Metoda 1: Clear localStorage (Browser)
```javascript
// În Console (F12):
localStorage.clear();
// Apoi refresh pagina
```

### Metoda 2: Manual
```javascript
// În Console (F12):
localStorage.removeItem('users');
localStorage.removeItem('therapists');
localStorage.removeItem('currentUser');
localStorage.removeItem('appointments');
localStorage.removeItem('reviews');
localStorage.removeItem('forumTopics');
localStorage.removeItem('forumReplies');
// Apoi refresh pagina
```

---

## 💡 TIPS

1. **Pentru testare rapidă**: Folosește admin account
2. **Pentru testare completă**: Testează toate cele 3 roluri
3. **Pentru demonstrație**: Creează un scenariu complet (beneficiar caută → rezervă → recenzie)
4. **Pentru debugging**: Verifică localStorage în DevTools (F12 → Application → Local Storage)

---

## 📞 PROBLEME?

### Parolă nu funcționează?
1. Verifică că ai scris corect (case-sensitive pentru email)
2. Verifică că nu ai spații la început/sfârșit
3. Dacă ești blocat (rate limiting), așteaptă 15 minute sau:
   ```javascript
   localStorage.removeItem('loginAttempts');
   ```

### Date ciudate?
1. Fă reset la localStorage (vezi mai sus)
2. Refresh pagina
3. Date sample vor fi reîncărcate automat

### Nu vezi panoul admin?
1. Verifică că te-ai logat cu admin@atsi.ro
2. Verifică localStorage:
   ```javascript
   JSON.parse(localStorage.getItem('currentUser')).userType
   // Ar trebui să returneze "admin"
   ```

---

## ✅ CHECKLIST TESTARE

- [ ] Login Admin
- [ ] Login Psiholog
- [ ] Login Beneficiar
- [ ] Rate limiting (5 încercări)
- [ ] Înregistrare nou user
- [ ] Editare profil
- [ ] Rezervare sesiune
- [ ] Lasă recenzie
- [ ] Forum topic nou
- [ ] Forum reply
- [ ] Filtrare terapeuți
- [ ] Search funcționează
- [ ] Mobile menu funcționează
- [ ] Toate validările funcționează

---

**Data Creare**: Octombrie 14, 2025  
**Ultima Actualizare**: Octombrie 14, 2025  
**Status**: ✅ Toate parolele hash-uite

**Happy Testing! 🚀**

