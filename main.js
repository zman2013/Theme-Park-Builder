const TILE_WIDTH = 96;
const TILE_HEIGHT = 48;
const GRID_COLS = 24;
const GRID_ROWS = 24;
const MIN_ZOOM = 0.62;
const MAX_ZOOM = 1.8;
const STARTING_FUNDS = 9500;
const BASE_GUEST_CAP = 24;
const PATH_COST = 15;

const assetPaths = {
  ferris: "./assets/ferris.png",
  carousel: "./assets/carousel.png",
  coaster: "./assets/coaster.png",
  drop: "./assets/drop.png",
  food: "./assets/food.png",
  restroom: "./assets/restroom.png",
  tree: "./assets/tree.png",
  fountain: "./assets/fountain.png",
  flower: "./assets/flower.png",
  lamp: "./assets/lamp.png",
  bench: "./assets/bench.png",
  gate: "./assets/gate.png",
  uiHero: "./assets/ui-hero.png",
};

const terrainMeta = {
  grass: { name: "草地" },
  path: { name: "道路" },
  water: { name: "水域" },
};

const structureCatalog = {
  ferris: {
    label: "摩天轮",
    type: "ride",
    cost: 1400,
    upkeep: 9,
    fun: 28,
    queueCap: 8,
    capacity: 4,
    cycle: 520,
    sprite: "ferris",
    footprint: { w: 2, h: 2 },
    happinessBoost: 18,
  },
  carousel: {
    label: "旋转木马",
    type: "ride",
    cost: 900,
    upkeep: 6,
    fun: 18,
    queueCap: 6,
    capacity: 3,
    cycle: 360,
    sprite: "carousel",
    footprint: { w: 2, h: 2 },
    happinessBoost: 14,
  },
  coaster: {
    label: "迷你过山车",
    type: "ride",
    cost: 2200,
    upkeep: 14,
    fun: 40,
    queueCap: 10,
    capacity: 5,
    cycle: 600,
    sprite: "coaster",
    footprint: { w: 3, h: 2 },
    happinessBoost: 24,
  },
  drop: {
    label: "跳楼机",
    type: "ride",
    cost: 1800,
    upkeep: 12,
    fun: 33,
    queueCap: 8,
    capacity: 4,
    cycle: 450,
    sprite: "drop",
    footprint: { w: 2, h: 2 },
    happinessBoost: 20,
  },
  food: {
    label: "小吃摊",
    type: "facility",
    cost: 600,
    upkeep: 2,
    sprite: "food",
    footprint: { w: 1, h: 1 },
    hungerFill: 34,
  },
  restroom: {
    label: "洗手间",
    type: "facility",
    cost: 500,
    upkeep: 2,
    sprite: "restroom",
    footprint: { w: 1, h: 1 },
    hygieneBoost: 30,
  },
  tree: {
    label: "树丛",
    type: "scenery",
    cost: 75,
    upkeep: 0,
    sprite: "tree",
    footprint: { w: 1, h: 1 },
    beauty: 8,
  },
  fountain: {
    label: "喷泉",
    type: "scenery",
    cost: 180,
    upkeep: 1,
    sprite: "fountain",
    footprint: { w: 1, h: 1 },
    beauty: 14,
  },
  flower: {
    label: "花坛",
    type: "scenery",
    cost: 65,
    upkeep: 0,
    sprite: "flower",
    footprint: { w: 1, h: 1 },
    beauty: 5,
  },
  lamp: {
    label: "园区路灯",
    type: "scenery",
    cost: 55,
    upkeep: 0,
    sprite: "lamp",
    footprint: { w: 1, h: 1 },
    beauty: 4,
  },
  bench: {
    label: "长椅",
    type: "scenery",
    cost: 45,
    upkeep: 0,
    sprite: "bench",
    footprint: { w: 1, h: 1 },
    beauty: 3,
  },
};

const tools = [
  { key: "path", label: "道路", cost: PATH_COST, description: "引导游客在园区内移动。" },
  { key: "erase", label: "推土机", cost: 0, description: "拆除道路和建筑设施。" },
  { key: "ferris", label: "摩天轮", cost: structureCatalog.ferris.cost, description: "视野好，客流稳定。" },
  { key: "carousel", label: "旋转木马", cost: structureCatalog.carousel.cost, description: "适合全年龄游客。" },
  { key: "coaster", label: "迷你过山车", cost: structureCatalog.coaster.cost, description: "刺激感强，适合作为核心设施。" },
  { key: "drop", label: "跳楼机", cost: structureCatalog.drop.cost, description: "占地紧凑，刺激直接。" },
  { key: "food", label: "小吃摊", cost: structureCatalog.food.cost, description: "补充饥饿并带来收入。" },
  { key: "restroom", label: "洗手间", cost: structureCatalog.restroom.cost, description: "改善卫生感受和舒适度。" },
  { key: "tree", label: "树丛", cost: structureCatalog.tree.cost, description: "增加阴影和自然氛围。" },
  { key: "fountain", label: "喷泉", cost: structureCatalog.fountain.cost, description: "提升周边游客心情。" },
  { key: "flower", label: "花坛", cost: structureCatalog.flower.cost, description: "低成本提升景观氛围。" },
  { key: "lamp", label: "园区路灯", cost: structureCatalog.lamp.cost, description: "让主路看起来更完整。" },
  { key: "bench", label: "长椅", cost: structureCatalog.bench.cost, description: "方便游客短暂停留休息。" },
];

