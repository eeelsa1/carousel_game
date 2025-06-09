import React, { useState, useCallback } from "react";

export default function GameStart({
  onStart,
  onDifficultyChange,
  onGameDurationChange,
}) {
  const [showRules, setShowRules] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState("normal"); // 預設難度
  const [customGameDuration, setCustomGameDuration] = useState(30); // 預設遊戲時間設為 30 秒

  // 遊戲規則彈窗
  const RulesModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-2xl w-full relative transform transition-all duration-300 scale-100 opacity-100 border-4 border-pink-200">
        <h2 className="text-4xl font-extrabold text-pink-500 mb-6 text-center drop-shadow-md">
          遊戲規則 🍭✨
        </h2>
        <div className="flex flex-wrap justify-center gap-4 text-gray-700 text-lg font-semibold">
          <div className="w-full md:w-1/2 lg:w-1/3 p-3 bg-blue-50 rounded-lg shadow-md flex flex-col items-center text-center">
            <span className="mb-2 text-4xl">🎠</span>
            <p>旋轉木馬上的甜蜜點心會不斷轉動，看準時機！</p>
          </div>
          <div className="w-full md:w-1/2 lg:w-1/3 p-3 bg-yellow-50 rounded-lg shadow-md flex flex-col items-center text-center">
            <span className="mb-2 text-4xl">🍬</span>
            <p>當 糖果 轉到底部甜甜圈 (🍩) 處，點擊得分 +1！</p>
          </div>
          <div className="w-full md:w-1/2 lg:w-1/3 p-3 bg-red-50 rounded-lg shadow-md flex flex-col items-center text-center">
            <span className="mb-2 text-4xl">💧</span>
            <p>融化的水滴 點錯會扣分 -1 ，要小心哦！</p>
          </div>
          <div className="w-full md:w-1/2 lg:w-1/3 p-3 bg-green-50 rounded-lg shadow-md flex flex-col items-center text-center">
            <span className="mb-2 text-4xl">⏰</span>
            <p>點擊過早或過晚，都不會加分或扣分哦！把握時機！</p>
          </div>
          <div className="w-full md:w-1/2 lg:w-1/3 p-3 bg-purple-50 rounded-lg shadow-md flex flex-col items-center text-center">
            <span className="mb-2 text-4xl">⏱️</span>
            <p>遊戲時間可自定義，努力收集最多甜點，成為點心達人吧！</p>
          </div>
        </div>
        <button
          onClick={() => setShowRules(false)}
          className="mt-8 bg-pink-400 hover:bg-pink-500 text-white font-extrabold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 mx-auto block text-xl"
        >
          我知道了！開始甜蜜派對！
        </button>
      </div>
    </div>
  );

  const handleDifficultyChange = useCallback(
    (difficulty) => {
      setSelectedDifficulty(difficulty);
      onDifficultyChange(difficulty);
    },
    [onDifficultyChange]
  );

  const handleGameDurationChange = useCallback(
    (duration) => {
      setCustomGameDuration(duration);
      onGameDurationChange(duration);
    },
    [onGameDurationChange]
  );

  const handleStartGame = useCallback(() => {
    onGameDurationChange(customGameDuration);
    onDifficultyChange(selectedDifficulty);
    onStart();
  }, [
    customGameDuration,
    selectedDifficulty,
    onGameDurationChange,
    onDifficultyChange,
    onStart,
  ]);
  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-pink-50 to-purple-50 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* 遊戲規則按鈕 - 右上角 */}
      <button
        onClick={() => setShowRules(true)}
        className="absolute top-6 right-6 bg-blue-300 hover:bg-blue-400 text-white font-semibold py-2 px-4 rounded-full shadow-md transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-3d z-20"
      >
        遊戲規則 📖
      </button>
      {/* 背景裝飾 */}
      <div className="absolute top-10 left-1/4 w-16 h-16 bg-blue-100 rounded-full animate-float opacity-50 z-0"></div>
      <div className="absolute bottom-20 right-1/3 w-12 h-12 bg-rose-100 rounded-lg transform rotate-45 animate-float delay-1000 opacity-50 z-0"></div>
      <div className="absolute top-1/3 right-10 w-20 h-20 bg-green-100 rounded-full animate-float delay-500 opacity-50 z-0"></div>
      <div className="absolute bottom-10 left-1/5 w-10 h-10 bg-purple-100 rounded-full animate-float delay-1500 opacity-50 z-0"></div>{" "}
      <h1
        className="text-4xl md:text-5xl font-extrabold text-pink-400 drop-shadow-lg mb-4 relative z-10"
        style={{ textShadow: "4px 4px 0px rgba(255,255,255,0.7)" }}
      >
        甜蜜夢幻樂園 🎠
      </h1>
      <p className="text-lg md:text-xl text-gray-600 mb-6 relative z-10 font-semibold">
        點擊開始，一起收集美味甜點星星吧！✨
      </p>{" "}
      <div className="flex flex-col space-y-4 relative z-10 w-full max-w-md">
        {/* 遊戲時間選項 */}
        <div className="bg-gradient-to-br from-white via-blue-50 to-purple-50 p-4 rounded-2xl shadow-lg border-2 border-blue-200 backdrop-blur-sm bg-opacity-90">
          <div className="flex items-center justify-center mb-3">
            <span className="text-xl mr-2">⏰</span>
            <label className="font-bold text-lg text-blue-600">
              選擇遊戲時間
            </label>
          </div>{" "}
          <div className="grid grid-cols-2 gap-2">
            {[30, 45, 60, 120].map((duration) => (
              <label
                key={duration}
                className={`relative flex items-center justify-center p-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  customGameDuration === duration
                    ? "bg-gradient-to-r from-blue-400 to-purple-500 text-white shadow-lg scale-105"
                    : "bg-white bg-opacity-80 text-gray-700 hover:bg-blue-100 shadow-md"
                }`}
              >
                <input
                  type="radio"
                  name="gameDuration"
                  value={duration}
                  checked={customGameDuration === duration}
                  onChange={() => handleGameDurationChange(duration)}
                  className="sr-only"
                />
                <span className="font-bold text-base">{duration}秒</span>
                {customGameDuration === duration && (
                  <span className="absolute top-0.5 right-0.5 text-yellow-300 text-sm">
                    ✨
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>{" "}
        {/* 難度調整選項 */}
        <div className="bg-gradient-to-br from-white via-pink-50 to-orange-50 p-4 rounded-2xl shadow-lg border-2 border-pink-200 backdrop-blur-sm bg-opacity-90">
          <div className="flex items-center justify-center mb-3">
            <span className="text-xl mr-2">🎯</span>
            <label className="font-bold text-lg text-pink-600">
              選擇難度等級
            </label>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <label
              className={`relative flex items-center p-3 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                selectedDifficulty === "easy"
                  ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg scale-105"
                  : "bg-white bg-opacity-80 text-gray-700 hover:bg-green-100 shadow-md"
              }`}
            >
              <input
                type="radio"
                name="difficulty"
                value="easy"
                checked={selectedDifficulty === "easy"}
                onChange={() => handleDifficultyChange("easy")}
                className="sr-only"
              />
              <span className="text-xl mr-2">🐢</span>
              <div className="flex-1">
                <div className="font-bold text-base">簡單模式</div>
                <div className="text-xs opacity-75">慢速轉動，寬鬆時機</div>
              </div>
              {selectedDifficulty === "easy" && (
                <span className="text-yellow-300 text-lg">✨</span>
              )}
            </label>

            <label
              className={`relative flex items-center p-3 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                selectedDifficulty === "normal"
                  ? "bg-gradient-to-r from-blue-400 to-indigo-500 text-white shadow-lg scale-105"
                  : "bg-white bg-opacity-80 text-gray-700 hover:bg-blue-100 shadow-md"
              }`}
            >
              <input
                type="radio"
                name="difficulty"
                value="normal"
                checked={selectedDifficulty === "normal"}
                onChange={() => handleDifficultyChange("normal")}
                className="sr-only"
              />
              <span className="text-xl mr-2">🎠</span>
              <div className="flex-1">
                <div className="font-bold text-base">普通模式</div>
                <div className="text-xs opacity-75">標準速度，平衡挑戰</div>
              </div>
              {selectedDifficulty === "normal" && (
                <span className="text-yellow-300 text-lg">✨</span>
              )}
            </label>

            <label
              className={`relative flex items-center p-3 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                selectedDifficulty === "hard"
                  ? "bg-gradient-to-r from-red-400 to-pink-500 text-white shadow-lg scale-105"
                  : "bg-white bg-opacity-80 text-gray-700 hover:bg-red-100 shadow-md"
              }`}
            >
              <input
                type="radio"
                name="difficulty"
                value="hard"
                checked={selectedDifficulty === "hard"}
                onChange={() => handleDifficultyChange("hard")}
                className="sr-only"
              />
              <span className="text-xl mr-2">🚀</span>
              <div className="flex-1">
                <div className="font-bold text-base">困難模式</div>
                <div className="text-xs opacity-75">高速轉動，精準時機</div>
              </div>
              {selectedDifficulty === "hard" && (
                <span className="text-yellow-300 text-lg">✨</span>
              )}
            </label>
          </div>
        </div>
        <button
          onClick={handleStartGame}
          className="bg-pink-300 hover:bg-pink-400 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-3d text-lg mt-4"
        >
          開始甜蜜冒險！
        </button>
      </div>
      {showRules && <RulesModal />}
    </div>
  );
}
