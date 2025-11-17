import React, { useState } from 'react';
import { Player, GameSettings } from '../types';
import { PlusIcon, TrashIcon } from './icons';
import { ROUNDS_DATA } from '../constants';
import InstructionsModal from './InstructionsModal';
import { useTranslation } from '../hooks/useTranslation';

interface SettingsModalProps {
  onClose: () => void;
  gameSettings: GameSettings;
  setGameSettings: React.Dispatch<React.SetStateAction<GameSettings>>;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, gameSettings, setGameSettings }) => {
  const { t, locale, setLocale } = useTranslation();

  const handleToggleRound = (roundKey: string) => {
    setGameSettings(prev => {
        const enabledRounds = prev.enabledRounds.includes(roundKey)
            ? prev.enabledRounds.filter(r => r !== roundKey)
            : [...prev.enabledRounds, roundKey];
        return {...prev, enabledRounds};
    });
  };

  const handleScoreChange = (card: string, value: string) => {
    const score = parseInt(value, 10);
    if (!isNaN(score)) {
        setGameSettings(prev => ({
            ...prev,
            cardScores: {
                ...prev.cardScores,
                [card]: score
            }
        }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="w-full max-w-lg bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 space-y-4" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-center text-gray-900">{t('settings')}</h2>
        
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <div>
                <h3 className="font-semibold text-lg text-gray-800 mb-2 border-b pb-1">{t('language')}</h3>
                <div className="flex space-x-2">
                     <button
                        onClick={() => setLocale('es')}
                        className={`w-full py-2 px-4 rounded-lg transition-colors ${
                            locale === 'es' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                    >
                        Español
                    </button>
                    <button
                        onClick={() => setLocale('en')}
                        className={`w-full py-2 px-4 rounded-lg transition-colors ${
                            locale === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                    >
                        English
                    </button>
                </div>
            </div>

            <div>
                <h3 className="font-semibold text-lg text-gray-800 mb-2 border-b pb-1">{t('rounds')}</h3>
                 <div className="grid grid-cols-2 gap-2 text-sm">
                    {ROUNDS_DATA.map(round => (
                        <label key={round.key} className="flex items-center space-x-2 p-1 rounded-md hover:bg-gray-100">
                            <input type="checkbox" checked={gameSettings.enabledRounds.includes(round.key)} onChange={() => handleToggleRound(round.key)} className="form-checkbox h-4 w-4 rounded bg-gray-300 border-gray-400 text-blue-500 focus:ring-blue-500"/>
                            <span>{t(`roundName_${round.key}`)}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="font-semibold text-lg text-gray-800 mb-2 border-b pb-1">{t('scores')}</h3>
                <p className="text-sm text-gray-500 mb-2">{t('cardScoresForScanner')}</p>
                <div className="grid grid-cols-3 gap-x-4 gap-y-2 text-sm">
                    {Object.entries(gameSettings.cardScores).map(([card, score]) => (
                        <div key={card} className="flex items-center space-x-2">
                            <label className="w-8 font-mono">{card}:</label>
                            <input 
                                type="number" 
                                value={score} 
                                onChange={(e) => handleScoreChange(card, e.target.value)}
                                className="w-16 bg-gray-200 text-gray-900 border border-gray-300 rounded-md px-2 py-1 text-center"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <button 
            onClick={onClose}
            className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
            {t('close')}
        </button>
      </div>
    </div>
  );
};

interface PlayerSetupProps {
  players: Player[];
  gameSettings: GameSettings;
  onAddPlayer: (name: string) => void;
  onRemovePlayer: (id: number) => void;
  onStartGame: () => void;
  setGameSettings: React.Dispatch<React.SetStateAction<GameSettings>>;
  onContinueGame: () => void;
  savedGameExists: boolean;
}

const PlayerSetup: React.FC<PlayerSetupProps> = ({ players, onAddPlayer, onRemovePlayer, onStartGame, gameSettings, setGameSettings, onContinueGame, savedGameExists }) => {
  const [playerName, setPlayerName] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const { t } = useTranslation();

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      onAddPlayer(playerName.trim());
      setPlayerName('');
    }
  };

  return (
    <>
    {showInstructions && <InstructionsModal onClose={() => setShowInstructions(false)} />}
    {showSettings && <SettingsModal onClose={() => setShowSettings(false)} gameSettings={gameSettings} setGameSettings={setGameSettings} />}
    <div className="min-h-screen flex flex-col items-center justify-start p-4 pt-16 sm:pt-24">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 space-y-6">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900">{t('title')}</h1>
                <p className="text-gray-500 mt-2">{t('setupSubtitle')}</p>
            </div>
            
            <form onSubmit={handleAddPlayer} className="flex space-x-2">
            <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder={t('playerNamePlaceholder')}
                className="flex-grow bg-gray-200 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded-lg flex items-center justify-center transition-colors duration-200">
                <PlusIcon />
            </button>
            </form>

            <div className="space-y-3">
                <h2 className="text-lg font-semibold text-gray-700 border-b border-gray-300 pb-2">{t('players')}</h2>
                {players.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                    {players.map((player) => (
                    <li key={player.id} className="flex items-center justify-between py-3">
                        <span className="text-gray-900 text-lg">{player.name}</span>
                        <button onClick={() => onRemovePlayer(player.id)} className="text-red-600 hover:text-red-500 transition-colors">
                        <TrashIcon />
                        </button>
                    </li>
                    ))}
                </ul>
                ) : (
                    <p className="text-gray-500 text-center py-4">{t('addAtLeastTwo')}</p>
                )}
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-200">
                {savedGameExists && (
                    <button
                        onClick={onContinueGame}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 text-lg"
                    >
                        {t('continueGame')}
                    </button>
                )}
                <button
                    onClick={onStartGame}
                    disabled={players.length < 2 || gameSettings.enabledRounds.length === 0}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-200 text-lg"
                    >
                    {savedGameExists ? t('startNewGame') : t('startGame')}
                </button>
                <button
                    onClick={() => setShowSettings(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                    {t('settings')}
                </button>
                <button
                    onClick={() => setShowInstructions(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                    {t('gameInstructions')}
                </button>
            </div>
        </div>
    </div>
    </>
  );
};

export default PlayerSetup;
