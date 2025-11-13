import React from 'react';
import { Player } from '../types';
import { CrownIcon } from './icons';
import { useTranslation } from '../hooks/useTranslation';

interface GameEndProps {
  players: Player[];
  onNewGame: () => void;
}

const GameEnd: React.FC<GameEndProps> = ({ players, onNewGame }) => {
  const { t } = useTranslation();

  const calculateTotal = (player: Player) => {
    return player.scores.reduce((acc, score) => acc + (score || 0), 0);
  };

  const sortedPlayers = [...players].sort((a, b) => calculateTotal(a) - calculateTotal(b));
  const winnerScore = calculateTotal(sortedPlayers[0]);
  const winners = sortedPlayers.filter(p => calculateTotal(p) === winnerScore);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 pt-16 sm:pt-24">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-900">{t('gameFinished')}</h1>
        
        <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-yellow-500">{winners.length > 1 ? t('winnersAre') : t('winnerIs')}</h2>
            {winners.map(winner => (
                 <div key={winner.id} className="flex items-center justify-center space-x-2 text-3xl font-bold text-green-600">
                    <CrownIcon />
                    <span>{winner.name}</span>
                 </div>
            ))}
            <p className="text-gray-500">{t('withPoints', { score: winnerScore })}</p>
        </div>

        <div>
            <h3 className="text-xl font-semibold text-gray-700 border-b border-gray-200 pb-2 mb-3">{t('finalResults')}</h3>
            <ul className="divide-y divide-gray-200 text-left">
                {sortedPlayers.map((player, index) => (
                    <li key={player.id} className="flex justify-between items-center py-3">
                        <span className={`text-lg ${winners.some(w => w.id === player.id) ? 'text-green-600' : 'text-gray-900'}`}>
                            {index + 1}. {player.name}
                        </span>
                        <span className="font-semibold text-lg">{calculateTotal(player)} {t('scorePoints')}</span>
                    </li>
                ))}
            </ul>
        </div>
        
        <button
          onClick={onNewGame}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 text-lg"
        >
          {t('playAgain')}
        </button>
      </div>
    </div>
  );
};

export default GameEnd;