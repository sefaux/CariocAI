import React, { useState, useEffect } from 'react';
import { Card } from '../types';
import { TrashIcon, PlusIcon } from './icons';
import { useTranslation } from '../hooks/useTranslation';

interface ScanConfirmationProps {
    image: string;
    cards: Card[];
    score: number;
    onConfirm: (cards: Card[], score: number) => void;
    onRetry: () => void;
    scoreCard: (rank: string) => number;
}

const ScanConfirmation: React.FC<ScanConfirmationProps> = ({ image, cards, score, onConfirm, onRetry, scoreCard }) => {
    const [editedCards, setEditedCards] = useState<Card[]>(cards);
    const [editedScore, setEditedScore] = useState(score);
    const { t } = useTranslation();

    useEffect(() => {
        const newScore = editedCards.reduce((sum, card) => sum + scoreCard(card.rank), 0);
        setEditedScore(newScore);
    }, [editedCards, scoreCard]);

    const handleCardChange = (index: number, field: 'rank' | 'suit', value: string) => {
        const newCards = [...editedCards];
        newCards[index] = { ...newCards[index], [field]: value };
        setEditedCards(newCards);
    };

    const handleAddCard = () => {
        setEditedCards([...editedCards, { rank: 'A', suit: 'Hearts' }]);
    };

    const handleDeleteCard = (index: number) => {
        setEditedCards(editedCards.filter((_, i) => i !== index));
    };

    return (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 z-50">
            <div className="w-full max-w-lg bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-6 space-y-4">
                <h2 className="text-2xl font-bold text-center text-gray-900">{t('confirmScore')}</h2>
                
                <div className="flex flex-col md:flex-row gap-4 items-start">
                    <div className="w-full md:w-1/3">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('capture')}</h3>
                        <img src={image} alt="Cartas escaneadas" className="rounded-lg w-full" />
                    </div>
                    <div className="w-full md:w-2/3">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('detectedCardsEditable')}</h3>
                        <div className="bg-gray-100 p-3 rounded-lg max-h-48 overflow-y-auto space-y-2">
                            {editedCards.map((card, index) => (
                                <div key={index} className="flex items-center justify-between space-x-2">
                                    <input 
                                        type="text" 
                                        value={card.rank} 
                                        onChange={(e) => handleCardChange(index, 'rank', e.target.value.toUpperCase())}
                                        className="w-20 bg-gray-200 text-gray-900 border border-gray-300 rounded-md px-2 py-1 text-center font-mono"
                                        placeholder={t('rank')}
                                    />
                                    <select
                                        value={card.suit}
                                        onChange={(e) => handleCardChange(index, 'suit', e.target.value)}
                                        className="bg-gray-200 text-gray-900 border border-gray-300 rounded-md px-2 py-1.5 appearance-none text-center"
                                        style={{fontSize: '1.2rem'}}
                                    >
                                        <option value="Hearts">♥️</option>
                                        <option value="Diamonds">♦️</option>
                                        <option value="Clubs">♣️</option>
                                        <option value="Spades">♠️</option>
                                        <option value="Joker">🃏</option>
                                    </select>
                                    <button onClick={() => handleDeleteCard(index)} className="text-red-500 hover:text-red-400 p-1">
                                        <TrashIcon />
                                    </button>
                                </div>
                            ))}
                            {editedCards.length === 0 && <p className="text-gray-500 text-center">{t('noCardsAddOne')}</p>}
                        </div>
                        <button onClick={handleAddCard} className="w-full mt-2 flex items-center justify-center space-x-2 bg-blue-500/80 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                           <PlusIcon /> <span>{t('addCard')}</span>
                        </button>
                    </div>
                </div>

                <div className="text-center bg-gray-100 p-4 rounded-lg">
                    <p className="text-gray-500 text-lg">{t('totalScore')}</p>
                    <p className="text-4xl font-bold text-blue-600">{editedScore}</p>
                </div>

                <div className="flex justify-center items-center space-x-4 pt-2">
                    <button onClick={onRetry} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                        {t('scanAgain')}
                    </button>
                    <button onClick={() => onConfirm(editedCards, editedScore)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
                        {t('confirm')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ScanConfirmation;
