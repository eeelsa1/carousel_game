import { useEffect, useRef, useState, useCallback } from "react";

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
        transform: "translate(-50%, -50%)",
        zIndex: 110,
      }}
    >
      {children}
    </div>
  );
};

const Carousel = ({ onFinish, difficulty, initialTime, onBackToHome }) => {
  const radius = 150;
  const targetCircleSize = 70;
  const objectSize = 50;

  const [angle, setAngle] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(initialTime || 30);
  const [currentObject, setCurrentObject] = useState("star");
  const [floatingTexts, setFloatingTexts] = useState([]);

  const intervalRef = useRef(null);
  const timerRef = useRef(null);
  const objectSwitcherRef = useRef(null);
  const floatingTextIdRef = useRef(0);

  const getGameParams = useCallback(() => {
    switch (difficulty) {
      case "easy":
        return {
          rotationSpeed: 3,
          angleTolerance: 18,
        };
      case "hard":
        return {
          rotationSpeed: 8,
          angleTolerance: 8,
        };
      case "normal":
      default:
        return {
          rotationSpeed: 5,
          angleTolerance: 12,
        };
    }
  }, [difficulty]);

  const { rotationSpeed, angleTolerance } = getGameParams();

  const targetAngle = 90;
  const targetAngleStart = (targetAngle - angleTolerance + 360) % 360;
  const targetAngleEnd = (targetAngle + angleTolerance) % 360;

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-pink-50 to-purple-50 flex flex-col items-center justify-center relative">
      <div>Test Component</div>
    </div>
  );
};

export default Carousel;
