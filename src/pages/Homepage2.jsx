import { useState, useEffect, useCallback, useRef } from 'react';
import { modeMusic } from '../constants/modeMusic';
import { colors } from '../constants/colors';
import NameScreen from '../components/NameScreen';
import LeftColumn from '../components/LeftColumn';
import RightColumn from '../components/RightColumn';
import GameBoard from '../components/GameBoard';
import { WarningModal, VictoryModal, ResumeModal, GameOverModal, FailureModal } from '../components/Modals';
import MobileFloatingButtons from '../components/MobileFloatingButtons';

// Constants - Updated durations
const MODE_DURATIONS = {
  easy: 40000, // 40 seconds
  hard: 70000, // 70 seconds
  king: 40000  // 40 seconds (keeping original for king)
};

// Score thresholds for each mode
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
  const [score, setScore] = useState(0); // Add separate score state

  const nameInputRef = useRef(null);
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
  const handleVictoryRef = useRef(null);
  const handleFailureRef = useRef(null);
  const fadeIntervalRef = useRef(null);

  // Load saved state on mount
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    const savedMutePreference = localStorage.getItem('simonMuted');
    if (savedMutePreference) setIsMuted(JSON.parse(savedMutePreference));
    loadSoundEffects();

    const savedPlayers = localStorage.getItem('simonPlayers');
    if (savedPlayers) {
      try { setPlayers(JSON.parse(savedPlayers)); } catch { }
    }

    const savedGameState = localStorage.getItem('simonGameState');
    if (savedGameState) {
      try {
        const gameState = JSON.parse(savedGameState);
        setSavedGameState(gameState);
        if (gameState.gameStarted && !gameState.gameOver && !gameState.gameWon && !gameState.gameFailed && gameState.randomArray?.length > 0) {
          setShowResumePrompt(true);
        } else {
          setPlayerName(gameState.playerName || '');
          setIsNameSubmitted(gameState.isNameSubmitted || false);
          setGameActive(gameState.gameActive || false);
          setGameOver(gameState.gameOver || false);
          setGameWon(gameState.gameWon || false);
          setGameFailed(gameState.gameFailed || false);
          setRandomArray(gameState.randomArray || []);
          setUserSelectionArray(gameState.userSelectionArray || []);
          setGameStarted(gameState.gameStarted || false);
          setSelectedMode(gameState.selectedMode || 'quickgame');
          setCurrentMusicIndex(gameState.currentMusicIndex || 0);
          setKingBadge(gameState.kingBadge || false);
          setWarningCount(gameState.warningCount || 0);
          setScore(gameState.score || 0);
        }
      } catch { }
    }
    setIsInitialLoad(false);
  }, []);

  // Save game state to localStorage
  useEffect(() => {
    if (isInitialLoad) return;
    const gameState = {
      playerName, isNameSubmitted, gameActive, gameOver, gameWon, gameFailed,
      randomArray, userSelectionArray, gameStarted, selectedMode,
      currentMusicIndex, warningCount, kingBadge, score // Add score to saved state
    };
    localStorage.setItem('simonGameState', JSON.stringify(gameState));
  }, [playerName, isNameSubmitted, gameActive, gameOver, gameWon, gameFailed, randomArray,
      userSelectionArray, gameStarted, selectedMode, currentMusicIndex, warningCount, kingBadge, score, isInitialLoad]);

  // Save players to localStorage
  useEffect(() => {
    if (players.length > 0) localStorage.setItem('simonPlayers', JSON.stringify(players));
  }, [players]);

  // Cleanup on unmount
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
      '1': '/sounds/red.mp3', '2': '/sounds/blue.mp3', '3': '/sounds/green.mp3',
      '4': '/sounds/black.mp3', 'cheer': '/sounds/cheer.mp3',
      'gameover': '/sounds/gameover.mp3', 'victory': '/sounds/victory.mp3',
      'failure': '/sounds/failure.mp3'
    };
    Object.entries(soundFiles).forEach(([key, path]) => {
      const audio = new Audio(path); audio.preload = 'auto';
      soundEffectsRef.current[key] = audio;
    });
  }, []);

  const playSound = useCallback((soundId) => {
    if (isMuted) return;
    const sound = soundEffectsRef.current[soundId];
    if (sound) { const c = sound.cloneNode(); c.volume = 0.5; c.play().catch(() => { }); }
  }, [isMuted]);

  const getRandomMusicIndex = useCallback(() => {
    const mode = modeMusic[selectedMode];
    if (!mode) return 0;
    return Math.floor(Math.random() * mode.music.length);
  }, [selectedMode]);

  const stopInactivityTimer = useCallback(() => {
    if (inactivityIntervalRef.current) {
      clearInterval(inactivityIntervalRef.current);
      inactivityIntervalRef.current = null;
    }
  }, []);

  const stopBackgroundMusic = useCallback(() => {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.pause();
      backgroundMusicRef.current = null;
    }
    if (modeTimeoutRef.current) {
      clearTimeout(modeTimeoutRef.current);
      modeTimeoutRef.current = null;
    }
  }, []);

  const fadeOutMusic = useCallback((callback) => {
    if (!backgroundMusicRef.current || isMuted) {
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
      const newVolume = initialVolume * (1 - currentStep / fadeSteps);
      
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.volume = Math.max(0, newVolume);
      }
      
      if (currentStep >= fadeSteps) {
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
        if (backgroundMusicRef.current) {
          backgroundMusicRef.current.pause();
        }
        if (callback) callback();
      }
    }, fadeInterval);
  }, [isMuted]);

  // Save score to leaderboard
  const saveScoreToLeaderboard = useCallback((isVictory, score) => {
    if (score > 0) {
      const newPlayer = {
        id: Date.now(),
        name: playerName,
        score: score,
        mode: selectedMode,
        date: new Date().toLocaleDateString(),
        kingBadge: selectedMode === 'king' && isVictory
      };
      setPlayers(prev => [newPlayer, ...prev].sort((a, b) => b.score - a.score).slice(0, 20));
    }
  }, [playerName, selectedMode]);

  // Handle failure when score is below threshold
  const handleFailure = useCallback((score) => {
    console.log('Game failed - score below threshold:', score);
    setFinalScore(score);
    setGameFailed(true);
    setGameActive(false);
    setGameStarted(false);
    playSound('failure');
    stopInactivityTimer();
    
    if (modeTimeoutRef.current) {
      clearTimeout(modeTimeoutRef.current);
      modeTimeoutRef.current = null;
    }
    
    // Save score to leaderboard (as failure, no king badge)
    saveScoreToLeaderboard(false, score);
    
    setShowFailureModal(true);
  }, [playSound, stopInactivityTimer, saveScoreToLeaderboard]);

  // Handle victory when score meets or exceeds threshold
  const handleVictory = useCallback((score) => {
    console.log('Game victory - score meets or exceeds threshold:', score);
    setFinalScore(score);
    setGameWon(true);
    setGameActive(false);
    setGameStarted(false);
    playSound('victory');
    stopInactivityTimer();
    
    if (modeTimeoutRef.current) {
      clearTimeout(modeTimeoutRef.current);
      modeTimeoutRef.current = null;
    }
    
    if (selectedMode === 'king') setKingBadge(true);
    
    // Save score to leaderboard (as victory)
    saveScoreToLeaderboard(true, score);
    
    setShowVictoryModal(true);
  }, [selectedMode, playSound, stopInactivityTimer, saveScoreToLeaderboard]);

  // Store handlers in refs
  useEffect(() => {
    handleVictoryRef.current = handleVictory;
  }, [handleVictory]);

  useEffect(() => {
    handleFailureRef.current = handleFailure;
  }, [handleFailure]);

  const checkGameEnd = useCallback(() => {
    // Use the score state instead of randomArray.length - 1
    const currentScore = score;
    const threshold = SCORE_THRESHOLDS[selectedMode];
    
    console.log(`Game ending - Final Score: ${currentScore}, Threshold: ${threshold}`);
    
    if (currentScore >= threshold) {
      if (handleVictoryRef.current) handleVictoryRef.current(currentScore);
    } else {
      if (handleFailureRef.current) handleFailureRef.current(currentScore);
    }
  }, [selectedMode, score]);

  const startBackgroundMusic = useCallback(() => {
    if (isMuted || !selectedMode) {
      console.log('Cannot start music: muted or no mode');
      return;
    }
    
    const mode = modeMusic[selectedMode];
    if (!mode) {
      console.log('Mode not found:', selectedMode);
      return;
    }
    
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.pause();
      backgroundMusicRef.current = null;
    }
    
    if (modeTimeoutRef.current) {
      clearTimeout(modeTimeoutRef.current);
      modeTimeoutRef.current = null;
    }
    
    initializeAudio();
    
    const safeIndex = Math.min(currentMusicIndex, mode.music.length - 1);
    if (safeIndex !== currentMusicIndex) setCurrentMusicIndex(safeIndex);
    const musicFile = mode.music[safeIndex];
    
    try {
      const bgMusic = new Audio(musicFile);
      bgMusic.loop = mode.loop;
      bgMusic.volume = 0.3;
      
      const duration = MODE_DURATIONS[selectedMode] || 40000;
      
      const musicTimeout = setTimeout(() => {
        console.log(`${selectedMode} mode timeout reached - fading out`);
        fadeOutMusic(() => {
          checkGameEnd();
        });
        modeTimeoutRef.current = null;
      }, duration);
      
      modeTimeoutRef.current = musicTimeout;
      
      bgMusic.addEventListener('ended', () => {
        console.log(`${selectedMode} mode music ended naturally - ending game`);
        if (modeTimeoutRef.current) {
          clearTimeout(modeTimeoutRef.current);
          modeTimeoutRef.current = null;
        }
        if (!mode.loop) {
          fadeOutMusic(() => {
            checkGameEnd();
          });
        }
      });
      
      bgMusic.onerror = (e) => {
        console.log('Error playing music:', e);
      };
      
      backgroundMusicRef.current = bgMusic;
      
      bgMusic.play()
        .then(() => {
          console.log('Music started successfully');
        })
        .catch((err) => {
          console.log('Failed to play music:', err);
          backgroundMusicRef.current = null;
        });
        
    } catch (error) {
      console.log('Error creating audio:', error);
    }
  }, [isMuted, selectedMode, currentMusicIndex, setCurrentMusicIndex, initializeAudio, checkGameEnd, fadeOutMusic]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newMuted = !prev;
      localStorage.setItem('simonMuted', JSON.stringify(newMuted));
      
      if (newMuted) {
        stopBackgroundMusic();
      } else {
        if (gameStarted && !gameOver && !gameWon && !gameFailed) {
          setTimeout(() => {
            startBackgroundMusic();
          }, 50);
        }
      }
      return newMuted;
    });
  }, [gameStarted, gameOver, gameWon, gameFailed, stopBackgroundMusic, startBackgroundMusic]);

  // Add useEffect for audio context
  useEffect(() => {
    const handleUserInteraction = () => {
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume().then(() => {
          console.log('Audio context resumed by user interaction');
          audioInitializedRef.current = true;
        });
      }
    };

    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('keydown', handleUserInteraction);
    window.addEventListener('touchstart', handleUserInteraction);

    return () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

  const handleInactivity = useCallback(() => {
    stopInactivityTimer();

    if (warningCount === 0) {
      if (backgroundMusicRef.current) backgroundMusicRef.current.pause();
      setGameActive(false);
      setShowWarningModal(true);
      setWarningCount(1);
    } else {
      setShowWarningModal(false);
      setGameOver(true);
      setGameStarted(false);
      setGameActive(false);
      setGameWon(false);
      setGameFailed(false);
      stopBackgroundMusic();
    }
  }, [warningCount, stopBackgroundMusic, stopInactivityTimer]);

  const startInactivityTimer = useCallback(() => {
    stopInactivityTimer();
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
  }, [handleInactivity, stopInactivityTimer]);

  const resetInactivityTimer = useCallback(() => {
    if (gameStarted && !gameOver && !gameWon && !gameFailed) {
      stopInactivityTimer();
      startInactivityTimer();
    }
  }, [gameStarted, gameOver, gameWon, gameFailed, startInactivityTimer, stopInactivityTimer]);

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
    const timeout = setTimeout(() => setGameActive(true), 600);
    timeoutsRef.current.push(timeout);
  }, [beep]);

  const startGame = useCallback(() => {
    console.log('Starting new game');
    initializeAudio();
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    stopInactivityTimer();
    stopBackgroundMusic();

    const newMusicIndex = getRandomMusicIndex();
    setCurrentMusicIndex(newMusicIndex);
    currentMusicIndexRef.current = newMusicIndex;

    setGameActive(false);
    setGameOver(false);
    setGameWon(false);
    setGameFailed(false);
    setGameStarted(true);
    setRandomArray([]);
    setUserSelectionArray([]);
    setActiveColor(null);
    setWarningCount(0);
    setShowVictoryModal(false);
    setShowFailureModal(false);
    setFinalScore(0);
    setScore(0); // Reset score when game starts

    const mode = modeMusic[selectedMode];
    if (mode) {
      if (!isMuted) {
        try {
          const musicFile = mode.music[newMusicIndex];
          const bgMusic = new Audio(musicFile);
          bgMusic.loop = mode.loop;
          bgMusic.volume = 0.3;
          
          const duration = MODE_DURATIONS[selectedMode] || 40000;
          
          const musicTimeout = setTimeout(() => {
            console.log(`${selectedMode} mode timeout reached - fading out`);
            fadeOutMusic(() => {
              checkGameEnd();
            });
            modeTimeoutRef.current = null;
          }, duration);
          
          modeTimeoutRef.current = musicTimeout;
          
          bgMusic.addEventListener('ended', () => {
            console.log(`${selectedMode} mode music ended naturally - ending game`);
            if (modeTimeoutRef.current) {
              clearTimeout(modeTimeoutRef.current);
              modeTimeoutRef.current = null;
            }
            if (!mode.loop) {
              fadeOutMusic(() => {
                checkGameEnd();
              });
            }
          });
          
          backgroundMusicRef.current = bgMusic;
          bgMusic.play().catch(() => { });
        } catch { }
      }

      startInactivityTimer();
      
      setTimeout(() => {
        boxBlink();
      }, 500);
    }
  }, [selectedMode, isMuted, initializeAudio, stopInactivityTimer, stopBackgroundMusic,
      getRandomMusicIndex, boxBlink, startInactivityTimer, checkGameEnd, fadeOutMusic]);

  const handleColorClick = useCallback((colorId) => {
    if (!gameActive || gameOver || gameWon || gameFailed || !gameStarted) return;

    beep(colorId);

    const newUserSelection = [...userSelectionArray, parseInt(colorId)];
    setUserSelectionArray(newUserSelection);

    if (newUserSelection.length === randomArray.length) {
      if (newUserSelection.toString() === randomArray.toString()) {
        // Correct sequence - increase score
        setScore(prev => prev + 1); // Increment score
        setTimeout(() => boxBlink(), 1000);
        setUserSelectionArray([]);
      } else {
        // Wrong click - game over
        const currentScore = score; // Use score state
        console.log('Wrong click - Game Over. Score:', currentScore);
        setGameOver(true);
        setGameActive(false);
        setGameStarted(false);
        playSound('gameover');
        stopBackgroundMusic();
        stopInactivityTimer();

        if (currentScore > 0) {
          const newPlayer = {
            id: Date.now(), name: playerName, score: currentScore,
            mode: selectedMode, date: new Date().toLocaleDateString(),
            kingBadge: false
          };
          setPlayers(prev => [newPlayer, ...prev].sort((a, b) => b.score - a.score).slice(0, 20));
        }
      }
    }
  }, [gameActive, gameOver, gameWon, gameFailed, gameStarted, userSelectionArray, randomArray,
      playerName, selectedMode, beep, boxBlink, playSound, stopBackgroundMusic, stopInactivityTimer, score]);

  const resumeGame = useCallback(() => {
    setShowWarningModal(false);
    if (!isMuted && backgroundMusicRef.current) backgroundMusicRef.current.play();
    setGameActive(true);
    startInactivityTimer();
  }, [isMuted, startInactivityTimer]);

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
  }, [stopBackgroundMusic, stopInactivityTimer]);

  const handleResumeGame = useCallback(() => {
    if (savedGameState) {
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
      setScore(savedGameState.score || 0); // Restore score

      if (savedGameState.gameStarted && !savedGameState.gameOver && !savedGameState.gameWon && !savedGameState.gameFailed && savedGameState.randomArray?.length > 0) {
        hasResumedRef.current = true;
      }

      setShowResumePrompt(false);
      setSavedGameState(null);

      if (!isMuted && savedGameState.gameStarted && !savedGameState.gameOver && !savedGameState.gameWon && !savedGameState.gameFailed) {
        setTimeout(() => {
          startBackgroundMusic();
          startInactivityTimer();
        }, 500);
      }
    }
  }, [savedGameState, isMuted, startBackgroundMusic, startInactivityTimer]);

  const handleRestartGame = useCallback(() => {
    setShowResumePrompt(false);
    setSavedGameState(null);
    localStorage.removeItem('simonGameState');
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
    setKingBadge(false);
    setScore(0); // Reset score
  }, []);

  const newPlayer = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    stopInactivityTimer();
    stopBackgroundMusic();
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
    setKingBadge(false);
    setScore(0); // Reset score
    localStorage.removeItem('simonGameState');
  }, [stopInactivityTimer, stopBackgroundMusic]);

  const playAgain = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    stopInactivityTimer();
    stopBackgroundMusic();
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
    setShowVictoryModal(false);
    setShowFailureModal(false);
    setScore(0); // Reset score
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
  const selectMode = (mode) => { if (gameStarted && !gameOver && !gameWon && !gameFailed) return; setSelectedMode(mode); setCurrentMusicIndex(0); };

  if (!isNameSubmitted) {
    return <NameScreen playerName={playerName} setPlayerName={setPlayerName} handleNameSubmit={handleNameSubmit} />;
  }

  return (
    <div style={{
      minHeight: '100vh', width: '100%', background: '#07080d',
      position: 'relative', overflowX: 'hidden',
      fontFamily: "'Share Tech Mono', monospace"
    }}>
      {/* Grid bg */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: 'linear-gradient(rgba(0,229,200,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,200,0.02) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }} />

      {/* Modals */}
      <WarningModal show={showWarningModal} onContinue={resumeGame} onQuit={quitGame} />
      <VictoryModal show={showVictoryModal} selectedMode={selectedMode} score={finalScore} onPlayAgain={playAgain} />
      <FailureModal show={showFailureModal} selectedMode={selectedMode} score={finalScore} onPlayAgain={playAgain} />
      <ResumeModal
        show={showResumePrompt}
        playerName={savedGameState?.playerName}
        score={(savedGameState?.randomArray?.length || 1) - 1}
        onContinue={handleResumeGame}
        onRestart={handleRestartGame}
      />
      <GameOverModal show={gameOver && !gameWon && !gameFailed} score={score} onPlayAgain={playAgain} onNewPlayer={newPlayer} />

      {/* Mobile FABs */}
      <MobileFloatingButtons
        showLeftOverlay={showLeftOverlay} showRightOverlay={showRightOverlay}
        setShowLeftOverlay={setShowLeftOverlay} setShowRightOverlay={setShowRightOverlay}
        toggleMute={toggleMute} isMuted={isMuted} closeOverlays={closeOverlays}
        kingBadge={kingBadge} players={players} getRankStyle={getRankStyle} getRankIcon={getRankIcon}
      />

      {/* Main layout */}
      <div style={{
        position: 'relative', zIndex: 1,
        maxWidth: '1400px', margin: '0 auto',
        padding: '16px',
        display: 'flex',
        gap: '16px',
        minHeight: '100vh',
        alignItems: 'start'
      }}>
        <LeftColumn playerName={playerName} kingBadge={kingBadge} />

        <div className='gamed' style={{ width: '60%', minWidth: 0, height: '100vh', padding: '20px 0', margin: 'auto' }}>
          <style>{`
            @media (max-width: 800px) {
              .gamed {
                width: 100% !important;
                max-width: 100% !important;
              }
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
            score={score} // Pass score to GameBoard
          />
        </div>

        <RightColumn players={players} setPlayers={setPlayers} getRankStyle={getRankStyle} getRankIcon={getRankIcon} />
      </div>
    </div>
  );
};

export default SimonGame;