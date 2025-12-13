// =========================
// SENTEN AI – FINAL SCRIPT (SECURE)
// =========================

const promptInput = document.getElementById("prompt");
const submitBtn = document.getElementById("submit");
const chatContainer = document.querySelector(".chat-container");

// IMPORTANT: Backend endpoint (NO API KEY here)
const API_URL = "/api/gemini";

// --------------------------
// Add message to chat window
// --------------------------
function addMessage(message, sender) {
  const box = document.createElement("div");
  box.classList.add(sender === "user" ? "user-chat-box" : "ai-chat-box");

  const img = document.createElement("img");
  img.classList.add("dp");
  img.src = sender === "user" ? "user.png" : "ai.png";

  const bubble = document.createElement("div");
  bubble.classList.add(sender === "user" ? "user-chat-area" : "ai-chat-area");
  bubble.innerText = message;

  box.appendChild(img);
  box.appendChild(bubble);
  chatContainer.appendChild(box);

  chatContainer.scrollTo({
    top: chatContainer.scrollHeight,
    behavior: "smooth",
  });
}

// --------------------------
// Main Function
// --------------------------
async function sendMessage() {
  const text = promptInput.value.trim();
  if (!text) return;

  addMessage(text, "user");
  promptInput.value = "";

  // Loader
  const loaderBox = document.createElement("div");
  loaderBox.classList.add("ai-chat-box");

  const aiImg = document.createElement("img");
  aiImg.src = "ai.png";
  aiImg.classList.add("dp");

  const loader = document.createElement("div");
  loader.classList.add("ai-chat-area");
  loader.innerHTML = `<img src="loading.webp" width="40">`;

  loaderBox.appendChild(aiImg);
  loaderBox.appendChild(loader);
  chatContainer.appendChild(loaderBox);

  chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from AI.";

    loaderBox.remove();
    addMessage(reply, "ai");
  } catch (error) {
    loaderBox.remove();
    addMessage("Server error. Please try again.", "ai");
  }
}

// --------------------------
// Events
// --------------------------
submitBtn.addEventListener("click", sendMessage);

promptInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});

// --------------------------
// Welcome Message
// --------------------------
window.onload = () => {
  addMessage("Hello! I am SENTEN AI. How can I help you today?", "ai");
};
