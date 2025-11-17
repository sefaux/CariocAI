import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { ROUNDS_DATA } from '../constants';
import { Player } from '../types';

interface ChangeRoundModalProps {
  onClose: () => void;
  onSelectRound: (roundKey: string) => void;
  players: Player[];
  currentRoundKey: string;
}

const ChangeRoundModal: React.FC<ChangeRoundModalProps> = ({ onClose, onSelectRound, players, currentRoundKey }) => {
  const { t } = useTranslation();

  const isRoundCompleted = (roundKey: string) => {
    const roundIndex = ROUNDS_DATA.findIndex(r => r.key === roundKey);
    return players.some(p => p.scores[roundIndex] !== null);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="w-full max-w-lg bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 space-y-4" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-center text-gray-900">{t('changeRound')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm max-h-[60vh] overflow-y-auto pr-2">
            {ROUNDS_DATA.map(round => {
                const completed = isRoundCompleted(round.key);
                const isCurrent = round.key === currentRoundKey;
                return (
                    <button
                        key={round.key}
                        disabled={completed}
                        onClick={() => onSelectRound(round.key)}
                        className={`p-3 rounded-lg text-left transition-colors ${
                            isCurrent ? 'bg-blue-600 text-white ring-2 ring-blue-300' : 
                            completed ? 'bg-gray-300/80 text-gray-500 cursor-not-allowed line-through' : 
                            'bg-gray-200 hover:bg-gray-300'
                        }`}
                    >
                        <span className="font-semibold">{t(`roundName_${round.key}`)}</span>
                        {completed && <span className="text-xs ml-2">({t('completed')})</span>}
                    </button>
                );
            })}
        </div>
        <button 
            onClick={onClose}
            className="w-full mt-2 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
            {t('cancel')}
        </button>
      </div>
    </div>
  );
};

export default ChangeRoundModal;
