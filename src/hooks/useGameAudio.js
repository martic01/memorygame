// hooks/useGameAudio.js
import { useCallback, useRef, useEffect } from 'react';

// Constants
const EASY_MODE_DURATION = 30000; // 30 seconds in milliseconds

export const useGameAudio = (
  isMuted,
  selectedMode,
  currentMusicIndex,
  setCurrentMusicIndex,
  gameStarted,
  gameOver,
  gameWon
) => {
  const audioContextRef = useRef(null);
  const backgroundMusicRef = useRef(null);
  const soundEffectsRef = useRef({});
  const audioInitializedRef = useRef(false);
  const easyModeTimeoutRef = useRef(null);
  const onVictoryRef = useRef(null);

  // Allow setting the victory callback
  const setVictoryCallback = useCallback((callback) => {
    onVictoryRef.current = callback;
  }, []);

  const initializeAudio = useCallback(() => {
    if (!audioInitializedRef.current && audioContextRef.current) {
      audioContextRef.current.resume().then(() => {
        audioInitializedRef.current = true;
      }).catch(() => { });
    }
  }, []);

  const loadSoundEffects = useCallback(() => {
    const soundFiles = {
      '1': '/sounds/red.mp3', '2': '/sounds/blue.mp3', '3': '/sounds/green.mp3',
      '4': '/sounds/black.mp3', 'cheer': '/sounds/cheer.mp3',
      'gameover': '/sounds/gameover.mp3', 'victory': '/sounds/victory.mp3'
    };
    Object.entries(soundFiles).forEach(([key, path]) => {
      const audio = new Audio(path);
      audio.preload = 'auto';
      soundEffectsRef.current[key] = audio;
    });
  }, []);

  const playSound = useCallback((soundId) => {
    if (isMuted) return;
    const sound = soundEffectsRef.current[soundId];
    if (sound) {
      const c = sound.cloneNode();
      c.volume = 0.5;
      c.play().catch(() => { });
    }
  }, [isMuted]);

  const stopBackgroundMusic = useCallback(() => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.pause();
      backgroundMusicRef.current = null;
    }
    if (easyModeTimeoutRef.current) {
      clearTimeout(easyModeTimeoutRef.current);
      easyModeTimeoutRef.current = null;
    }
  }, []);

  const startBackgroundMusic = useCallback(() => {
    if (isMuted || !selectedMode) return;
    initializeAudio();
    
    import('../constants/modeMusic').then(({ modeMusic }) => {
      const mode = modeMusic[selectedMode];
      if (!mode) return;
      
      if (backgroundMusicRef.current) backgroundMusicRef.current.pause();
      
      if (easyModeTimeoutRef.current) {
        clearTimeout(easyModeTimeoutRef.current);
        easyModeTimeoutRef.current = null;
      }
      
      const safeIndex = Math.min(currentMusicIndex, mode.music.length - 1);
      if (safeIndex !== currentMusicIndex) setCurrentMusicIndex(safeIndex);
      const musicFile = mode.music[safeIndex];
      
      try {
        const bgMusic = new Audio(musicFile);
        bgMusic.loop = mode.loop;
        bgMusic.volume = 0.3;
        
        if (selectedMode === 'easy') {
          const musicTimeout = setTimeout(() => {
            if (backgroundMusicRef.current) {
              backgroundMusicRef.current.pause();
              backgroundMusicRef.current.currentTime = 0;
              if (onVictoryRef.current) onVictoryRef.current();
            }
            easyModeTimeoutRef.current = null;
          }, EASY_MODE_DURATION);
          
          easyModeTimeoutRef.current = musicTimeout;
          
          bgMusic.addEventListener('ended', () => {
            if (easyModeTimeoutRef.current) {
              clearTimeout(easyModeTimeoutRef.current);
              easyModeTimeoutRef.current = null;
            }
            if (!mode.loop && onVictoryRef.current) onVictoryRef.current();
          });
        } else {
          bgMusic.onended = () => {
            if (!mode.loop && onVictoryRef.current) onVictoryRef.current();
          };
        }
        
        bgMusic.onerror = () => { };
        backgroundMusicRef.current = bgMusic;
        backgroundMusicRef.current.play().catch(() => { });
      } catch { }
    });
  }, [isMuted, selectedMode, currentMusicIndex, setCurrentMusicIndex, initializeAudio]);

  // Initialize audio context on mount
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    loadSoundEffects();
    
    return () => {
      if (backgroundMusicRef.current) backgroundMusicRef.current.pause();
      if (audioContextRef.current) audioContextRef.current.close();
      if (easyModeTimeoutRef.current) clearTimeout(easyModeTimeoutRef.current);
    };
  }, [loadSoundEffects]);

  return {
    audioContextRef,
    backgroundMusicRef,
    soundEffectsRef,
    audioInitializedRef,
    easyModeTimeoutRef,
    initializeAudio,
    loadSoundEffects,
    playSound,
    stopBackgroundMusic,
    startBackgroundMusic,
    setVictoryCallback,
  };
};