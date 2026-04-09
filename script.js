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
    img.src = player.image;
    div.appendChild(img);

    const name = document.createElement("div");
    name.textContent = player.username;
    div.appendChild(name);

    world.appendChild(div);

  }
}

async function join() {
  const response = await fetch("https://tinkr.tech/sdb/Artjom/wanderworld", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      action: "join",
      username: "Artjom"
    })
  });

  const data = await response.json();

  localStorage.setItem("key", data.player_key);
}

world.addEventListener("click", (e) => {
  fetch("https://tinkr.tech/sdb/Artjom/wanderworld", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      action: "move",
      player_key: localStorage.getItem("key"),
      x: e.offsetX,
      y: e.offsetY
    })
  });

  loadWorld();
})

async function talk(text) {
  const response = await fetch("https://tinkr.tech/sdb/Artjom/wanderworld", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      action: "talk",
      player_key: localStorage.getItem("key"),
      message: text
    })
  });
}
console.log(localStorage.getItem("key"));
join();
loadWorld();