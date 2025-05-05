# Platformă Terapie Pro Bono - Ghid de Utilizare

Această platformă a fost creată pentru a conecta tinerii din medii vulnerabile cu terapeuți care oferă servicii pro bono. Platforma este construită folosind HTML, CSS și JavaScript, fără a necesita un server backend, utilizând localStorage pentru persistența datelor.

## Cum să rulezi aplicația

1. Descarcă toate fișierele aplicației
2. Deschide fișierul `index.html` în browserul tău preferat

## Funcționalități implementate

### Pentru tineri (clienți)
- Înregistrare și autentificare
- Vizualizarea listei de terapeuți disponibili
- Filtrarea terapeuților după diverse criterii (oraș, gen, specializare, tip de sesiune)
- Vizualizarea detaliilor unui terapeut
- Programarea unei ședințe de terapie
- Adăugarea recenziilor pentru terapeuți
- Participarea la discuții pe forum
- Accesarea resurselor informative despre terapie

### Pentru terapeuți
- Înregistrare și autentificare ca terapeut
- Completarea și editarea profilului profesional
- Vizualizarea programărilor confirmate
- Participarea la discuții pe forum (cu etichetă de terapeut)

## Structura aplicației

### Fișiere HTML
- `index.html` - Pagina principală a aplicației care conține toate template-urile pentru paginile dinamice

### Fișiere CSS
- `css/styles.css` - Stiluri principale
- `css/responsive.css` - Stiluri pentru responsive design

### Fișiere JavaScript
- `js/data.js` - Gestionarea datelor și persistența acestora folosind localStorage
- `js/auth.js` - Funcționalități de autentificare și gestionare a sesiunilor
- `js/app.js` - Logica principală a aplicației și manipularea interfeței utilizator

### Directorul img
- Conține imagini placeholder pentru profilurile terapeuților și alte elemente vizuale

## Note tehnice

### Persistența datelor
Aplicația utilizează localStorage pentru a stoca:
- Conturi de utilizatori (tineri și terapeuți)
- Programări
- Recenzii
- Subiecte și răspunsuri de pe forum
- Conținut pentru resurse educaționale

### Limitări
- Datele sunt stocate local în browser, deci nu sunt partajate între dispozitive
- Nu există autentificare reală sau securizare a datelor
- Funcționalități precum notificări prin email sau SMS nu sunt disponibile
- Calendarul de disponibilitate este simplificat

## Date demo

Aplicația vine pre-populată cu:
- 3 conturi de terapeuți
- 2 conturi de tineri
- Câteva recenzii
- 2 subiecte de forum cu răspunsuri
- 4 articole de resurse informative

### Conturi demo

#### Terapeuți
- Email: ana.popescu@example.com / Parolă: password
- Email: mihai.ionescu@example.com / Parolă: password
- Email: elena.dumitrescu@example.com / Parolă: password

#### Tineri
- Email: alex@example.com / Parolă: password
- Email: maria@example.com / Parolă: password

## Dezvoltare viitoare

Pentru o implementare completă în producție, ar trebui considerate:
- Backend server cu bază de date pentru persistența reală a datelor
- Autentificare securizată
- Sistem de notificări (email, SMS)
- Interfață de moderare pentru recenzii
- Calendar avansat de disponibilitate
- Sistem de anulare/reprogramare a ședințelor
- Integrare cu servicii de videoconferință pentru ședințe online
- Aplicație mobilă pentru acces facil

## Suport

Această aplicație este un prototip pentru a demonstra funcționalitățile necesare. Pentru suport sau întrebări, contactați echipa de dezvoltare. 