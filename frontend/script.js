const API_URL = "http://localhost:5000/api";

// 📌 REGISTRAZIONE (Fixato)
document.getElementById("register-form")?.addEventListener("submit", async function (event) {
    event.preventDefault();
    
    const name = document.getElementById("name").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    const role = document.getElementById("role").value;

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password, role })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Errore nella registrazione");

        alert("Registrazione completata! Ora puoi accedere.");
        window.location.href = "index.html";
    } catch (error) {
        alert(error.message);
    }
});

// 📌 LOGIN (Fixato)
document.getElementById("login-form")?.addEventListener("submit", async function (event) {
    event.preventDefault();
    
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Errore nel login");

        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("user_id", data.user_id);

        if (data.role === "organizzatore") {
            window.location.href = "dashboard_organizzatore.html";
        } else {
            window.location.href = "dashboard_utente.html";
        }
    } catch (error) {
        alert(error.message);
    }
});

// 📌 Prenotazione Evento
document.getElementById("booking-form")?.addEventListener("submit", async function (event) {
    event.preventDefault();
    
    const seats = document.getElementById("seats-booked").value;
    const event_id = new URLSearchParams(window.location.search).get("id");
    const user_id = localStorage.getItem("user_id"); 
    const token = localStorage.getItem("token"); 

    if (!user_id || !token) {
        alert("Devi essere loggato per prenotare un evento.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/bookings/book`, { 
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify({ user_id, event_id, seats_booked: seats })
        });

        const data = await response.json();
        if (response.ok) {
            alert("Prenotazione effettuata!");
        } else {
            alert("Errore: " + data.error);
        }
    } catch (error) {
        alert("Errore di connessione al server.");
        console.error(error);
    }
});



// 📌 LOGOUT (Fixato)
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user_id");
    window.location.href = "index.html";
}

// 📌 CARICARE EVENTI (Fixato)
async function loadEvents() {
    try {
        const response = await fetch(`${API_URL}/events`);
        if (!response.ok) throw new Error("Errore nel recupero degli eventi");

        const events = await response.json();
        const container = document.getElementById("events-container");
        container.innerHTML = "";

        events.forEach(event => {
            const div = document.createElement("div");
            div.classList.add("card", "m-2", "p-3");
            div.innerHTML = `
                <h3>${event.title}</h3>
                <p>${event.description}</p>
                <p>Data: ${new Date(event.date).toLocaleString()}</p>
                <p>Posti disponibili: ${event.available_seats}</p>
                <button class="btn btn-primary" onclick="window.location.href='event.html?id=${event.id}'">Prenota</button>
            `;
            container.appendChild(div);
        });
    } catch (error) {
        console.error("Errore nel caricamento degli eventi:", error);
    }
}


// 📌 FUNZIONE PER CARICARE I DETTAGLI DI UN EVENTO (Fixato)
async function loadEventDetails() {
    const event_id = new URLSearchParams(window.location.search).get("id");

    if (!event_id) {
        alert("Evento non trovato!");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/events`);
        if (!response.ok) throw new Error("Errore nel recupero degli eventi");

        const events = await response.json();
        const event = events.find(e => e.id == event_id);

        if (!event) {
            alert("Evento non trovato!");
            return;
        }

        document.getElementById("event-title").textContent = event.title;
        document.getElementById("event-description").textContent = event.description;
        document.getElementById("event-date").textContent = new Date(event.date).toLocaleString();
        document.getElementById("event-seats").textContent = event.available_seats;

    } catch (error) {
        console.error("Errore nel caricamento dei dettagli evento:", error);
        alert("Impossibile caricare i dettagli dell'evento.");
    }
}

// 📌 INIZIALIZZA LA PAGINA DETTAGLIO EVENTO
if (window.location.pathname.includes("event.html")) {
    document.addEventListener("DOMContentLoaded", loadEventDetails);
}


// 📌 CREAZIONE EVENTO (Fixato)
document.getElementById("create-event-form")?.addEventListener("submit", async function (event) {
    event.preventDefault();
    
    const title = document.getElementById("event-title").value;
    const description = document.getElementById("event-description").value;
    const date = document.getElementById("event-date").value;
    const seats = document.getElementById("event-seats").value;
    const image = document.getElementById("event-image").value;
    const organizer_id = localStorage.getItem("user_id");

    try {
        const response = await fetch(`${API_URL}/events/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ organizer_id, title, description, date, seats, image })
        });

        if (!response.ok) throw new Error("Errore nella creazione evento");

        alert("Evento creato con successo!");
        loadEvents();
    } catch (error) {
        alert(error.message);
    }
});

// 📌 INIZIALIZZAZIONE DASHBOARD
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("dashboard_utente.html") || window.location.pathname.includes("dashboard_organizzatore.html")) {
        loadEvents();
    }
});
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
        if (window.location.pathname.includes("index.html")) {
            if (role === "organizzatore") {
                window.location.href = "dashboard_organizzatore.html";
            } else {
                window.location.href = "dashboard_utente.html";
            }
        }
    }
});


