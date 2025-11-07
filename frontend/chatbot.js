// chatbot.js — CLUBz Assistant connected to Azure Blob
document.addEventListener("DOMContentLoaded", () => {

  // === Azure Blob JSON URL ===
  const blobURL = "https://stclubportalss.blob.core.windows.net/clubdata/events.json";
  let clubData = [];

  // === Fetch club/event data from Azure Blob Storage ===
  async function loadData() {
    try {
      const res = await fetch(blobURL);
      const data = await res.json();
      clubData = data.clubs;
      console.log("✅ Loaded club data from Azure Blob:", clubData);
    } catch (err) {
      console.error("❌ Failed to load data from Azure Blob", err);
    }
  }

  loadData();

  // === Chat UI Elements ===
  const chatBubble = document.createElement("div");
  chatBubble.id = "chat-bubble";
  chatBubble.innerHTML = "💬";
  document.body.appendChild(chatBubble);

  const chatWindow = document.createElement("div");
  chatWindow.id = "chat-window";
  chatWindow.innerHTML = `
    <div id="chat-header">CLUBz Assistant ✨</div>
    <div id="chat-body">
      <p class="bot">Hi there! 👋<br>Ask me about upcoming events or clubs.</p>
    </div>
    <div id="chat-input">
      <input type="text" id="chatText" placeholder="Type your question..."/>
      <button id="sendBtn">Send</button>
    </div>
  `;
  document.body.appendChild(chatWindow);

  // === Styles ===
  const style = document.createElement("style");
  style.innerHTML = `
    #chat-bubble {
      position: fixed;
      bottom: 25px;
      right: 25px;
      background: #F0AD4E;
      color: #fff;
      border-radius: 50%;
      width: 60px; height: 60px;
      display:flex;align-items:center;justify-content:center;
      font-size:28px;cursor:pointer;
      box-shadow:0 4px 12px rgba(0,0,0,0.2);
      z-index:1000;
      transition:0.3s;
    }
    #chat-bubble:hover {transform:scale(1.1);}
    #chat-window {
      position: fixed;
      bottom: 100px;
      right: 30px;
      width: 320px;
      height: 420px;
      background:#fff;
      border-radius:12px;
      box-shadow:0 8px 20px rgba(0,0,0,0.15);
      display:none;
      flex-direction:column;
      overflow:hidden;
      z-index:1000;
    }
    #chat-header {
      background:#292D3E;
      color:#fff;
      text-align:center;
      padding:10px;
      font-weight:600;
    }
    #chat-body {
      flex:1;
      padding:10px;
      overflow-y:auto;
      font-size:14px;
    }
    #chat-body p {margin:10px 0;}
    #chat-body .bot {
      background:#f1f1f1;
      padding:8px 12px;
      border-radius:10px;
      width:fit-content;
      max-width:80%;
    }
    #chat-body .user {
      background:#F0AD4E;
      color:#fff;
      padding:8px 12px;
      border-radius:10px;
      margin-left:auto;
      width:fit-content;
      max-width:80%;
    }
    #chat-input {
      display:flex;
      border-top:1px solid #eee;
    }
    #chatText {
      flex:1;
      border:none;
      padding:10px;
      outline:none;
    }
    #sendBtn {
      background:#F0AD4E;
      color:#fff;
      border:none;
      width:70px;
      cursor:pointer;
      font-weight:600;
    }
  `;
  document.head.appendChild(style);

  // === Open/Close Chat ===
  chatBubble.addEventListener("click", () => {
    chatWindow.style.display = chatWindow.style.display === "flex" ? "none" : "flex";
  });

  const chatBody = chatWindow.querySelector("#chat-body");
  const input = chatWindow.querySelector("#chatText");
  const sendBtn = chatWindow.querySelector("#sendBtn");

  // === Sending Message ===
  const sendMessage = () => {
    const text = input.value.trim();
    if (!text) return;
    chatBody.innerHTML += `<p class="user">${text}</p>`;
    input.value = "";
    setTimeout(() => reply(text.toLowerCase()), 600);
  };

  // === Chatbot Reply Logic (Dynamic from Blob) ===
  const reply = (msg) => {
    let response = "I didn’t get that 😅. Try asking about clubs or events.";

    if (clubData.length > 0) {
      const foundClub = clubData.find(c => msg.includes(c.name.toLowerCase().split(" ")[0]));
      if (foundClub) {
        response = `<strong>${foundClub.name}</strong><br>${foundClub.about}<br><em>Next Event:</em> ${foundClub.next_event}`;
      } else if (msg.includes("event") || msg.includes("upcoming")) {
        response = "Here are some upcoming events:<br><ul>";
        clubData.forEach(c => {
          response += `<li><strong>${c.name}:</strong> ${c.next_event}</li>`;
        });
        response += "</ul>";
      } else if (msg.includes("club")) {
        response = "We have the following clubs:<br>" + clubData.map(c => c.name).join(", ");
      } else if (msg.includes("register")) {
        response = "To register, click 'Join Now' on the Clubs page.";
      } else if (msg.includes("hello") || msg.includes("hi")) {
        response = "Hey! 👋 I'm the CLUBz Assistant. Ask me about any club or upcoming event.";
      }
    }

    chatBody.innerHTML += `<p class="bot">${response}</p>`;
    chatBody.scrollTop = chatBody.scrollHeight;
  };

  // === Event Listeners ===
  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keypress", e => {
    if (e.key === "Enter") sendMessage();
  });
});