const typeLabels = {
  ride: "游乐设施",
  facility: "服务设施",
  scenery: "景观装饰",
};

const statusLabels = {
  Open: "开放中",
  Running: "运行中",
  Ready: "就绪",
};

const dom = {
  heroArt: document.querySelector("#hero-art"),
  toolGrid: document.querySelector("#toolGrid"),
  clearSelection: document.querySelector("#clearSelection"),
  speedButton: document.querySelector("#speedButton"),
  canvas: document.querySelector("#parkCanvas"),
  hoverCard: document.querySelector("#hoverCard"),
  funds: document.querySelector("#fundsValue"),
  guests: document.querySelector("#guestValue"),
  happiness: document.querySelector("#happinessValue"),
  cleanliness: document.querySelector("#cleanValue"),
  rating: document.querySelector("#ratingValue"),
  queue: document.querySelector("#queueMetric"),
  revenue: document.querySelector("#revenueMetric"),
  litter: document.querySelector("#litterMetric"),
  rides: document.querySelector("#rideMetric"),
  eventFeed: document.querySelector("#eventFeed"),
  rideStatus: document.querySelector("#rideStatus"),
};

const ctx = dom.canvas.getContext("2d");
const entryGate = { x: 11, y: 21, sprite: "gate" };
const guestColors = ["#ff826e", "#4db6ff", "#ffd166", "#ff7ca8", "#8bd67f", "#b490ff"];

const state = {
  selectedTool: "path",
  speed: 1,
  funds: STARTING_FUNDS,
  guests: [],
  structures: [],
  events: [],
  tick: 0,
  revenueWindow: [],
  litter: 2,
  hoveredTile: null,
  dragPlacement: false,
  panning: false,
  mouse: { x: 0, y: 0 },
  camera: {
    x: dom.canvas.width * 0.5,
    y: 124,
    zoom: 0.88,
    initialized: false,
  },
};

const images = {};
const grid = createGrid();

for (let offset = 0; offset < 2; offset += 1) {
  grid[entryGate.y][entryGate.x + offset].ground = "path";
}

