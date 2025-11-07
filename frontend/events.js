// events.js - Fetch and display all events from Azure Blob
document.addEventListener("DOMContentLoaded", loadEvents);

async function loadEvents() {
  const blobUrl = "https://stclubportalss.blob.core.windows.net/clubdata/events.json";
  const container = document.getElementById("eventsContainer");

  try {
    const response = await fetch(`${blobUrl}?t=${Date.now()}`);
    if (!response.ok) throw new Error("Failed to load event data.");
    const data = await response.json();

    const events = data.clubs || [];
    container.innerHTML = "";

    if (events.length === 0) {
      container.innerHTML = "<p>No events available currently.</p>";
      return;
    }

    events.forEach(ev => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
        <h3>${ev.name}</h3>
        <p>${ev.about}</p>
        <p><strong>Date:</strong> ${ev.next_event}</p>
        <button onclick="registerEvent('${ev.name}')">Register</button>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    container.innerHTML = `<p style="color:red;text-align:center;">Error loading events: ${err.message}</p>`;
  }
}

function registerEvent(eventName) {
  alert(`✅ Registered for "${eventName}" successfully!`);
  // (Later we can connect this to Azure Function to store registration)
}
