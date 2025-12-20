export const initialStats = {
  meal: 50,
  sleep: 50,
  happiness: 50,
  cleanliness: 50,
  money: 50000,
  fuel: 100,
  lifeSatisfaction: 50,
};

export const initialItems = [
  {
    id: "fishing_rod",
    name: "Fishing Rod",
    icon: "🎣",
    usable: true,
    inInventory: false,
    type: "tool", // <--- kalau tool: repeat use
    effect: { meal: 10 },
    onlyUsableIn: "Lake",
  },
  {
    id: "shell",
    name: "Sea Shell",
    icon: "🐚",
    usable: false,
    inInventory: false,
    type: "collectible", // <--- tidak pernah dipakai
  },
];

// Area connections for movement
export const gameAreas = {
  Castle: {
    up: "Cave",
    down: "Cave",
    left: "Mercusuar",
    right: "Mercusuar",
    bg: "map.jpg",
    specificArea: "CastleArea",
    icon: "castle.png",
  }, //
  Cave: {
    up: "Castle",
    down: "Castle",
    left: "Island",
    right: "Island",
    bg: "map.jpg",
    specificArea: "CaveArea",
    icon: "cave.png",
  }, //
  Mercusuar: {
    up: "Island",
    down: "Island",
    left: "Castle",
    right: "Castle",
    bg: "map.jpg",
    specificArea: "MercusuarArea",
    icon: "lighthouse.png",
  }, //
  Island: {
    up: "Mercusuar",
    down: "Mercusuar",
    left: "Cave",
    right: "Cave",
    bg: "map.jpg",
    specificArea: "IslandArea",
    icon: "treasure.png",
  }, //
};

export const activityDefinitions = {
  // --- CASTLE (TOWN & SUPERMARKET) ---
  "Town - STROLL AROUND": {
    duration: 3,
    statChanges: { happiness: 15, fuel: -5 },
    message: "Berjalan-jalan di pelabuhan bajak laut...",
    animation: "🚶",
    type: "activity",
    requiredItems: [],
  },

  "Town - TRADE GOODS": {
    duration: 2,
    statChanges: { money: 15000, sleep: -5 },
    message: "Berdagang hasil jarahan dengan penduduk lokal...",
    animation: "🤝",
    type: "activity",
    requiredItems: [],
  },

  "Supermarket - BUY FISHING NET": {
    duration: 1,
    statChanges: { money: -5000 },
    message: "Membeli jaring ikan baru...",
    type: "purchase",
    requiredItems: [],
    itemAcquired: {
      id: "net",
      name: "Fishing Net",
      icon: "🕸️",
      type: "tool",
      inInventory: true,
    },
    animation: "💰",
  },

  "Supermarket - BUY SURFBOARD": {
    duration: 1,
    statChanges: { money: -15000 },
    message: "Membeli papan selancar kayu...",
    type: "purchase",
    requiredItems: [],
    itemAcquired: {
      id: "surfboard",
      name: "Surfboard",
      icon: "🏄",
      type: "tool",
      inInventory: true,
    },
    animation: "💰",
  },

  "Supermarket - BUY RICE": {
    duration: 1,
    statChanges: { money: -2000 },
    message: "Membeli persediaan beras...",
    type: "purchase",
    requiredItems: [],
    itemAcquired: {
      id: "rice",
      name: "Rice",
      icon: "🍚",
      type: "consumable",
      effect: { meal: 30 },
      inInventory: true,
    },
    animation: "💰",
  },

  "ThroneRoom - MEET KING": {
    duration: 3,
    statChanges: {
      happiness: 10,
      lifeSatisfaction: 15,
    },
    message: "Menghadap Raja Bajak Laut di singgasana...",
    animation: "👑",
    type: "activity",
  },

  "ThroneRoom - REST": {
    duration: 4,
    statChanges: { sleep: 40, happiness: 5 },
    message: "Beristirahat sejenak di kursi tamu kerajaan...",
    animation: "😴",
    type: "activity",
  },

  // --- CAVE ---
  "Tunnel - EXPLORE CAVE": {
    duration: 5,
    statChanges: { happiness: 10, fuel: -10, sleep: -10 },
    message: "Menjelajahi lorong gua yang gelap...",
    animation: "🔦",
    type: "activity",
  },
  "Tunnel - DECODE WALL": {
    duration: 4,
    statChanges: { lifeSatisfaction: 5, sleep: -10 },
    message: "Membaca simbol kuno di dinding gua...",
    animation: "📜",
    type: "activity",
  },

  // --- MERCUSUAR ---
  "Refuel - FILL FUEL": {
    duration: 2,
    statChanges: { money: -10000, fuel: 50 },
    message: "Mengisi ulang bahan bakar kapal...",
    animation: "⛽",
    type: "activity",
    requiredItems: [],
  },

  "Refuel - CLEAN SHIP": {
    duration: 3,
    statChanges: { cleanliness: 40, happiness: 5 },
    message: "Membersihkan dek kapal dari kerang...",
    animation: "🧹",
    type: "activity",
    requiredItems: [],
  },

  "Top - OBSERVE SEA": {
    duration: 2,
    statChanges: { happiness: 10, lifeSatisfaction: 5 },
    message: "Melihat samudera luas dari puncak mercusuar...",
    animation: "🔭",
    type: "activity",
  },

  // --- ISLAND (BEACH & Jungle) ---
  "Beach - SURFING": {
    duration: 4,
    statChanges: { happiness: 25, fuel: -5 },
    message: "Menaklukan ombak besar!",
    requiredItems: ["surfboard"],
    animation: "🌊",
    type: "activity",
  },

  "Beach - FISHING": {
    duration: 5,
    statChanges: { meal: 20, money: 2000 },
    message: "Memancing ikan di tepi pantai...",
    requiredItems: ["net"],
    animation: "🎣",
    type: "activity",
  },

  "Beach - FIND BOTTLE": {
    duration: 2,
    statChanges: { happiness: 10 },
    message: "Mencari botol hanyut di pesisir...",
    animation: "🍾",
    type: "activity",
    requiredItems: [],
  },

  "Beach - EXPLORE BEACH": {
    duration: 4,
    statChanges: { happiness: 20, fuel: -5 },
    message: "Menjelajahi pantai berpasir putih...",
    animation: "🏖️",
    type: "activity",
  },
  "Beach - COLLECT SHELL": {
    duration: 1,
    statChanges: { happiness: 5 },
    message: "Mencari kerang cantik di pasir...",
    animation: "🐚",
    type: "activity",
  },

  "Jungle - EXPLORE JUNGLE": {
    duration: 6,
    statChanges: {
      happiness: 30,
      money: 50000,
      lifeSatisfaction: 20,
    },
    message: "Menjelajahi rimba pulau dan menemukan harta karun!",
    animation: "🌴",
    type: "activity",
  },

  "Jungle - REST IN HAMMOCK": {
    duration: 4,
    statChanges: { sleep: 40, happiness: 10 },
    message: "Tidur sejenak di bawah pohon kelapa...",
    animation: "😴",
    type: "activity",
    requiredItems: [],
  },
};

