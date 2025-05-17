"use client";

import React, { useState, useEffect, useRef } from "react";

interface AIResponseCardProps {
  response: string;
  loading?: boolean;
  isOfflineMode?: boolean;
  onRegenerate?: () => void;
}

const AIResponseCard = ({
  response,
  loading = false,
  isOfflineMode = false,
  onRegenerate,
}: AIResponseCardProps) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  // reset saat respons berubah
  useEffect(() => {
    setDisplayText("");
    setCurrentIndex(0);
    setIsTyping(true);
    setIsCompleted(false);
  }, [response]);

  // efek typing
  useEffect(() => {
    if (!isTyping || !response) return;

    if (currentIndex < response.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + response[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 15); // kecepatan mengetik (makin kecil makin cepat)

      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
      setIsCompleted(true);
    }
  }, [currentIndex, response, isTyping]);

  // memposisikan kursor
  useEffect(() => {
    if (containerRef.current && isTyping) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }

    if (cursorRef.current && textRef.current) {
      const textNode = textRef.current;
      const cursorNode = cursorRef.current;

      if (textNode.parentNode) {
        textNode.parentNode.insertBefore(cursorNode, textNode.nextSibling);
      }
    }
  }, [displayText, isTyping]);

  // format teks sederhana
  const formatTextWithLineBreaks = (text: string) => {
    return text.split("\n").map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < text.split("\n").length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className="mt-6 rounded-lg border bg-white shadow-md transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 overflow-hidden rounded-full bg-indigo-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-full w-full p-1 text-indigo-600"
            >
              <path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10Z"></path>
              <path d="M12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z"></path>
              <path d="M12 8v1"></path>
              <path d="M12 15v1"></path>
              <path d="M16 12h-1"></path>
              <path d="M9 12H8"></path>
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">AI Assistant</p>
            <p className="text-xs text-slate-500">
              {isOfflineMode ? "Mode Offline" : "Mode Online"}
            </p>
          </div>
        </div>
        {isCompleted && onRegenerate && (
          <button
            onClick={onRegenerate}
            className="rounded-md p-1 text-xs text-slate-500 hover:bg-slate-100"
            title="Regenerate response"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
              <path d="M3 3v5h5"></path>
            </svg>
          </button>
        )}
      </div>
      <div
        ref={containerRef}
        className="max-h-80 min-h-[120px] overflow-y-auto overflow-x-hidden p-4 text-slate-700"
      >
        {loading ? (
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-t-2 border-indigo-500"></div>
              <p className="mt-2 text-sm text-slate-500">
                Memproses respons...
              </p>
            </div>
          </div>
        ) : (
          <div className="relative whitespace-pre-wrap break-words">
            <span ref={textRef}>{formatTextWithLineBreaks(displayText)}</span>
            {isTyping && (
              <span
                ref={cursorRef}
                className="inline-block h-4 w-2 animate-pulse-custom bg-indigo-500 align-text-bottom"
                style={{ verticalAlign: "text-bottom" }}
              ></span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export { AIResponseCard };
