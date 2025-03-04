import { useState } from 'react';
import Welcome from './components/Welcome';
import NetworkTopology from './components/NetworkTopology';
import "@fontsource/corben"; // Poids par défaut
import "@fontsource/corben/700.css"; // Gras si nécessaire

const App = () => {
  const [start, setStart] = useState(false);

  const handleStart = () => {
    setStart(true);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-red-100">
      {!start ? (
        <Welcome onStart={handleStart} />
      ) : (
        <NetworkTopology />
      )}
    </div>
  );
};

export default App;
