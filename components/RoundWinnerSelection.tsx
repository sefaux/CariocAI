import React from 'react';
import { Player } from '../types';
import { useTranslation } from '../hooks/useTranslation';

interface ActiveRound {
    key: string;
}

interface RoundWinnerSelectionProps {
  players: Player[];
  currentRound: number;
  activeRounds: ActiveRound[];
  onSelectWinner: (winnerId: number) => void;
  onNewGame: () => void;
  onSkipRound: () => void;
}

const RoundWinnerSelection: React.FC<RoundWinnerSelectionProps> = ({ players, currentRound, activeRounds, onSelectWinner, onNewGame, onSkipRound }) => {
  const { t } = useTranslation();
  const round = activeRounds[currentRound];
  const canSkip = ["three_runs", "dirty_run", "royal_run"].includes(round.key);
  const is13CardsRound = ["dirty_run", "royal_run"].includes(round.key);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 pt-16 sm:pt-24">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">{t('round')} {currentRound + 1}</h1>
            <p className="text-xl text-blue-600 font-semibold">{t(`roundName_${round.key}`)}</p>
            <p className="text-gray-500 mt-1">{t(`roundDescription_${round.key}`)}</p>
            {is13CardsRound && <p className="text-yellow-600 mt-2 text-sm">{t('thirteenCardRoundInfo')}</p>}
        </div>
        
        <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800">{t('whoWonTheRound')}</h2>
            <p className="text-gray-500 mt-1">{t('winnerGetsZero')}</p>
        </div>

        <div className="space-y-3">
          {players.map((player) => (
            <button
              key={player.id}
              onClick={() => onSelectWinner(player.id)}
              className="w-full bg-gray-200 hover:bg-blue-600 text-gray-900 hover:text-white font-bold py-4 px-4 rounded-lg transition-all duration-200 text-lg"
            >
              {player.name}
            </button>
          ))}
        </div>
        
        {canSkip && (
             <button
                onClick={onSkipRound}
                className="w-full bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
                {t('skipRound')}
            </button>
        )}

        <div className="pt-4 border-t border-gray-200">
             <button
                onClick={onNewGame}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
                {t('startNewGame')}
            </button>
        </div>
      </div>
    </div>
  );
};

export default RoundWinnerSelection;