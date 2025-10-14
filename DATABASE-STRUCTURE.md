# Structura Bazei de Date - Platformă ATSI PsyPlatform

## Prezentare Generală

Platforma utilizează **localStorage** pentru persistența datelor pe partea de client. Este o soluție simplă și eficientă pentru această aplicație, eliminând necesitatea unui server backend.

## Tipuri de Utilizatori

### 1. Administrator (admin)
- **Scop**: Gestionarea platformei
- **Acces**: Panou de administrare complet
- **Permisiuni**:
  - Gestionare utilizatori (CRUD)
  - Aprobare/gestionare psihologi
  - Moderare recenzii
  - Vizualizare statistici
  - Acces la toate programările

**Date de autentificare implicite:**
- Email: `admin@atsi.ro`
- Parolă: `admin123`

### 2. Psiholog (psiholog)
- **Scop**: Furnizare servicii de terapie
- **Acces**: Profil terapeut + gestionare disponibilitate
- **Permisiuni**:
  - Editare profil propriu
  - Vizualizare programări
  - Gestionare calendar disponibilitate
  - Vizualizare recenzii proprii
  
**Câmpuri specifice:**
- Descriere profesională
- "De ce terapie cu mine?"
- Specializări
- Oraș
- Gen
- Tipuri sesiuni (online/cabinet)
- Foto
- Status aprobare (approved: true/false)
- Disponibilitate (calendar)

### 3. Beneficiar (beneficiar)
- **Scop**: Accesare servicii de terapie
- **Acces**: Profil utilizator + programări
- **Permisiuni**:
  - Căutare și filtrare psihologi
  - Rezervare ședințe
  - Adăugare recenzii
  - Participare forum
  - Vizualizare programări proprii

## Structura Datelor în localStorage

### 1. users
**Cheie**: `users`
**Format**: JSON Array

```javascript
{
  id: string,           // ID unic generat automat
  name: string,         // Nume complet
  email: string,        // Email (unic)
  password: string,     // Parolă (plain text - doar pentru demo)
  userType: string      // 'admin', 'psiholog', 'beneficiar'
}
```

### 2. therapists
**Cheie**: `therapists`
**Format**: JSON Array

```javascript
{
  id: string,
  name: string,
  email: string,
  password: string,
  photo: string,                    // Cale către fotografie
  description: string,              // Descriere profesională
  why: string,                      // De ce terapie cu mine?
  specializations: array[string],   // Lista specializări
  city: string,
  online: boolean,                  // Oferă ședințe online
  office: boolean,                  // Oferă ședințe la cabinet
  gender: string,                   // 'male', 'female'
  userType: string,                 // 'psiholog'
  approved: boolean,                // Status aprobare admin
  availability: {                   // Disponibilitate pe zile
    monday: array[string],          // Ex: ['10:00', '11:00', '14:00']
    tuesday: array[string],
    wednesday: array[string],
    thursday: array[string],
    friday: array[string],
    saturday: array[string],
    sunday: array[string]
  }
}
```

### 3. appointments
**Cheie**: `appointments`
**Format**: JSON Array

```javascript
{
  id: string,
  therapistId: string,    // ID psiholog
  userId: string,         // ID beneficiar
  date: string,           // Format: 'YYYY-MM-DD'
  time: string,           // Format: 'HH:MM'
  status: string          // 'confirmed', 'completed', 'cancelled'
}
```

### 4. reviews
**Cheie**: `reviews`
**Format**: JSON Array

```javascript
{
  id: string,
  therapistId: string,
  userId: string,
  userName: string,
  rating: number,         // 1-5
  text: string,
  date: string,           // ISO string
  approved: boolean       // Necesită aprobare admin
}
```

### 5. forumTopics
**Cheie**: `forumTopics`
**Format**: JSON Array

```javascript
{
  id: string,
  userId: string,
  userName: string,
  title: string,
  content: string,
  date: string            // ISO string
}
```

### 6. forumReplies
**Cheie**: `forumReplies`
**Format**: JSON Array

```javascript
{
  id: string,
  topicId: string,
  userId: string,
  userName: string,
  content: string,
  date: string            // ISO string
}
```

### 7. resources
**Cheie**: `resources`
**Format**: JSON Object

```javascript
{
  'resource-id': {
    title: string,
    content: string       // HTML content
  }
}
```

### 8. currentUser
**Cheie**: `currentUser`
**Format**: JSON Object

Stochează utilizatorul autentificat curent pentru persistența sesiunii.

## Funcții de Date Disponibile

### TherapyData

#### Gestionare Utilizatori
- `getUsers()` - Returnează toți utilizatorii
- `getUserByEmail(email)` - Caută utilizator după email
- `getUserById(id)` - Caută utilizator după ID
- `saveUser(user)` - Salvează/actualizează utilizator
- `deleteUser(id)` - Șterge utilizator

