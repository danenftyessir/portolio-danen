"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import Image from "next/image";

// data pengguna
const userData = {
  nama: "Danendra Shafi Athallah",
  lokasi: "Jakarta, Indonesia",
  keahlian: ["Next.js", "Python", "AI", "Data Science"],
  hobi: ["Membaca", "Traveling"],
  proyek: [
    {
      nama: "AI Sentiment Analyzer",
      deskripsi: "Aplikasi analisis sentimen menggunakan NLP",
      teknologi: ["Python", "TensorFlow", "Flask"],
      link: "https://github.com/username/sentiment-analyzer",
    },
    {
      nama: "E-Commerce Dashboard",
      deskripsi: "Dashboard untuk monitoring penjualan online",
      teknologi: ["React", "Node.js", "MongoDB"],
      link: "https://github.com/username/ecommerce-dashboard",
    },
    {
      nama: "Personal Finance Tracker",
      deskripsi: "Aplikasi tracking keuangan pribadi",
      teknologi: ["Next.js", "Prisma", "PostgreSQL"],
      link: "https://github.com/username/finance-tracker",
    },
  ],
};

// preset pertanyaan
const presetQuestions = [
  "Apa keahlian utama kamu?",
  "Ceritakan tentang proyek terbaikmu",
  "Apa hobi yang kamu sukai?",
  "Bagaimana pengalamanmu dengan AI?",
];

