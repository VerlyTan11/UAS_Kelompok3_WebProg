// src/context/GameConstants.js

export const initialStats = {
  meal: 50,
  sleep: 50,
  happiness: 50,
  cleanliness: 50,
  money: 250000,
  lifeSatisfaction: 50, // New stat for scoring preview
};

export const initialItems = [
  {
    id: "pegasus",
    name: "Pegasus",
    icon: "🐎",
    isEquipped: false,
    inInventory: true,
    type: "consumable",
    effect: { happiness: 10, cleanliness: -5 },
    usable: true,
  },
  {
    id: "broken_apple",
    name: "Broken Apple",
    icon: "🍎",
    isEquipped: false,
    inInventory: true,
    type: "consumable",
    effect: { meal: 15, sleep: -5 },
    usable: true,
  },
  {
    id: "baby",
    name: "Baby",
    icon: "👶",
    isEquipped: false,
    inInventory: true,
    type: "permanent",
    effect: { happiness: 5, money: -1000 },
    usable: false,
  },
  {
    id: "surfboard",
    name: "Surfboard",
    icon: "🏄",
    isEquipped: false,
    inInventory: false,
    type: "gear",
    effect: {},
    usable: false,
  },
];

// Area connections for movement
export const gameAreas = {
  Home: {
    up: "Temple",
    down: "Lake",
    left: "Mountain",
    right: "Beach",
    bg: "home.jpg",
    specificArea: "HomeArea",
  },
  Beach: {
    up: "Temple",
    down: "Lake",
    left: "Home",
    right: "Mountain",
    bg: "beach.jpg",
    specificArea: "BeachArea",
  },
  Temple: {
    up: "Mountain",
    down: "Home",
    left: "Lake",
    right: "Beach",
    bg: "temple.jpg",
    specificArea: "TempleArea",
  },
  Lake: {
    up: "Beach",
    down: "Mountain",
    left: "Home",
    right: "Temple",
    bg: "lake.jpg",
    specificArea: "LakeArea",
  },
  Mountain: {
    up: "Temple",
    down: "Lake",
    left: "Beach",
    right: "Home",
    bg: "mount.jpg",
    specificArea: "MountainArea",
  },
};

// Definisi semua aktivitas di semua area spesifik
export const activityDefinitions = {
  // Beach Activities
  "Sands Area - PLAY SANDS": {
    duration: 3,
    statChanges: { happiness: 20, cleanliness: -10, lifeSatisfaction: 5 },
    message: "Playing in the sands... fun!",
    requiredItems: [],
    animation: "🏖️",
    type: "activity",
  },
  "Sands Area - SUNBATHING": {
    duration: 5,
    statChanges: {
      sleep: 15,
      happiness: 5,
      cleanliness: -5,
      lifeSatisfaction: 2,
    },
    message: "Basking in the sun...",
    requiredItems: [],
    animation: "☀️",
    type: "activity",
  },
  "Sands Area - SIGHTSEEING": {
    duration: 2,
    statChanges: { happiness: 10, meal: -5, lifeSatisfaction: 1 },
    message: "Enjoying the view...",
    requiredItems: [],
    animation: "👀",
    type: "activity",
  },
  "Shop Area - BUY COCONUT": {
    duration: 1,
    statChanges: { meal: 10, money: -5000 },
    message: "Buying a fresh coconut...",
    requiredItems: [],
    type: "purchase",
    itemAcquired: null,
    animation: "🥥",
  },
  "Shop Area - BUY SOUVENIR": {
    duration: 2,
    statChanges: { happiness: 5, money: -15000, lifeSatisfaction: 2 },
    message: "Buying a souvenir...",
    requiredItems: [],
    type: "purchase",
    itemAcquired: null,
    animation: "🛍️",
  },
  "Shop Area - BUY SURFBOARD": {
    duration: 1,
    statChanges: { money: -50000, lifeSatisfaction: 5 },
    message: "Buying a new surfboard...",
    requiredItems: [],
    type: "purchase",
    itemAcquired: {
      id: "surfboard",
      name: "Surfboard",
      icon: "🏄",
      isEquipped: false,
      inInventory: true,
      type: "gear",
      effect: {},
      usable: true,
    },
    animation: "💸",
  },
  "Sea Area - SWIMMING": {
    duration: 4,
    statChanges: { cleanliness: 20, sleep: -10, lifeSatisfaction: 5 },
    message: "Swimming in the refreshing water...",
    requiredItems: [],
    animation: "🏊",
    type: "activity",
  },
  "Sea Area - SURFING": {
    duration: 6,
    statChanges: { happiness: 30, sleep: -10, meal: -5, lifeSatisfaction: 10 },
    message: "Riding the waves!",
    requiredItems: ["surfboard"],
    animation: "🌊",
    type: "activity",
  },
  // Home Activities
  "Kitchen - EAT": {
    duration: 2,
    statChanges: { meal: 50, money: -1000 },
    message: "Eating a hearty meal...",
    requiredItems: [],
    animation: "🍽️",
    type: "activity",
  },
  "Bedroom - SLEEP": {
    duration: 5,
    statChanges: { sleep: 50, cleanliness: -10 },
    message: "Getting some rest...",
    requiredItems: [],
    animation: "😴",
    type: "activity",
  },
  "Bathroom - CLEAN UP": {
    duration: 3,
    statChanges: { cleanliness: 50 },
    message: "Cleaning up...",
    requiredItems: [],
    animation: "🧼",
    type: "activity",
  },
  // Other Areas
  "Praying Area - MEDITATE": {
    duration: 8,
    statChanges: { happiness: 20, sleep: 10, meal: -10, lifeSatisfaction: 15 },
    message: "Meditating in the silent temple...",
    requiredItems: [],
    animation: "🧘",
    type: "activity",
  },
  "Fishing Spot - FISHING": {
    duration: 5,
    statChanges: { meal: 20, happiness: 5, cleanliness: -5 },
    message: "Fishing in the quiet lake...",
    requiredItems: [],
    animation: "🎣",
    type: "activity",
  },
  "Trailhead - HIKING": {
    duration: 10,
    statChanges: {
      sleep: -20,
      meal: -20,
      happiness: 40,
      cleanliness: -10,
      lifeSatisfaction: 20,
    },
    message: "Hiking to the mountain top!",
    requiredItems: [],
    animation: "⛰️",
    type: "activity",
  },
};

