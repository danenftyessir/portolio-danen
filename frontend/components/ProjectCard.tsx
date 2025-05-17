import React from "react";

const ProjectCard = ({
  title,
  description,
  bgGradient,
  icon,
  technologies,
  detailLink,
  delay = 0,
}) => {
  return (
    <div
      className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-on-scroll opacity-0 flex flex-col h-full"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Header dengan gradient background */}
      <div className={`flex h-48 items-center justify-center ${bgGradient}`}>
        {icon}
      </div>

      {/* Content area */}
      <div className="p-6 flex flex-col h-full">
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        <p className="mb-4 text-slate-600">{description}</p>

        {/* Technology badges */}
        <div className="mb-4 flex flex-wrap gap-2">
          {technologies.map((tech, idx) => (
            <span
              key={idx}
              className="rounded-full bg-indigo-100 px-2 py-1 text-xs text-indigo-800"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Spacer to push link to bottom */}
        <div className="flex-grow"></div>

        {/* Detail link - always at the bottom */}
        <a
          href={detailLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-800 mt-auto inline-block"
        >
          Lihat Detail →
        </a>
      </div>
    </div>
  );
};

// Implementasi di page.tsx

export const ProjectHighlightsSection = () => {
  return (
    <section className="w-full bg-white px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-10 text-center text-3xl font-bold">
          Project Highlights
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Project Card 1 */}
          <ProjectCard
            title="Algoritma Pencarian Little Alchemy 2"
            description="Implementasi BFS, DFS, dan Bidirectional Search untuk mencari kombinasi recipe dalam permainan Little Alchemy 2."
            bgGradient="bg-gradient-to-r from-blue-600 to-indigo-700"
            icon={
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
            }
            technologies={["Go", "Next.js", "Strategi Algoritma"]}
            detailLink="https://github.com/UburUburLembur/Tubes2_EldenBoys/"
            delay={0}
          />

          {/* Project Card 2 */}
          <ProjectCard
            title="Rush Hour Puzzle Solver"
            description="Program yang menyelesaikan puzzle Rush Hour dengan algoritma pathfinding seperti UCS, Greedy Best-First Search, A*, dan Dijkstra."
            bgGradient="bg-gradient-to-r from-emerald-500 to-teal-500"
            icon={
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
            }
            technologies={["Java", "Strategi Algoritma", "GUI"]}
            detailLink="https://github.com/danenftyessir/Tucil3_13523136_13523155"
            delay={100}
          />

          {/* Project Card 3 */}
          <ProjectCard
            title="IQ Puzzler Pro Solver"
            description="Solusi canggih untuk permainan papan IQ Puzzler Pro menggunakan algoritma brute force dengan visualisasi interaktif."
            bgGradient="bg-gradient-to-r from-purple-500 to-pink-500"
            icon={
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
            }
            technologies={["Java", "JavaFX", "Strategi Algoritma"]}
            detailLink="https://github.com/danenftyessir/Tucil1_13523136"
            delay={200}
          />
        </div>
      </div>
    </section>
  );
};
