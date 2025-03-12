'use client';

import React from 'react';

interface SuggestionProps {
    selectedColor: string;
    text: string;
    handleTextChange: (value: string) => void;
    loading: boolean;
}

const HaikuInput: React.FC<SuggestionProps> = ({ selectedColor, text, handleTextChange, loading }) => {
    return (
        <textarea
            className={`${selectedColor} w-full h-full outline-none resize-none text-gray-700 text-lg placeholder-gray-400 font-mono rounded-sm shadow-sm p-4 border border-gray-200/50 backdrop-blur-sm`}
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder={["Silent wind whispers...", 
                "Gentle rain falls...", 
                "Stars shine brightly...", 
                "Leaves rustle softly...",
                "Moonlight glows faintly...",
                "River flows quietly...",
                "Clouds drift slowly...",
                "Dawn breaks gently...",
                "Mist settles calmly...",
                "Waves crash softly...",
                "Forest hums alive...",
                "Snow falls silently...",
                "Sun sets peacefully...",
                "Breeze carries dreams...",
                "Twilight fades away..."][Math.floor(Math.random() * 15)]}
            disabled={loading}
        />
    );
};

export default HaikuInput;