function createGrid() {
  const rows = [];
  for (let y = 0; y < GRID_ROWS; y += 1) {
    const row = [];
    for (let x = 0; x < GRID_COLS; x += 1) {
      const border = x === 0 || y === 0 || x === GRID_COLS - 1 || y === GRID_ROWS - 1;
      row.push({
        ground: border && (x < 4 || y < 3) ? "water" : "grass",
        structure: null,
        occupant: null,
        reserved: false,
      });
    }
    rows.push(row);
  }
  return rows;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function emitEvent(message) {
  state.events.unshift({
    id: `${Date.now()}-${Math.random()}`,
    message,
  });
  state.events = state.events.slice(0, 10);
}

function buildToolPalette() {
  for (const tool of tools) {
    const button = document.createElement("button");
    button.className = "tool-card";
    button.type = "button";
    button.dataset.tool = tool.key;
    button.innerHTML = `
      <span class="tool-label">${tool.label}</span>
      <strong>$${tool.cost}</strong>
      <small>${tool.description}</small>
    `;
    button.addEventListener("click", () => {
      state.selectedTool = tool.key;
      syncToolSelection();
    });
    dom.toolGrid.append(button);
  }
}

function syncToolSelection() {
  document.querySelectorAll(".tool-card").forEach((button) => {
    button.classList.toggle("active", button.dataset.tool === state.selectedTool);
  });
}

async function loadAssets() {
  const entries = Object.entries(assetPaths);
  await Promise.all(
    entries.map(async ([key, src]) => {
      const image = new Image();
      image.src = src;
      await image.decode().catch(() => {});
      images[key] = image;
    }),
  );
}

function resizeCanvas() {
  const bounds = dom.canvas.getBoundingClientRect();
  const width = Math.round(bounds.width);
  const height = Math.round(bounds.height);

  if (dom.canvas.width === width && dom.canvas.height === height) {
    return;
  }

  const previousWidth = dom.canvas.width || width;
  const previousHeight = dom.canvas.height || height;
  dom.canvas.width = width;
  dom.canvas.height = height;

  if (state.camera.initialized) {
    state.camera.x += (width - previousWidth) * 0.5;
    state.camera.y += (height - previousHeight) * 0.12;
  } else {
    state.camera.x = width * 0.5;
    state.camera.y = 124;
    state.camera.initialized = true;
  }

  constrainCamera();
}

function constrainCamera() {
  const tileHalfWidth = TILE_WIDTH * 0.5 * state.camera.zoom;
  const tileHalfHeight = TILE_HEIGHT * 0.5 * state.camera.zoom;
  const leftEdge = -23 * tileHalfWidth - tileHalfWidth;
  const rightEdge = (GRID_COLS - 1) * tileHalfWidth + tileHalfWidth;
  const bottomEdge = (GRID_COLS + GRID_ROWS - 2) * tileHalfHeight + TILE_HEIGHT * state.camera.zoom;
  const sideMargin = Math.min(220, dom.canvas.width * 0.2);

  state.camera.x = clamp(state.camera.x, sideMargin - rightEdge, dom.canvas.width - sideMargin - leftEdge);
  state.camera.y = clamp(state.camera.y, dom.canvas.height - 124 - bottomEdge, 132);
}

function isoToScreen(x, y, zOffset = 0) {
  const isoX = (x - y) * TILE_WIDTH * 0.5;
  const isoY = (x + y) * TILE_HEIGHT * 0.5 - zOffset;

  return {
    x: state.camera.x + isoX * state.camera.zoom,
    y: state.camera.y + isoY * state.camera.zoom,
  };
}

function screenToIso(x, y) {
  const localX = (x - state.camera.x) / state.camera.zoom;
  const localY = (y - state.camera.y) / state.camera.zoom;

  return {
    x: Math.floor(localY / TILE_HEIGHT + localX / TILE_WIDTH),
    y: Math.floor(localY / TILE_HEIGHT - localX / TILE_WIDTH),
  };
}

function isInsideGrid(x, y) {
  return x >= 0 && y >= 0 && x < GRID_COLS && y < GRID_ROWS;
}

function neighbors(x, y) {
  return [
    { x: x + 1, y },
    { x: x - 1, y },
    { x, y: y + 1 },
    { x, y: y - 1 },
  ].filter((position) => isInsideGrid(position.x, position.y));
}

function canPlaceFootprint(originX, originY, footprint) {
  for (let y = 0; y < footprint.h; y += 1) {
    for (let x = 0; x < footprint.w; x += 1) {
      const targetX = originX + x;
      const targetY = originY + y;
      if (!isInsideGrid(targetX, targetY)) {
        return false;
      }

      const tile = grid[targetY][targetX];
      if (tile.ground === "water" || tile.structure || tile.reserved) {
        return false;
      }
    }
  }

  return true;
}

function footprintTouchesPath(originX, originY, footprint) {
  for (let y = 0; y < footprint.h; y += 1) {
    for (let x = 0; x < footprint.w; x += 1) {
      for (const point of neighbors(originX + x, originY + y)) {
        if (grid[point.y][point.x].ground === "path") {
          return true;
        }
      }
    }
  }

  return false;
}

function cleanupGuestsForStructure(structure) {
  const affectedGuests = new Set([
    ...structure.queue.map((guest) => guest.id),
    ...structure.riders.map((guest) => guest.id),
  ]);

  for (const guest of state.guests) {
    if (guest.target?.id === structure.id || affectedGuests.has(guest.id)) {
      guest.target = null;
      guest.path = [];
      guest.progress = 0;
      if (guest.state !== "wandering") {
        guest.state = "wandering";
      }
    }
  }
}

function placeStructure(kind, x, y) {
  const blueprint = structureCatalog[kind];
  if (!blueprint) {
    return false;
  }

  if (state.funds < blueprint.cost) {
    emitEvent(`资金不足，无法建造${blueprint.label}。`);
    return false;
  }

  if (!canPlaceFootprint(x, y, blueprint.footprint) || !footprintTouchesPath(x, y, blueprint.footprint)) {
    emitEvent(`${blueprint.label}需要建在道路旁边的空地上。`);
    return false;
  }

  const structure = {
    id: `${kind}-${Date.now()}-${Math.random()}`,
    kind,
    label: blueprint.label,
    type: blueprint.type,
    sprite: blueprint.sprite,
    x,
    y,
    width: blueprint.footprint.w,
    height: blueprint.footprint.h,
    upkeep: blueprint.upkeep,
    queueCap: blueprint.queueCap ?? 0,
    capacity: blueprint.capacity ?? 0,
    cycle: blueprint.cycle ?? 0,
    fun: blueprint.fun ?? 0,
    hungerFill: blueprint.hungerFill ?? 0,
    hygieneBoost: blueprint.hygieneBoost ?? 0,
    beauty: blueprint.beauty ?? 0,
    happinessBoost: blueprint.happinessBoost ?? 0,
    queue: [],
    riders: [],
    timer: 0,
    status: "Open",
  };

  state.funds -= blueprint.cost;
  state.structures.push(structure);

  for (let row = 0; row < structure.height; row += 1) {
    for (let col = 0; col < structure.width; col += 1) {
      const tile = grid[y + row][x + col];
      tile.structure = structure.id;
      tile.occupant = structure;
      tile.reserved = col !== 0 || row !== 0;
    }
  }

  emitEvent(
    structure.type === "ride" || structure.type === "facility"
      ? `${structure.label}已开业，游客立刻注意到了。`
      : `${structure.label}为乐园增添了更多魅力。`,
  );
  return true;
}

function removeAt(x, y) {
  if (!isInsideGrid(x, y)) {
    return;
  }

  const tile = grid[y][x];
  if (tile.occupant) {
    const structure = tile.occupant;
    cleanupGuestsForStructure(structure);
    state.structures = state.structures.filter((entry) => entry.id !== structure.id);

    for (let row = 0; row < structure.height; row += 1) {
      for (let col = 0; col < structure.width; col += 1) {
        const target = grid[structure.y + row][structure.x + col];
        target.structure = null;
        target.occupant = null;
        target.reserved = false;
      }
    }

    emitEvent(`${structure.label}已拆除，为新规划腾出空间。`);
    return;
  }

  const gateTile = y === entryGate.y && (x === entryGate.x || x === entryGate.x + 1);
  if (tile.ground === "path" && !gateTile) {
    tile.ground = "grass";
    emitEvent("一段道路已被清除。");
  }
}

function paintPath(x, y) {
  if (!isInsideGrid(x, y)) {
    return;
  }

  const tile = grid[y][x];
  if (tile.ground === "water" || tile.structure || tile.ground === "path") {
    return;
  }

  if (state.funds < PATH_COST) {
    return;
  }

  tile.ground = "path";
  state.funds -= PATH_COST;
}

function applyTool(x, y) {
  if (!isInsideGrid(x, y)) {
    return;
  }

  if (state.selectedTool === "path") {
    paintPath(x, y);
    return;
  }

  if (state.selectedTool === "erase") {
    removeAt(x, y);
    return;
  }

  placeStructure(state.selectedTool, x, y);
}

function drawTile(x, y, highlighted) {
  const tile = grid[y][x];
  const screen = isoToScreen(x, y);
  const width = TILE_WIDTH * state.camera.zoom;
  const height = TILE_HEIGHT * state.camera.zoom;
  const colors = {
    grass: ["#79c98c", "#63a96d"],
    path: ["#f4d9b9", "#d9ba90"],
    water: ["#56b8d4", "#338cae"],
  };
  const [fill, stroke] = colors[tile.ground] || colors.grass;

  ctx.beginPath();
  ctx.moveTo(screen.x, screen.y);
  ctx.lineTo(screen.x + width * 0.5, screen.y + height * 0.5);
  ctx.lineTo(screen.x, screen.y + height);
  ctx.lineTo(screen.x - width * 0.5, screen.y + height * 0.5);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = highlighted ? "#fff6b2" : stroke;
  ctx.lineWidth = highlighted ? 3 : 1;
  ctx.stroke();

  if (tile.ground === "path") {
    ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
    ctx.beginPath();
    ctx.moveTo(screen.x, screen.y + height * 0.18);
    ctx.lineTo(screen.x + width * 0.22, screen.y + height * 0.5);
    ctx.lineTo(screen.x, screen.y + height * 0.82);
    ctx.lineTo(screen.x - width * 0.22, screen.y + height * 0.5);
    ctx.closePath();
    ctx.fill();
  }
}

function drawImageOrFallback(image, x, y, width, height) {
  if (image?.complete && image.naturalWidth) {
    ctx.drawImage(image, x, y, width, height);
    return;
  }

  ctx.fillStyle = "rgba(48, 66, 53, 0.85)";
  ctx.fillRect(x, y, width, height);
}

function drawStructure(structure) {
  const anchor = isoToScreen(structure.x, structure.y);
  const imageWidth = TILE_WIDTH * state.camera.zoom * (structure.width * 0.75 + 0.65);
  const imageHeight = TILE_HEIGHT * state.camera.zoom * (structure.height * 1.8 + 0.6);
  const left = anchor.x - imageWidth * 0.48;
  const top = anchor.y - imageHeight * 0.55;

  drawImageOrFallback(images[structure.sprite], left, top, imageWidth, imageHeight);

  if (structure.type === "ride") {
    const queueAnchor = isoToScreen(structure.x + structure.width, structure.y + structure.height - 1);
    ctx.fillStyle = "rgba(26, 41, 29, 0.88)";
    ctx.fillRect(queueAnchor.x - 38, queueAnchor.y + 4, 76, 18);
    ctx.fillStyle = "#fef3dc";
    ctx.font = `${Math.max(12, 13 * state.camera.zoom)}px Manrope`;
    ctx.textAlign = "center";
    ctx.fillText(`排 ${structure.queue.length}/${structure.queueCap}`, queueAnchor.x, queueAnchor.y + 18);
  }
}

function drawEntryGate() {
  const screen = isoToScreen(entryGate.x, entryGate.y);
  const width = TILE_WIDTH * state.camera.zoom * 1.8;
  const height = TILE_HEIGHT * state.camera.zoom * 1.8;
  drawImageOrFallback(images[entryGate.sprite], screen.x - width * 0.28, screen.y - height * 0.25, width, height);
}

function nearestPathTile(x, y) {
  let best = null;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (let row = 0; row < GRID_ROWS; row += 1) {
    for (let col = 0; col < GRID_COLS; col += 1) {
      if (grid[row][col].ground !== "path") {
        continue;
      }

      const distance = Math.abs(x - col) + Math.abs(y - row);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = { x: col, y: row };
      }
    }
  }

  return best;
}