#### Gestionare Psihologi
- `getTherapists(includeUnapproved)` - Returnează psihologi (doar aprobați implicit)
- `getTherapistById(id)` - Caută psiholog după ID
- `saveTherapist(therapist)` - Salvează/actualizează psiholog
- `approveTherapist(id)` - Aprobă psiholog
- `deleteTherapist(id)` - Șterge psiholog

#### Gestionare Programări
- `getAppointments()` - Returnează toate programările
- `getAppointmentsByUserId(userId)` - Programări pentru utilizator
- `getAppointmentsByTherapistId(therapistId)` - Programări pentru psiholog
- `saveAppointment(appointment)` - Salvează/actualizează programare

#### Gestionare Recenzii
- `getReviews()` - Returnează toate recenziile
- `getReviewsByTherapistId(therapistId)` - Recenzii pentru psiholog
- `saveReview(review)` - Salvează recenzie (unapproved implicit)
- `approveReview(id)` - Aprobă recenzie
- `deleteReview(id)` - Șterge recenzie

#### Gestionare Forum
- `getForumTopics()` - Returnează toate subiectele
- `getForumTopicById(id)` - Caută subiect după ID
- `saveForumTopic(topic)` - Salvează subiect
- `getForumReplies()` - Returnează toate răspunsurile
- `getForumRepliesByTopicId(topicId)` - Răspunsuri pentru subiect
- `saveForumReply(reply)` - Salvează răspuns

#### Resurse
- `getResourceById(id)` - Returnează resursa după ID

## Psihologi Incluși în Platformă

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

Toți psihologii au:
- Descriere profesională
- Secțiune "De ce terapie cu mine?"
- Specializări multiple
- Disponibilitate setată
- Status: Aprobat
- Poze din folderul `Date/Poze2/`

## Flux de Aprobare

### Psihologi Noi
1. Înregistrare prin formularul public → `approved: false`
2. Admin primește notificare în panoul de administrare
3. Admin verifică datele și aprobă → `approved: true`
4. Psihologul apare în lista publică

### Recenzii Noi
1. Beneficiarul adaugă recenzie → `approved: false`
2. Admin verifică conținutul în panoul de administrare
3. Admin aprobă → `approved: true`
4. Recenzia apare pe profilul psihologului

## Securitate și Limitări

### Securitate
⚠️ **IMPORTANT**: Această implementare este doar pentru DEMO/DEZVOLTARE:
- Parolele sunt stocate în plain text
- Nu există validare pe server
- Nu există protecție CSRF
- localStorage poate fi accesat/modificat ușor

### Pentru Producție, Este Necesar:
- Backend cu bază de date reală (PostgreSQL, MySQL, MongoDB)
- Autentificare cu JWT sau sesiuni securizate
- Hash-uire parole (bcrypt)
- Validare pe server
- HTTPS obligatoriu
- Rate limiting
- Backup regulat
- Conformitate GDPR

### Limitări localStorage
- Limită ~5-10MB per domeniu
- Date nu sunt criptate
- Nu există sincronizare între dispozitive
- Date pot fi șterse de utilizator

## Inițializare Date

La prima încărcare, aplicația verifică dacă există date în localStorage. Dacă nu există, se încarcă datele sample din `data.js`:
- 1 administrator
- 3 beneficiari
- 11 psihologi (cu date complete)
- Recenzii sample
- Subiecte forum sample
- 4 resurse educaționale

## Backup și Restore

Pentru backup:
```javascript
const backup = {
  users: localStorage.getItem('users'),
  therapists: localStorage.getItem('therapists'),
  appointments: localStorage.getItem('appointments'),
  reviews: localStorage.getItem('reviews'),
  forumTopics: localStorage.getItem('forumTopics'),
  forumReplies: localStorage.getItem('forumReplies')
};
console.log(JSON.stringify(backup));
```

Pentru restore:
```javascript
Object.keys(backup).forEach(key => {
  localStorage.setItem(key, backup[key]);
});
```

## Migrare către Backend

Pentru migrare către un backend real:

1. **Creează tabele în baza de date**
2. **Exportă datele din localStorage**
3. **Creează API endpoints**:
   - POST /api/auth/login
   - POST /api/auth/register
   - GET /api/therapists
   - POST /api/appointments
   - etc.
4. **Actualizează funcțiile din data.js** să folosească fetch() în loc de localStorage
5. **Implementează autentificare JWT**
6. **Adaugă middleware de autorizare**

Structura actuală facilitează această migrare deoarece toată logica de date este centralizată în modulul `TherapyData`.

