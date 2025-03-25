Il progetto intende creare una web application che consente all'utente finale di prenotare eventi ed agli organizzatori di amministrarli e crearli. Scritto in Node.js + Express per il backend, utilizza MySQL come database e per il frontend si avvale di HTML/JavaScript con Bootstrap.

## Struttura del progetto

- **Frontend** - HTML + JavaScript
    - index.html - Pagina principale [Login/Registrazione]
    - dashboard_utente.html - Dashboard per gli utenti [Prenotazione eventi]
    - dashboard_organizzatore.html -Dashboard per gli organizzatori [Gestione eventi]
    - event.html - Pagina dettaglio evento per prenotazione
    - script. js - script per gestire login, registrazione e prenotazioni
- **Backend** - Node.js + Express
    - server.js - Avvio del server Express
    - db.js - Configurazione della connessione MySQL
    - .env - Variabili d’ambiente(JWT_SECRET/Credenziali DB)
    - /routes
        - auth.js - API di autenticazione
        - events.js - API per la gestione degli eventi
        - bookings.js - API per prenotare eventi e gestire le prenotazioni
- **Database**
- -- Tabella Utenti (users)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('utente', 'organizzatore') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Tabella Eventi (events)
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    organizer_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    date DATETIME NOT NULL,
    seats INT NOT NULL,
    available_seats INT NOT NULL,
    image VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE
);
-- Tabella Prenotazioni (bookings)
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    seats_booked INT NOT NULL,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);
-- Tabella Notifiche (notifications)
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    message TEXT NOT NULL,
    seen BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