// Guests walk only on path tiles and may target adjacent access points to structures.
function findPath(start, destination, allowEndOffPath = false) {
  const queue = [start];
  const parents = new Map();
  const seen = new Set([`${start.x},${start.y}`]);

  while (queue.length) {
    const current = queue.shift();
    if (current.x === destination.x && current.y === destination.y) {
      const path = [];
      let cursor = current;
      while (cursor) {
        path.unshift(cursor);
        cursor = parents.get(`${cursor.x},${cursor.y}`);
      }
      return path;
    }

    for (const next of neighbors(current.x, current.y)) {
      const key = `${next.x},${next.y}`;
      if (seen.has(key)) {
        continue;
      }

      const isDestination = next.x === destination.x && next.y === destination.y;
      const tile = grid[next.y][next.x];
      const walkable = tile.ground === "path" || (allowEndOffPath && isDestination);
      if (!walkable) {
        continue;
      }

      seen.add(key);
      parents.set(key, current);
      queue.push(next);
    }
  }

  return null;
}

function spawnGuest(id) {
  return {
    id,
    x: entryGate.x,
    y: entryGate.y,
    progress: 0,
    speed: 0.014 + Math.random() * 0.015,
    path: [],
    state: "wandering",
    happiness: 66 + Math.random() * 18,
    hunger: 18 + Math.random() * 22,
    hygiene: 22 + Math.random() * 20,
    target: null,
    color: randomFrom(guestColors),
  };
}