// Struktur Area Spesifik (dengan koneksi arah baru untuk navigasi keyboard/panah)
export const gameSpecificAreas = {
  IslandArea: {
    name: "Island",
    bg: "island.jpg",
    locations: {
      Beach: {
        activities: [
          "SURFING",
          "FISHING",
          "FIND BOTTLE",
          "EXPLORE BEACH",
          "COLLECT SHELL",
        ],
        items: ["shell"],
        right: "Jungle",
        down: "Exit",
      },
      Jungle: {
        activities: ["EXPLORE JUNGLE", "REST IN HAMMOCK"],
        left: "Beach",
        down: "Exit",
      },
      Exit: {
        activities: ["GO BACK"],
        up: "Beach",
        right: "Jungle",
      },
    },
  },

  CaveArea: {
    name: "Cave",
    bg: "cave.jpg",
    locations: {
      Tunnel: {
        activities: ["EXPLORE CAVE", "DECODE WALL"],
        down: "Exit",
      },
      Exit: {
        activities: ["GO BACK"],
        up: "Tunnel",
      },
    },
  },

  CastleArea: {
    name: "Castle",
    bg: "castle.jpg",
    locations: {
      Town: {
        activities: ["STROLL AROUND", "TRADE GOODS"],
        right: "Supermarket",
        down: "Exit",
      },
      Supermarket: {
        activities: ["BUY FISHING NET", "BUY SURFBOARD", "BUY RICE"],
        left: "Town",
        right: "ThroneRoom",
        down: "Exit",
      },
      ThroneRoom: {
        activities: ["MEET KING", "REST"],
        left: "Supermarket",
        down: "Exit",
      },
      Exit: {
        activities: ["GO BACK"],
        up: "Supermarket",
        left: "Town",
        right: "ThroneRoom",
      },
    },
  },

  MercusuarArea: {
    name: "Mercusuar",
    bg: "lighthouse.jpg",
    locations: {
      Refuel: {
        activities: ["FILL FUEL", "CLEAN SHIP"],
        right: "Top",
        down: "Exit",
      },
      Top: {
        activities: ["OBSERVE SEA"],
        left: "Refuel",
        down: "Exit",
      },
      Exit: {
        activities: ["GO BACK"],
        up: "Top",
        left: "Refuel",
      },
    },
  },
};

// Helper to get next area name based on direction
export const getNextArea = (currentArea, direction) => {
  const areaData = gameAreas[currentArea];
  if (areaData && areaData[direction]) {
    return areaData[direction];
  }
  return null;
};

export const scoreMultipliers = {
  statBalanceWeight: 0.4,
  activitiesPerformedWeight: 0.3,
  itemsCollectedWeight: 0.1,
  areasVisitedWeight: 0.2,
};
