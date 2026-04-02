const world = document.getElementById("world");

async function loadWorld() {
  const res = await fetch("/sdb/poly/wander");
  const data = await res.json();

  console.log(data)

  for (const player of data.players) {
    const div = document.createElement("div");
    div.textContent = player.username;
    world.appendChild(div);
  }
}

loadWorld();