function parkBeauty() {
  return state.structures.reduce((total, structure) => total + (structure.beauty || 0), 0);
}

function parkRating() {
  const rideCount = state.structures.filter((structure) => structure.type === "ride").length;
  const averageHappiness = state.guests.length
    ? state.guests.reduce((sum, guest) => sum + guest.happiness, 0) / state.guests.length
    : 72;

  return Math.round(averageHappiness * 0.5 + rideCount * 12 + parkBeauty() * 0.8 + Math.max(0, 100 - state.litter * 6));
}

function chooseGuestTarget(guest) {
  const rides = state.structures.filter((structure) => structure.type === "ride" && structure.queue.length < structure.queueCap);
  const foodStalls = state.structures.filter((structure) => structure.kind === "food");
  const restrooms = state.structures.filter((structure) => structure.kind === "restroom");

  let target = null;
  if (guest.hunger > 70 && foodStalls.length) {
    target = randomFrom(foodStalls);
  } else if (guest.hygiene > 72 && restrooms.length) {
    target = randomFrom(restrooms);
  } else if (rides.length) {
    target = randomFrom(rides);
  } else {
    const strollDestination = nearestPathTile(
      guest.x + Math.round(Math.random() * 4 - 2),
      guest.y + Math.round(Math.random() * 4 - 2),
    );

    if (strollDestination) {
      guest.target = { kind: "stroll", x: strollDestination.x, y: strollDestination.y };
      guest.path = findPath({ x: guest.x, y: guest.y }, strollDestination) || [];
    }
    return;
  }

  if (!target) {
    return;
  }

  const accessPoint = nearestPathTile(target.x + target.width - 1, target.y + target.height - 1);
  if (!accessPoint) {
    return;
  }

  const path = findPath({ x: guest.x, y: guest.y }, accessPoint);
  if (path && path.length >= 2) {
    guest.target = target;
    guest.path = path;
  }
}

