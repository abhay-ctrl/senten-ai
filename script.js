// ================== DOM ELEMENTS ==================
const promptInput = document.getElementById("prompt");
const submitBtn = document.getElementById("submit");
const chatContainer = document.getElementById("chat-container");
const themeSwitch = document.getElementById("themeSwitch");

const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");

const Api_URL = "/api/gemini";

// ================== AUTO SCROLL ==================
function scrollToBottom() {
  chatContainer.scrollTo({
    top: chatContainer.scrollHeight,
    behavior: "smooth",
  });
}

// ================== SIDEBAR TOGGLE ==================
menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("sidebar-open");
});

// Close sidebar when clicking outside
document.addEventListener("click", (e) => {
  if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
    sidebar.classList.remove("sidebar-open");
  }
});

// ================== ADD CHAT MESSAGE ==================
function addMessage(message, sender) {
  const box = document.createElement("div");
  box.className = sender === "user" ? "user-chat-box" : "ai-chat-box";

  const img = document.createElement("img");
  img.className = "dp";
  img.src = sender === "user" ? "user.png" : "ai.png"; // change paths if needed

  const bubble = document.createElement("div");
  bubble.className = sender === "user" ? "user-chat-area" : "ai-chat-area";
  bubble.textContent = message; // safer than innerHTML

  box.appendChild(img);
  box.appendChild(bubble);
  chatContainer.appendChild(box);

  scrollToBottom();
}

// ================== LOAD SAVED THEME ==================
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  themeSwitch.checked = true;
}

// ================== THEME SWITCH ==================
themeSwitch.addEventListener("change", () => {
  document.body.classList.toggle("dark-mode", themeSwitch.checked);
  localStorage.setItem("theme", themeSwitch.checked ? "dark" : "light");
});

// ================== SEND MESSAGE ==================
async function sendMessage() {
  const text = promptInput.value.trim();
  if (!text) return;

  addMessage(text, "user");
  promptInput.value = "";

  // Loading bubble
  const loaderBox = document.createElement("div");
  loaderBox.className = "ai-chat-box";
  loaderBox.innerHTML = `
    <img src="ai.png" class="dp">
    <div class="ai-chat-area typing">Typing...</div>
  `;
  chatContainer.appendChild(loaderBox);
  scrollToBottom();

  try {
    const response = await fetch(Api_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text }] }],
      }),
    });

    const data = await response.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from server.";

    loaderBox.remove();
    addMessage(reply, "ai");
  } catch (error) {
    loaderBox.remove();
    addMessage("⚠ Error: Could not connect to Mindsense AI server.", "ai");
    console.error(error);
  }
}

// ================== BUTTON SEND ==================
submitBtn.addEventListener("click", sendMessage);

// ================== ENTER KEY SEND ==================
promptInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

// ================== WELCOME MESSAGE ==================
window.addEventListener("load", () => {
  addMessage("Hello! I am Mindsense AI. How can I help you today?", "ai");
});
