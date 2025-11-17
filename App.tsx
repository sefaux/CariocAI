import React, { useState, useCallback, useEffect } from 'react';
import { Player, GamePhase, GameSettings, Card } from './types';
import { ROUNDS_DATA, DEFAULT_CARD_SCORES } from './constants';
import PlayerSetup from './components/PlayerSetup';
import RoundWinnerSelection from './components/RoundWinnerSelection';
import RoundScoreInput from './components/RoundScoreInput';
import Standings from './components/Standings';
import GameEnd from './components/GameEnd';
import CardScanner from './components/CardScanner';
import ScanConfirmation from './components/ScanConfirmation';
import { useTranslation } from './hooks/useTranslation';

import { GoogleGenAI, Type } from "@google/genai";

const SETTINGS_KEY = 'cariocaGameSettings';
const GAME_STATE_KEY = 'cariocaGameState';

const App: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [gamePhase, setGamePhase] = useState<GamePhase>(GamePhase.Setup);
  const [currentRound, setCurrentRound] = useState(0);
  const [roundWinnerId, setRoundWinnerId] = useState<number | null>(null);
  const { t } = useTranslation();
  const [savedGameExists, setSavedGameExists] = useState(false);
  
  const [gameSettings, setGameSettings] = useState<GameSettings>(() => {
    try {
        const savedSettings = localStorage.getItem(SETTINGS_KEY);
        if (savedSettings) {
            const parsed = JSON.parse(savedSettings);
            if (parsed.cardScores && parsed.enabledRounds) {
                return parsed;
            }
        }
    } catch (error) {
        console.error("Failed to load settings from localStorage", error);
    }
    return {
        cardScores: DEFAULT_CARD_SCORES,
        enabledRounds: ROUNDS_DATA.map(r => r.key),
    };
  });
  const [roundScores, setRoundScores] = useState<Record<number, string>>({});

  // State for scanning flow
  const [scanningPlayerId, setScanningPlayerId] = useState<number | null>(null);
  const [lastScan, setLastScan] = useState<{image: string; cards: Card[]; score: number;} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for a saved game only once on initial mount
  useEffect(() => {
    try {
      const savedStateJSON = localStorage.getItem(GAME_STATE_KEY);
      if (savedStateJSON) {
        const savedState = JSON.parse(savedStateJSON);
        // A valid saved game must have players and not be in the setup phase.
        if (savedState.players && savedState.players.length > 0 && savedState.gamePhase !== GamePhase.Setup) {
          setSavedGameExists(true);
        } else {
          // Clean up invalid or obsolete game states from storage.
          localStorage.removeItem(GAME_STATE_KEY);
          setSavedGameExists(false);
        }
      } else {
        setSavedGameExists(false);
      }
    } catch {
      // If parsing fails, the stored data is corrupt, so clean it up.
      localStorage.removeItem(GAME_STATE_KEY);
      setSavedGameExists(false);
    }
  }, []);

  // Save game settings whenever they change
  useEffect(() => {
    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(gameSettings));
    } catch (error) {
        console.error("Failed to save settings to localStorage", error);
    }
  }, [gameSettings]);
  
  // Save game state whenever it changes, but only if the game is active.
  useEffect(() => {
    if (gamePhase !== GamePhase.Setup && players.length > 0) {
      try {
        const gameState = { players, gamePhase, currentRound, roundWinnerId, roundScores };
        localStorage.setItem(GAME_STATE_KEY, JSON.stringify(gameState));
      } catch (error) {
        console.error("Failed to save game state", error);
      }
    }
  }, [players, gamePhase, currentRound, roundWinnerId, roundScores]);


  const activeRounds = ROUNDS_DATA.filter(r => gameSettings.enabledRounds.includes(r.key));

  const handleAddPlayer = (name: string) => {
    const newPlayer: Player = {
      id: Date.now(),
      name,
      scores: Array(ROUNDS_DATA.length).fill(null),
    };
    setPlayers(prev => [...prev, newPlayer]);
  };

  const handleRemovePlayer = (id: number) => {
    setPlayers(prev => prev.filter(p => p.id !== id));
  };

  const handleStartGame = () => {
    // Explicitly clear any previous game state when starting a new game.
    localStorage.removeItem(GAME_STATE_KEY);
    setSavedGameExists(false);

    if (players.length >= 2 && activeRounds.length > 0) {
      const initialPlayers = players.map(p => ({
        ...p,
        scores: Array(ROUNDS_DATA.length).fill(null),
      }));
      setPlayers(initialPlayers);
      setCurrentRound(0);
      setRoundWinnerId(null);
      setGamePhase(GamePhase.WinnerSelection);
    }
  };

  const handleContinueGame = () => {
    try {
      const savedStateJSON = localStorage.getItem(GAME_STATE_KEY);
      if (savedStateJSON) {
        const savedState = JSON.parse(savedStateJSON);
        setPlayers(savedState.players || []);
        setGamePhase(savedState.gamePhase || GamePhase.Setup);
        setCurrentRound(savedState.currentRound || 0);
        setRoundWinnerId(savedState.roundWinnerId || null);
        setRoundScores(savedState.roundScores || {});
      }
    } catch (error) {
      console.error("Failed to load game state", error);
      localStorage.removeItem(GAME_STATE_KEY);
      setSavedGameExists(false);
    }
  };
  
  const initRoundScores = useCallback((winnerId: number) => {
    const initialScores: Record<number, string> = {};
    players.forEach(p => {
      initialScores[p.id] = p.id === winnerId ? '0' : '';
    });
    setRoundScores(initialScores);
  }, [players]);

  const handleSelectWinner = (winnerId: number) => {
    setRoundWinnerId(winnerId);
    initRoundScores(winnerId);
    setGamePhase(GamePhase.ScoreInput);
  };
  
  const handleSkipRound = () => {
     setPlayers(prevPlayers => 
        prevPlayers.map(player => {
            const newScores = [...player.scores];
            const roundIndex = ROUNDS_DATA.findIndex(r => r.key === activeRounds[currentRound].key);
            if (roundIndex !== -1) {
              newScores[roundIndex] = 0;
            }
            return { ...player, scores: newScores };
        })
    );
    setGamePhase(GamePhase.Standings);
  };

  const handleRecordScores = () => {
     const scoresForRound = players.map(p => {
        const scoreStr = roundScores[p.id];
        const score = parseInt(scoreStr, 10);
        return isNaN(score) ? null : score;
    });
    setPlayers(prevPlayers => 
        prevPlayers.map((player, index) => {
            const newScores = [...player.scores];
            const roundIndex = ROUNDS_DATA.findIndex(r => r.key === activeRounds[currentRound].key);
            if (roundIndex !== -1) {
              newScores[roundIndex] = scoresForRound[index];
            }
            return { ...player, scores: newScores };
        })
    );
    setGamePhase(GamePhase.Standings);
  };
  
  const handleNextRound = () => {
    if (currentRound < activeRounds.length - 1) {
        setCurrentRound(prev => prev + 1);
        setRoundWinnerId(null);
        setGamePhase(GamePhase.WinnerSelection);
    } else {
        setGamePhase(GamePhase.Finished);
    }
  };

  const handleNewGame = () => {
    localStorage.removeItem(GAME_STATE_KEY);
    setSavedGameExists(false);
    setPlayers([]);
    setCurrentRound(0);
    setRoundWinnerId(null);
    setGamePhase(GamePhase.Setup);
  };

  const handleChangeRound = (newRoundKey: string) => {
    const currentRoundKey = activeRounds[currentRound].key;
    if (newRoundKey === currentRoundKey) return;

    let newEnabledRounds = [...gameSettings.enabledRounds];
    if (!newEnabledRounds.includes(newRoundKey)) {
        newEnabledRounds.push(newRoundKey);
    }

    const orderedEnabledRounds = ROUNDS_DATA
      .map(r => r.key)
      .filter(key => newEnabledRounds.includes(key));
    
    const newActiveRounds = ROUNDS_DATA.filter(r => orderedEnabledRounds.includes(r.key));
    const newCurrentRoundIndex = newActiveRounds.findIndex(r => r.key === newRoundKey);

    if (newCurrentRoundIndex !== -1) {
        setGameSettings(prev => ({ ...prev, enabledRounds: orderedEnabledRounds }));
        setCurrentRound(newCurrentRoundIndex);
    }
  };

  // --- Scanning Flow Handlers ---

  const handleStartScan = (playerId: number) => {
    setScanningPlayerId(playerId);
    setGamePhase(GamePhase.Scanning);
  };
  
  const handleCancelScan = () => {
    setScanningPlayerId(null);
    setGamePhase(GamePhase.ScoreInput);
  };
  
  const scoreCard = (rank: string): number => {
      const upperRank = (rank || '').toUpperCase();
      
      if (gameSettings.cardScores.hasOwnProperty(upperRank)) {
          return gameSettings.cardScores[upperRank];
      }

      return gameSettings.cardScores['Joker'] || 30;
  };

  const handleImageScanned = async (imageData: string) => {
    setIsLoading(true);
    setError(null);
    setGamePhase(GamePhase.ScoreInput); 

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const model = 'gemini-2.5-flash';
        
        const schema = {
            type: Type.OBJECT,
            properties: {
                cards: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            rank: { type: Type.STRING, description: "Card rank (A, 2-10, J, Q, K, Joker)" },
                            suit: { type: Type.STRING, description: "Card suit (use one of: Hearts, Diamonds, Clubs, Spades, Joker)" }
                        }
                    }
                }
            }
        };

        const prompt = `Analyze the image to identify all playing cards.
Your output MUST be a JSON object that strictly follows the provided schema.
**CRITICAL INSTRUCTIONS TO AVOID ERRORS:**
1. Your primary goal is to return a valid JSON response, NOT to fail.
2. For every potential card you see, attempt to identify its rank and suit.
3. Valid Ranks: 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'Joker'.
4. Valid Suits: 'Hearts', 'Diamonds', 'Clubs', 'Spades', 'Joker'.
5. **FAILURE AVOIDANCE RULE:** If you have ANY uncertainty about a card's rank or suit due to blur, angle, lighting, or any other issue, you MUST classify that card's rank AND suit as 'Joker'.
6. If you cannot identify any cards at all, you MUST return a JSON object with an empty 'cards' array: {"cards": []}.
7. DO NOT output any text or explanation outside of the JSON structure. Your entire response must be the JSON object.`;

        const response = await ai.models.generateContent({
            model,
            contents: {
                parts: [
                    { text: prompt },
                    { inlineData: { mimeType: 'image/jpeg', data: imageData.split(',')[1] } }
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            }
        });
        
        const jsonText = response.text;
        const result = JSON.parse(jsonText);
        const detectedCards: Card[] = result.cards || [];
        const totalScore = detectedCards.reduce((sum, card) => sum + scoreCard(card.rank), 0);
        
        setLastScan({ image: imageData, cards: detectedCards, score: totalScore });
        setGamePhase(GamePhase.ScanConfirmation);

    } catch (e) {
        console.error("Card recognition API error:", e);
        setError(t('cardRecognitionError'));
        setScanningPlayerId(null); 
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleConfirmScan = (cards: Card[], score: number) => {
      if (scanningPlayerId) {
          setRoundScores(prev => ({
              ...prev,
              [scanningPlayerId]: String(score)
          }));
      }
      setScanningPlayerId(null);
      setLastScan(null);
      setGamePhase(GamePhase.ScoreInput);
  };
  
  const handleRetryScan = () => {
      setGamePhase(GamePhase.Scanning);
  };

  const renderContent = () => {
    switch (gamePhase) {
      case GamePhase.Setup:
        return <PlayerSetup players={players} onAddPlayer={handleAddPlayer} onRemovePlayer={handleRemovePlayer} onStartGame={handleStartGame} gameSettings={gameSettings} setGameSettings={setGameSettings} onContinueGame={handleContinueGame} savedGameExists={savedGameExists} />;
      case GamePhase.WinnerSelection:
        return <RoundWinnerSelection players={players} currentRound={currentRound} onSelectWinner={handleSelectWinner} onNewGame={handleNewGame} onSkipRound={handleSkipRound} activeRounds={activeRounds} onChangeRound={handleChangeRound} />;
      case GamePhase.ScoreInput:
        if (roundWinnerId === null) {
            setGamePhase(GamePhase.WinnerSelection);
            return null;
        }
        return <RoundScoreInput players={players} currentRound={currentRound} roundWinnerId={roundWinnerId} onRecordScores={handleRecordScores} onStartScan={handleStartScan} roundScores={roundScores} setRoundScores={setRoundScores} isLoading={isLoading} error={error} setError={setError} cardScores={gameSettings.cardScores} activeRounds={activeRounds} />;
      case GamePhase.Standings:
        // FIX: Pass gameSettings prop to the Standings component.
        return <Standings players={players} currentRound={currentRound} onNextRound={handleNextRound} activeRounds={activeRounds} gameSettings={gameSettings} />;
      case GamePhase.Finished:
        return <GameEnd players={players} onNewGame={handleNewGame} />;
      case GamePhase.Scanning:
        return <CardScanner onScan={handleImageScanned} onCancel={handleCancelScan} />;
      case GamePhase.ScanConfirmation:
          if (!lastScan) return null;
          return <ScanConfirmation {...lastScan} onConfirm={handleConfirmScan} onRetry={handleRetryScan} scoreCard={scoreCard} />;
      default:
        return null;
    }
  };

  return <div>{renderContent()}</div>;
};

export default App;
