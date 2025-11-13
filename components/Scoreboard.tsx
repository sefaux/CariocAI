import React, { useState, useEffect, useRef } from 'react';
import { Player } from '../types';
import { ROUNDS_DATA } from '../constants';
import { useTranslation } from '../hooks/useTranslation';

interface ScoreboardProps {
  players: Player[];
  currentRound: number;
  onRecordScores: (scores: (number | null)[]) => void;
  onNewGame: () => void;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ players, currentRound, onRecordScores, onNewGame }) => {
  const [roundScores, setRoundScores] = useState<Record<number, string>>({});
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    const initialScores: Record<number, string> = {};
    players.forEach(p => {
      initialScores[p.id] = '';
    });
    setRoundScores(initialScores);
    inputRefs.current = new Array(players.length);
  }, [currentRound, players]);

  const handleScoreChange = (playerId: number, score: string) => {
    if (score === '') {
        setRoundScores(prev => ({ ...prev, [playerId]: '' }));
        return;
    }
    const numericValue = parseInt(score, 10);
    if (!isNaN(numericValue)) {
        const clampedValue = Math.max(0, Math.min(240, numericValue));
        setRoundScores(prev => ({ ...prev, [playerId]: String(clampedValue) }));
    }
  };

  const areAllScoresEntered = players.every(p => roundScores[p.id] !== undefined && /^\d+$/.test(roundScores[p.id]));

  const handleSubmitScores = () => {
    if (!areAllScoresEntered) return;
    const scoresToSubmit = players.map(p => {
        const scoreStr = roundScores[p.id];
        const score = parseInt(scoreStr, 10);
        return isNaN(score) ? 0 : score;
    });
    onRecordScores(scoresToSubmit);
  };
  
  const calculateTotal = (player: Player) => {
    return player.scores.reduce((acc, score) => acc + (score || 0), 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, currentIndex: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      // Find the next empty input, wrapping around
      for (let i = 1; i <= players.length; i++) {
        const nextIndex = (currentIndex + i) % players.length;
        const nextPlayer = players[nextIndex];
        if (roundScores[nextPlayer.id] === '' || roundScores[nextPlayer.id] === undefined) {
          inputRefs.current[nextIndex]?.focus();
          return;
        }
      }
      
      if (areAllScoresEntered) {
        handleSubmitScores();
      }
    }
  };
  
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmitScores();
  };


  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 pt-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{t('round')} {currentRound + 1}</h1>
                    <p className="text-xl text-blue-600 font-semibold">{t(`roundName_${ROUNDS_DATA[currentRound].key}`)}</p>
                </div>
                <button
                    onClick={onNewGame}
                    className="mt-4 sm:mt-0 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                    {t('startNewGame')}
                </button>
            </div>
        </div>

        <form onSubmit={handleSubmitForm} className="overflow-x-auto bg-white/90 backdrop-blur-md rounded-2xl shadow-xl">
          <table className="w-full text-sm text-left text-gray-800">
            <thead className="text-xs text-gray-500 uppercase bg-gray-200/80">
              <tr>
                <th scope="col" className="px-6 py-3 rounded-tl-2xl">{t('round')}</th>
                {players.map(player => (
                  <th key={player.id} scope="col" className="px-6 py-3 text-center">{player.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROUNDS_DATA.map((round, roundIndex) => (
                <tr key={roundIndex} className={`border-b border-gray-200/50 ${roundIndex === currentRound ? 'bg-blue-100/70' : 'bg-white/80'}`}>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{t(`roundName_${round.key}`)}</td>
                  {players.map((player, playerIndex) => (
                    <td key={player.id} className="px-6 py-4 text-center">
                      {roundIndex < currentRound ? (
                        player.scores[roundIndex]
                      ) : roundIndex === currentRound ? (
                        <input
                          type="number"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          min="0"
                          max="240"
                          // FIX: Use a block body for the ref callback to avoid returning a value.
                          ref={(el) => {inputRefs.current[playerIndex] = el;}}
                          onKeyDown={(e) => handleKeyDown(e, playerIndex)}
                          enterKeyHint={areAllScoresEntered ? 'done' : 'next'}
                          value={roundScores[player.id] || ''}
                          onChange={(e) => handleScoreChange(player.id, e.target.value)}
                          className="w-20 bg-gray-100 text-gray-900 border border-gray-300 rounded-md px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={t('scorePoints')}
                        />
                      ) : (
                        '-'
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-200/80 text-gray-900 font-bold">
              <tr>
                <td className="px-6 py-4 rounded-bl-2xl uppercase">{t('total')}</td>
                {players.map(player => (
                  <td key={player.id} className="px-6 py-4 text-center text-lg">{calculateTotal(player)}</td>
                ))}
              </tr>
            </tfoot>
          </table>
        </form>

        <div className="mt-6 flex justify-end">
            <button
                onClick={handleSubmitScores}
                disabled={!areAllScoresEntered}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-200 text-lg"
                >
                {t('recordScores')}
            </button>
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;