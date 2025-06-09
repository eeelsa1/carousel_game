import { useEffect, useRef, useState, useCallback } from "react";
import { Howl } from "howler";

// 浮動文字組件
const FloatingText = ({ children, x, y, color, duration = 1000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div
      className={`absolute text-3xl font-bold ${color} animate-float-up-fade-out`}
      style={{
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        transform: "translate(-50%, -50%)", // 居中對齊
        zIndex: 110, // 確保浮動文字在透明圓圈 (100) 之上
      }}
    >
      {children}
    </div>
  );
};

const Carousel = ({ onFinish, difficulty, initialTime, onBackToHome }) => {
  // 音效初始化
  const dingSound = useRef(
    new Howl({
      src: [
        "data:audio/wav;base64,UklGRhgNAABXQVZFZm10IBAAAAABAAEAgD4AAIA+AAABAAgAZGF0YfAMAAA+9+g7NPzHOgD+xQEA/sUB/tWBAwD+1YEDAdpgBAHaYAQPzooFD86KBQHVQAYB1UAGAdVABgHVQAYB1UAGD9RGBgHVQAYB1UAGAdVABgHVQAYB1UAGAdVABg/eqQYB1UAGAdVABgHVQAYB1UAGAdVABgHVQAYB1UAGAdVABgHVQAYB1UAGAdVABgHVQAYB1UAGD+qLBgHVQAYB1UAGAdVABgHVQAYB1UAGAdVABgHVQAYB1UAGAdVABgHVQAYB1UAGAdVABgHVQAYB1UAGAdVABgHVQAYP6osGAdVABgHVQAYB1UAGAdVABgHVQAYB1UAGAdVABgHVQAYB1UAGAdVABgHVQAYB1UAGAdVABgHVQAYB1UAGAdVABgHVQAYP6osGAdVABgHVQAYB1UAGAdVABgHVQAYB1UAGAdVABgHVQAYB1UAGAdVABgHVQAYB1UAGAdVABgHVQAYB1UAGAdVABgHVQAYP6osG",
      ],
      volume: 0.3,
      preload: true,
    })
  );

  const wrongSound = useRef(
    new Howl({
      src: [
        "data:audio/wav;base64,UklGRhgNAABXQVZFZm10IBAAAAABAAEAgD4AAIA+AAABAAgAZGF0YfAMAACA/2cA4P7TAeD+0wHg/tMB4P7TAeD+0wHg/tMB4P7TAeD+0wHg/tMB4P7TAeD+0wHg/tMB4P7TAeD+0wHg/tMB4P7TAeD+0wHg/tMB4P7TAeD+0wHg/tMB4P7TAeD+0wHg/tMB4P7TAeD+0wHg/tMB4P7TAeD+0wHg/tMB4P7TAeD+0wHg/tMB4P7TAeD+0wHg/tMB4P7TAeD+0wHg/tMB4P7TAeD+0wHg/tMB4P7TAeD+0wHg/tMB4P7TAeD+0wHg/tMB4P7TAeD+0wHg/tMB4P7TAeD+0wHg/tMB4P7TAeD+0wHg/tMB4P7TAeD+0wHg/tMB4P7TAeD+0wHg/tMB4P7TAeD+0wHg/tMB4P7TAeD+0wHg/tMB4P7TAeD+0wHg/tMB4P7TAeD+0wHg/tMB4P7TAeD+0wHg/tMB4P7TAeD+0wHg/tMB4P7TAeD+0wHg/tMB4P7TAeD+0wHg/tMB4P7TAeD+0wHg/tMB4P7TAeD+0wHg/tMB4P7TAeD+0wHg/tMB4P7TAeD+0wHg/tMB4P7TAeD+0wHg/tMB4P7TAeD+0wHg/tMB4P7TAeD+0wHg/tMB",
      ],
      volume: 0.2,
      preload: true,
    })
  );

  // 接收 difficulty 和 initialTime props
  const radius = 150; // 旋轉半徑
  const targetCircleSize = 70; // 透明圓圈（玩家點擊區）的大小 (直徑)
  const objectSize = 50; // 星星/冰淇淋的大小

  const [angle, setAngle] = useState(0); // 主旋轉角度 (單一物件的角度)
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(initialTime || 30); // 使用傳入的 initialTime，默認30秒
  const [currentObject, setCurrentObject] = useState("star"); // 回歸：單一旋轉物件類型
  const [floatingTexts, setFloatingTexts] = useState([]);

  const intervalRef = useRef(null); // 主旋轉定時器
  const timerRef = useRef(null); // 倒數計時器
  const objectSwitcherRef = useRef(null); // 物件切換定時器
  const floatingTextIdRef = useRef(0); // 用於生成浮動文字的唯一 ID

  // 根據難度設定遊戲參數 (objectSpawnInterval 和 objectLifeTime 將不再直接使用，但保留了旋轉速度和容忍度)
  const getGameParams = useCallback(() => {
    switch (difficulty) {
      case "easy":
        return {
          rotationSpeed: 3, // 較慢
          angleTolerance: 18, // 較寬鬆
        };
      case "hard":
        return {
          rotationSpeed: 8, // 較快
          angleTolerance: 8, // 較嚴格
        };
      case "normal":
      default:
        return {
          rotationSpeed: 5, // 預設速度
          angleTolerance: 12, // 預設容忍度
        };
    }
  }, [difficulty]);

  const { rotationSpeed, angleTolerance } = getGameParams(); // 獲取當前難度參數

  // 目標角度：根據你之前的測試結果，90 度在你的系統中對應視覺上的底部
  const targetAngle = 90;
  const targetAngleStart = (targetAngle - angleTolerance + 360) % 360; // 確保角度在0-359之間
  const targetAngleEnd = (targetAngle + angleTolerance) % 360; // 這裡計算可能需要調整，如果 targetAngle + angleTolerance 超過 360

  // 第一個 useEffect：設置所有定時器。當難度改變時，定時器會重新設置。
  useEffect(() => {
    // 清除舊的定時器
    clearInterval(intervalRef.current);
    clearInterval(objectSwitcherRef.current);
    clearInterval(timerRef.current);

    // 主旋轉動畫
    intervalRef.current = setInterval(() => {
      setAngle((prev) => (prev + rotationSpeed) % 360); // 使用 rotationSpeed
    }, 100);

    // 物件切換定時器 - 隨機切換
    const scheduleNextObjectChange = () => {
      const randomInterval = Math.random() * 3000 + 1500; // 1.5秒到4.5秒之間的隨機間隔
      objectSwitcherRef.current = setTimeout(() => {
        // 隨機選擇下一個物件類型
        const objectTypes = ["star", "meltedIceCream"];
        const currentIndex = objectTypes.indexOf(currentObject);
        const availableTypes = objectTypes.filter(
          (_, index) => index !== currentIndex
        );
        const nextType =
          availableTypes[Math.floor(Math.random() * availableTypes.length)];

        setCurrentObject(nextType);
        scheduleNextObjectChange(); // 遞迴安排下一次切換
      }, randomInterval);
    };

    scheduleNextObjectChange();

    // 倒數計時器
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    // 清理函數：組件卸載時清除所有定時器
    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(objectSwitcherRef.current); // 改為 clearTimeout 因為現在使用 setTimeout
      clearInterval(timerRef.current);
    };
  }, [rotationSpeed, currentObject]); // 新增 currentObject 作為依賴項

  // 第二個 useEffect：監聽 timeLeft 變化，在遊戲結束時調用 onFinish
  useEffect(() => {
    if (timeLeft <= 0) {
      // 再次清理定時器，確保在遊戲結束時立即停止所有活動
      clearInterval(intervalRef.current);
      clearTimeout(objectSwitcherRef.current); // 改為 clearTimeout
      clearInterval(timerRef.current);
      onFinish(score); // 安全地調用父組件的 onFinish
    }
  }, [timeLeft, onFinish, score]);

  // 玩家點擊「透明圓圈」的處理函數
  const handleTargetCircleClick = useCallback(() => {
    console.log("Clicked! Current Angle:", angle);
    console.log("Target Range:", targetAngleStart, "to", targetAngleEnd);

    let isTargetAngle = false;
    // 處理角度跨越 0/360 邊界的情況 (例如 350-10 度)
    if (targetAngleStart <= targetAngleEnd) {
      isTargetAngle = angle >= targetAngleStart && angle <= targetAngleEnd;
    } else {
      isTargetAngle = angle >= targetAngleStart || angle <= targetAngleEnd;
    }
    console.log("Is within target angle?", isTargetAngle); // 獲取透明圓圈的中心位置，用於浮動文字的起始點
    const targetCircleElement = document.getElementById("target-circle");
    let centerX = 0;
    let centerY = 0;
    if (targetCircleElement) {
      const rect = targetCircleElement.getBoundingClientRect();
      const parentRect =
        targetCircleElement.parentElement.getBoundingClientRect();
      centerX =
        rect.left + rect.width / 2 - parentRect.left - parentRect.width / 2;
      centerY =
        rect.top + rect.height / 2 - parentRect.top - parentRect.height / 2;
    }

    if (currentObject === "star") {
      // 直接判斷 currentObject
      if (isTargetAngle) {
        // 播放成功音效
        dingSound.current.play();

        setScore((prev) => prev + 1);
        const targetCircle = document.getElementById("target-circle");
        if (targetCircle) {
          targetCircle.classList.add(
            "bg-green-200",
            "border-green-400",
            "animate-ping"
          );
          setTimeout(
            () =>
              targetCircle.classList.remove(
                "bg-green-200",
                "border-green-400",
                "animate-ping"
              ),
            300
          );
        }
        // 觸發 +1 浮動文字
        floatingTextIdRef.current += 1;
        setFloatingTexts((prevTexts) => [
          ...prevTexts,
          {
            id: floatingTextIdRef.current,
            x: centerX,
            y: centerY,
            text: "+1",
            color: "text-green-500",
          },
        ]);
        setTimeout(() => {
          setFloatingTexts((prevTexts) =>
            prevTexts.filter((text) => text.id !== floatingTextIdRef.current)
          );
        }, 1000);
      } else {
        // 點擊但不在有效範圍，不加分
      }
    } else if (currentObject === "meltedIceCream") {
      // 直接判斷 currentObject
      if (isTargetAngle) {
        // 播放錯誤音效
        wrongSound.current.play();

        setScore((prev) => Math.max(0, prev - 1));
        const targetCircle = document.getElementById("target-circle");
        if (targetCircle) {
          targetCircle.classList.add(
            "bg-red-200",
            "border-red-400",
            "animate-pulse"
          );
          setTimeout(
            () =>
              targetCircle.classList.remove(
                "bg-red-200",
                "border-red-400",
                "animate-pulse"
              ),
            300
          );
        }
        // 觸發 -1 浮動文字
        floatingTextIdRef.current += 1;
        setFloatingTexts((prevTexts) => [
          ...prevTexts,
          {
            id: floatingTextIdRef.current,
            x: centerX,
            y: centerY,
            text: "-1",
            color: "text-red-500",
          },
        ]);
        setTimeout(() => {
          setFloatingTexts((prevTexts) =>
            prevTexts.filter((text) => text.id !== floatingTextIdRef.current)
          );
        }, 1000);
      } else {
        // 點擊但不在有效範圍，不扣分
      }
    }
  }, [angle, currentObject, targetAngleStart, targetAngleEnd]); // 確保所有用到的狀態和 props 都作為依賴項

  // 計算旋轉物件的位置
  const x = radius * Math.cos((angle * Math.PI) / 180);
  const y = radius * Math.sin((angle * Math.PI) / 180);

  // 透明圓圈（目標點擊區）的 CSS 定位 (底部 90 度)
  const fixedTargetX = 0;
  const fixedTargetY = radius; // Y軸向下為正，所以 +radius 表示在底部

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-pink-50 to-purple-50 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* 回首頁按鈕 - 右上角 */}
      <button
        onClick={onBackToHome}
        className="absolute top-6 right-6 bg-blue-300 hover:bg-blue-400 text-white font-semibold py-2 px-4 rounded-full shadow-md transition-all duration-300 transform hover:scale-105 active:scale-95 z-50"
      >
        🏠 回首頁
      </button>

      <div className="text-3xl font-bold mb-4 text-pink-500 drop-shadow-md">
        <span className="mr-2">⏳</span> 倒數 {timeLeft} 秒 ｜{" "}
        <span className="ml-2">🍭</span> 分數: {score}
      </div>

      <div className="relative w-[400px] h-[400px] rounded-full bg-pink-100 border-8 border-pink-200 shadow-3d flex items-center justify-center overflow-hidden">
        {/* 內層裝飾，像蛋糕層次，顏色更柔和 */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-pink-100 to-yellow-100 opacity-50 rounded-full"></div>
        <div className="absolute w-full h-1/2 bg-rose-200 rounded-t-full opacity-60 bottom-0 shadow-inner-top"></div>
        <div className="absolute w-3/4 h-1/2 bg-yellow-100 rounded-t-full opacity-70 bottom-0 z-10 shadow-inner-top"></div>
        <div className="absolute w-1/2 h-1/2 bg-blue-100 rounded-t-full opacity-80 bottom-0 z-20 shadow-inner-top"></div>

        {/* 中心裝飾 - 杯子蛋糕 (z-index: 30) */}
        <div className="absolute inset-0 flex items-center justify-center z-30">
          <div className="w-[90px] h-[90px] bg-white rounded-full border-4 border-rose-300 shadow-3d flex items-center justify-center text-4xl">
            🧁
          </div>
        </div>

        {/* 固定的「甜甜圈」目標區 (z-index: 100) */}
        <button
          id="target-circle"
          onClick={handleTargetCircleClick}
          className="absolute border-4 border-blue-200 border-dashed rounded-full flex items-center justify-center transition-all duration-150 bg-yellow-50 bg-opacity-80 shadow-3d"
          style={{
            left: `calc(50% + ${fixedTargetX}px - ${targetCircleSize / 2}px)`,
            top: `calc(50% + ${fixedTargetY}px - ${targetCircleSize / 2}px)`,
            width: `${targetCircleSize}px`,
            height: `${targetCircleSize}px`,
            zIndex: 100, // 確保它在最上層，可以被點擊
            pointerEvents: "auto", // 確保它能接收點擊事件
          }}
        >
          <span className="text-orange-300 text-4xl font-bold">🍩</span>
        </button>

        {/* 旋轉的物件 (糖果/水滴) (z-index: 40, pointer-events: none) */}
        {/* 現在只有一個旋轉物件，直接渲染 */}
        <div
          id="spinning-object"
          className={`absolute w-[${objectSize}px] h-[${objectSize}px] rounded-full shadow-3d flex items-center justify-center text-white font-bold transition-all duration-150 text-4xl animate-pulse-bright`}
          style={{
            left: `calc(50% + ${x}px - ${objectSize / 2}px)`,
            top: `calc(50% + ${y}px - ${objectSize / 2}px)`,
            backgroundColor:
              currentObject === "star"
                ? "#FFC0CB"
                : "#A8E8D5" /* 粉色和薄荷綠 */,
            zIndex: 40, // 顯示在中心裝飾物之上，但在透明圓圈之下
            pointerEvents: "none", // 確保點擊事件穿透這個元素
          }}
        >
          {currentObject === "star" ? "🍬" : "💧"}
        </div>

        {/* 渲染所有浮動文字 */}
        {floatingTexts.map((item) => (
          <FloatingText key={item.id} x={item.x} y={item.y} color={item.color}>
            {item.text}
          </FloatingText>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
