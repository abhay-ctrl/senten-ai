const prompt = document.querySelector("#prompt");
const submitbtn = document.querySelector("#submit");
const chatContainer = document.querySelector(".chat-container");
const imagebtn = document.querySelector("#image");
const image = document.querySelector("#image img");
const imageinput = document.querySelector("#image input");

// FIXED: correct API URL + inside quotes
const Api_Url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyCvo3zB3Ury2BWgKodGMK4vR_jmvZodFh4"

let user = {
  message: null,
  file: {
    mime_type: null,
    data: null,
  },
};

async function generateResponse(aiChatBox) {
  let text = aiChatBox.querySelector(".ai-chat-area");

  let parts = [{ text: user.message }];

  if (user.file.data) {
    parts.push({
      inline_data: {
        mime_type: user.file.mime_type,
        data: user.file.data,
      },
    });
  }

  let RequestOption = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user", // FIXED
          parts: parts,
        },
      ],
    }),
  };

  try {
    let response = await fetch(Api_Url, RequestOption);
    let data = await response.json();

    console.log(data);

    let apiResponse =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response received from API.";

    text.innerHTML = apiResponse.trim();
  } catch (error) {
    console.log(error);
    text.innerHTML = "Error fetching response.";
  } finally {
    chatContainer.scrollTo({
      top: chatContainer.scrollHeight,
      behavior: "smooth",
    });
    image.src = `img.svg`;
    image.classList.remove("choose");
    user.file = {};
  }
}

function createChatBox(html, classes) {
  let div = document.createElement("div");
  div.innerHTML = html;
  div.classList.add(classes);
  return div;
}

function handlechatResponse(userMessage) {
  if (!userMessage.trim()) return;

  user.message = userMessage;

  let html = `
    <img src="user.png" width="8%">
    <div class="user-chat-area">
      ${user.message}
      ${
        user.file.data
          ? `<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg"/>`
          : ""
      }
    </div>
  `;

  prompt.value = "";
  let userChatBox = createChatBox(html, "user-chat-box");
  chatContainer.appendChild(userChatBox);

  chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });

  setTimeout(() => {
    let html = `
      <img src="ai.png" width="10%">
      <div class="ai-chat-area">
        <img src="loading.webp" class="load" width="50px">
      </div>
    `;

    let aiChatBox = createChatBox(html, "ai-chat-box");
    chatContainer.appendChild(aiChatBox);
    generateResponse(aiChatBox);
  }, 600);
}

prompt.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handlechatResponse(prompt.value);
});

submitbtn.addEventListener("click", () => {
  handlechatResponse(prompt.value);
});

imageinput.addEventListener("change", () => {
  const file = imageinput.files[0];
  if (!file) return;

  let reader = new FileReader();
  reader.onload = (e) => {
    let base64string = e.target.result.split(",")[1];
    user.file = {
      mime_type: file.type,
      data: base64string,
    };
    image.src = `data:${file.type};base64,${base64string}`;
    image.classList.add("choose");
  };

  reader.readAsDataURL(file);
});

imagebtn.addEventListener("click", () => {
  imagebtn.querySelector("input").click();
});

