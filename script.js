// DOM
const promptInput = document.getElementById("prompt");
const submitBtn = document.getElementById("submit");
const chatContainer = document.getElementById("chat-container");
const themeSwitch = document.getElementById("themeSwitch");
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");

const Api_URL = "/api/gemini";

// Scroll
function scrollToBottom() {
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Sidebar
menuBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  sidebar.classList.toggle("open");
});

document.addEventListener("click", (e) => {
  if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
    sidebar.classList.remove("open");
  }
});

// Chat message
function addMessage(msg, sender) {
  const box = document.createElement("div");
  box.className = sender === "user" ? "user-chat-box" : "ai-chat-box";

  const img = document.createElement("img");
  img.className = "dp";
  img.src = sender === "user" ? "user.png" : "ai.png";

  const bubble = document.createElement("div");
  bubble.className = sender === "user" ? "user-chat-area" : "ai-chat-area";
  bubble.textContent = msg;

  box.append(img, bubble);
  chatContainer.appendChild(box);
  scrollToBottom();
}

// Theme load
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  themeSwitch.checked = true;
}

// Theme toggle
themeSwitch.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode", themeSwitch.checked);
  localStorage.setItem("theme", themeSwitch.checked ? "dark" : "light");
});

// Send message
async function sendMessage() {
  const text = promptInput.value.trim();
  if (!text) return;

  addMessage(text, "user");
  promptInput.value = "";

  const loader = document.createElement("div");
  loader.className = "ai-chat-box";
  loader.innerHTML = `<div class="ai-chat-area">Typing...</div>`;
  chatContainer.appendChild(loader);

  try {
    const res = await fetch(Api_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text }] }]
      }),
    });

    const data = await res.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No reply";

    loader.remove();
    addMessage(reply, "ai");

  } catch (err) {
    loader.remove();
    addMessage("Server error ❌", "ai");
    console.error(err);
  }
}

// Button + Enter
submitBtn.onclick = sendMessage;
promptInput.addEventListener("keydown", e => e.key === "Enter" && sendMessage());

// Welcome
window.onload = () => {
  addMessage("Hello! I am Mindsense AI 🤖", "ai");
};
