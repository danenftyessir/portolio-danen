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

  // efek typing dengan kecepatan yang konsisten berdasarkan karakter
  useEffect(() => {
    if (!isTyping || !response) return;

    if (currentIndex < response.length) {
      // kecepatan typing berdasarkan karakter
      let typingSpeed = 12; // kecepatan dasar

      // perlambat di tanda baca untuk efek yang lebih alami
      const currentChar = response[currentIndex];
      if ([".", "!", "?"].includes(currentChar)) {
        typingSpeed = 200; // pause setelah kalimat
      } else if ([",", ";", ":"].includes(currentChar)) {
        typingSpeed = 100; // pause medium untuk koma, dll
      }

      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + response[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, typingSpeed);

      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
      setIsCompleted(true);
    }
  }, [currentIndex, response, isTyping]);

  // memposisikan kursor dan auto-scroll
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

  // format teks dengan pemrosesan markdown sederhana
  const formatText = (text: string) => {
    // tangani baris baru
    const withLineBreaks = text.split("\n").map((line, i) => (
      <React.Fragment key={i}>
        {formatTextSegment(line)}
        {i < text.split("\n").length - 1 && <br />}
      </React.Fragment>
    ));

    return withLineBreaks;
  };

  // format segmen teks dengan support bold dan italic
  const formatTextSegment = (text: string) => {
    // proses bold (**text**)
    let parts = text.split(/(\*\*.*?\*\*)/g);

    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }

      // proses italic (*text*)
      const italicParts = part.split(/(\*.*?\*)/g);
      if (italicParts.length > 1) {
        return italicParts.map((italicPart, j) => {
          if (italicPart.startsWith("*") && italicPart.endsWith("*")) {
            return <em key={`${i}-${j}`}>{italicPart.slice(1, -1)}</em>;
          }
          return italicPart;
        });
      }

      return part;
    });
  };

  // pilih pesan loading yang lebih informatif
  const getLoadingMessage = () => {
    const messages = [
      "Memproses pertanyaan...",
      "Menganalisis data...",
      "Menyusun jawaban...",
      "Membuka knowledge base...",
      "Berpikir sejenak...",
    ];

    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <div className="mt-6 rounded-lg border bg-white shadow-md transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 overflow-hidden rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 p-0.5">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-indigo-600"
              >
                <path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10Z"></path>
                <path d="M12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z"></path>
                <path d="M12 8v1"></path>
                <path d="M12 15v1"></path>
                <path d="M16 12h-1"></path>
                <path d="M9 12H8"></path>
              </svg>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">AI Assistant</p>
            <div className="flex items-center text-xs text-slate-500">
              <span
                className={`mr-1.5 inline-block h-2 w-2 rounded-full ${
                  isOfflineMode ? "bg-amber-500" : "bg-green-500"
                }`}
              ></span>
              {isOfflineMode ? "Mode Offline" : "Mode Online"}
            </div>
          </div>
        </div>
        {isCompleted && onRegenerate && (
          <button
            onClick={onRegenerate}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-500 transition-colors hover:bg-slate-100 hover:text-indigo-600"
            title="Regenerate response"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
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
            <span>Regenerate</span>
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
              <div className="flex space-x-1">
                <div
                  className="h-2 w-2 animate-bounce rounded-full bg-indigo-400"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="h-2 w-2 animate-bounce rounded-full bg-indigo-500"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="h-2 w-2 animate-bounce rounded-full bg-indigo-600"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
              <p className="mt-3 text-sm text-slate-500">
                {getLoadingMessage()}
              </p>
            </div>
          </div>
        ) : (
          <div className="relative whitespace-pre-wrap break-words">
            <span ref={textRef}>{formatText(displayText)}</span>
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
