import { useState, useEffect, useCallback, useRef } from 'react';
import { modeMusic } from '../constants/modeMusic';
import { colors } from '../constants/colors';
import NameScreen from '../components/NameScreen';
import LeftColumn from '../components/LeftColumn';
import RightColumn from '../components/RightColumn';
import GameBoard from '../components/GameBoard';
import { WarningModal, VictoryModal, ResumeModal, GameOverModal, FailureModal } from '../components/Modals';
import MobileFloatingButtons from '../components/MobileFloatingButtons';

// Mode durations - only for timed modes
const MODE_DURATIONS = {
  easy: 40000, // 40 seconds
  hard: 70000, // 70 seconds
  // king mode uses full song length - no timeout
  // quick game loops forever - no timeout
};

const SCORE_THRESHOLDS = {
  easy: 5,
  hard: 10,
  king: 15
};

const SimonGame = () => {
  const [playerName, setPlayerName] = useState('');
  const [isNameSubmitted, setIsNameSubmitted] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gameFailed, setGameFailed] = useState(false);
  const [randomArray, setRandomArray] = useState([]);
  const [userSelectionArray, setUserSelectionArray] = useState([]);
  const [activeColor, setActiveColor] = useState(null);
  const [players, setPlayers] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [savedGameState, setSavedGameState] = useState(null);
  const [selectedMode, setSelectedMode] = useState('quickgame');
  const [currentMusicIndex, setCurrentMusicIndex] = useState(0);
  const [warningCount, setWarningCount] = useState(0);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [inactivitySeconds, setInactivitySeconds] = useState(20);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState(false);
  const [kingBadge, setKingBadge] = useState(false);
  const [showLeftOverlay, setShowLeftOverlay] = useState(false);
  const [showRightOverlay, setShowRightOverlay] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  
  // score is tracked only via ref to avoid stale closure bugs
  const scoreRef = useRef(0);
  const [scoreDisplay, setScoreDisplay] = useState(0); // for UI only

  const timeoutRef = useRef(null);
  const timeoutsRef = useRef([]);
  const hasResumedRef = useRef(false);
  const inactivityIntervalRef = useRef(null);
  const currentMusicIndexRef = useRef(0);
  const audioContextRef = useRef(null);
  const backgroundMusicRef = useRef(null);
  const soundEffectsRef = useRef({});
  const audioInitializedRef = useRef(false);
  const modeTimeoutRef = useRef(null);
  const fadeIntervalRef = useRef(null);
  
  // Keep live refs for values used inside timers/closures
  const selectedModeRef = useRef(selectedMode);
  const playerNameRef = useRef(playerName);
  const gameStartedRef = useRef(false);
  const gameActiveRef = useRef(false);
  const gameOverRef = useRef(false);
  const gameWonRef = useRef(false);
  const gameFailedRef = useRef(false);
  const warningCountRef = useRef(0);
  const isProcessingInactivityRef = useRef(false);

  useEffect(() => { selectedModeRef.current = selectedMode; }, [selectedMode]);
  useEffect(() => { playerNameRef.current = playerName; }, [playerName]);
  useEffect(() => { gameStartedRef.current = gameStarted; }, [gameStarted]);
  useEffect(() => { gameActiveRef.current = gameActive; }, [gameActive]);
  useEffect(() => { gameOverRef.current = gameOver; }, [gameOver]);
  useEffect(() => { gameWonRef.current = gameWon; }, [gameWon]);
  useEffect(() => { gameFailedRef.current = gameFailed; }, [gameFailed]);
  useEffect(() => { warningCountRef.current = warningCount; }, [warningCount]);

  // Load saved state on mount
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    const savedMutePreference = localStorage.getItem('simonMuted');
    if (savedMutePreference) setIsMuted(JSON.parse(savedMutePreference));
    loadSoundEffects();

    const savedPlayers = localStorage.getItem('simonPlayers');
    if (savedPlayers) { try { setPlayers(JSON.parse(savedPlayers)); } catch { } }

    const saved = localStorage.getItem('simonGameState');
    if (saved) {
      try {
        const gs = JSON.parse(saved);
        setSavedGameState(gs);
        if (gs.gameStarted && !gs.gameOver && !gs.gameWon && !gs.gameFailed && gs.randomArray?.length > 0) {
          setShowResumePrompt(true);
        } else {
          setPlayerName(gs.playerName || '');
          setIsNameSubmitted(gs.isNameSubmitted || false);
          setGameActive(gs.gameActive || false);
          setGameOver(gs.gameOver || false);
          setGameWon(gs.gameWon || false);
          setGameFailed(gs.gameFailed || false);
          setRandomArray(gs.randomArray || []);
          setUserSelectionArray(gs.userSelectionArray || []);
          setGameStarted(gs.gameStarted || false);
          setSelectedMode(gs.selectedMode || 'quickgame');
          setCurrentMusicIndex(gs.currentMusicIndex || 0);
          setKingBadge(gs.kingBadge || false);
          setWarningCount(gs.warningCount || 0);
          const savedScore = gs.score || 0;
          scoreRef.current = savedScore;
          setScoreDisplay(savedScore);
        }
      } catch { }
    }
    setIsInitialLoad(false);
  }, []);

  // Save game state
  useEffect(() => {
    if (isInitialLoad) return;
    const gs = {
      playerName, isNameSubmitted, gameActive, gameOver, gameWon, gameFailed,
      randomArray, userSelectionArray, gameStarted, selectedMode,
      currentMusicIndex, warningCount, kingBadge, score: scoreRef.current
    };
    localStorage.setItem('simonGameState', JSON.stringify(gs));
  }, [playerName, isNameSubmitted, gameActive, gameOver, gameWon, gameFailed,
      randomArray, userSelectionArray, gameStarted, selectedMode,
      currentMusicIndex, warningCount, kingBadge, scoreDisplay, isInitialLoad]);

  useEffect(() => {
    if (players.length > 0) localStorage.setItem('simonPlayers', JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    return () => {
      if (backgroundMusicRef.current) backgroundMusicRef.current.pause();
      if (audioContextRef.current) audioContextRef.current.close();
      if (inactivityIntervalRef.current) clearInterval(inactivityIntervalRef.current);
      if (modeTimeoutRef.current) clearTimeout(modeTimeoutRef.current);
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  const initializeAudio = useCallback(() => {
    if (!audioInitializedRef.current && audioContextRef.current) {
      audioContextRef.current.resume().then(() => { audioInitializedRef.current = true; }).catch(() => { });
    }
  }, []);

  const loadSoundEffects = useCallback(() => {
    const soundFiles = {
      '1': '/sounds/red.mp3', '2': '/sounds/blue.mp3',
      '3': '/sounds/green.mp3', '4': '/sounds/black.mp3',
      'cheer': '/sounds/cheer.mp3', 'gameover': '/sounds/gameover.mp3',
      'victory': '/sounds/victory.mp3', 'failure': '/sounds/failure.mp3'
    };
    Object.entries(soundFiles).forEach(([key, path]) => {
      const audio = new Audio(path); audio.preload = 'auto';
      soundEffectsRef.current[key] = audio;
    });
  }, []);

  const isMutedRef = useRef(isMuted);
  useEffect(() => { isMutedRef.current = isMuted; }, [isMuted]);

  const playSound = useCallback((soundId) => {
    if (isMutedRef.current) return;
    const sound = soundEffectsRef.current[soundId];
    if (sound) { const c = sound.cloneNode(); c.volume = 1; c.play().catch(() => { }); }
  }, []);

  const getRandomMusicIndex = useCallback(() => {
    const mode = modeMusic[selectedModeRef.current];
    if (!mode) return 0;
    return Math.floor(Math.random() * mode.music.length);
  }, []);

  const stopInactivityTimer = useCallback(() => {
    if (inactivityIntervalRef.current) {
      clearInterval(inactivityIntervalRef.current);
      inactivityIntervalRef.current = null;
    }
  }, []);

  const stopBackgroundMusic = useCallback(() => {
    if (fadeIntervalRef.current) { clearInterval(fadeIntervalRef.current); fadeIntervalRef.current = null; }
    if (backgroundMusicRef.current) { backgroundMusicRef.current.pause(); backgroundMusicRef.current = null; }
    if (modeTimeoutRef.current) { clearTimeout(modeTimeoutRef.current); modeTimeoutRef.current = null; }
  }, []);

  const fadeOutMusic = useCallback((callback) => {
    if (!backgroundMusicRef.current || isMutedRef.current) {
      if (callback) callback();
      return;
    }
    const fadeSteps = 10;
    const fadeDuration = 1000;
    const fadeInterval = fadeDuration / fadeSteps;
    let currentStep = 0;
    const initialVolume = backgroundMusicRef.current.volume;
    fadeIntervalRef.current = setInterval(() => {
      currentStep++;
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.volume = Math.max(0, initialVolume * (1 - currentStep / fadeSteps));
      }
      if (currentStep >= fadeSteps) {
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
        if (backgroundMusicRef.current) backgroundMusicRef.current.pause();
        if (callback) callback();
      }
    }, fadeInterval);
  }, []);

  const saveScoreToLeaderboard = useCallback((isVictory, score) => {
    if (score > 0) {
      const newPlayer = {
        id: Date.now(), name: playerNameRef.current, score,
        mode: selectedModeRef.current, date: new Date().toLocaleDateString(),
        kingBadge: selectedModeRef.current === 'king' && isVictory
      };
      setPlayers(prev => [newPlayer, ...prev].sort((a, b) => b.score - a.score).slice(0, 20));
    }
  }, []);

  // checkGameEnd reads score from ref — always fresh
  const checkGameEnd = useCallback(() => {
    const currentScore = scoreRef.current;
    const currentMode = selectedModeRef.current;
    
    if (!currentMode) {
      console.error('No mode selected when game ended');
      return;
    }
    
    const threshold = SCORE_THRESHOLDS[currentMode];
    
    if (threshold === undefined) {
      console.error(`No threshold defined for mode: ${currentMode}`);
      return;
    }
    
    console.log(`Game ending — Mode: ${currentMode}, Score: ${currentScore}, Threshold: ${threshold}`);
    
    if (currentScore >= threshold) {
      handleVictory(currentScore);
    } else {
      handleFailure(currentScore);
    }
  }, []);

  const handleVictory = useCallback((score) => {
    console.log('Game victory - score meets or exceeds threshold:', score);
    setFinalScore(score);
    setGameWon(true);
    setGameActive(false);
    setGameStarted(false);
    playSound('victory');
    stopInactivityTimer();
    if (modeTimeoutRef.current) { clearTimeout(modeTimeoutRef.current); modeTimeoutRef.current = null; }
    if (selectedModeRef.current === 'king') setKingBadge(true);
    saveScoreToLeaderboard(true, score);
    setShowVictoryModal(true);
  }, [playSound, stopInactivityTimer, saveScoreToLeaderboard]);

  const handleFailure = useCallback((score) => {
    console.log('Game failed - score below threshold:', score);
    setFinalScore(score);
    setGameFailed(true);
    setGameActive(false);
    setGameStarted(false);
    playSound('failure');
    stopInactivityTimer();
    if (modeTimeoutRef.current) { clearTimeout(modeTimeoutRef.current); modeTimeoutRef.current = null; }
    saveScoreToLeaderboard(false, score);
    setShowFailureModal(true);
  }, [playSound, stopInactivityTimer, saveScoreToLeaderboard]);

  const scheduleModeTimeout = useCallback((duration) => {
    if (modeTimeoutRef.current) { clearTimeout(modeTimeoutRef.current); modeTimeoutRef.current = null; }
    modeTimeoutRef.current = setTimeout(() => {
      console.log('Mode timeout reached — fading out');
      modeTimeoutRef.current = null;
      fadeOutMusic(() => checkGameEnd());
    }, duration);
  }, [fadeOutMusic, checkGameEnd]);

  const startBackgroundMusic = useCallback(() => {
    if (isMutedRef.current || !selectedModeRef.current) return;
    const mode = modeMusic[selectedModeRef.current];
    if (!mode) return;
    if (backgroundMusicRef.current) { backgroundMusicRef.current.pause(); backgroundMusicRef.current = null; }
    if (modeTimeoutRef.current) { clearTimeout(modeTimeoutRef.current); modeTimeoutRef.current = null; }
    initializeAudio();
    const safeIndex = Math.min(currentMusicIndexRef.current, mode.music.length - 1);
    const musicFile = mode.music[safeIndex];
    try {
      const bgMusic = new Audio(musicFile);
      bgMusic.loop = mode.loop;
      bgMusic.volume = 1;
      
      // Only set timeout for timed modes (easy and hard)
      // King mode uses full song length - no timeout
      // Quick game loops forever - no timeout
      if (selectedModeRef.current === 'easy' || selectedModeRef.current === 'hard') {
        const duration = MODE_DURATIONS[selectedModeRef.current];
        scheduleModeTimeout(duration);
      }
      
      // For king mode, we let the song play fully
      // For quick game, it loops forever
      
      bgMusic.addEventListener('ended', () => {
        if (!mode.loop) {
          if (modeTimeoutRef.current) { clearTimeout(modeTimeoutRef.current); modeTimeoutRef.current = null; }
          fadeOutMusic(() => checkGameEnd());
        }
        // If mode.loop is true (quick game), do nothing on ended
      });
      
      bgMusic.onerror = () => { };
      backgroundMusicRef.current = bgMusic;
      bgMusic.play().catch(() => { backgroundMusicRef.current = null; });
    } catch { }
  }, [initializeAudio, scheduleModeTimeout, fadeOutMusic, checkGameEnd]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newMuted = !prev;
      localStorage.setItem('simonMuted', JSON.stringify(newMuted));
      if (newMuted) {
        stopBackgroundMusic();
      } else {
        if (gameStartedRef.current && !gameOverRef.current && !gameWonRef.current && !gameFailedRef.current) {
          setTimeout(() => startBackgroundMusic(), 50);
        }
      }
      return newMuted;
    });
  }, [stopBackgroundMusic, startBackgroundMusic]);

  useEffect(() => {
    const handle = () => {
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume().then(() => { audioInitializedRef.current = true; });
      }
    };
    window.addEventListener('click', handle);
    window.addEventListener('keydown', handle);
    window.addEventListener('touchstart', handle);
    return () => {
      window.removeEventListener('click', handle);
      window.removeEventListener('keydown', handle);
      window.removeEventListener('touchstart', handle);
    };
  }, []);

  const handleInactivity = useCallback(() => {
    // Prevent double execution
    if (isProcessingInactivityRef.current) {
      console.log('Already processing inactivity, skipping');
      return;
    }
    
    isProcessingInactivityRef.current = true;
    stopInactivityTimer();

    // Don't process if:
    // - Game is not active
    // - Game is already in an end state
    if (
      !gameActiveRef.current ||
      gameOverRef.current ||
      gameWonRef.current ||
      gameFailedRef.current
    ) {
      isProcessingInactivityRef.current = false;
      return;
    }

    if (warningCountRef.current === 0) {
      console.log('First timeout - showing warning modal');
      if (backgroundMusicRef.current) backgroundMusicRef.current.pause();
      setGameActive(false);
      setShowWarningModal(true);
      setWarningCount(1);
      warningCountRef.current = 1;
    } else {
      console.log('Second timeout - game over with no score');
      setShowWarningModal(false);
      setGameOver(true);
      setGameStarted(false);
      setGameActive(false);
      setGameWon(false);
      setGameFailed(false);
      stopBackgroundMusic();
      // Reset warning count for next game
      setWarningCount(0);
      warningCountRef.current = 0;
    }
    
    // Reset processing flag after a short delay
    setTimeout(() => {
      isProcessingInactivityRef.current = false;
    }, 100);
  }, [stopBackgroundMusic, stopInactivityTimer]);

  const startInactivityTimer = useCallback(() => {
    // Prevent multiple timers
    if (inactivityIntervalRef.current) {
      console.log('Timer already exists, not creating another');
      return;
    }

    setInactivitySeconds(20);

    inactivityIntervalRef.current = setInterval(() => {
      setInactivitySeconds(prev => {
        if (prev <= 1) {
          handleInactivity();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [handleInactivity]);

  const resetInactivityTimer = useCallback(() => {
    if (gameStartedRef.current && !gameOverRef.current && !gameWonRef.current && !gameFailedRef.current && gameActiveRef.current) {
      stopInactivityTimer();
      startInactivityTimer();
    }
  }, [startInactivityTimer, stopInactivityTimer]);

  const beep = useCallback((colorId) => {
    setActiveColor(colorId);
    playSound(colorId);
    setTimeout(() => setActiveColor(null), 300);
    resetInactivityTimer();
  }, [playSound, resetInactivityTimer]);

  const boxBlink = useCallback(() => {
    const newColorId = Math.floor(Math.random() * 4) + 1;
    setRandomArray(prev => [...prev, newColorId]);
    setGameActive(false);
    setUserSelectionArray([]);
    beep(newColorId.toString());
    const t = setTimeout(() => setGameActive(true), 600);
    timeoutsRef.current.push(t);
  }, [beep]);

  const startGame = useCallback(() => {
    console.log('Starting new game');
    initializeAudio();
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    stopInactivityTimer(); // Clear any existing timer
    stopBackgroundMusic();

    const newMusicIndex = getRandomMusicIndex();
    setCurrentMusicIndex(newMusicIndex);
    currentMusicIndexRef.current = newMusicIndex;

    // Reset score via ref AND display state
    scoreRef.current = 0;
    setScoreDisplay(0);

    setGameActive(false); 
    setGameOver(false); 
    setGameWon(false); 
    setGameFailed(false);
    setGameStarted(true); 
    setRandomArray([]); 
    setUserSelectionArray([]);
    setActiveColor(null); 
    setWarningCount(0); 
    warningCountRef.current = 0;
    setShowVictoryModal(false); 
    setShowFailureModal(false); 
    setFinalScore(0);
    setShowWarningModal(false);
    isProcessingInactivityRef.current = false;

    const mode = modeMusic[selectedModeRef.current];
    if (mode) {
      if (!isMutedRef.current) {
        try {
          const musicFile = mode.music[newMusicIndex];
          const bgMusic = new Audio(musicFile);
          bgMusic.loop = mode.loop;
          bgMusic.volume = 1;
          
          // Only set timeout for timed modes (easy and hard)
          if (selectedModeRef.current === 'easy' || selectedModeRef.current === 'hard') {
            const duration = MODE_DURATIONS[selectedModeRef.current];
            scheduleModeTimeout(duration);
          }
          
          // For king mode, we let the song play fully
          // For quick game, it loops forever
          
          bgMusic.addEventListener('ended', () => {
            if (!mode.loop) {
              if (modeTimeoutRef.current) { clearTimeout(modeTimeoutRef.current); modeTimeoutRef.current = null; }
              fadeOutMusic(() => checkGameEnd());
            }
          });
          
          backgroundMusicRef.current = bgMusic;
          bgMusic.play().catch(() => { });
        } catch { }
      }
      startInactivityTimer(); // Start a new timer
      setTimeout(() => boxBlink(), 500);
    }
  }, [initializeAudio, stopInactivityTimer, stopBackgroundMusic, getRandomMusicIndex,
      boxBlink, startInactivityTimer, scheduleModeTimeout, fadeOutMusic, checkGameEnd]);

  // userSelectionRef keeps a fresh copy of userSelectionArray for the click handler
  const userSelectionRef = useRef([]);
  useEffect(() => { userSelectionRef.current = userSelectionArray; }, [userSelectionArray]);
  const randomArrayRef = useRef([]);
  useEffect(() => { randomArrayRef.current = randomArray; }, [randomArray]);

  const handleColorClick = useCallback((colorId) => {
    if (!gameActive || gameOver || gameWon || gameFailed || !gameStarted) return;

    beep(colorId);

    const currentSelection = [...userSelectionRef.current, parseInt(colorId)];
    setUserSelectionArray(currentSelection);

    const currentRandom = randomArrayRef.current;

    if (currentSelection.length === currentRandom.length) {
      if (currentSelection.toString() === currentRandom.toString()) {
        // Correct — increment score via ref so checkGameEnd always sees the latest value
        scoreRef.current += 1;
        setScoreDisplay(scoreRef.current);
        setTimeout(() => boxBlink(), 1000);
        setUserSelectionArray([]);
      } else {
        // Wrong click — game over
        const currentScore = scoreRef.current;
        console.log('Wrong click — Game Over. Score:', currentScore);
        setGameOver(true);
        setGameActive(false);
        setGameStarted(false);
        playSound('gameover');
        stopBackgroundMusic();
        stopInactivityTimer();
        if (currentScore > 0) {
          const newPlayer = {
            id: Date.now(), name: playerNameRef.current, score: currentScore,
            mode: selectedModeRef.current, date: new Date().toLocaleDateString(),
            kingBadge: false
          };
          setPlayers(prev => [newPlayer, ...prev].sort((a, b) => b.score - a.score).slice(0, 20));
        }
      }
    }
  }, [gameActive, gameOver, gameWon, gameFailed, gameStarted,
      beep, boxBlink, playSound, stopBackgroundMusic, stopInactivityTimer]);

  const resumeGame = useCallback(() => {
    setShowWarningModal(false);
    if (!isMutedRef.current && backgroundMusicRef.current) backgroundMusicRef.current.play();
    setGameActive(true);
    startInactivityTimer();
  }, [startInactivityTimer]);

  const quitGame = useCallback(() => {
    setShowWarningModal(false);
    setGameOver(true); 
    setGameStarted(false); 
    setGameActive(false);
    setGameWon(false); 
    setGameFailed(false);
    stopBackgroundMusic(); 
    stopInactivityTimer();
    setWarningCount(0); 
    warningCountRef.current = 0;
    isProcessingInactivityRef.current = false;
  }, [stopBackgroundMusic, stopInactivityTimer]);

  const handleResumeGame = useCallback(() => {
    if (savedGameState) {
      const savedScore = savedGameState.score || 0;
      scoreRef.current = savedScore;
      setScoreDisplay(savedScore);
      setPlayerName(savedGameState.playerName || '');
      setIsNameSubmitted(savedGameState.isNameSubmitted || false);
      setGameActive(savedGameState.gameActive || false);
      setGameOver(savedGameState.gameOver || false);
      setGameWon(savedGameState.gameWon || false);
      setGameFailed(savedGameState.gameFailed || false);
      setRandomArray(savedGameState.randomArray || []);
      setUserSelectionArray(savedGameState.userSelectionArray || []);
      setGameStarted(savedGameState.gameStarted || false);
      setSelectedMode(savedGameState.selectedMode || 'quickgame');
      setCurrentMusicIndex(savedGameState.currentMusicIndex || 0);
      setKingBadge(savedGameState.kingBadge || false);
      setWarningCount(savedGameState.warningCount || 0);
      warningCountRef.current = savedGameState.warningCount || 0;
      setShowResumePrompt(false);
      setSavedGameState(null);
      if (!isMutedRef.current && savedGameState.gameStarted && !savedGameState.gameOver && !savedGameState.gameWon && !savedGameState.gameFailed) {
        setTimeout(() => { startBackgroundMusic(); startInactivityTimer(); }, 500);
      }
    }
  }, [savedGameState, startBackgroundMusic, startInactivityTimer]);

  const handleRestartGame = useCallback(() => {
    setShowResumePrompt(false); 
    setSavedGameState(null);
    localStorage.removeItem('simonGameState');
    scoreRef.current = 0; 
    setScoreDisplay(0);
    setPlayerName(''); 
    setIsNameSubmitted(false); 
    setGameActive(false);
    setGameOver(false); 
    setGameWon(false); 
    setGameFailed(false); 
    setGameStarted(false);
    setRandomArray([]); 
    setUserSelectionArray([]); 
    setActiveColor(null);
    setSelectedMode('quickgame'); 
    setCurrentMusicIndex(0);
    setWarningCount(0); 
    warningCountRef.current = 0; 
    setKingBadge(false);
    isProcessingInactivityRef.current = false;
  }, []);

  const newPlayer = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout); 
    timeoutsRef.current = [];
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    stopInactivityTimer(); 
    stopBackgroundMusic();
    scoreRef.current = 0; 
    setScoreDisplay(0);
    setPlayerName(''); 
    setIsNameSubmitted(false); 
    setGameActive(false);
    setGameOver(false); 
    setGameWon(false); 
    setGameFailed(false); 
    setGameStarted(false);
    setRandomArray([]); 
    setUserSelectionArray([]); 
    setActiveColor(null);
    setSelectedMode('quickgame'); 
    setCurrentMusicIndex(0);
    setWarningCount(0); 
    warningCountRef.current = 0; 
    setKingBadge(false);
    localStorage.removeItem('simonGameState');
    isProcessingInactivityRef.current = false;
  }, [stopInactivityTimer, stopBackgroundMusic]);

  const playAgain = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout); 
    timeoutsRef.current = [];
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    stopInactivityTimer(); 
    stopBackgroundMusic();
    scoreRef.current = 0; 
    setScoreDisplay(0);
    setGameActive(false); 
    setGameOver(false); 
    setGameWon(false); 
    setGameFailed(false);
    setGameStarted(false); 
    setRandomArray([]); 
    setUserSelectionArray([]);
    setActiveColor(null); 
    setCurrentMusicIndex(0);
    setWarningCount(0); 
    warningCountRef.current = 0;
    setShowVictoryModal(false); 
    setShowFailureModal(false);
    isProcessingInactivityRef.current = false;
  }, [stopInactivityTimer, stopBackgroundMusic]);

  const getGlowStyle = useCallback((color) => {
    if (activeColor === color.id) {
      const shadowMap = {
        '1': '0 0 30px 15px rgba(239,68,68,0.95)',
        '2': '0 0 30px 15px rgba(59,130,246,0.95)',
        '3': '0 0 30px 15px rgba(34,197,94,0.95)',
        '4': '0 0 30px 15px rgba(255,255,255,0.85)'
      };
      return { boxShadow: shadowMap[color.id], transform: 'scale(1.04)', transition: 'all 0.1s ease-out', zIndex: 10 };
    }
    return {};
  }, [activeColor]);

  const getRankStyle = (index) => {
    if (index === 0) return 'rank-first';
    if (index === 1) return 'rank-second';
    if (index === 2) return 'rank-third';
    return 'rank-default';
  };

  const getRankIcon = (index) => {
    if (index === 0) return '🏆';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}`;
  };

  const closeOverlays = () => { setShowLeftOverlay(false); setShowRightOverlay(false); };
  const handleNameSubmit = (e) => { e.preventDefault(); if (playerName.trim()) setIsNameSubmitted(true); };
  const selectMode = (mode) => {
    if (gameStarted && !gameOver && !gameWon && !gameFailed) return;
    setSelectedMode(mode); 
    selectedModeRef.current = mode; 
    setCurrentMusicIndex(0);
  };

  if (!isNameSubmitted) {
    return <NameScreen playerName={playerName} setPlayerName={setPlayerName} handleNameSubmit={handleNameSubmit} />;
  }

  return (
    <div style={{
      minHeight: '100vh', width: '100%', background: '#07080d',
      position: 'relative', overflowX: 'hidden',
      fontFamily: "'Share Tech Mono', monospace"
    }}>
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: 'linear-gradient(rgba(0,229,200,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,200,0.02) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }} />

      <WarningModal show={showWarningModal} onContinue={resumeGame} onQuit={quitGame} />
      <VictoryModal show={showVictoryModal} selectedMode={selectedMode} score={finalScore} onPlayAgain={playAgain} />
      <FailureModal show={showFailureModal} selectedMode={selectedMode} score={finalScore} onPlayAgain={playAgain} />
      <ResumeModal
        show={showResumePrompt}
        playerName={savedGameState?.playerName}
        score={savedGameState?.score || 0}
        onContinue={handleResumeGame}
        onRestart={handleRestartGame}
      />
      <GameOverModal show={gameOver && !gameWon && !gameFailed} score={scoreDisplay} onPlayAgain={playAgain} onNewPlayer={newPlayer} />

      <MobileFloatingButtons
        showLeftOverlay={showLeftOverlay} showRightOverlay={showRightOverlay}
        setShowLeftOverlay={setShowLeftOverlay} setShowRightOverlay={setShowRightOverlay}
        toggleMute={toggleMute} isMuted={isMuted} closeOverlays={closeOverlays}
        kingBadge={kingBadge} players={players} getRankStyle={getRankStyle} getRankIcon={getRankIcon}
      />

      <div style={{
        position: 'relative', zIndex: 1,
        maxWidth: '1400px', margin: '0 auto',
        padding: '16px', display: 'flex', gap: '16px',
        minHeight: '100vh', alignItems: 'start'
      }}>
        <LeftColumn playerName={playerName} kingBadge={kingBadge} />

        <div className='gamed' style={{ width: '60%', minWidth: 0, height: '100vh', padding: '20px 0', margin: 'auto' }}>
          <style>{`
            @media (max-width: 800px) {
              .gamed { width: 100% !important; max-width: 100% !important; }
            }
          `}</style>
          <GameBoard
            playerName={playerName} kingBadge={kingBadge}
            gameStarted={gameStarted} gameActive={gameActive}
            gameOver={gameOver} gameWon={gameWon}
            randomArray={randomArray} activeColor={activeColor}
            selectedMode={selectedMode} isMuted={isMuted}
            toggleMute={toggleMute} inactivitySeconds={inactivitySeconds}
            startGame={startGame} handleColorClick={handleColorClick}
            getGlowStyle={getGlowStyle} selectMode={selectMode}
            score={scoreDisplay}
          />
        </div>

        <RightColumn players={players} setPlayers={setPlayers} getRankStyle={getRankStyle} getRankIcon={getRankIcon} />
      </div>
    </div>
  );
};

export default SimonGame;