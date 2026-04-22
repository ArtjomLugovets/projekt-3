const world = document.getElementById("world");

async function loadWorld() {
  const response = await fetch("https://tinkr.tech/sdb/Artjom/wanderworld");
  const data = await response.json();
  render(data);
}

function render(state) {
  world.innerHTML = "";

  for (const player of state.players) {
    const div = document.createElement("div");
    div.className = "player";

    div.style.left = player.x + "px";
    div.style.top = player.y + "px";

    if (player.message) {
      const bubble = document.createElement("div");
      bubble.className = "bubble";
      bubble.textContent = player.message;
      div.appendChild(bubble);
    }

    const img = document.createElement("img");
    img.src = "https://tinkr.tech" + player.image;
    div.appendChild(img);

    const name = document.createElement("div");
    name.textContent = player.username;
    div.appendChild(name);

    world.appendChild(div);
  }
}

async function init() {
  let key = localStorage.getItem("key");
  let username = localStorage.getItem("username");

  if (!username) {
    username = "Chill Guy_" + Math.floor(Math.random() * 1000);
    localStorage.setItem("username", username);
  }

  if (!key || key === "undefined" || key === "null") {
    const response = await fetch("https://tinkr.tech/sdb/Artjom/wanderworld", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: "join",
        username: username
      })
    });

    const data = await response.json();

    if (data.player_key) {
      localStorage.setItem("key", data.player_key);
    } else {
      return;
    }
  }

  setInterval(loadWorld, 1000);
}

world.addEventListener("click", async (e) => {
  const key = localStorage.getItem("key");

  if (!key || key === "undefined") return;

  await fetch("https://tinkr.tech/sdb/Artjom/wanderworld", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      action: "move",
      player_key: key,
      x: e.offsetX,
      y: e.offsetY
    })
  });

  loadWorld();
});

async function talk(text) {
  const key = localStorage.getItem("key");

  if (!key) return;

  await fetch("https://tinkr.tech/sdb/Artjom/wanderworld", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      action: "talk",
      player_key: key,
      message: text
    })
  });
}

function sendMessage() {
  const input = document.getElementById("msg");
  if (!input.value) return;

  talk(input.value);
  input.value = "";
}

function clearSave() {
  localStorage.clear();
  location.reload();
}

init();