function maybeSpawnGuests() {
  if (state.guests.length >= BASE_GUEST_CAP + Math.floor(parkRating() / 12) || state.tick % 280 !== 0) {
    return;
  }

  const amount = 1 + Math.floor(Math.random() * Math.max(1, parkRating() / 25));
  for (let index = 0; index < amount; index += 1) {
    state.guests.push(spawnGuest(`guest-${state.tick}-${index}`));
  }
}

function updateRide(structure) {
  if (structure.type !== "ride") {
    return;
  }

  structure.timer += state.speed;
  if (structure.riders.length && structure.timer >= structure.cycle) {
    structure.timer = 0;
    structure.status = "Open";

    for (const guest of structure.riders) {
      guest.state = "wandering";
      guest.path = [];
      guest.target = null;
      guest.happiness = clamp(guest.happiness + structure.happinessBoost, 0, 100);
      guest.hunger = clamp(guest.hunger + 6, 0, 100);
      guest.hygiene = clamp(guest.hygiene + 4, 0, 100);
    }

    structure.riders = [];
    emitEvent(`${structure.label}完成了一轮运行，游客们看起来很满意。`);
  }

  while (structure.queue.length && structure.riders.length < structure.capacity && structure.status === "Open") {
    const guest = structure.queue.shift();
    guest.state = "riding";
    structure.riders.push(guest);
    structure.status = "Running";
  }
}

function updateGuest(guest) {
  guest.hunger = clamp(guest.hunger + 0.005 * state.speed, 0, 100);
  guest.hygiene = clamp(guest.hygiene + 0.004 * state.speed, 0, 100);
  guest.happiness = clamp(guest.happiness - 0.0025 * state.speed - state.litter * 0.0005, 18, 100);

  if ((guest.path.length <= 1 || !guest.target) && guest.state === "wandering") {
    chooseGuestTarget(guest);
  }

  if (guest.state === "riding" || guest.state === "queuing") {
    return;
  }

  if (guest.path.length > 1) {
    const nextStep = guest.path[1];
    guest.progress += guest.speed * state.speed;

    if (guest.progress >= 1) {
      guest.x = nextStep.x;
      guest.y = nextStep.y;
      guest.path.shift();
      guest.progress = 0;
    }
    return;
  }

  if (guest.target?.kind === "stroll") {
    guest.target = null;
    return;
  }

  if (guest.target?.type === "ride") {
    if (guest.target.queue.length < guest.target.queueCap) {
      guest.target.queue.push(guest);
      guest.state = "queuing";
      state.funds += Math.round(guest.target.fun * 0.5);
      state.revenueWindow.push(guest.target.fun * 0.5);
    } else {
      guest.happiness = clamp(guest.happiness - 3, 0, 100);
      guest.target = null;
    }
    return;
  }

  if (guest.target?.kind === "food") {
    guest.hunger = clamp(guest.hunger - guest.target.hungerFill, 0, 100);
    guest.happiness = clamp(guest.happiness + 8, 0, 100);
    guest.target = null;
    state.funds += 22;
    state.revenueWindow.push(22);
    emitEvent("小吃摊刚刚完成了一笔不错的销售。");
    return;
  }

  if (guest.target?.kind === "restroom") {
    guest.hygiene = clamp(guest.hygiene - guest.target.hygieneBoost, 0, 100);
    guest.happiness = clamp(guest.happiness + 5, 0, 100);
    guest.target = null;
    return;
  }

  guest.target = null;
}

function updateEconomy() {
  if (state.tick % 300 === 0) {
    const upkeep = state.structures.reduce((sum, structure) => sum + (structure.upkeep || 0), 0);
    state.funds -= upkeep;
  }

  if (state.tick % 260 === 0) {
    state.litter = clamp(
      state.litter + 0.4 + state.structures.filter((structure) => structure.type === "ride").length * 0.12 - parkBeauty() * 0.02,
      0,
      18,
    );
  }
}

function simulate() {
  state.tick += 1;
  maybeSpawnGuests();

  for (const structure of state.structures) {
    updateRide(structure);
  }

  for (const guest of state.guests) {
    updateGuest(guest);
  }

  if (state.tick % 420 === 0 && state.guests.length) {
    const positive = state.guests.filter((guest) => guest.happiness > 70).length;
    const negative = state.guests.filter((guest) => guest.happiness < 45).length;

    if (positive > negative) {
      emitEvent("游客们正在称赞乐园的氛围和布局。");
    } else if (negative > positive) {
      emitEvent("游客开始有些不耐烦了，试着增加餐饮、道路或景观。");
    }
  }

  updateEconomy();
  while (state.revenueWindow.length > 60) {
    state.revenueWindow.shift();
  }
}

