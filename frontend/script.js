const API_URL = "http://localhost:5000/api";

// 📌 Controllo utente loggato e reindirizzamento alla dashboard corretta
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

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Errore nel login");
        }

        const data = await response.json();
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

// 📌 LOGOUT (Fixato)
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user_id");
    window.location.href = "index.html";
}

// 📌 CARICARE EVENTI (Fixato per Utente e Organizzatore)
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
                <p>Data: ${event.date}</p>
                <p>Posti disponibili: ${event.available_seats}</p>
                <button class="btn btn-primary" onclick="window.location.href='event.html?id=${event.id}'">Prenota</button>
            `;
            container.appendChild(div);
        });
    } catch (error) {
        console.error("Errore nel caricamento degli eventi:", error);
    }
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
