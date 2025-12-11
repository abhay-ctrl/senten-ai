const promptInput = document.querySelector("#prompt");
const sendBtn = document.querySelector("#sendBtn");
const chatArea = document.querySelector("#chatArea");

// Google Gemini API
const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyCvo3zB3Ury2BWgKodGMK4vR_jmvZodFh4";

let user = {
  message: null,
  file: {
    mime_type: null,
    data: null,
  },
};

function addUserMessage(text) {
  const msg = document.createElement("div");
  msg.className = "message user";
  msg.innerHTML = `
      <div class="bubble">${text}</div>
      <img src="user.png" class="avatar">
  `;
  chatArea.appendChild(msg);
  chatArea.scrollTop = chatArea.scrollHeight;
}

function addAILoading() {
  const msg = document.createElement("div");
  msg.className = "message ai loading";
  msg.innerHTML = `
      <img src="ai.png" class="avatar">
      <div class="bubble">
        <img src="loading.webp" width="40px">
      </div>
  `;
  chatArea.appendChild(msg);
  chatArea.scrollTop = chatArea.scrollHeight;
  return msg; // return to replace later
}

function replaceAIMessage(loadingElement, text) {
  loadingElement.innerHTML = `
      <img src="ai.png" class="avatar">
      <div class="bubble">${text}</div>
  `;
  loadingElement.classList.remove("loading");
  chatArea.scrollTop = chatArea.scrollHeight;
}

async function generateAIResponse(userMessage, loadingElement) {
  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: userMessage }],
      },
    ],
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    const aiText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Error: No response from AI.";

    replaceAIMessage(loadingElement, aiText.trim());
  } catch (err) {
    replaceAIMessage(loadingElement, "Error connecting to API.");
    console.log(err);
  }
}

function sendMessage() {
  const text = promptInput.value.trim();
  if (!text) return;

  addUserMessage(text);
  promptInput.value = "";

  const loadingMsg = addAILoading();

  setTimeout(() => {
    generateAIResponse(text, loadingMsg);
  }, 400);
}

// ENTER key
promptInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

// Send button
sendBtn.addEventListener("click", () => sendMessage());

