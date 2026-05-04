import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            maxWidth: {
                content: "1180px",
            },
            colors: {
                brand: {
                    red: "#D84A3A",
                    redDark: "#B83A2F",
                    redSoft: "#F3B4AA",
                    navy: "#132238",
                    navySoft: "#DDE7F0",
                    sky: "#BFE8F5",
                    skySoft: "#E7F7FB",
                    cream: "#F7F1E8",
                    ink: "#101827",
                    text: "#1B2230",
                },
            },
            boxShadow: {
                soft: "0 24px 70px rgba(16, 24, 39, 0.14)",
            },
            backgroundImage: {
                headerGradient:
                    "linear-gradient(90deg, #132238 0%, #0F4F5A 100%)",
            },
        },
    },
    plugins: [],
};

export default config;