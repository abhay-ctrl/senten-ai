// =========================
// SENTEN AI – FINAL SCRIPT
// =========================

const promptInput = document.getElementById("prompt");   // FIXED
const submitBtn = document.getElementById("submit");     // FIXED
const chatContainer = document.querySelector(".chat-container");

const Api_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyBMnLKDFzkX5VCz9HJ5w8bTTAvQGQ0uEV4";

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
  bubble.innerHTML = message;

  box.appendChild(img);
  box.appendChild(bubble);

  chatContainer.appendChild(box);

  chatContainer.scrollTo({
    top: chatContainer.scrollHeight,
    behavior: "smooth",
  });
}

// --------------------------
// Main Function: send message
// --------------------------
async function sendMessage() {
  const text = promptInput.value.trim();
  if (!text) return;

  addMessage(text, "user");
  promptInput.value = "";

  // Loader box
  const loaderBox = document.createElement("div");
  loaderBox.classList.add("ai-chat-box");

  const aiImg = document.createElement("img");
  aiImg.src = "ai.png";
  aiImg.classList.add("dp");

  const loader = document.createElement("div");
  loader.classList.add("ai-chat-area");
  loader.innerHTML = `<img src="loading.webp" width="50px">`;

  loaderBox.appendChild(aiImg);
  loaderBox.appendChild(loader);
  chatContainer.appendChild(loaderBox);

  chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });

  // Wait loader animate
  await new Promise((res) => setTimeout(res, 1200));

  // CALL API
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

// --------------------------
// Click Send Button
// --------------------------
submitBtn.addEventListener("click", function () {
  sendMessage();
});

// --------------------------
// ENTER Key Fix (Laptop + PC)
// --------------------------
promptInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();  // IMPORTANT FIX
    sendMessage();
  }
});

// --------------------------
// Welcome Message
// --------------------------
window.onload = () => {
  addMessage("Hello! I am SENTEN AI. How can I help you today?", "ai");
};