// Struktur Area Spesifik (dengan koneksi arah baru untuk navigasi keyboard/panah)
export const gameSpecificAreas = {
  BeachArea: {
    name: "Beach",
    bg: "beach.jpg",
    locations: {
      "Sands Area": {
        activities: ["PLAY SANDS", "SUNBATHING", "SIGHTSEEING"],
        right: "Hotel",
        down: "Shop Area",
        up: "Exit", // Move to exit area
      },
      "Shop Area": {
        activities: ["BUY COCONUT", "BUY SOUVENIR", "BUY SURFBOARD"],
        up: "Sands Area",
        right: "Sea Area",
        left: "Exit",
      },
      "Sea Area": {
        activities: ["SWIMMING", "SURFING"],
        left: "Shop Area",
        up: "Hotel",
        down: "Exit",
      },
      "Hotel": {
        activities: ["CHECK-IN"],
        left: "Sands Area",
        down: "Sea Area",
        right: "Exit",
      },
      Exit: {
        activities: ["GO BACK"],
        up: "Sands Area",
        down: "Sea Area",
        left: "Shop Area",
        right: "Hotel",
      },
    },
  },
  HomeArea: {
    name: "Home",
    bg: "home.jpg",
    locations: {
      Kitchen: { activities: ["EAT"], right: "Bedroom", down: "Bathroom" },
      Bedroom: {
        activities: ["SLEEP"],
        left: "Kitchen",
        down: "Bathroom",
        up: "Exit",
      },
      Bathroom: {
        activities: ["CLEAN UP"],
        up: "Kitchen",
        right: "Bedroom",
        left: "Exit",
      },
      Exit: {
        activities: ["GO BACK"],
        up: "Kitchen",
        right: "Bathroom",
        down: "Bedroom",
        left: "Bedroom",
      }, // Can exit from any direction back to a room
    },
  },
  TempleArea: {
    name: "Temple",
    bg: "temple.jpg",
    locations: {
      "Praying Area": {
        activities: ["MEDITATE"],
        down: "Exit",
        up: "Exit",
        left: "Exit",
        right: "Exit",
      },
      Exit: {
        activities: ["GO BACK"],
        up: "Praying Area",
        down: "Praying Area",
        left: "Praying Area",
        right: "Praying Area",
      },
    },
  },
  LakeArea: {
    name: "Lake",
    bg: "lake.jpg",
    locations: {
      "Fishing Spot": {
        activities: ["FISHING"],
        down: "Exit",
        up: "Exit",
        left: "Exit",
        right: "Exit",
      },
      Exit: {
        activities: ["GO BACK"],
        up: "Fishing Spot",
        down: "Fishing Spot",
        left: "Fishing Spot",
        right: "Fishing Spot",
      },
    },
  },
  MountainArea: {
    name: "Mountain",
    bg: "mount.jpg",
    locations: {
      Trailhead: {
        activities: ["HIKING"],
        down: "Exit",
        up: "Exit",
        left: "Exit",
        right: "Exit",
      },
      Exit: {
        activities: ["GO BACK"],
        up: "Trailhead",
        down: "Trailhead",
        left: "Trailhead",
        right: "Trailhead",
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
