import quickGameMusic from '../assets/sounds/first.mp3';
import alan3 from "../assets/sounds/alan-3.mp3"
import alaned3 from "../assets/sounds/alaned-3.mp3"
import alanedr3 from "../assets/sounds/alanedr-3.mp3"
import alaner4 from "../assets/sounds/alaner-4.mp3"
import alanha2 from "../assets/sounds/alanha-2.mp3"
import alansh4 from "../assets/sounds/alansh-4.mp3"
import alant3 from "../assets/sounds/alant-3.mp3"
import alanw2 from "../assets/sounds/alanw-2.mp3"
import alanzx1 from "../assets/sounds/alanzx-1.mp3"

export const modeMusic = {
  quickgame: {
    icon: '⚡',
    name: 'Quick Game',
    music: [quickGameMusic,alanzx1, alanw2, alanha2, alaned3, alan3,alanedr3, alant3,alaner4, alansh4],
    theme: 'border-blue-400',
    loop: true
  },
  easy: {
    icon: '😎',
    name: 'Easy Mode',
    music: [alanzx1, alanw2, alanha2, alaned3, alan3],
    theme: 'border-green-400',
    loop: false
  },
  hard: {
    icon: '😇',
    name: 'Hard Mode',
    music: [alanha2,alanedr3, alant3,alaned3, alan3],
    theme: 'border-orange-500 shadow-lg shadow-orange-500/50',
    loop: false
  },
  king: {
    icon: '👑',
    name: 'King Mode',
    music: [alaner4, alansh4],
    theme: 'border-yellow-400 shadow-[0_0_30px_rgba(255,215,0,0.8)]',
    loop: false,
    specialBadge: true
  }
};