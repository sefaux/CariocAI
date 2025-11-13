import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

interface InstructionsModalProps {
  onClose: () => void;
}

const InstructionsModal: React.FC<InstructionsModalProps> = ({ onClose }) => {
  const { t } = useTranslation();
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="w-full max-w-lg bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 space-y-4" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-center text-gray-900">{t('howToPlay')}</h2>
        <div className="text-gray-700 space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            <p><strong className="text-blue-600">{t('objective')}</strong> {t('objectiveText')}</p>
            
            <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-1">{t('theGame')}</h3>
                <ul className="list-disc list-inside space-y-1">
                    <li>{t('gameRule1')}</li>
                    <li>{t('gameRule2')}</li>
                    <li>{t('gameRule3')}</li>
                    <li>{t('gameRule4')}</li>
                    <li>{t('gameRule5')}</li>
                </ul>
            </div>
             <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-1">{t('jokerRules')}</h3>
                <ul className="list-disc list-inside space-y-1">
                    <li>{t('jokerRule1')}</li>
                    <li>{t('jokerRule2')}</li>
                </ul>
            </div>
             <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-1">{t('scoring')}</h3>
                <ul className="list-disc list-inside space-y-1">
                    <li>{t('scoringRule1')}</li>
                    <li>{t('scoringRule2')}</li>
                    <li>{t('scoringRule3')}</li>
                </ul>
            </div>
            <p className="text-sm text-gray-500 pt-2">{t('goodLuck')}</p>
        </div>
        <button 
            onClick={onClose}
            className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
            {t('understood')}
        </button>
      </div>
    </div>
  );
};

export default InstructionsModal;
