import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import DecimalGame from "./components/game/DecimalGame";
import "@fontsource/inter";
import { useAudio } from "./lib/stores/useAudio";
import { useEffect } from "react";

function App() {
  const { setBackgroundMusic, setHitSound, setSuccessSound } = useAudio();

  // Load audio elements when the app starts
  useEffect(() => {
    // Create and configure background music
    const backgroundMusic = new Audio("/sounds/background.mp3");
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.2;
    setBackgroundMusic(backgroundMusic);

    // Create sound effects
    const hitSound = new Audio("/sounds/hit.mp3");
    hitSound.volume = 0.5;
    setHitSound(hitSound);

    const successSound = new Audio("/sounds/success.mp3");
    successSound.volume = 0.5;
    setSuccessSound(successSound);
  }, [setBackgroundMusic, setHitSound, setSuccessSound]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <DecimalGame />
      </div>
    </QueryClientProvider>
  );
}

export default App;