function structureAt(x, y) {
  if (!isInsideGrid(x, y)) {
    return null;
  }
  return grid[y][x].occupant;
}

function drawGuests() {
  for (const guest of state.guests) {
    let drawX = guest.x;
    let drawY = guest.y;

    if (guest.path.length > 1) {
      const next = guest.path[1];
      drawX = guest.x + (next.x - guest.x) * guest.progress;
      drawY = guest.y + (next.y - guest.y) * guest.progress;
    }

    const screen = isoToScreen(drawX, drawY);
    const radius = 7 * state.camera.zoom;
    ctx.fillStyle = guest.color;
    ctx.beginPath();
    ctx.arc(screen.x, screen.y + TILE_HEIGHT * state.camera.zoom * 0.54, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(22, 31, 27, 0.6)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function updateMetrics() {
  const averageHappiness = state.guests.length
    ? Math.round(state.guests.reduce((sum, guest) => sum + guest.happiness, 0) / state.guests.length)
    : 72;
  const cleanliness = clamp(Math.round(100 - state.litter * 6), 0, 100);
  const totalQueue = state.structures.reduce((sum, structure) => sum + structure.queue.length, 0);
  const revenue = state.revenueWindow.reduce((sum, amount) => sum + amount, 0);

  dom.funds.textContent = `$${Math.round(state.funds)}`;
  dom.guests.textContent = String(state.guests.length);
  dom.happiness.textContent = `${averageHappiness}%`;
  dom.cleanliness.textContent = `${cleanliness}%`;
  dom.rating.textContent = String(parkRating());
  dom.queue.textContent = String(totalQueue);
  dom.revenue.textContent = `$${Math.round(revenue)}`;
  dom.litter.textContent = state.litter.toFixed(1);
  dom.rides.textContent = String(state.structures.filter((structure) => structure.type === "ride").length);

  dom.eventFeed.innerHTML = state.events.map((entry) => `<li>${entry.message}</li>`).join("");
  dom.rideStatus.innerHTML = state.structures
    .filter((structure) => structure.type === "ride")
    .map(
      (structure) => `
        <li>
          <span>${structure.label}</span>
          <strong>${statusLabels[structure.status] || structure.status}</strong>
          <small>${structure.queue.length} 人排队</small>
        </li>
      `,
    )
    .join("");

  if (!dom.rideStatus.innerHTML) {
    dom.rideStatus.innerHTML = "<li><span>还没有游乐设施</span><small>先建一项设施，把游客吸引进来。</small></li>";
  }
}

function updateHoverCard() {
  const hovered = state.hoveredTile;
  if (!hovered || !isInsideGrid(hovered.x, hovered.y)) {
    dom.hoverCard.classList.add("hidden");
    return;
  }

  const tile = grid[hovered.y][hovered.x];
  const structure = structureAt(hovered.x, hovered.y);
  dom.hoverCard.classList.remove("hidden");
  dom.hoverCard.style.left = `${state.mouse.x + 18}px`;
  dom.hoverCard.style.top = `${state.mouse.y + 18}px`;

  if (structure) {
    dom.hoverCard.innerHTML = `
      <strong>${structure.label}</strong>
      <span>${typeLabels[structure.type] || structure.type}</span>
      <small>${structure.queue.length} 人排队，${statusLabels[structure.status] || statusLabels.Ready}</small>
    `;
    return;
  }

  const toolLabel = tools.find((tool) => tool.key === state.selectedTool)?.label || state.selectedTool;
  dom.hoverCard.innerHTML = `
    <strong>${terrainMeta[tile.ground].name}</strong>
    <span>地块 ${hovered.x}, ${hovered.y}</span>
    <small>当前工具：${toolLabel}</small>
  `;
}

function render() {
  resizeCanvas();
  ctx.clearRect(0, 0, dom.canvas.width, dom.canvas.height);
  ctx.fillStyle = "#d9f1ff";
  ctx.fillRect(0, 0, dom.canvas.width, dom.canvas.height);

  const overlay = ctx.createLinearGradient(0, 0, 0, dom.canvas.height);
  overlay.addColorStop(0, "rgba(255, 255, 255, 0.45)");
  overlay.addColorStop(1, "rgba(255, 212, 167, 0.18)");
  ctx.fillStyle = overlay;
  ctx.fillRect(0, 0, dom.canvas.width, dom.canvas.height);

  for (let y = 0; y < GRID_ROWS; y += 1) {
    for (let x = 0; x < GRID_COLS; x += 1) {
      const highlighted = state.hoveredTile && state.hoveredTile.x === x && state.hoveredTile.y === y;
      drawTile(x, y, highlighted);
    }
  }

  drawEntryGate();
  state.structures
    .slice()
    .sort((left, right) => left.x + left.y - (right.x + right.y))
    .forEach(drawStructure);
  drawGuests();
  updateHoverCard();
}

function pointerPosition(event) {
  const bounds = dom.canvas.getBoundingClientRect();
  return {
    x: event.clientX - bounds.left,
    y: event.clientY - bounds.top,
  };
}

function wireEvents() {
  dom.clearSelection.addEventListener("click", () => {
    state.selectedTool = "path";
    syncToolSelection();
  });

  dom.speedButton.addEventListener("click", () => {
    state.speed = state.speed === 1 ? 2 : state.speed === 2 ? 3 : 1;
    dom.speedButton.textContent = `速度 x${state.speed}`;
  });

  dom.canvas.addEventListener("contextmenu", (event) => event.preventDefault());

  dom.canvas.addEventListener("pointerdown", (event) => {
    const pointer = pointerPosition(event);
    const tile = screenToIso(pointer.x, pointer.y);
    state.mouse = pointer;

    if (event.button === 2) {
      state.panning = true;
      dom.canvas.dataset.panOriginX = String(event.clientX);
      dom.canvas.dataset.panOriginY = String(event.clientY);
      dom.canvas.dataset.cameraX = String(state.camera.x);
      dom.canvas.dataset.cameraY = String(state.camera.y);
      return;
    }

    state.dragPlacement = true;
    applyTool(tile.x, tile.y);
  });

  window.addEventListener("pointerup", () => {
    state.dragPlacement = false;
    state.panning = false;
  });

  dom.canvas.addEventListener("pointermove", (event) => {
    const pointer = pointerPosition(event);
    state.mouse = pointer;
    state.hoveredTile = screenToIso(pointer.x, pointer.y);

    if (state.dragPlacement && state.selectedTool === "path") {
      applyTool(state.hoveredTile.x, state.hoveredTile.y);
    }

    if (!state.panning) {
      return;
    }

    const startX = Number(dom.canvas.dataset.panOriginX || 0);
    const startY = Number(dom.canvas.dataset.panOriginY || 0);
    const cameraX = Number(dom.canvas.dataset.cameraX || state.camera.x);
    const cameraY = Number(dom.canvas.dataset.cameraY || state.camera.y);

    state.camera.x = cameraX + (event.clientX - startX);
    state.camera.y = cameraY + (event.clientY - startY);
    constrainCamera();
  });

  dom.canvas.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();
      state.camera.zoom = clamp(state.camera.zoom - event.deltaY * 0.0007, MIN_ZOOM, MAX_ZOOM);
      constrainCamera();
    },
    { passive: false },
  );

  window.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    if (event.key === "ArrowLeft" || key === "a") {
      state.camera.x += 26;
    }
    if (event.key === "ArrowRight" || key === "d") {
      state.camera.x -= 26;
    }
    if (event.key === "ArrowUp" || key === "w") {
      state.camera.y += 13;
    }
    if (event.key === "ArrowDown" || key === "s") {
      state.camera.y -= 13;
    }
    constrainCamera();
  });
}