export default function Home() {
  const [userPrompt, setUserPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [useMock, setUseMock] = useState(false);
  const [backendStatus, setBackendStatus] = useState("checking");
  const { toast } = useToast();
  const aboutRef = useRef<HTMLDivElement>(null);

  // cek koneksi ke backend saat aplikasi dimuat
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

  // fungsi untuk scroll ke bagian About
  const scrollToAbout = () => {
    aboutRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // fungsi untuk mengirim pertanyaan ke backend
  const askAI = async (question: string) => {
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

      // mendapatkan text response untuk debugging
      const responseText = await response.text();
      console.log("Raw response:", responseText);

      if (!response.ok) {
        // mencoba parse response sebagai JSON jika memungkinkan
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
            description: "Mencoba menggunakan mode offline",
          });
          setUseMock(true);
          await askAI(question);
          return;
        } else {
          toast({
            title: "Error",
            description: "Terjadi kesalahan saat menghubungi AI",
            variant: "destructive",
          });
        }
        return;
      }

      // parse response sebagai JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        setErrorMessage("Format respons tidak valid");
        toast({
          title: "Error",
          description: "Format respons tidak valid",
          variant: "destructive",
        });
        return;
      }

      setAiResponse(data.response);
    } catch (error) {
      console.error("Error:", error);

      // jika bukan mode mock, coba dengan mode mock
      if (!useMock) {
        toast({
          title: "Info",
          description: "Mencoba menggunakan mode offline",
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
        description: "Terjadi kesalahan saat menghubungi AI",
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

  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* hero section */}
      <section className="flex flex-col items-center justify-center w-full min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white px-4">
        <div className="text-center">
          {/* Foto profil di hero section */}
          <div className="flex justify-center mb-8">
            <div className="relative w-48 h-48 rounded-full overflow-hidden border-2 border-indigo-500 p-1 shadow-lg animate-fadeIn">
              <img
                src="/profile.jpg"
                alt={`Foto profil ${userData.nama}`}
                className="absolute inset-0 w-full h-full object-cover rounded-full"
              />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            Hi, Saya {userData.nama}
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-8">
            Membangun masa depan dengan kode & AI.
          </p>
          <Button
            onClick={scrollToAbout}
            className="rounded-full px-6 py-6 bg-indigo-600 hover:bg-indigo-700"
          >
            Tanya tentang saya →
          </Button>
        </div>
      </section>

      {/* about section */}
      <section ref={aboutRef} className="w-full py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-center">
              Tentang Saya
            </h2>
            <div className="flex flex-col md:flex-row gap-8 items-center">
              {/* Foto profil di about section */}
              <div className="mb-4 md:mb-0 flex justify-center">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-slate-300 p-1 shadow-md">
                  <img
                    src="/profile.jpg"
                    alt={`Foto profil ${userData.nama}`}
                    className="absolute inset-0 w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
              <div className="bg-slate-100 p-6 rounded-xl flex-1">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <span className="text-lg">📍</span>
                    <span>{userData.lokasi}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-lg">💻</span>
                    <span>Keahlian: {userData.keahlian.join(", ")}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-lg">🧠</span>
                    <span>Hobi: {userData.hobi.join(", ")}</span>
                  </li>
                </ul>
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {userData.keahlian.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-center p-3 bg-slate-800 text-white rounded-lg"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ask ai section */}
      <section className="w-full py-20 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-center">
              Tanya AI Saya
            </h2>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              {/* status backend & toggle mode */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block w-3 h-3 rounded-full ${
                      backendStatus === "connected"
                        ? "bg-green-500"
                        : backendStatus === "error"
                        ? "bg-red-500"
                        : "bg-yellow-500"
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
                  Mode: {useMock ? "Offline" : "Online"}
                </Button>
              </div>

              {/* Textarea dengan animasi */}
              <Textarea
                placeholder="Tanyakan sesuatu tentang saya..."
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                className="mb-4 min-h-[125px] transition-all duration-300 focus:border-indigo-500"
                animatedBorder={true}
              />

              <div className="flex gap-2 mb-4 flex-wrap">
                {presetQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setUserPrompt(question);
                      askAI(question);
                    }}
                    className="text-xs hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-300"
                  >
                    {question}
                  </Button>
                ))}
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => askAI(userPrompt)}
                  disabled={isLoading}
                  className="bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                    "Tanya"
                  )}
                </Button>
              </div>

              {isLoading && (
                <div className="mt-6 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              )}

              {errorMessage && (
                <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg">
                  <h3 className="font-medium mb-2">Error:</h3>
                  <div className="text-sm">{errorMessage}</div>
                  <div className="mt-2 text-sm">
                    <p>Periksa apakah:</p>
                    <ul className="list-disc pl-5 mt-1">
                      <li>Backend server berjalan di http://localhost:8000</li>
                      <li>
                        API key OpenAI sudah dikonfigurasi dengan benar di file
                        .env
                      </li>
                      <li>
                        Koneksi internet tersedia untuk menghubungi API OpenAI
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {aiResponse && (
                <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200 animate-[fadeIn_0.5s_ease-in-out]">
                  <h3 className="font-medium mb-2">
                    Respons{useMock ? " (Mode Offline)" : ""}:
                  </h3>
                  <div className="whitespace-pre-wrap">{aiResponse}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* projects section */}
      <section className="w-full py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div>
            <h2 className="text-3xl font-bold mb-8 text-center">
              Proyek Unggulan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {userData.proyek.map((project, index) => (
                <div
                  key={index}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{project.nama}</h3>
                    <p className="text-slate-600 text-sm mb-3">
                      {project.deskripsi}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {project.teknologi.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 text-sm hover:underline transition-all duration-300"
                    >
                      Lihat di GitHub →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="w-full py-12 px-4 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center gap-4 mb-6">
            <a
              href="https://github.com/danenftyessir"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-400 transition-colors duration-300"
            >
              GitHub
            </a>
            <a
              href="danendra1967@gmail.com"
              className="hover:text-indigo-400 transition-colors duration-300"
            >
              Email
            </a>
            <a
              href="https://www.linkedin.com/in/danendrashafiathallah"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-400 transition-colors duration-300"
            >
              LinkedIn
            </a>
          </div>
          <p className="text-slate-400 text-sm">
            Portfolio ini dikembangkan dengan AI dan dibangun menggunakan
            Next.js + Python.
          </p>
        </div>
      </footer>
    </main>
  );
}
