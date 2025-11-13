import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

const LanguageSwitcher: React.FC = () => {
    const { locale, setLocale } = useTranslation();

    return (
        <div className="flex items-center space-x-1 p-1 rounded-full bg-gray-200">
            <button
                onClick={() => setLocale('es')}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    locale === 'es' ? 'bg-blue-500 text-white' : 'text-gray-800'
                }`}
            >
                ES
            </button>
            <button
                onClick={() => setLocale('en')}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    locale === 'en' ? 'bg-blue-500 text-white' : 'text-gray-800'
                }`}
            >
                EN
            </button>
        </div>
    );
};

export default LanguageSwitcher;