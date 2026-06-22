"use client";

import { useEffect, useRef, useState } from "react";

function clamp(value: number, min = 0, max = 1) {
    return Math.min(Math.max(value, min), max);
}

function mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number) {
    const progress = clamp((value - inMin) / (inMax - inMin));
    return outMin + (outMax - outMin) * progress;
}

export function ScrollRevealSection() {
    const sectionRef = useRef<HTMLElement | null>(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        function onScroll() {
            if (!sectionRef.current) return;

            const rect = sectionRef.current.getBoundingClientRect();
            const total = sectionRef.current.offsetHeight - window.innerHeight;

            if (total <= 0) return;

            const rawProgress = clamp(-rect.top / total);
            setProgress(rawProgress);
        }

        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);

        onScroll();

        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, []);

    return (
        <section ref={sectionRef} className="relative h-[320vh] bg-brand-cream">
            <div className="sticky top-0 h-screen overflow-hidden bg-brand-cream">
                <div className="relative h-full w-full overflow-hidden">
                    <div
                        className="absolute right-0 top-[10%] z-[1] h-[20vh] w-screen origin-right"
                        style={{
                            backgroundColor: "#F3B4AA",
                            transform: `scaleX(${mapRange(progress, 0, 0.45, 0, 1)})`,
                        }}
                    />

                    <div
                        className="absolute right-0 top-[31%] z-[1] h-[22vh] w-screen origin-right"
                        style={{
                            backgroundColor: "#BFE8F5",
                            transform: `scaleX(${mapRange(progress, 0.05, 0.6, 0, 1)})`,
                        }}
                    />

                    <div
                        className="absolute left-0 top-[56%] z-[1] h-[16vh] w-screen origin-left"
                        style={{
                            backgroundColor: "#F3B4AA",
                            transform: `scaleX(${mapRange(progress, 0.12, 0.68, 0, 1)})`,
                        }}
                    />

                    <div
                        className="absolute bottom-[8%] left-0 z-[1] h-[18vh] w-screen origin-left"
                        style={{
                            backgroundColor: "#E7F7FB",
                            transform: `scaleX(${mapRange(progress, 0.18, 0.82, 0, 1)})`,
                        }}
                    />

                    <div
                        className="absolute bottom-0 left-0 z-[1] h-[8vh] w-screen origin-left"
                        style={{
                            backgroundColor: "#DDE7F0",
                            transform: `scaleX(${mapRange(progress, 0.28, 0.95, 0, 1)})`,
                        }}
                    />

                    <div className="relative z-[3] mx-auto flex h-full w-[min(1100px,92vw)] flex-col items-center">
                        <h2 className="max-w-[980px] px-2 pt-[30vh] text-center text-[clamp(2.6rem,5vw,5rem)] font-semibold uppercase leading-[0.95] tracking-[-0.06em] text-brand-ink">
                            A Rocker Pilates encontra você no ponto em que você está.
                        </h2>

                        <div className="relative z-[3] mt-[5vh] flex min-h-[190px] w-[min(900px,82vw)] flex-col justify-center gap-3 rounded-[20px] bg-white/92 px-8 py-10 text-center text-[1.08rem] shadow-[0_8px_24px_rgba(0,0,0,0.11)] md:px-12">
                            <p
                                className="text-brand-ink transition-all duration-300"
                                style={{
                                    opacity: mapRange(progress, 0.08, 0.3, 0, 1),
                                    transform: `translateY(${18 - 18 * mapRange(progress, 0.08, 0.3, 0, 1)}px)`,
                                }}
                            >
                                Pilates com acolhimento, técnica e direção clara.
                            </p>

                            <p
                                className="text-brand-ink transition-all duration-300"
                                style={{
                                    opacity: mapRange(progress, 0.22, 0.46, 0, 1),
                                    transform: `translateY(${18 - 18 * mapRange(progress, 0.22, 0.46, 0, 1)}px)`,
                                }}
                            >
                                Cada aluno evolui no próprio ritmo, sem pressão vazia.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}