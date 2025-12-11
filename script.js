const sendBtn = document.getElementById("send");
const input = document.getElementById("prompt");
const chat = document.getElementById("chat-container");

// ADD MESSAGE FUNCTION
function addMessage(type, text, img) {
    const row = document.createElement("div");
    row.className = "msg-row " + type;

    const dp = document.createElement("img");
    dp.src = img;
    dp.className = "dp";

    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.innerText = text;

    if (type === "ai") {
        row.append(dp, bubble);
    } else {
        row.append(bubble, dp);
    }

    chat.appendChild(row);
    chat.scrollTop = chat.scrollHeight;
}

// SEND HANDLER
sendBtn.onclick = async () => {
    const text = input.value.trim();
    if (!text) return;

    // User message
    addMessage("user", text, "user.png");
    input.value = "";

    // Show loading AI DP
    const loadingRow = document.createElement("div");
    loadingRow.className = "msg-row ai";

    const loadingDp = document.createElement("img");
    loadingDp.src = "loading.webp";
    loadingDp.className = "dp";

    const loadingBubble = document.createElement("div");
    loadingBubble.className = "bubble";
    loadingBubble.innerText = "Typing...";

    loadingRow.append(loadingDp, loadingBubble);
    chat.appendChild(loadingRow);
    chat.scrollTop = chat.scrollHeight;

    // Wait 3 seconds
    await new Promise(r => setTimeout(r, 3000));

    // Remove loading
    chat.removeChild(loadingRow);

    // API CALL (replace with your API)
    let aiReply = "This is SENTEN AI replying to you.";

    // AI message
    addMessage("ai", aiReply, "ai.png");
};
