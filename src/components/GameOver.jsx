import React from "react";

function GameOver({ score, onRestart, onBackToHome }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 to-pink-50 text-center p-8 relative overflow-hidden">
      {/* 回首頁按鈕 - 右上角 */}
      <button
        onClick={onBackToHome}
        className="absolute top-6 right-6 bg-blue-300 hover:bg-blue-400 text-white font-semibold py-2 px-4 rounded-full shadow-md transition-all duration-300 transform hover:scale-105 active:scale-95 z-50"
      >
        🏠 回首頁
      </button>

      {/* 背景裝飾，同 GameStart */}
      <div className="absolute top-10 left-1/4 w-16 h-16 bg-blue-100 rounded-full animate-float opacity-50 z-0"></div>
      <div className="absolute bottom-20 right-1/3 w-12 h-12 bg-rose-100 rounded-lg transform rotate-45 animate-float delay-1000 opacity-50 z-0"></div>

      <h1
        className="text-5xl md:text-6xl font-bold mb-4 text-pink-400 drop-shadow-lg relative z-10"
        style={{ textShadow: "3px 3px 0px rgba(255,255,255,0.7)" }}
      >
        🎉 遊戲結束！
      </h1>
      <p className="text-3xl md:text-4xl mb-6 font-bold text-gray-700 relative z-10">
        你收集了 <span className="text-purple-400">{score}</span> 個糖果！
      </p>
      <button
        onClick={onRestart}
        className="bg-purple-300 text-white text-xl px-8 py-3 rounded-lg hover:bg-purple-400 transition shadow-lg transform hover:scale-105 active:scale-95 relative z-10 font-semibold shadow-3d"
      >
        再玩一次！
      </button>
    </div>
  );
}

export default GameOver;
