"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Gift, Sparkles, Star } from "lucide-react";

interface BoxOpeningAnimationProps {
  isOpen: boolean;
  boxName?: string;
  boxImage?: string;
  onAnimationComplete?: () => void;
  isApiComplete?: boolean;
  initialTitle?: string;
  shakeTitle?: string;
  openingTitle?: string;
  revealTitle?: string;
}

export const BoxOpeningAnimation = ({
  isOpen,
  boxName = "Mystery Box",
  boxImage,
  onAnimationComplete,
  isApiComplete = false,
  initialTitle = "Đang chuẩn bị...",
  shakeTitle = "Đang mở hộp...",
  openingTitle = "Đang mở hộp quà!",
  revealTitle = "Chúc mừng!",
}: BoxOpeningAnimationProps) => {
  const [mounted, setMounted] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<
    "initial" | "shake" | "opening" | "reveal"
  >("initial");
  const [progressWidth, setProgressWidth] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setAnimationPhase("initial");
      setProgressWidth(0);
      return;
    }

    const timeouts: NodeJS.Timeout[] = [];

    // Phase 1: initial → shake (500ms)
    timeouts.push(setTimeout(() => setAnimationPhase("shake"), 500));

    // Phase 2: shake → opening (2000ms)
    timeouts.push(setTimeout(() => setAnimationPhase("opening"), 2000));

    // Phase 3: opening → reveal (only when API is complete)
    if (isApiComplete) {
      timeouts.push(setTimeout(() => setAnimationPhase("reveal"), 3000));

      // Call completion callback after reveal
      timeouts.push(
        setTimeout(() => {
          onAnimationComplete?.();
        }, 3500)
      );
    }

    // Progress bar animation - stop at 90% until API is complete
    const progressInterval = setInterval(() => {
      setProgressWidth((prev) => {
        if (isApiComplete) {
          // API done - go to 100%
          return Math.min(prev + 10, 100);
        } else {
          // API not done - stop at 90%
          return Math.min(prev + 3, 90);
        }
      });
    }, 100);

    return () => {
      timeouts.forEach(clearTimeout);
      clearInterval(progressInterval);
    };
  }, [isOpen, onAnimationComplete, isApiComplete]);

  if (!isOpen || !mounted) return null;

  const animationContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl my-auto">
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              <Sparkles
                className="text-yellow-400 opacity-70"
                size={12 + Math.random() * 16}
              />
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="relative text-center">
          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 animate-pulse">
            {animationPhase === "initial" && initialTitle}
            {animationPhase === "shake" && shakeTitle}
            {animationPhase === "opening" && openingTitle}
            {animationPhase === "reveal" && revealTitle}
          </h2>

          {/* Box container */}
          <div className="relative flex items-center justify-center h-80">
            {/* Glow effect */}
            <div
              className={`absolute inset-0 rounded-full blur-3xl transition-all duration-1000 ${
                animationPhase === "reveal"
                  ? "bg-gradient-to-r from-yellow-400 via-purple-500 to-pink-500 opacity-60 scale-150"
                  : "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-30 scale-100"
              }`}
            />

            {/* Box */}
            <div
              className={`relative transition-all duration-700 ${
                animationPhase === "shake"
                  ? "animate-shake"
                  : animationPhase === "opening"
                  ? "animate-bounce scale-110"
                  : animationPhase === "reveal"
                  ? "scale-150 opacity-0"
                  : ""
              }`}
            >
              {boxImage ? (
                <div className="relative w-64 h-64 flex items-center justify-center">
                  <img
                    src={boxImage}
                    alt={boxName}
                    className="w-full h-full object-contain drop-shadow-2xl"
                  />
                </div>
              ) : (
                <div className="relative w-64 h-64 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl transform rotate-12 shadow-2xl" />
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-2xl" />
                  <Gift className="relative w-32 h-32 text-white drop-shadow-2xl z-10" />
                </div>
              )}
            </div>

            {/* Stars burst on reveal */}
            {animationPhase === "reveal" && (
              <div className="absolute inset-0 flex items-center justify-center">
                {[...Array(8)].map((_, i) => (
                  <Star
                    key={i}
                    className="absolute text-yellow-400 animate-star-burst"
                    size={32}
                    style={{
                      animationDelay: `${i * 0.1}s`,
                      transform: `rotate(${i * 45}deg) translateY(-100px)`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Loading bar */}
          <div className="mt-8 max-w-md mx-auto">
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-100"
                style={{ width: `${progressWidth}%` }}
              />
            </div>
            <p className="mt-4 text-gray-400 text-sm">
              {progressWidth === 100
                ? "Hoàn tất!"
                : "Vui lòng đợi trong giây lát..."}
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0) rotate(0deg);
          }
          10%,
          30%,
          50%,
          70%,
          90% {
            transform: translateX(-10px) rotate(-5deg);
          }
          20%,
          40%,
          60%,
          80% {
            transform: translateX(10px) rotate(5deg);
          }
        }

        @keyframes star-burst {
          0% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: scale(2) rotate(180deg);
          }
        }

        @keyframes progress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }

        .animate-float {
          animation: float linear infinite;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out infinite;
        }

        .animate-star-burst {
          animation: star-burst 1s ease-out forwards;
        }

        .animate-progress {
          animation: progress 3s ease-out forwards;
        }
      `}</style>
    </div>
  );

  return createPortal(animationContent, document.body);
};