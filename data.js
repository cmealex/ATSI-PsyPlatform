/**
 * Data management for the therapy platform
 * This file provides functions for loading, saving, and manipulating data
 * using localStorage for client-side persistence
 */

// Namespace for data operations
const TherapyData = {
    // Initialize storage
    init: function() {
        if (!localStorage.getItem('therapists')) {
            localStorage.setItem('therapists', JSON.stringify(this.sampleTherapists));
        }
        
        if (!localStorage.getItem('users')) {
            localStorage.setItem('users', JSON.stringify(this.sampleUsers));
        }
        
        if (!localStorage.getItem('appointments')) {
            localStorage.setItem('appointments', JSON.stringify([]));
        }
        
        if (!localStorage.getItem('reviews')) {
            localStorage.setItem('reviews', JSON.stringify(this.sampleReviews));
        }
        
        if (!localStorage.getItem('forumTopics')) {
            localStorage.setItem('forumTopics', JSON.stringify(this.sampleForumTopics));
        }
        
        if (!localStorage.getItem('forumReplies')) {
            localStorage.setItem('forumReplies', JSON.stringify(this.sampleForumReplies));
        }
        
        if (!localStorage.getItem('resources')) {
            localStorage.setItem('resources', JSON.stringify(this.resourceContents));
        }
    },
    
    // Therapist operations
    getTherapists: function() {
        return JSON.parse(localStorage.getItem('therapists') || '[]');
    },
    
    getTherapistById: function(id) {
        const therapists = this.getTherapists();
        return therapists.find(therapist => therapist.id === id) || null;
    },
    
    saveTherapist: function(therapist) {
        const therapists = this.getTherapists();
        const index = therapists.findIndex(t => t.id === therapist.id);
        
        if (index !== -1) {
            therapists[index] = therapist;
        } else {
            therapist.id = Date.now().toString();
            therapists.push(therapist);
        }
        
        localStorage.setItem('therapists', JSON.stringify(therapists));
        return therapist;
    },
    
    // User operations
    getUsers: function() {
        return JSON.parse(localStorage.getItem('users') || '[]');
    },
    
    getUserByEmail: function(email) {
        const users = this.getUsers();
        return users.find(user => user.email === email) || null;
    },
    
    getUserById: function(id) {
        const users = this.getUsers();
        return users.find(user => user.id === id) || null;
    },
    
    saveUser: function(user) {
        const users = this.getUsers();
        const index = users.findIndex(u => u.id === user.id);
        
        if (index !== -1) {
            users[index] = user;
        } else {
            user.id = Date.now().toString();
            users.push(user);
        }
        
        localStorage.setItem('users', JSON.stringify(users));
        return user;
    },
    
    // Appointment operations
    getAppointments: function() {
        return JSON.parse(localStorage.getItem('appointments') || '[]');
    },
    
    getAppointmentsByUserId: function(userId) {
        const appointments = this.getAppointments();
        return appointments.filter(appointment => appointment.userId === userId);
    },
    
    getAppointmentsByTherapistId: function(therapistId) {
        const appointments = this.getAppointments();
        return appointments.filter(appointment => appointment.therapistId === therapistId);
    },
    
    saveAppointment: function(appointment) {
        const appointments = this.getAppointments();
        const index = appointments.findIndex(a => a.id === appointment.id);
        
        if (index !== -1) {
            appointments[index] = appointment;
        } else {
            appointment.id = Date.now().toString();
            appointments.push(appointment);
        }
        
        localStorage.setItem('appointments', JSON.stringify(appointments));
        return appointment;
    },
    
    // Review operations
    getReviews: function() {
        return JSON.parse(localStorage.getItem('reviews') || '[]');
    },
    
    getReviewsByTherapistId: function(therapistId) {
        const reviews = this.getReviews();
        return reviews.filter(review => review.therapistId === therapistId);
    },
    
    saveReview: function(review) {
        const reviews = this.getReviews();
        const index = reviews.findIndex(r => r.id === review.id);
        
        if (index !== -1) {
            reviews[index] = review;
        } else {
            review.id = Date.now().toString();
            review.approved = false; // New reviews need moderation
            reviews.push(review);
        }
        
        localStorage.setItem('reviews', JSON.stringify(reviews));
        return review;
    },
    
    // Forum operations
    getForumTopics: function() {
        return JSON.parse(localStorage.getItem('forumTopics') || '[]');
    },
    
    getForumTopicById: function(id) {
        const topics = this.getForumTopics();
        return topics.find(topic => topic.id === id) || null;
    },
    
    saveForumTopic: function(topic) {
        const topics = this.getForumTopics();
        const index = topics.findIndex(t => t.id === topic.id);
        
        if (index !== -1) {
            topics[index] = topic;
        } else {
            topic.id = Date.now().toString();
            topic.date = new Date().toISOString();
            topics.push(topic);
        }
        
        localStorage.setItem('forumTopics', JSON.stringify(topics));
        return topic;
    },
    
    getForumReplies: function() {
        return JSON.parse(localStorage.getItem('forumReplies') || '[]');
    },
    
    getForumRepliesByTopicId: function(topicId) {
        const replies = this.getForumReplies();
        return replies.filter(reply => reply.topicId === topicId);
    },
    
    saveForumReply: function(reply) {
        const replies = this.getForumReplies();
        const index = replies.findIndex(r => r.id === reply.id);
        
        if (index !== -1) {
            replies[index] = reply;
        } else {
            reply.id = Date.now().toString();
            reply.date = new Date().toISOString();
            replies.push(reply);
        }
        
        localStorage.setItem('forumReplies', JSON.stringify(replies));
        return reply;
    },
    
    // Resource operations
    getResourceById: function(id) {
        const resources = JSON.parse(localStorage.getItem('resources') || '{}');
        return resources[id] || null;
    },
    
    // Sample data for initial setup
    sampleTherapists: [
        {
            id: '1',
            name: 'Ana Popescu',
            email: 'ana.popescu@example.com',
            password: 'password',
            description: 'Sunt un terapeut cu experiență de peste 10 ani în lucrul cu tinerii din medii vulnerabile. Abordarea mea este centrată pe soluții și este adaptată fiecărui client în parte.',
            why: 'Cred cu tărie că fiecare tânăr merită sprijin pentru a depăși traumele și a-și construi un viitor mai bun. Terapia cu mine oferă un spațiu sigur și de susținere pentru explorarea și vindecarea experiențelor dificile.',
            specializations: ['anxietate', 'depresie', 'traume din copilărie', 'relații'],
            city: 'București',
            online: true,
            office: true,
            gender: 'female',
            userType: 'therapist',
            availability: {
                monday: ['10:00', '11:00', '14:00', '15:00', '16:00'],
                tuesday: ['10:00', '11:00', '14:00', '15:00', '16:00'],
                wednesday: ['10:00', '11:00', '14:00', '15:00', '16:00'],
                thursday: ['10:00', '11:00', '14:00', '15:00', '16:00'],
                friday: ['10:00', '11:00', '14:00', '15:00']
            }
        },
        {
            id: '2',
            name: 'Mihai Ionescu',
            email: 'mihai.ionescu@example.com',
            password: 'password',
            description: 'Sunt specializat în terapie cognitiv-comportamentală pentru adolescenți și tineri adulți. Am o experiență vastă în lucrul cu tineri din sistemul de protecție.',
            why: 'Abordarea mea terapeutică este prietenoasă și directă. Cred în puterea tinerilor de a-și depăși dificultățile cu sprijin adecvat și îndrumare empatică.',
            specializations: ['anxietate', 'fobii', 'stimă de sine', 'adicții'],
            city: 'Cluj-Napoca',
            online: true,
            office: false,
            gender: 'male',
            userType: 'therapist',
            availability: {
                monday: ['11:00', '12:00', '16:00', '17:00', '18:00'],
                wednesday: ['11:00', '12:00', '16:00', '17:00', '18:00'],
                friday: ['11:00', '12:00', '16:00', '17:00']
            }
        },
        {
            id: '3',
            name: 'Elena Dumitrescu',
            email: 'elena.dumitrescu@example.com',
            password: 'password',
            description: 'Sunt psihoterapeut integrativ cu o experiență de 5 ani în lucrul cu copii și tineri. Abordarea mea combinată îmbină tehnici eficiente din diferite școli terapeutice.',
            why: 'Ofer un spațiu sigur și de acceptare unde poți explora liber gândurile și emoțiile. Împreună, putem găsi resursele tale interioare pentru a face față provocărilor și a construi o viață mai împlinită.',
            specializations: ['depresie', 'anxietate', 'traume', 'relații familiale'],
            city: 'Iași',
            online: true,
            office: true,
            gender: 'female',
            userType: 'therapist',
            availability: {
                monday: ['09:00', '10:00', '15:00', '16:00', '17:00'],
                tuesday: ['09:00', '10:00', '15:00', '16:00', '17:00'],
                thursday: ['09:00', '10:00', '15:00', '16:00', '17:00']
            }
        }
    ],
    
    sampleUsers: [
        {
            id: '101',
            name: 'Alex Munteanu',
            email: 'alex@example.com',
            password: 'password',
            userType: 'youth'
        },
        {
            id: '102',
            name: 'Maria Popa',
            email: 'maria@example.com',
            password: 'password',
            userType: 'youth'
        }
    ],
    
    sampleReviews: [
        {
            id: '201',
            therapistId: '1',
            userId: '101',
            userName: 'Alex M.',
            rating: 5,
            text: 'Doamna Ana m-a ajutat enorm să îmi înțeleg anxietatea și să dezvolt strategii pentru a o gestiona. Sesiunile sunt relaxate și productive.',
            date: '2023-06-15',
            approved: true
        },
        {
            id: '202',
            therapistId: '1',
            userId: '102',
            userName: 'Maria P.',
            rating: 4,
            text: 'Terapia cu doamna Popescu mi-a oferit instrumentele necesare pentru a face față situațiilor dificile. Apreciez răbdarea și înțelegerea ei.',
            date: '2023-07-22',
            approved: true
        },
        {
            id: '203',
            therapistId: '2',
            userId: '101',
            userName: 'Alex M.',
            rating: 5,
            text: 'Domnul Mihai are o abordare foarte clară și practică. M-a ajutat să-mi înfrunt fobiile și să-mi recapăt încrederea în mine.',
            date: '2023-05-10',
            approved: true
        }
    ],
    
    sampleForumTopics: [
        {
            id: '301',
            userId: '101',
            userName: 'Alex M.',
            title: 'Cum să gestionez anxietatea înainte de un interviu',
            content: 'În curând voi avea un interviu important și simt că anxietatea mă copleșește. Aveți sfaturi pentru a gestiona aceste emoții?',
            date: '2023-08-05'
        },
        {
            id: '302',
            userId: '102',
            userName: 'Maria P.',
            title: 'Experiențe cu terapia online',
            content: 'Sunt curioasă cum a fost experiența voastră cu terapia online. Ați simțit că este la fel de eficientă ca sesiunile față în față?',
            date: '2023-07-15'
        }
    ],
    
    sampleForumReplies: [
        {
            id: '401',
            topicId: '301',
            userId: '102',
            userName: 'Maria P.',
            content: 'Am trecut prin asta și ce m-a ajutat a fost să practic tehnici de respirație și mindfulness înainte de interviu. De asemenea, pregătirea și simularea interviului cu un prieten m-au ajutat să mă simt mai încrezătoare.',
            date: '2023-08-06'
        },
        {
            id: '402',
            topicId: '301',
            userId: '1',
            userName: 'Ana Popescu (Terapeut)',
            content: 'Anxietatea înainte de evenimente importante este normală. Câteva strategii care pot ajuta: tehnici de respirație profundă, vizualizare pozitivă a rezultatului, pregătire adecvată și asigurarea unei odihne suficiente înainte de eveniment. Nu uita că puțină anxietate poate fi constructivă, te menține alert și concentrat!',
            date: '2023-08-07'
        },
        {
            id: '403',
            topicId: '302',
            userId: '101',
            userName: 'Alex M.',
            content: 'Am avut câteva sesiuni online și a fost surprinzător de bine. La început mi se părea puțin ciudat, dar m-am obișnuit repede. Avantajul major a fost că nu a trebuit să mă deplasez, ceea ce mi-a economisit mult timp.',
            date: '2023-07-16'
        }
    ],
    
    resourceContents: {
        'therapy-info': {
            title: 'Ce este terapia?',
            content: `
                <p>Terapia, cunoscută și sub denumirea de psihoterapie sau consiliere, este un proces colaborativ între un terapeut și o persoană care caută sprijin pentru a aborda anumite probleme sau pentru a-și îmbunătăți starea de bine mentală și emoțională.</p>
                
                <h3>Cum funcționează terapia?</h3>
                <p>În cadrul terapiei, terapeutul creează un spațiu sigur și confidențial unde poți explora gândurile, emoțiile și comportamentele care te preocupă. Procesul implică de obicei:</p>
                <ul>
                    <li>Discuții deschise despre experiențele și provocările tale</li>
                    <li>Explorarea tiparelor de gândire și comportament</li>
                    <li>Dezvoltarea de strategii pentru a face față provocărilor</li>
                    <li>Stabilirea obiectivelor pentru schimbare și creștere personală</li>
                </ul>
                
                <h3>Tipuri de terapie</h3>
                <p>Există numeroase abordări terapeutice, fiecare cu principii și metode specifice:</p>
                <ul>
                    <li><strong>Terapia cognitiv-comportamentală (TCC)</strong> - se concentrează pe identificarea și schimbarea tiparelor de gândire negative și a comportamentelor problematice</li>
                    <li><strong>Terapia psihodinamică</strong> - explorează influențele inconștiente și experiențele din trecut asupra comportamentului actual</li>
                    <li><strong>Terapia umanistă</strong> - se concentrează pe potențialul de creștere personală și auto-actualizare</li>
                    <li><strong>Terapia sistemică</strong> - analizează relațiile și sistemele în care funcționează individul</li>
                </ul>
                
                <h3>Beneficiile terapiei</h3>
                <p>Terapia poate oferi numeroase beneficii, inclusiv:</p>
                <ul>
                    <li>Îmbunătățirea stării de bine emoționale și mentale</li>
                    <li>Dezvoltarea abilităților de a face față stresului și provocărilor</li>
                    <li>Îmbunătățirea relațiilor interpersonale</li>
                    <li>Creșterea stimei de sine și a încrederii în sine</li>
                    <li>Reducerea simptomelor de anxietate, depresie sau alte probleme de sănătate mentală</li>
                    <li>Descoperirea și dezvoltarea resurselor personale</li>
                </ul>
                
                <p>Este important de reținut că terapia este un proces individual, iar experiența și rezultatele pot varia de la persoană la persoană. Găsirea unui terapeut potrivit pentru nevoile tale este un pas important în acest proces.</p>
            `
        },
        'first-session': {
            title: 'Cum să te pregătești pentru prima ședință de terapie',
            content: `
                <p>Prima ședință de terapie poate fi o experiență plină de emoții - de la entuziasm la nervozitate. Iată câteva sfaturi pentru a te pregăti și a te simți mai confortabil.</p>
                
                <h3>Înainte de prima ședință</h3>
                <ul>
                    <li><strong>Reflectează asupra motivelor tale</strong> - Gândește-te la motivele pentru care cauți terapie și la ce speri să obții din acest proces</li>
                    <li><strong>Notează-ți întrebările</strong> - Pregătește orice întrebări ai despre procesul terapeutic, abordarea terapeutului sau confidențialitate</li>
                    <li><strong>Gândește-te la istoricul tău</strong> - Reflectează asupra experiențelor relevante din trecut, dar nu te stresa să îți amintești totul</li>
                    <li><strong>Verifică aspectele practice</strong> - Confirmă ora, locația sau detaliile de conectare pentru sesiunile online</li>
                </ul>
                
                <h3>În timpul primei ședințe</h3>
                <p>Prima sesiune este de obicei dedicată cunoașterii reciproce. Terapeutul va dori să afle despre tine, iar tu vei avea ocazia să vezi dacă te simți confortabil cu ei. În mod tipic:</p>
                <ul>
                    <li>Terapeutul îți va explica politica de confidențialitate și aspectele administrative</li>
                    <li>Vei discuta despre motivele căutării terapiei și istoricul tău relevant</li>
                    <li>Terapeutul poate pune întrebări despre familia ta, relații, sănătate și alte aspecte ale vieții tale</li>
                    <li>Puteți discuta despre obiectivele terapiei și frecvența sesiunilor</li>
                </ul>
                
                <h3>Ce să aduci</h3>
                <ul>
                    <li>O minte deschisă și disponibilitatea de a fi sincer</li>
                    <li>Orice notițe sau întrebări pe care le-ai pregătit</li>
                    <li>Pentru sesiunile online: asigură-te că ai o conexiune bună la internet și un spațiu privat</li>
                </ul>
                
                <h3>Sfaturi pentru a te simți confortabil</h3>
                <ul>
                    <li><strong>Fii sincer</strong> - Onestitatea este esențială pentru un proces terapeutic eficient</li>
                    <li><strong>Nu te grăbi</strong> - Nu trebuie să împărtășești totul în prima sesiune</li>
                    <li><strong>Exprimă-ți nesiguranțele</strong> - Dacă te simți nervos sau nesigur, poți împărtăși aceste sentimente cu terapeutul tău</li>
                    <li><strong>Evaluează relația</strong> - Observă cum te simți cu terapeutul; o relație terapeutică bună este esențială pentru succes</li>
                </ul>
                
                <p>Amintește-ți că terapia este o călătorie, iar prima sesiune este doar începutul. Dă-ți timp să te acomodezi cu procesul și să construiești o relație de încredere cu terapeutul tău.</p>
            `
        },
        'childhood-trauma': {
            title: 'Gestionarea traumelor din copilărie',
            content: `
                <p>Traumele din copilărie pot avea un impact semnificativ asupra vieții adulte, influențând relațiile, stima de sine și sănătatea mentală generală. Înțelegerea și abordarea acestor traume este un pas important spre vindecare.</p>
                
                <h3>Ce sunt traumele din copilărie?</h3>
                <p>Traumele din copilărie pot include:</p>
                <ul>
                    <li>Abuz fizic, emoțional sau sexual</li>
                    <li>Neglijare</li>
                    <li>Pierderea unui părinte sau a unei persoane dragi</li>
                    <li>Expunerea la violență domestică</li>
                    <li>Separarea de îngrijitorii primari</li>
                    <li>Instabilitate familială severă</li>
                    <li>Trăitul în medii nesigure sau impredictibile</li>
                </ul>
                
                <h3>Cum pot afecta traumele din copilărie viața adultă?</h3>
                <p>Efectele pot include:</p>
                <ul>
                    <li>Dificultăți în relațiile interpersonale</li>
                    <li>Probleme de atașament și încredere</li>
                    <li>Anxietate și depresie</li>
                    <li>Stimă de sine scăzută</li>
                    <li>Comportamente de auto-sabotare</li>
                    <li>Dificultăți în gestionarea emoțiilor</li>
                    <li>Tulburări de stres post-traumatic (PTSD)</li>
                </ul>
                
                <h3>Cum poate ajuta terapia?</h3>
                <p>Terapia oferă un cadru sigur pentru explorarea și procesarea traumelor din copilărie. Abordări terapeutice eficiente includ:</p>
                <ul>
                    <li><strong>Terapia de procesare cognitivă</strong> - ajută la schimbarea tiparelor de gândire negative legate de traumă</li>
                    <li><strong>EMDR (Eye Movement Desensitization and Reprocessing)</strong> - o tehnică specializată pentru procesarea amintirilor traumatice</li>
                    <li><strong>Terapia narativă</strong> - ajută la reconstruirea narațiunii personale într-un mod care promovează vindecarea</li>
                    <li><strong>Terapia focalizată pe traumă</strong> - abordări specifice pentru tratarea efectelor traumei</li>
                </ul>
                
                <h3>Strategii pentru vindecarea traumelor din copilărie</h3>
                <p>Pe lângă terapie, aceste practici pot sprijini procesul de vindecare:</p>
                <ul>
                    <li><strong>Auto-compasiune</strong> - dezvoltarea unei atitudini blânde și înțelegătoare față de sine</li>
                    <li><strong>Mindfulness</strong> - practici de conștientizare care ajută la ancorarea în prezent</li>
                    <li><strong>Educație despre traumă</strong> - înțelegerea modului în care trauma afectează creierul și corpul</li>
                    <li><strong>Stabilirea limitelor sănătoase</strong> - învățarea identificării și comunicării limitelor personale</li>
                    <li><strong>Conectarea cu rețele de sprijin</strong> - construirea relațiilor sănătoase și a sistemelor de suport</li>
                    <li><strong>Îngrijirea corpului</strong> - atenție la nutriție, somn și activitate fizică</li>
                </ul>
                
                <h3>Mesaj important</h3>
                <p>Vindecarea de traumele din copilărie este posibilă. Deși procesul poate fi dificil, cu sprijin adecvat și resurse potrivite, poți construi o viață împlinită dincolo de experiențele traumatice. Caută ajutor profesionist dacă simți că trauma din copilărie îți afectează viața - este un semn de putere, nu de slăbiciune.</p>
            `
        },
        'relaxation': {
            title: 'Tehnici de relaxare',
            content: `
                <p>Tehnicile de relaxare sunt instrumente valoroase pentru gestionarea stresului, anxietății și îmbunătățirea bunăstării generale. Aceste exerciții simple pot fi practicate acasă, la școală sau chiar la locul de muncă.</p>
                
                <h3>Respirația profundă</h3>
                <p><strong>Exercițiul 4-7-8:</strong></p>
                <ol>
                    <li>Stai confortabil, cu spatele drept</li>
                    <li>Expiră complet prin gură</li>
                    <li>Închide gura și inspiră liniștit prin nas numărând până la 4</li>
                    <li>Ține respirația numărând până la 7</li>
                    <li>Expiră complet prin gură, făcând un sunet de șuierat, numărând până la 8</li>
                    <li>Repetă ciclul de 4 ori</li>
                </ol>
                
                <h3>Relaxarea musculară progresivă</h3>
                <p>Această tehnică implică încordarea și apoi relaxarea diferitelor grupe musculare:</p>
                <ol>
                    <li>Stai confortabil, într-un loc liniștit</li>
                    <li>Începe cu picioarele: încordează mușchii picioarelor pentru 5 secunde, apoi relaxează-i</li>
                    <li>Continuă în sus prin corp: picioare, abdomen, piept, mâini, umeri, gât și față</li>
                    <li>Concentrează-te pe contrastul dintre tensiune și relaxare</li>
                    <li>La final, simte cum întregul corp este relaxat</li>
                </ol>
                
                <h3>Meditație de scanare corporală</h3>
                <ol>
                    <li>Stai întins sau așezat confortabil</li>
                    <li>Închide ochii și concentrează-te pe respirație</li>
                    <li>Îndreaptă-ți atenția spre degetele de la picioare, observând orice senzație</li>
                    <li>Treptat, mută-ți atenția în sus prin corp, scanând fiecare parte</li>
                    <li>Observă senzațiile fără a le judeca</li>
                    <li>Dacă mintea rătăcește, adu-o blând înapoi la scanarea corpului</li>
                    <li>Termină prin a fi conștient de corpul tău ca întreg</li>
                </ol>
                
                <h3>Vizualizare ghidată</h3>
                <p>Folosește-ți imaginația pentru a crea o experiență calmantă:</p>
                <ol>
                    <li>Stai confortabil într-un loc liniștit</li>
                    <li>Închide ochii și respiră adânc de câteva ori</li>
                    <li>Imaginează-ți un loc liniștit și sigur (o plajă, o pădure, un munte)</li>
                    <li>Folosește toate simțurile: ce vezi, auzi, miroși, simți și poate chiar guști</li>
                    <li>Explorează acest loc în imaginația ta pentru 5-10 minute</li>
                    <li>Când ești gata, revino încet la prezent</li>
                </ol>
                
                <h3>Mindfulness în activitățile zilnice</h3>
                <p>Practică atenția deplină în activitățile obișnuite:</p>
                <ul>
                    <li><strong>Mâncatul conștient</strong> - observă culoarea, textura, mirosul și gustul fiecărei înghițituri</li>
                    <li><strong>Plimbarea conștientă</strong> - simte cum picioarele ating pământul, observă împrejurimile</li>
                    <li><strong>Ascultarea conștientă</strong> - acordă atenție deplină când cineva vorbește</li>
                </ul>
                
                <h3>Sfaturi pentru practicarea tehnicilor de relaxare</h3>
                <ul>
                    <li>Începe cu sesiuni scurte (3-5 minute) și crește gradual durata</li>
                    <li>Practică regulat pentru rezultate optime</li>
                    <li>Experimentează cu diferite tehnici pentru a le găsi pe cele care funcționează cel mai bine pentru tine</li>
                    <li>Nu te descuraja dacă mintea rătăcește - este normal; adu-ți atenția înapoi la exercițiu</li>
                    <li>Folosește aplicații sau înregistrări audio pentru ghidare, dacă ajută</li>
                </ul>
                
                <p>Aceste tehnici de relaxare pot deveni instrumente valoroase în rutina ta zilnică, ajutându-te să gestionezi stresul și să-ți îmbunătățești starea de bine generală.</p>
            `
        }
    }
}; 