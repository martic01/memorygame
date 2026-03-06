import { useState, useEffect, useCallback, useRef } from 'react';
import { modeMusic } from '../constants/modeMusic';
import { colors } from '../constants/colors';
import NameScreen from '../components/NameScreen';
import LeftColumn from '../components/LeftColumn';
import RightColumn from '../components/RightColumn';
import GameBoard from '../components/GameBoard';
import { WarningModal, VictoryModal, ResumeModal, GameOverModal } from '../components/Modals';
import MobileFloatingButtons from '../components/MobileFloatingButtons';

const SimonGame = () => {
  const [playerName, setPlayerName] = useState('');
  const [isNameSubmitted, setIsNameSubmitted] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
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
  const [kingBadge, setKingBadge] = useState(false);

  // Mobile overlay states
  const [showLeftOverlay, setShowLeftOverlay] = useState(false);
  const [showRightOverlay, setShowRightOverlay] = useState(false);

  const nameInputRef = useRef(null);
  const timeoutRef = useRef(null);
  const timeoutsRef = useRef([]);
  const hasResumedRef = useRef(false);
  const inactivityIntervalRef = useRef(null);
  const currentMusicIndexRef = useRef(0); // Store music index for resume

  // Audio refs
  const audioContextRef = useRef(null);
  const backgroundMusicRef = useRef(null);
  const soundEffectsRef = useRef({});
  const audioInitializedRef = useRef(false);

  // Debug logs
  useEffect(() => {
    console.log('🔄 selectedMode changed to:', selectedMode);
  }, [selectedMode]);

  useEffect(() => {
    console.log('🎵 currentMusicIndex changed to:', currentMusicIndex);
  }, [currentMusicIndex]);

  // Initialize audio
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();

    const savedMutePreference = localStorage.getItem('simonMuted');
    if (savedMutePreference) {
      setIsMuted(JSON.parse(savedMutePreference));
    }

    loadSoundEffects();

    return () => {
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (inactivityIntervalRef.current) {
        clearInterval(inactivityIntervalRef.current);
      }
    };
  }, []);

  // Initialize audio on first user interaction
  const initializeAudio = useCallback(() => {
    if (!audioInitializedRef.current && audioContextRef.current) {
      audioContextRef.current.resume().then(() => {
        audioInitializedRef.current = true;
        console.log('Audio context resumed');
      }).catch(e => console.log('Failed to resume audio context:', e));
    }
  }, []);

  // Load sound effects
  const loadSoundEffects = useCallback(() => {
    const soundFiles = {
      '1': '/sounds/red.mp3',
      '2': '/sounds/blue.mp3',
      '3': '/sounds/green.mp3',
      '4': '/sounds/black.mp3',
      'cheer': '/sounds/cheer.mp3',
      'gameover': '/sounds/gameover.mp3',
      'victory': '/sounds/victory.mp3'
    };

    Object.entries(soundFiles).forEach(([key, path]) => {
      const audio = new Audio(path);
      audio.preload = 'auto';
      soundEffectsRef.current[key] = audio;
    });
  }, []);

  // Play sound effect
  const playSound = useCallback((soundId) => {
    if (isMuted) return;

    const sound = soundEffectsRef.current[soundId];
    if (sound) {
      const soundClone = sound.cloneNode();
      soundClone.volume = 0.5;
      soundClone.play().catch(e => console.log('Audio playback failed:', e));
    }
  }, [isMuted]);

  // Function to get random music index - ONLY used for new games
  const getRandomMusicIndex = useCallback(() => {
    const mode = modeMusic[selectedMode];
    if (!mode) return 0;
    
    const musicArray = mode.music;
    const randomIndex = Math.floor(Math.random() * musicArray.length);
    
    console.log(`%c🎲 NEW GAME RANDOM SELECTION: index ${randomIndex} for ${selectedMode} mode`, 'color: yellow; font-weight: bold');
    return randomIndex;
  }, [selectedMode]);

  // Start background music based on mode
  const startBackgroundMusic = useCallback(() => {
    if (isMuted || !selectedMode) {
      console.log('Cannot start music: muted or no mode');
      return;
    }

    initializeAudio();

    const mode = modeMusic[selectedMode];
    if (!mode) {
      console.log('Mode not found:', selectedMode);
      return;
    }

    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.pause();
    }

    // Make sure currentMusicIndex is valid
    const safeIndex = Math.min(currentMusicIndex, mode.music.length - 1);
    if (safeIndex !== currentMusicIndex) {
      console.log(`Fixing invalid music index: ${currentMusicIndex} -> ${safeIndex}`);
      setCurrentMusicIndex(safeIndex);
    }
    
    const musicFile = mode.music[safeIndex];
    console.log(`%c🎵 PLAYING music index ${safeIndex} for ${selectedMode} mode:`, 'color: cyan', musicFile);
    
    try {
      const bgMusic = new Audio(musicFile);
      bgMusic.loop = mode.loop;
      bgMusic.volume = 0.3;

      bgMusic.onended = () => {
        console.log(`%c⏱️ Music ended for ${selectedMode} mode`, 'color: orange');
        if (!mode.loop) {
          // Music finished - win the game
          handleVictory();
        }
      };

      bgMusic.onerror = (e) => {
        console.error('Error loading music:', e);
      };

      backgroundMusicRef.current = bgMusic;
      backgroundMusicRef.current.play().catch(e => console.log('Background music failed to play:', e));
    } catch (error) {
      console.error('Error creating audio:', error);
    }
  }, [isMuted, selectedMode, currentMusicIndex, initializeAudio]);

  // Handle victory
  const stopInactivityTimer = useCallback(() => {
    if (inactivityIntervalRef.current) {
      clearInterval(inactivityIntervalRef.current);
      inactivityIntervalRef.current = null;
    }
  }, []);

  const handleVictory = useCallback(() => {
    console.log('%c🏆 VICTORY!', 'color: gold; font-size: 16px');
    setGameWon(true);
    setGameActive(false);
    setGameStarted(false);
    playSound('victory');
    stopInactivityTimer();

    if (selectedMode === 'king') {
      setKingBadge(true);
    }

    setShowVictoryModal(true);

    // Save score
    if (randomArray.length - 1 > 0) {
      const newPlayer = {
        id: Date.now(),
        name: playerName,
        score: randomArray.length - 1,
        mode: selectedMode,
        date: new Date().toLocaleDateString(),
        kingBadge: selectedMode === 'king'
      };

      setPlayers(prev => {
        const updated = [newPlayer, ...prev].sort((a, b) => b.score - a.score).slice(0, 20);
        return updated;
      });
    }
  }, [selectedMode, playerName, randomArray.length, playSound, stopInactivityTimer]);

  // Stop background music
  const stopBackgroundMusic = useCallback(() => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.pause();
      backgroundMusicRef.current = null;
    }
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newMuted = !prev;
      console.log('Mute toggled:', newMuted ? 'Muted' : 'Unmuted');
      if (newMuted) {
        stopBackgroundMusic();
      } else if (gameStarted && !gameOver && !gameWon) {
        startBackgroundMusic();
      }
      return newMuted;
    });
  }, [gameStarted, gameOver, gameWon, startBackgroundMusic, stopBackgroundMusic]);

  // Start background music when game starts
  useEffect(() => {
    if (gameStarted && !gameOver && !gameWon && !isMuted) {
      startBackgroundMusic();
      startInactivityTimer();
    } else {
      stopBackgroundMusic();
      stopInactivityTimer();
    }
  }, [gameStarted, gameOver, gameWon, isMuted, startBackgroundMusic]);

  // When mode changes, stop current music
  useEffect(() => {
    stopBackgroundMusic();
  }, [selectedMode, stopBackgroundMusic]);

  // Inactivity timer functions - FIXED with warning count
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
  }, []);

  const resetInactivityTimer = useCallback(() => {
    if (gameStarted && !gameOver && !gameWon) {
      stopInactivityTimer();
      startInactivityTimer();
    }
  }, [gameStarted, gameOver, gameWon, startInactivityTimer, stopInactivityTimer]);

  // FIXED: Handle inactivity with warning count (1 warning only)
  const handleInactivity = useCallback(() => {
    stopInactivityTimer();

    if (warningCount === 0) {
      // First warning
      pauseGame();
      setShowWarningModal(true);
      setWarningCount(1);
    } else {
      // Second offense - quit game immediately (no second warning)
      setShowWarningModal(false);
      setGameOver(true);
      setGameStarted(false);
      setGameActive(false);
      setGameWon(false);
      stopBackgroundMusic();
      // No score saved
    }
  }, [warningCount, stopBackgroundMusic, stopInactivityTimer]);

  const pauseGame = useCallback(() => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.pause();
    }
    setGameActive(false);
  }, []);

  const resumeGame = useCallback(() => {
    setShowWarningModal(false);
    if (!isMuted && backgroundMusicRef.current) {
      backgroundMusicRef.current.play();
    }
    setGameActive(true);
    startInactivityTimer();
  }, [isMuted, startInactivityTimer]);

  const quitGame = useCallback(() => {
    setShowWarningModal(false);
    setGameOver(true);
    setGameStarted(false);
    setGameActive(false);
    setGameWon(false);
    stopBackgroundMusic();
    stopInactivityTimer();
    // No score saved
  }, [stopBackgroundMusic, stopInactivityTimer]);

  // Load all saved state from localStorage - FIXED to preserve music index
  useEffect(() => {
    const savedPlayers = localStorage.getItem('simonPlayers');
    if (savedPlayers) setPlayers(JSON.parse(savedPlayers));

    const savedGameState = localStorage.getItem('simonGameState');
    if (savedGameState) {
      try {
        const gameState = JSON.parse(savedGameState);
        setSavedGameState(gameState);

        if (gameState.gameStarted && !gameState.gameOver && !gameState.gameWon && gameState.randomArray.length > 0) {
          setShowResumePrompt(true);
          // Store the music index for resume
          if (gameState.currentMusicIndex !== undefined) {
            currentMusicIndexRef.current = gameState.currentMusicIndex;
          }
        } else {
          setPlayerName(gameState.playerName || '');
          setIsNameSubmitted(gameState.isNameSubmitted || false);
          setGameActive(gameState.gameActive || false);
          setGameOver(gameState.gameOver || false);
          setGameWon(gameState.gameWon || false);
          setRandomArray(gameState.randomArray || []);
          setUserSelectionArray(gameState.userSelectionArray || []);
          setGameStarted(gameState.gameStarted || false);
          setSelectedMode(gameState.selectedMode || 'quickgame');
          setCurrentMusicIndex(gameState.currentMusicIndex || 0);
          setKingBadge(gameState.kingBadge || false);
          setWarningCount(gameState.warningCount || 0);
        }
      } catch (e) {
        console.error('Failed to load game state', e);
      }
    }
    setIsInitialLoad(false);
  }, []);

  // Handle resume game - FIXED to preserve music index
  const handleResumeGame = useCallback(() => {
    if (savedGameState) {
      setPlayerName(savedGameState.playerName || '');
      setIsNameSubmitted(savedGameState.isNameSubmitted || false);
      setGameActive(savedGameState.gameActive || false);
      setGameOver(savedGameState.gameOver || false);
      setGameWon(savedGameState.gameWon || false);
      setRandomArray(savedGameState.randomArray || []);
      setUserSelectionArray(savedGameState.userSelectionArray || []);
      setGameStarted(savedGameState.gameStarted || false);
      setSelectedMode(savedGameState.selectedMode || 'quickgame');
      
      // IMPORTANT: Use the saved music index, don't generate new random
      const savedIndex = savedGameState.currentMusicIndex !== undefined ? 
        savedGameState.currentMusicIndex : currentMusicIndexRef.current;
      
      console.log(`%c🔄 RESUMING game with saved music index: ${savedIndex}`, 'color: blue');
      setCurrentMusicIndex(savedIndex);
      
      setKingBadge(savedGameState.kingBadge || false);
      setWarningCount(savedGameState.warningCount || 0);

      if (savedGameState.gameStarted && !savedGameState.gameOver && !savedGameState.gameWon && savedGameState.randomArray.length > 0) {
        hasResumedRef.current = true;
      }

      setShowResumePrompt(false);
      setSavedGameState(null);

      if (!isMuted && savedGameState.gameStarted && !savedGameState.gameOver && !savedGameState.gameWon) {
        setTimeout(() => {
          startBackgroundMusic();
          startInactivityTimer();
        }, 500);
      }
    }
  }, [savedGameState, isMuted, startBackgroundMusic, startInactivityTimer]);

  // Handle restart game
  const handleRestartGame = useCallback(() => {
    setShowResumePrompt(false);
    setSavedGameState(null);
    localStorage.removeItem('simonGameState');

    setPlayerName('');
    setIsNameSubmitted(false);
    setGameActive(false);
    setGameOver(false);
    setGameWon(false);
    setGameStarted(false);
    setRandomArray([]);
    setUserSelectionArray([]);
    setActiveColor(null);
    setSelectedMode('quickgame');
    setCurrentMusicIndex(0);
    setWarningCount(0);
    setKingBadge(false);
  }, []);

  // Resume game after user chooses to continue
  useEffect(() => {
    if (!isInitialLoad && hasResumedRef.current && gameStarted && !gameOver && !gameWon && randomArray.length > 0) {
      console.log('Resuming game after user choice');
      hasResumedRef.current = false;

      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];

      setGameActive(false);

      let index = 0;

      const playNext = () => {
        if (index < randomArray.length) {
          const colorId = randomArray[index].toString();
          setActiveColor(colorId);
          playSound(colorId);

          setTimeout(() => {
            setActiveColor(null);
          }, 500);

          index++;
          const timeout = setTimeout(playNext, 600);
          timeoutsRef.current.push(timeout);
        } else {
          const timeout = setTimeout(() => {
            setGameActive(true);
            startInactivityTimer();
          }, 400);
          timeoutsRef.current.push(timeout);
        }
      };

      const startTimeout = setTimeout(playNext, 200);
      timeoutsRef.current.push(startTimeout);
    }
  }, [isInitialLoad, gameStarted, gameOver, gameWon, randomArray, playSound, startInactivityTimer]);

  // Save game state to localStorage - FIXED to include music index and warning count
  useEffect(() => {
    if (isInitialLoad) return;

    const gameState = {
      playerName,
      isNameSubmitted,
      gameActive,
      gameOver,
      gameWon,
      randomArray,
      userSelectionArray,
      gameStarted,
      selectedMode,
      currentMusicIndex, // Save the current music index
      warningCount,      // Save warning count
      kingBadge
    };
    localStorage.setItem('simonGameState', JSON.stringify(gameState));
  }, [playerName, isNameSubmitted, gameActive, gameOver, gameWon, randomArray, userSelectionArray, gameStarted, selectedMode, currentMusicIndex, warningCount, kingBadge, isInitialLoad]);

  // Save players to localStorage with limit of 20
  useEffect(() => {
    if (players.length > 0) {
      const trimmedPlayers = players.slice(0, 20);
      localStorage.setItem('simonPlayers', JSON.stringify(trimmedPlayers));
    }
  }, [players]);

  // Save mute preference
  useEffect(() => {
    localStorage.setItem('simonMuted', JSON.stringify(isMuted));
  }, [isMuted]);

  // Clear all timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutsRef.current.forEach(clearTimeout);
      if (inactivityIntervalRef.current) clearInterval(inactivityIntervalRef.current);
    };
  }, []);

  // Function to remove shadow
  const removeShadow = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setActiveColor(null);
    }, 500);
  }, []);

  // Function to beep a color
  const beep = useCallback((colorId) => {
    setActiveColor(colorId);
    playSound(colorId);
    removeShadow();
    resetInactivityTimer();
  }, [playSound, removeShadow, resetInactivityTimer]);

  // Function to blink a random box
  const boxBlink = useCallback(() => {
    const randomSelect = Math.floor(Math.random() * 4) + 1;

    setRandomArray(prev => [...prev, randomSelect]);
    setGameActive(false);
    beep(randomSelect.toString());

    const timeout = setTimeout(() => {
      setGameActive(true);
    }, 600);

    timeoutsRef.current.push(timeout);
  }, [beep]);

  // Start game - FIXED: Only generates random music on NEW game, preserves on resume
  const startGame = useCallback(() => {
    if (!selectedMode) {
      console.log('No mode selected');
      return;
    }

    console.log('%c🎮 Starting NEW game with mode: ' + selectedMode, 'color: green; font-size: 14px');
    
    initializeAudio();
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    setUserSelectionArray([]);
    setRandomArray([]);
    setGameActive(false);
    setGameOver(false);
    setGameWon(false);
    setGameStarted(true);
    
    // Generate random music index ONLY for new games
    const randomIndex = getRandomMusicIndex();
    console.log(`%c🎲 NEW GAME - Setting music index to: ${randomIndex}`, 'color: yellow');
    setCurrentMusicIndex(randomIndex);
    
    // Reset warning count for new game
    setWarningCount(0);
    setInactivitySeconds(20);

    // Stop current music and start fresh with random song
    stopBackgroundMusic();
    
    // Small delay to ensure music starts after game initializes
    setTimeout(() => {
      if (!isMuted) {
        console.log('Starting background music after delay with index:', randomIndex);
        startBackgroundMusic();
      } else {
        console.log('Music is muted, not starting');
      }
    }, 100);

    const timeout = setTimeout(() => {
      boxBlink();
    }, 100);

    timeoutsRef.current.push(timeout);
  }, [selectedMode, boxBlink, initializeAudio, stopBackgroundMusic, startBackgroundMusic, isMuted, getRandomMusicIndex]);

  // Handle color click
  const handleColorClick = useCallback((colorId) => {
    if (!gameActive || gameOver || gameWon || !gameStarted) return;

    beep(colorId);

    const newUserSelection = [...userSelectionArray, parseInt(colorId)];
    setUserSelectionArray(newUserSelection);

    if (newUserSelection.length === randomArray.length) {
      if (newUserSelection.toString() === randomArray.toString()) {
        const timeout = setTimeout(() => {
          boxBlink();
        }, 1000);

        timeoutsRef.current.push(timeout);
        setUserSelectionArray([]);
      } else {
        setGameOver(true);
        setGameActive(false);
        setGameStarted(false);
        playSound('gameover');
        stopBackgroundMusic();
        stopInactivityTimer();

        if (randomArray.length - 1 > 0) {
          const newPlayer = {
            id: Date.now(),
            name: playerName,
            score: randomArray.length - 1,
            mode: selectedMode,
            date: new Date().toLocaleDateString(),
            kingBadge: false
          };

          setPlayers(prev => {
            const updated = [newPlayer, ...prev].sort((a, b) => b.score - a.score).slice(0, 20);
            return updated;
          });
        }
      }
    }
  }, [gameActive, gameOver, gameWon, gameStarted, userSelectionArray, randomArray, playerName, selectedMode, beep, boxBlink, playSound, stopBackgroundMusic, stopInactivityTimer]);

  // Reset game and go back to name entry
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
    setGameStarted(false);
    setRandomArray([]);
    setUserSelectionArray([]);
    setActiveColor(null);
    setSelectedMode('quickgame');
    setCurrentMusicIndex(0);
    setWarningCount(0);
    setKingBadge(false);

    localStorage.removeItem('simonGameState');
  }, [stopInactivityTimer, stopBackgroundMusic]);

  // Play again with same player
  const playAgain = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    stopInactivityTimer();
    stopBackgroundMusic();

    setGameActive(false);
    setGameOver(false);
    setGameWon(false);
    setGameStarted(false);
    setRandomArray([]);
    setUserSelectionArray([]);
    setActiveColor(null);
    // Don't reset music index - will be set by startGame
    setWarningCount(0);
    setShowVictoryModal(false);
  }, [stopInactivityTimer, stopBackgroundMusic]);

  const getGlowStyle = useCallback((color) => {
    if (activeColor === color.id) {
      const shadowMap = {
        '1': '0 0 30px 15px rgba(239,68,68,0.95)',
        '2': '0 0 30px 15px rgba(59,130,246,0.95)',
        '3': '0 0 30px 15px rgba(34,197,94,0.95)',
        '4': '0 0 30px 15px rgba(255,255,255,0.85)'
      };
      return {
        boxShadow: shadowMap[color.id],
        transform: 'scale(1.02)',
        transition: 'all 0.1s ease-out',
        zIndex: 10
      };
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
    return `${index + 1}.`;
  };

  const closeOverlays = () => {
    setShowLeftOverlay(false);
    setShowRightOverlay(false);
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (playerName.trim()) {
      setIsNameSubmitted(true);
    }
  };

  const selectMode = (mode) => {
    // Can't change mode during game
    if (gameStarted && !gameOver && !gameWon) return;
    console.log('Selected mode:', mode);
    setSelectedMode(mode);
    // Reset music index when mode changes
    setCurrentMusicIndex(0);
  };

  // Show name screen if name not submitted
  if (!isNameSubmitted) {
    return (
      <NameScreen 
        playerName={playerName}
        setPlayerName={setPlayerName}
        handleNameSubmit={handleNameSubmit}
      />
    );
  }

  return (
    <div className="game-container min-h-screen w-full bg-gradient-to-br from-slate-900 to-purple-900 p-2 sm:p-4 relative overflow-x-hidden">

      {/* Modals */}
      <WarningModal 
        show={showWarningModal}
        onContinue={resumeGame}
        onQuit={quitGame}
      />

      <VictoryModal 
        show={showVictoryModal}
        selectedMode={selectedMode}
        score={randomArray.length - 1}
        onPlayAgain={playAgain}
      />

      <ResumeModal 
        show={showResumePrompt}
        playerName={savedGameState?.playerName}
        score={savedGameState?.randomArray?.length - 1}
        onContinue={handleResumeGame}
        onRestart={handleRestartGame}
      />

      <GameOverModal 
        show={gameOver && !gameWon}
        score={randomArray.length - 1}
        onPlayAgain={playAgain}
        onNewPlayer={newPlayer}
      />

      {/* Mobile Floating Buttons */}
      <MobileFloatingButtons 
        showLeftOverlay={showLeftOverlay}
        showRightOverlay={showRightOverlay}
        setShowLeftOverlay={setShowLeftOverlay}
        setShowRightOverlay={setShowRightOverlay}
        toggleMute={toggleMute}
        isMuted={isMuted}
        closeOverlays={closeOverlays}
      />

      {/* Main layout */}
      <div className="main-layout w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-4 lg:gap-6 p-4">

        {/* Left Column - Desktop */}
        <LeftColumn playerName={playerName} kingBadge={kingBadge} />

        {/* Middle Column - Game Board */}
        <div className="w-full">
          <GameBoard 
            playerName={playerName}
            kingBadge={kingBadge}
            gameStarted={gameStarted}
            gameActive={gameActive}
            gameOver={gameOver}
            gameWon={gameWon}
            randomArray={randomArray}
            activeColor={activeColor}
            selectedMode={selectedMode}
            isMuted={isMuted}
            toggleMute={toggleMute}
            inactivitySeconds={inactivitySeconds}
            startGame={startGame}
            handleColorClick={handleColorClick}
            getGlowStyle={getGlowStyle}
            selectMode={selectMode}
          />
        </div>

        {/* Right Column - Desktop */}
        <RightColumn 
          players={players}
          setPlayers={setPlayers}
          getRankStyle={getRankStyle}
          getRankIcon={getRankIcon}
        />
      </div>
    </div>
  );
};

export default SimonGame;