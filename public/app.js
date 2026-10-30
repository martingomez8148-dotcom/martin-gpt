const form = document.getElementById("chatForm");
const input = document.getElementById("message");
const chat = document.getElementById("chat");
const welcome = document.getElementById("welcome");
const send = document.getElementById("send");

let history = [];
let busy = false;

function addMessage(text, role) {
  const item = document.createElement("div");
  item.className = "message " + role;
  item.textContent = text;
  chat.appendChild(item);
  item.scrollIntoView({ behavior: "smooth", block: "end" });
  return item;
}

function suggest(text) {
  input.value = text;
  input.focus();
}

window.suggest = suggest;

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const message = input.value.trim();
  if (!message || busy) return;

  busy = true;
  welcome.style.display = "none";
  send.disabled = true;

  addMessage(message, "user");
  input.value = "";

  const loading = addMessage("MARTIN GPT está pensando...", "assistant");

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        history
      })
    });

    const data = await response.json();
    loading.remove();

    if (!response.ok) {
      throw new Error(data.error || "No se pudo obtener una respuesta.");
    }

    const reply = data.reply || "No recibí una respuesta.";
    addMessage(reply, "assistant");

    history.push(
      { role: "user", content: message },
      { role: "assistant", content: reply }
    );

    history = history.slice(-10);

  } catch (error) {
    loading.textContent = "Error: " + error.message;
  } finally {
    busy = false;
    send.disabled = false;
    input.focus();
  }
});

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    form.requestSubmit();
  }
});
