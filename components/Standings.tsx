import React, { useState, useMemo } from 'react';
// FIX: Import GameSettings to use in the component's props.
import { Player, GameSettings } from '../types';
import { CrownIcon } from './icons';
import { useTranslation } from '../hooks/useTranslation';
import { ROUNDS_DATA } from '../constants';

interface ActiveRound {
    key: string;
}

interface StandingsProps {
  players: Player[];
  currentRound: number;
  activeRounds: ActiveRound[];
  onNextRound: () => void;
  // FIX: Add gameSettings to the component's props.
  gameSettings: GameSettings;
}

const Standings: React.FC<StandingsProps> = ({ players, currentRound, activeRounds, onNextRound, gameSettings }) => {
  const [activeTab, setActiveTab] = useState<'standings' | 'scores'>('standings');
  const { t } = useTranslation();

  const calculateTotal = (player: Player) => {
    return player.scores.reduce((acc, score) => acc + (score || 0), 0);
  };
  
  const sortedPlayers = useMemo(() => 
    [...players].sort((a, b) => calculateTotal(a) - calculateTotal(b)),
    [players]
  );
  
  const isLastRound = currentRound === activeRounds.length - 1;

  const currentGlobalRoundIndex = useMemo(() => 
    ROUNDS_DATA.findIndex(r => r.key === activeRounds[currentRound]?.key),
    [currentRound, activeRounds]
  );

  const TabButton: React.FC<{tab: 'standings' | 'scores', children: React.ReactNode}> = ({ tab, children }) => (
    <button
        onClick={() => setActiveTab(tab)}
        className={`w-1/2 py-3 text-center font-semibold text-lg transition-colors duration-200 rounded-t-lg ${
            activeTab === tab 
            ? 'bg-white/90 backdrop-blur-md text-blue-600' 
            : 'bg-gray-200/80 text-gray-600 hover:bg-gray-300/80'
        }`}
    >
        {children}
    </button>
  );

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 pt-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg">
            <h1 className="text-3xl font-bold text-gray-900">{t('endOfRound')} {currentRound + 1}</h1>
            <p className="text-xl text-gray-500">{t(`roundName_${activeRounds[currentRound].key}`)}</p>
        </div>

        <div className="flex">
            <TabButton tab="standings">{t('standings')}</TabButton>
            <TabButton tab="scores">{t('scoreSheet')}</TabButton>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-b-2xl shadow-xl p-4 sm:p-6">
            {activeTab === 'standings' ? (
                <div className="space-y-3">
                    {sortedPlayers.map((player, index) => (
                        <div key={player.id} className={`flex items-center justify-between p-4 rounded-lg ${index === 0 ? 'bg-green-100/80' : 'bg-gray-100/80'}`}>
                            <div className="flex items-center space-x-4">
                                <span className={`text-xl font-bold ${index === 0 ? 'text-yellow-600' : 'text-gray-500'}`}>#{index + 1}</span>
                                <span className="text-lg text-gray-900">{player.name}</span>
                                {index === 0 && <div className="text-yellow-500"><CrownIcon/></div>}
                            </div>
                            <span className="text-xl font-bold text-gray-900">{calculateTotal(player)} {t('scorePoints')}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-200/80">
                        <tr>
                            <th scope="col" className="px-6 py-3 w-1">{t('round')}</th>
                            {players.map(player => (
                            <th key={player.id} scope="col" className="px-6 py-3 text-center">{player.name}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {ROUNDS_DATA.map((round, globalRoundIndex) => {
                            if (!gameSettings.enabledRounds.includes(round.key)) return null;
                            return (
                                <tr key={globalRoundIndex} className={`border-b border-gray-300/50 ${globalRoundIndex > currentGlobalRoundIndex ? 'opacity-50' : ''}`}>
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{t(`roundName_${round.key}`)}</td>
                                {players.map((player) => (
                                    <td key={player.id} className="px-6 py-4 text-center">
                                        {player.scores[globalRoundIndex] ?? '-'}
                                    </td>
                                ))}
                                </tr>
                            );
                        })}
                        </tbody>
                        <tfoot className="bg-gray-200/80 text-gray-900 font-bold">
                        <tr>
                            <td className="px-6 py-4 uppercase">{t('total')}</td>
                            {players.map(player => (
                            <td key={player.id} className="px-6 py-4 text-center text-lg">{calculateTotal(player)}</td>
                            ))}
                        </tr>
                        </tfoot>
                    </table>
                </div>
            )}
        </div>

        <div className="mt-8 flex justify-center">
            <button
                onClick={onNextRound}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-12 rounded-lg transition-all duration-200 text-xl"
            >
                {isLastRound ? t('viewFinalResults') : t('nextRound')}
            </button>
        </div>
      </div>
    </div>
  );
};

export default Standings;