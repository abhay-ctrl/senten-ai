const promptInput = document.querySelector("#prompt");
const submitBtn = document.querySelector("#submit");
const chatContainer = document.querySelector(".chat-container");

const Api_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyAAyNRK6L9bIpwAb2qtG5GqrypfVHFtvx0";

// --------------------------
// Add message to chat window
// --------------------------
function addMessage(message, sender) {
  const messageBox = document.createElement("div");
  messageBox.classList.add(sender === "user" ? "user-chat-box" : "ai-chat-box");

  const img = document.createElement("img");
  img.src = sender === "user" ? "user.png" : "ai.png";
  img.classList.add("dp");

  const bubble = document.createElement("div");
  bubble.classList.add(sender === "user" ? "user-chat-area" : "ai-chat-area");
  bubble.innerHTML = message;

  messageBox.appendChild(img);
  messageBox.appendChild(bubble);
  chatContainer.appendChild(messageBox);

  chatContainer.scrollTo({
    top: chatContainer.scrollHeight,
    behavior: "smooth",
  });
}

// --------------------------
// Send user message
// --------------------------
async function sendMessage() {
  const text = promptInput.value.trim();
  if (!text) return;

  // Show user bubble
  addMessage(text, "user");
  promptInput.value = "";

  // Loader bubble
  const loaderBox = document.createElement("div");
  loaderBox.classList.add("ai-chat-box");

  const img = document.createElement("img");
  img.src = "ai.png";
  img.classList.add("dp");

  const loader = document.createElement("div");
  loader.classList.add("ai-chat-area");
  loader.innerHTML = `<img src="loading.webp" width="50px">`;

  loaderBox.appendChild(img);
  loaderBox.appendChild(loader);
  chatContainer.appendChild(loaderBox);

  chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });

  await new Promise((res) => setTimeout(res, 1500)); // Wait for loading animation

  // --------------- API CALL ---------------
  try {
    const response = await fetch(Api_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: text }] }],
      }),
    });

    const data = await response.json();

    const aiReply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from API.";

    loaderBox.remove(); // remove loader

    addMessage(aiReply, "ai"); // show ai reply
  } catch (err) {
    loaderBox.remove();
    addMessage("Error: Unable to reach AI server.", "ai");
  }
}

// --------------------------
// Events
// --------------------------
submitBtn.addEventListener("click", sendMessage);

promptInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

// --------------------------
// Welcome message
// --------------------------
window.onload = () => {
  addMessage("Hello! I am SENTEN AI. How can I assist you today?", "ai");
};
