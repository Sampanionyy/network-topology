import { useState, useEffect, useRef } from 'react';

const Welcome = ({ onStart }) => {
  const [text, setText] = useState('');
  const fullText = "Bienvenue sur Network topology, c'est un simulateur de Topologie Réseau capable graphiquement d’animer le routage du plus court chemin";
  const indexRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (indexRef.current < fullText.length) {
        setText(fullText.slice(0, indexRef.current + 1)); // Ajoute un caractère sans risque de saut
        indexRef.current++;
      } else {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-lg">
      <p className="text-xl text-gray-800 mb-6">{text}</p>
      {text === fullText && (
        <button
          onClick={onStart}
          className="mt-4 px-6 py-2 bg-red-300 text-white rounded-lg hover:bg-red-400 transition-all"
        >
          Commencer
        </button>
      )}
    </div>
  );
};

export default Welcome;
