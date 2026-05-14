interface ArticleImagePlaceholderProps {
    title: string;
    category?: string;
}

const ICONS = [
    // Document / article
    <path key="doc" strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />,
    // Lightbulb
    <path key="bulb" strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.355a3.375 3.375 0 01-3 0m3-2.355a3.375 3.375 0 01-3 0M12 3a6 6 0 00-6 6c0 1.926.91 3.638 2.32 4.726a2.25 2.25 0 001.18.524v.5a.75.75 0 001.5 0v-.5c.42-.051.822-.217 1.18-.524A6 6 0 0012 3z" />,
    // Code bracket
    <path key="code" strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />,
    // Rocket
    <path key="rocket" strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />,
];

const Particle = ({ delay, duration, x, y, size }: { delay: number; duration: number; x: number; y: number; size: number }) => (
    <div
        className="absolute rounded-full bg-primary opacity-20 animate-ping"
        style={{
            left: `${x}%`,
            top: `${y}%`,
            width: size,
            height: size,
            animationDelay: `${delay}s`,
            animationDuration: `${duration}s`,
        }}
    />
);

const Ring = ({ delay, scale }: { delay: number; scale: number }) => (
    <div
        className="absolute inset-0 rounded-full border border-primary/20 animate-ping"
        style={{
            animationDelay: `${delay}s`,
            animationDuration: "3s",
            transform: `scale(${scale})`,
        }}
    />
);

export const ArticleImagePlaceholder = ({ title, category }: ArticleImagePlaceholderProps) => {
    const iconIndex = title.length % ICONS.length;
    const icon = ICONS[iconIndex];

    const particles = [
        { delay: 0,   duration: 2.5, x: 15,  y: 20,  size: 8  },
        { delay: 0.4, duration: 3.2, x: 80,  y: 15,  size: 12 },
        { delay: 0.8, duration: 2.8, x: 70,  y: 75,  size: 6  },
        { delay: 1.2, duration: 3.5, x: 25,  y: 70,  size: 10 },
        { delay: 1.6, duration: 2.2, x: 88,  y: 45,  size: 7  },
        { delay: 0.6, duration: 3.0, x: 10,  y: 50,  size: 9  },
        { delay: 2.0, duration: 2.7, x: 55,  y: 88,  size: 5  },
        { delay: 1.4, duration: 3.8, x: 45,  y: 10,  size: 11 },
    ];

    return (
        <div className="w-full h-full relative overflow-hidden rounded-xl border-2 border-bodydark2 bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-gray-dark dark:via-boxdark dark:to-dark flex items-center justify-center">

            {/* Grid pattern background */}
            <div
                className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
                style={{
                    backgroundImage: `
                        linear-gradient(#81263A 1px, transparent 1px),
                        linear-gradient(90deg, #81263A 1px, transparent 1px)
                    `,
                    backgroundSize: "40px 40px",
                }}
            />

            {/* Gradient blobs */}
            <div className="absolute top-[-20%] left-[-10%] w-72 h-72 rounded-full bg-primary/10 blur-3xl animate-pulse" style={{ animationDuration: "4s" }} />
            <div className="absolute bottom-[-20%] right-[-10%] w-72 h-72 rounded-full bg-primary/10 blur-3xl animate-pulse" style={{ animationDuration: "5s", animationDelay: "1s" }} />

            {/* Floating particles */}
            {particles.map((p, i) => <Particle key={i} {...p} />)}

            {/* Center icon with rings */}
            <div className="relative flex flex-col items-center gap-5 z-10">
                <div className="relative flex items-center justify-center">
                    <Ring delay={0}    scale={1}   />
                    <Ring delay={0.8}  scale={1.4} />
                    <Ring delay={1.6}  scale={1.8} />

                    <div className="relative w-24 h-24 rounded-full bg-white dark:bg-boxdark border-2 border-primary/30 shadow-lg flex items-center justify-center animate-pulse" style={{ animationDuration: "3s" }}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.2}
                            stroke="currentColor"
                            className="w-12 h-12 text-primary"
                        >
                            {icon}
                        </svg>
                    </div>
                </div>

                <div className="text-center px-8 max-w-md">
                    <p className="text-sm font-semibold text-dark dark:text-white line-clamp-2 leading-snug">{title}</p>
                    {category && (
                        <span className="mt-2 inline-block text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                            {category}
                        </span>
                    )}
                </div>
            </div>

            {/* Corner decorations */}
            <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-primary/30 rounded-tl-md" />
            <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-primary/30 rounded-tr-md" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-primary/30 rounded-bl-md" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-primary/30 rounded-br-md" />
        </div>
    );
};
