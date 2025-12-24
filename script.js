const promptInput = document.getElementById("prompt");
const submitBtn = document.getElementById("submit");
const chatContainer = document.getElementById("chat-container");
const themeSwitch = document.getElementById("themeSwitch");

const Api_URL = "/api/gemini";

// ------------------------------------------------------
// AUTO-SCROLL WITH SMOOTH ANIMATION
// ------------------------------------------------------
function scrollToBottom() {
  chatContainer.scrollTo({
    top: chatContainer.scrollHeight,
    behavior: "smooth",
  });
}

// ------------------------------------------------------
// ADD MESSAGE TO CHAT (USER + AI)
// ------------------------------------------------------
function addMessage(message, sender) {
  const box = document.createElement("div");
  box.classList.add(sender === "user" ? "user-chat-box" : "ai-chat-box");

  const img = document.createElement("img");
  img.classList.add("dp");
  img.src = sender === "user" ? "user.png" : "ai.png";

  const bubble = document.createElement("div");
  bubble.classList.add(sender === "user" ? "user-chat-area" : "ai-chat-area");

  // Prevent long-message breaking layout
  bubble.style.wordBreak = "break-word";
  bubble.style.whiteSpace = "pre-wrap";

  bubble.innerHTML = message;

  box.appendChild(img);
  box.appendChild(bubble);
  chatContainer.appendChild(box);

  scrollToBottom();
}

// ------------------------------------------------------
// LOAD SAVED THEME
// ------------------------------------------------------
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  themeSwitch.checked = true;
}

// ------------------------------------------------------
// THEME TOGGLE
// ------------------------------------------------------
themeSwitch.addEventListener("change", () => {
  if (themeSwitch.checked) {
    document.body.classList.add("dark-mode");
    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.remove("dark-mode");
    localStorage.setItem("theme", "light");
  }
});

// ------------------------------------------------------
// MAIN FUNCTION — SEND MESSAGE
// ------------------------------------------------------
async function sendMessage() {
  const text = promptInput.value.trim();
  if (!text) return;

  addMessage(text, "user");
  promptInput.value = "";

  // ------------------------------------------------------
  // TYPING LOADER WITH SMOOTH AUTO-SCROLL
  // ------------------------------------------------------
  const loaderBox = document.createElement("div");
  loaderBox.classList.add("ai-chat-box");

  loaderBox.innerHTML = `
    <img src="ai.png" class="dp">
    <div class="ai-chat-area">
        <img src="loading.webp" width="45px">
    </div>
  `;

  chatContainer.appendChild(loaderBox);
  scrollToBottom();

  try {
    const response = await fetch(Api_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: text }] }],
      }),
    });

    const data = await response.json();
    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from API.";

    loaderBox.remove();
    addMessage(reply, "ai");
  } catch (err) {
    loaderBox.remove();
    addMessage("Error: Could not connect to SENTEN AI server.", "ai");
  }
}

// ------------------------------------------------------
// SEND BUTTON
// ------------------------------------------------------
submitBtn.addEventListener("click", sendMessage);

// ------------------------------------------------------
// ENTER KEY SUPPORT
// ------------------------------------------------------
promptInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});

// ------------------------------------------------------
// WELCOME MESSAGE
// ------------------------------------------------------
window.onload = () => {
  addMessage("Hello! I am SENTEN AI. How can I help you today?", "ai");
};
