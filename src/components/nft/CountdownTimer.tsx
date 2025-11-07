'use client';

import React, { useEffect, useState } from 'react';

interface CountdownTimerProps {
  endDate: string;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

function calculateTimeLeft(endDate: string): TimeLeft {
  const difference = new Date(endDate).getTime() - new Date().getTime();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    isExpired: false,
  };
}

export default function CountdownTimer({
  endDate,
  className = '',
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    calculateTimeLeft(endDate)
  );

  useEffect(() => {
    // Cập nhật mỗi giây
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(endDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (timeLeft.isExpired) {
    return (
      <div className={`flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 font-medium ${className}`}>
        <span>⏱️</span>
        <span>Đã hết hạn</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1.5 text-xs ${className}`}>
      <span>⏱️</span>
      <span className="text-gray-600 dark:text-gray-400">Còn:</span>
      <span className="font-medium text-gray-900 dark:text-gray-100">
        {timeLeft.days > 0 && `${timeLeft.days} ngày `}
        {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
      </span>
    </div>
  );
}
