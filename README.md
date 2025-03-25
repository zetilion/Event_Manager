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

