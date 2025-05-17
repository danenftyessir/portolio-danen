"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import { AISection } from "@/components/AISection";
import { ProjectCard } from "@/components/ProjectCard";

// data
const userData = {
  nama: "Danendra Shafi Athallah",
  lokasi: "Jakarta, Indonesia",
  pendidikan: "Institut Teknologi Bandung, Teknik Informatika (Semester 4)",
  keahlian: [
    "Java",
    "Python",
    "Next.js",
    "React",
    "Data Science",
    "Tailwind CSS",
  ],
  hobi: [
    "Membaca buku novel",
    "Traveling ke destinasi lokal",
    "Penggemar street food",
  ],
  bio: "Data Science Enthusiast",
};

export default function Home() {
  const aboutRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // fungsi untuk scroll ke bagian tertentu
  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // efek animasi untuk fade-in elemen saat scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fadeIn");
          }
        });
      },
      { threshold: 0.1 }
    );

    // pilih semua elemen dengan kelas animate-on-scroll
    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
      observer.observe(el);
    });

    return () => {
      document.querySelectorAll(".animate-on-scroll").forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, []);

  return (
    <main className="flex flex-col items-center overflow-x-hidden">
      {/* hero section with particles background */}
      <section className="relative flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-4 text-white">
        <ParticlesBackground quantity={30} color="#6366f1" />

        <div className="relative z-10 text-center">
          {/* Foto profil di hero section */}
          <div className="mb-8 flex justify-center">
            <div className="glow-effect relative h-40 w-40 overflow-hidden rounded-full border-2 border-indigo-500 p-1 shadow-lg md:h-48 md:w-48">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-50"></div>
              <div className="relative h-full w-full overflow-hidden rounded-full">
                <img
                  src="/profile.jpg"
                  alt={`Foto profil ${userData.nama}`}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          <h1 className="mb-2 text-4xl font-bold md:text-7xl">
            <span className="bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
              Hi, Saya {userData.nama}
            </span>
          </h1>

          <div className="mx-auto mb-6 h-1 w-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"></div>

          <p className="mb-8 text-xl text-slate-300 md:text-2xl">
            You had me at ‘Hello, World!’ <br />
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Button
              onClick={() => scrollToSection(aboutRef)}
              className="bg-indigo-600 hover:bg-indigo-700"
              size="lg"
            >
              Tanya tentang saya
            </Button>
          </div>

          <div className="mt-16 flex justify-center space-x-4">
            <a
              href="https://github.com/danenftyessir"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-slate-800 p-3 text-slate-300 transition-colors duration-300 hover:bg-indigo-800 hover:text-white"
              aria-label="GitHub"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>

            <a
              href="https://linkedin.com/in/danendrashafiathallah"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-slate-800 p-3 text-slate-300 transition-colors duration-300 hover:bg-indigo-800 hover:text-white"
              aria-label="LinkedIn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>

            <a
              href="https://www.instagram.com/danennn__/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-slate-800 p-3 text-slate-300 transition-colors duration-300 hover:bg-indigo-800 hover:text-white"
              aria-label="Instagram"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
          </div>
        </div>

        {/* scroll down indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-indigo-400"
          >
            <path d="M12 5v14"></path>
            <path d="m19 12-7 7-7-7"></path>
          </svg>
        </div>
      </section>

      {/* about section dan ask ai section */}
      <section
        ref={aboutRef}
        className="w-full bg-gradient-to-b from-white via-indigo-50 to-indigo-100 px-4 py-20"
      >
        <div className="mx-auto max-w-4xl">
          <div>
            <h2 className="mb-8 text-center text-3xl font-bold">
              Tentang Saya
            </h2>

            {/* Bio Card - LinkedIn Style */}
            <div className="mb-20 rounded-xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-on-scroll opacity-0">
              <div className="flex flex-col md:flex-row">
                {/* Foto profil */}
                <div className="flex justify-center p-6 md:justify-start">
                  <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-slate-200 shadow-sm">
                    <img
                      src="/profile.jpg"
                      alt={`Foto profil ${userData.nama}`}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                </div>

                {/* Informasi bio */}
                <div className="flex-1 p-6 md:pl-0">
                  <h3 className="mb-2 text-2xl font-bold">{userData.nama}</h3>

                  <div className="mb-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📍</span>
                      <span>{userData.lokasi}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🎓</span>
                      <span>Mahasiswa Teknik Informatika ITB, Semester 4</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">💻</span>
                      <span>Data Science Enthusiast</span>
                    </div>
                  </div>

                  {/* Skills badges */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {userData.keahlian.map((skill, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Hobi */}
                  <div className="mt-4 text-slate-600">
                    <span className="font-medium">Hobi:</span>{" "}
                    {userData.hobi.join(", ")}
                  </div>
                </div>
              </div>
            </div>

            {/* Tanya AI bagian */}
            <div className="animate-on-scroll opacity-0">
              <AISection /> {/* Menggunakan komponen terpisah */}
            </div>
          </div>
        </div>
      </section>

      {/* Project Highlights Section - Versi yang Diperbarui */}
      <section className="w-full bg-white px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-3xl font-bold">
            Project Highlights
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Project Card 1 */}
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-on-scroll opacity-0 flex flex-col h-full">
              <div className="flex h-48 items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 17l9 5 9-5-9-5-9 5"></path>
                  <path d="M3 7l9 5 9-5-9-5-9 5"></path>
                  <path d="M3 12l9 5 9-5"></path>
                  <line x1="12" y1="22" x2="12" y2="17"></line>
                  <line x1="12" y1="12" x2="12" y2="7"></line>
                  <line x1="12" y1="7" x2="12" y2="2"></line>
                </svg>
              </div>
              <div className="p-6 flex flex-col h-full">
                <h3 className="mb-2 text-lg font-semibold">
                  Algoritma Pencarian Little Alchemy 2
                </h3>
                <p className="mb-4 text-slate-600">
                  Implementasi BFS, DFS, dan Bidirectional Search untuk mencari
                  kombinasi recipe dalam permainan Little Alchemy 2.
                </p>
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs text-indigo-800">
                    Go
                  </span>
                  <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs text-indigo-800">
                    Next.js
                  </span>
                  <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs text-indigo-800">
                    Strategi Algoritma
                  </span>
                </div>
                <div className="flex-grow"></div>{" "}
                {/* Spacer untuk mendorong link ke bawah */}
                <a
                  href="https://github.com/UburUburLembur/Tubes2_EldenBoys/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-800 mt-auto"
                >
                  Lihat Detail →
                </a>
              </div>
            </div>

            {/* Project Card 2 */}
            <div
              className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-on-scroll opacity-0 flex flex-col h-full"
              style={{ animationDelay: "100ms" }}
            >
              <div className="flex h-48 items-center justify-center bg-gradient-to-r from-emerald-500 to-teal-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="2" ry="2"></rect>
                  <path d="M9 2v20"></path>
                  <path d="M14 2v20"></path>
                  <path d="M2 9h20"></path>
                  <path d="M2 14h20"></path>
                </svg>
              </div>
              <div className="p-6 flex flex-col h-full">
                <h3 className="mb-2 text-lg font-semibold">
                  Rush Hour Puzzle Solver
                </h3>
                <p className="mb-4 text-slate-600">
                  Program yang menyelesaikan puzzle Rush Hour dengan algoritma
                  pathfinding seperti UCS, Greedy Best-First Search, A*, dan
                  Dijkstra.
                </p>
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs text-indigo-800">
                    Java
                  </span>
                  <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs text-indigo-800">
                    Strategi Algoritma
                  </span>
                  <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs text-indigo-800">
                    GUI
                  </span>
                </div>
                <div className="flex-grow"></div>{" "}
                {/* Spacer untuk mendorong link ke bawah */}
                <a
                  href="https://github.com/danenftyessir/Tucil3_13523136_13523155"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-800 mt-auto"
                >
                  Lihat Detail →
                </a>
              </div>
            </div>

            {/* Project Card 3 */}
            <div
              className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-on-scroll opacity-0 flex flex-col h-full"
              style={{ animationDelay: "200ms" }}
            >
              <div className="flex h-48 items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <rect x="7" y="7" width="3" height="3"></rect>
                  <rect x="14" y="7" width="3" height="3"></rect>
                  <rect x="7" y="14" width="3" height="3"></rect>
                  <rect x="14" y="14" width="3" height="3"></rect>
                </svg>
              </div>
              <div className="p-6 flex flex-col h-full">
                <h3 className="mb-2 text-lg font-semibold">
                  IQ Puzzler Pro Solver
                </h3>
                <p className="mb-4 text-slate-600">
                  Solusi canggih untuk permainan papan IQ Puzzler Pro
                  menggunakan algoritma brute force dengan visualisasi
                  interaktif.
                </p>
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs text-indigo-800">
                    Java
                  </span>
                  <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs text-indigo-800">
                    JavaFX
                  </span>
                  <span className="rounded-full bg-indigo-100 px-2 py-1 text-xs text-indigo-800">
                    Strategi Algoritma
                  </span>
                </div>
                <div className="flex-grow"></div>{" "}
                {/* Spacer untuk mendorong link ke bawah */}
                <a
                  href="https://github.com/danenftyessir/Tucil1_13523136"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-800 mt-auto"
                >
                  Lihat Detail →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="w-full bg-slate-950 px-4 py-12 text-white">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 flex justify-center gap-6">
            <a
              href="https://github.com/danenftyessir"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-300 hover:text-indigo-400"
              aria-label="GitHub"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>

            <a
              href="https://www.linkedin.com/in/danendrashafiathallah"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-300 hover:text-indigo-400"
              aria-label="LinkedIn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>

            <a
              href="https://www.instagram.com/danennn__/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-300 hover:text-indigo-400"
              aria-label="Instagram"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
          </div>
          <p className="text-sm text-slate-400">
            Portfolio ini dikembangkan dengan Next.js + Python dan ditenagai
            oleh AI.
          </p>
          <p className="mt-2 text-xs text-slate-500">
            © {new Date().getFullYear()} {userData.nama}. Semua hak cipta
            dilindungi.
          </p>
        </div>
      </footer>
    </main>
  );
}
