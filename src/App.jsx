// src/App.jsx
import { useState } from "react";
import GameStart from "./components/GameStart";
import Carousel from "./components/Carousel";
import GameOver from "./components/GameOver";

function App() {
  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(null);
  const [difficulty, setDifficulty] = useState("normal");
  const [gameDuration, setGameDuration] = useState(30); // 確保這裡預設也是 30

  const handleFinish = (finalScore) => {
    setScore(finalScore);
    setStarted(false);
  };

  const handleRestart = () => {
    setScore(null);
    setStarted(true);
    // 重啟時，難度和時間保持上次選擇的，如果需要重設，再添加 setDifficulty('normal'); setGameDuration(30);
  };

  const handleBackToHome = () => {
    setScore(null);
    setStarted(false);
  };

  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
    console.log("Difficulty set to:", newDifficulty);
  };

  const handleGameDurationChange = (duration) => {
    setGameDuration(duration);
    console.log("Game duration set to:", duration);
  };

  return (
    <>
      {!started && score === null && (
        <GameStart
          onStart={() => setStarted(true)}
          onDifficultyChange={handleDifficultyChange}
          onGameDurationChange={handleGameDurationChange} // 傳遞給 GameStart
        />
      )}
      {started && (
        <Carousel
          onFinish={handleFinish}
          difficulty={difficulty}
          initialTime={gameDuration} // 傳遞給 Carousel
          onBackToHome={handleBackToHome}
        />
      )}
      {!started && score !== null && (
        <GameOver
          score={score}
          onRestart={handleRestart}
          onBackToHome={handleBackToHome}
        />
      )}
    </>
  );
}

export default App;
