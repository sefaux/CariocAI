import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

interface HelpModalProps {
  cardScores: Record<string, number>;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ cardScores, onClose }) => {
  const { t } = useTranslation();
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="w-full max-w-sm bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 space-y-4" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-center text-gray-900">{t('cardScores')}</h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-lg text-gray-700 p-4 bg-gray-100 rounded-lg">
            {Object.entries(cardScores).map(([card, score]) => (
                <div key={card} className="flex justify-between">
                    <span className="font-semibold">{card}:</span>
                    <span>{score} {t('scorePoints')}</span>
                </div>
            ))}
        </div>
        <button 
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
            {t('close')}
        </button>
      </div>
    </div>
  );
};

export default HelpModal;
