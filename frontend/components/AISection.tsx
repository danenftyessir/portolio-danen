import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { AIResponseCard } from "@/components/AIResponseCard";

// komponen ai section yang diperbaiki
const AISection = () => {
  const [userPrompt, setUserPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [useMock, setUseMock] = useState(false);
  const [backendStatus, setBackendStatus] = useState("checking");
  const [previousQuestions, setPreviousQuestions] = useState([]);
  const { toast } = useToast();
  const textareaRef = useRef(null);

  // preset pertanyaan yang relevan dengan profile
  const presetQuestions = [
    "Apa keahlian utama kamu?",
    "Ceritakan tentang proyek terbaik kamu",
    "Apa hobi yang kamu sukai?",
    "Ceritakan tentang pengalamanmu dengan data science",
    "Apa rencana karir kamu ke depan?",
    "Bagaimana pendidikan kamu?",
  ];

  // cek koneksi ke backend saat komponen dimuat
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch("http://localhost:8000/", {
          method: "GET",
        });

        if (response.ok) {
          setBackendStatus("connected");
          setUseMock(false);
        } else {
          setBackendStatus("error");
          setUseMock(true);
        }
      } catch (error) {
        console.error("Error connecting to backend:", error);
        setBackendStatus("error");
        setUseMock(true);
      }
    };

    checkBackend();
  }, []);

  // fungsi untuk mengirim pertanyaan ke backend
  const askAI = async (question) => {
    if (!question.trim()) {
      toast({
        title: "Error",
        description: "Pertanyaan tidak boleh kosong",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setAiResponse("");
    setErrorMessage("");

    // simpan pertanyaan ke history
    if (!previousQuestions.includes(question)) {
      setPreviousQuestions((prev) => [question, ...prev].slice(0, 5));
    }

    // pilih endpoint berdasarkan mode
    const endpoint = useMock
      ? "http://localhost:8000/ask-mock"
      : "http://localhost:8000/ask";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        const responseText = await response.text();

        // parse response sebagai JSON jika memungkinkan
        let errorDetail;
        try {
          errorDetail = JSON.parse(responseText).detail;
        } catch (e) {
          errorDetail = responseText || "Gagal mendapatkan respons";
        }

        setErrorMessage(`Error: ${errorDetail}`);

        // coba gunakan mode mock jika endpoint /ask gagal
        if (!useMock) {
          toast({
            title: "Info",
            description: "Beralih ke mode offline untuk sementara",
          });
          setUseMock(true);
          await askAI(question);
          return;
        } else {
          toast({
            title: "Error",
            description: "Terjadi kesalahan saat menghubungi backend",
            variant: "destructive",
          });
        }
        return;
      }

      // parse response sebagai JSON
      const data = await response.json();

      // perbaikan formatting respons - hapus spasi berlebih & normalisasi
      const cleanedResponse = data.response
        .replace(/\s+/g, " ") // ganti multiple spaces dengan single space
        .replace(/\s+\./g, ".") // hapus spasi sebelum tanda titik
        .replace(/\s+,/g, ",") // hapus spasi sebelum koma
        .replace(/,\s+/g, ", ") // standarisasi spasi setelah koma
        .replace(/\.\s+/g, ". ") // standarisasi spasi setelah titik
        .replace(/\s+!/g, "!") // hapus spasi sebelum tanda seru
        .replace(/!\s+/g, "! ") // standarisasi spasi setelah tanda seru
        .replace(/\s+\?/g, "?") // hapus spasi sebelum tanda tanya
        .replace(/\?\s+/g, "? ") // standarisasi spasi setelah tanda tanya
        .replace(/\s+:/g, ":") // hapus spasi sebelum titik dua
        .replace(/:\s+/g, ": ") // standarisasi spasi setelah titik dua
        .replace(/\s+;/g, ";") // hapus spasi sebelum titik koma
        .replace(/;\s+/g, "; ") // standarisasi spasi setelah titik koma
        .replace(/\s+$/g, "") // hapus trailing spaces
        .replace(/^\s+/g, "") // hapus leading spaces
        .trim(); // trim spaces di awal dan akhir

      setAiResponse(cleanedResponse);
    } catch (error) {
      console.error("Error:", error);

      // jika bukan mode mock, coba dengan mode mock
      if (!useMock) {
        toast({
          title: "Info",
          description: "Beralih ke mode offline untuk sementara",
        });
        setUseMock(true);
        await askAI(question);
        return;
      }

      setErrorMessage(
        `Error: ${
          error instanceof Error ? error.message : "Terjadi kesalahan koneksi"
        }`
      );
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menghubungi backend",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // fungsi untuk toggle mode
  const toggleMode = () => {
    setUseMock(!useMock);
    toast({
      title: "Mode Diubah",
      description: `Beralih ke mode ${!useMock ? "offline" : "online"}`,
    });
  };

  // fungsi untuk regenerate respons
  const regenerateResponse = () => {
    askAI(userPrompt);
  };

  // fungsi untuk handle keydown
  const handleKeyDown = (e) => {
    // kirim pertanyaan dengan Ctrl+Enter
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      askAI(userPrompt);
    }
  };

  // fungsi untuk menampilkan pertanyaan dari history
  const selectPreviousQuestion = (question) => {
    setUserPrompt(question);
    // focus ke textarea dan posisikan cursor di akhir
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(question.length, question.length);
    }
  };

  return (
    <div>
      <h2 className="mb-6 text-center text-3xl font-bold">Tanya AI Asisten</h2>
      <div className="rounded-xl bg-white p-6 shadow-md">
        {/* status backend & toggle mode */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`inline-block h-3 w-3 rounded-full ${
                backendStatus === "connected"
                  ? "bg-green-500"
                  : backendStatus === "error"
                  ? "bg-red-500"
                  : "bg-yellow-500 animate-pulse"
              }`}
            ></span>
            <span className="text-sm text-slate-600">
              {backendStatus === "connected"
                ? "Backend terhubung"
                : backendStatus === "error"
                ? "Backend tidak terhubung"
                : "Mengecek status..."}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleMode}
            className="text-xs"
          >
            <span
              className={`mr-1.5 inline-block h-2 w-2 rounded-full ${
                useMock ? "bg-amber-500" : "bg-green-500"
              }`}
            ></span>
            Mode: {useMock ? "Offline" : "Online"}
          </Button>
        </div>

        {/* Input area dengan styling yang lebih menarik */}
        <div className="mb-4 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 shadow-inner transition-all focus-within:border-indigo-300 focus-within:ring-1 focus-within:ring-indigo-300">
          <Textarea
            ref={textareaRef}
            placeholder="Tanyakan sesuatu tentang saya..."
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[130px] max-h-[200px] resize-y border-0 bg-transparent transition-all duration-300 focus-visible:ring-0"
          />
          <div className="border-t border-slate-200 bg-slate-100 px-3 py-2 text-xs text-slate-500">
            Tekan Ctrl+Enter untuk kirim
          </div>
        </div>

        {/* Sejarah pertanyaan sebelumnya */}
        {previousQuestions.length > 0 && (
          <div className="mb-4">
            <p className="mb-2 text-xs text-slate-500">
              Pertanyaan sebelumnya:
            </p>
            <div className="flex flex-wrap gap-2">
              {previousQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => selectPreviousQuestion(q)}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 transition-colors hover:bg-slate-50 hover:text-indigo-600"
                >
                  {q.length > 20 ? q.substring(0, 20) + "..." : q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Preset questions dengan UI yang lebih menarik */}
        <div className="mb-4">
          <p className="mb-2 text-xs text-slate-500">Pertanyaan umum:</p>
          <div className="flex flex-wrap gap-2">
            {presetQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => {
                  setUserPrompt(question);
                  askAI(question);
                }}
                className="text-xs border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors duration-300"
              >
                {question}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => setUserPrompt("")}
            disabled={isLoading || !userPrompt}
            className="border-slate-200 hover:bg-red-50 hover:text-red-600 transition-colors duration-300"
          >
            Reset
          </Button>
          <Button
            onClick={() => askAI(userPrompt)}
            disabled={isLoading || !userPrompt.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="-ml-1 mr-2 h-4 w-4 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Memproses...
              </span>
            ) : (
              <span className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-1.5 h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Tanya
              </span>
            )}
          </Button>
        </div>

        {/* AI Response Card */}
        {(aiResponse || isLoading) && (
          <AIResponseCard
            response={aiResponse}
            loading={isLoading}
            isOfflineMode={useMock}
            onRegenerate={regenerateResponse}
          />
        )}

        {errorMessage && (
          <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-700">
            <div className="flex items-center gap-2 font-medium">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <h3>Error</h3>
            </div>
            <div className="mt-2 text-sm">{errorMessage}</div>
            <div className="mt-3 text-sm">
              <p>Periksa apakah:</p>
              <ul className="mt-1 list-disc pl-5">
                <li>Backend server berjalan di http://localhost:8000</li>
                <li>
                  API key OpenAI sudah dikonfigurasi dengan benar di file .env
                </li>
                <li>Koneksi internet tersedia untuk menghubungi API OpenAI</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { AISection };
