"use client";

import { useState, useEffect } from "react";

interface TypewriterEffectProps {
  text: string;
  speed?: number;
  delay?: number;
}

export const TypewriterEffect = ({
  text,
  speed = 50,
  delay = 0,
}: TypewriterEffectProps) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // reset saat teks berubah
    setDisplayText("");
    setCurrentIndex(0);
    setIsTyping(true);

    // delay awal sebelum mulai mengetik
    const initialTimeout = setTimeout(() => {
      setIsTyping(true);
    }, delay);

    return () => clearTimeout(initialTimeout);
  }, [text, delay]);

  useEffect(() => {
    if (!isTyping) return;

    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
    }
  }, [currentIndex, text, speed, isTyping]);

  return (
    <div>
      {displayText}
      {isTyping && (
        <span className="inline-block w-2 h-4 bg-indigo-500 ml-1 animate-pulse-custom"></span>
      )}
    </div>
  );
};
