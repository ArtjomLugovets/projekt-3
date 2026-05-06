const world = document.getElementById("world");
const tilesLayer = document.getElementById("tiles");
const playersLayer = document.getElementById("players");

async function loadWorld() {
  const response = await fetch("https://tinkr.tech/sdb/Artjom/wanderworld");
  const data = await response.json();
  render(data);
}

function render(state) {
  playersLayer.innerHTML = "";

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
    div.classList.add("nimi");

    playersLayer.appendChild(div);
  }
}

const tiles = [
  { x: 64, y: 64, img: "tree.png" },
  { x: 128, y: 96, img: "tree.png" },
  { x: 256, y: 64, img: "tree.png" },
  { x: 320, y: 128, img: "tree.png" },
  { x: 480, y: 96, img: "tree.png" },
  { x: 544, y: 160, img: "tree.png" },
  { x: 700, y: 100, img: "tree.png" },

  { x: 100, y: 300, img: "tree.png" },
  { x: 200, y: 350, img: "tree.png" },
  { x: 300, y: 320, img: "tree.png" },
  { x: 400, y: 360, img: "tree.png" },
  { x: 500, y: 340, img: "tree.png" },
  { x: 600, y: 300, img: "tree.png" },

  { x: 50, y: 500, img: "tree.png" },
  { x: 150, y: 520, img: "tree.png" },
  { x: 250, y: 500, img: "tree.png" },
  { x: 350, y: 520, img: "tree.png" },
  { x: 450, y: 500, img: "tree.png" },
  { x: 550, y: 520, img: "tree.png" },
  { x: 650, y: 500, img: "tree.png" },

  { x: 320, y: 200, img: "water.png" },
  { x: 352, y: 200, img: "water.png" },
  { x: 384, y: 200, img: "water.png" },

  { x: 320, y: 232, img: "water.png" },
  { x: 352, y: 232, img: "water.png" },
  { x: 384, y: 232, img: "water.png" },

  { x: 320, y: 264, img: "water.png" },
  { x: 352, y: 264, img: "water.png" },
  { x: 384, y: 264, img: "water.png" },


  { x: 100, y: 190, img: "house.png" },
  { x: 600, y: 150, img: "house.png" },
  { x: 400, y: 440, img: "house.png" },


  { x: 0, y: 224, img: "path.png" },
  { x: 32, y: 224, img: "path.png" },
  { x: 64, y: 224, img: "path.png" },
  { x: 96, y: 224, img: "path.png" },

  { x: 640, y: 0, img: "path.png" },
  { x: 640, y: 32, img: "path.png" },
  { x: 640, y: 64, img: "path.png" },
  { x: 640, y: 96, img: "path.png" },
  { x: 640, y: 128, img: "path.png" },

  { x: 400, y: 600 - 32, img: "path.png" },
  { x: 400, y: 600 - 64, img: "path.png" },
  { x: 400, y: 600 - 96, img: "path.png" },
  { x: 400, y: 600 - 128, img: "path.png" }
];


function renderTiles() {
  tilesLayer.innerHTML = "";

  for (const tile of tiles) {
    const img = document.createElement("img");

    img.src = "https://tinkr.tech/sdb_apps/wanderworld/images/" + tile.img;

    img.style.position = "absolute";
    img.style.left = tile.x + "px";
    img.style.top = tile.y + "px";

    img.style.width = "32px";
    img.style.height = "32px";

    img.style.imageRendering = "pixelated";

    tilesLayer.appendChild(img);
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

  renderTiles();
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

function changeUser() {
  const newName = prompt("Enter new username");

  if (!newName || newName.trim() === "") return;

  localStorage.setItem("username", newName);
  localStorage.removeItem("key");
  location.reload();
}

init();