function seedPark() {
  emitEvent("清晨客流到了，第一批游客已经在大门外等待入园。");

  for (let x = entryGate.x - 1; x <= entryGate.x + 5; x += 1) {
    paintPath(x, entryGate.y);
  }
  for (let y = entryGate.y - 1; y >= entryGate.y - 5; y -= 1) {
    paintPath(entryGate.x + 2, y);
  }
  for (let x = entryGate.x + 1; x <= entryGate.x + 6; x += 1) {
    paintPath(x, entryGate.y - 3);
  }
  for (let y = entryGate.y - 5; y >= entryGate.y - 8; y -= 1) {
    paintPath(entryGate.x + 4, y);
  }

  placeStructure("carousel", 12, 16);
  placeStructure("food", 15, 17);
  placeStructure("restroom", 15, 20);
  placeStructure("tree", 10, 20);
  placeStructure("fountain", 14, 14);
  placeStructure("flower", 16, 19);

  for (let index = 0; index < 8; index += 1) {
    state.guests.push(spawnGuest(`seed-${index}`));
  }
}

function frame() {
  simulate();
  updateMetrics();
  render();
  requestAnimationFrame(frame);
}

async function init() {
  buildToolPalette();
  wireEvents();
  syncToolSelection();
  await loadAssets();
  if (images.uiHero) {
    dom.heroArt.src = images.uiHero.src;
  }
  seedPark();
  resizeCanvas();
  updateMetrics();
  render();
  frame();
}

init();
