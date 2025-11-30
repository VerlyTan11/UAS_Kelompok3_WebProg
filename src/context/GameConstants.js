// src/context/GameConstants.js

export const initialStats = {
    meal: 50,
    sleep: 50,
    happiness: 50,
    cleanliness: 50,
    money: 250000,
};

export const initialItems = [
    { name: 'Pegasus', icon: '🐎', isEquipped: false },
    { name: 'Broken Apple', icon: '🍎', isEquipped: false },
    { name: 'Baby', icon: '👶', isEquipped: false },
];

export const gameAreas = {
    Home: { next: 'Beach' },
    Beach: { next: 'Temple', specificArea: true },
    Temple: { next: 'Mountain' },
    Lake: { next: 'Home' },
    Mountain: { next: 'Lake' },
};

export const beachAreas = {
    'Sands Area': { activities: ['PLAY SANDS', 'SUNBATHING', 'SIGHTSEEING'] },
    'Shop Area': { activities: ['BUY COCONUT', 'BUY SOUVENIR'] },
    'Sea Area': { activities: ['SWIMMING', 'FISHING'] },
};