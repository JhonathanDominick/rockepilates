import { Hero } from "@/components/Hero";
import { getConfigs } from "@/lib/api/config";
import { CTA } from "@/components/CTA";
import { About } from "@/components/About";


export default async function Home() {
    const configs = await getConfigs([
        "home.title",
        "home.subtitle",
        "home.cta.title",
        "home.cta.button",
        "home.about.text",
    ]);

    return (
        <main>
            <Hero
                title={configs["home.title"]?.valor}
                subtitle={configs["home.subtitle"]?.valor}
            />

            <CTA
                title={configs["home.cta.title"]?.valor}
                button={configs["home.cta.button"]?.valor}
            />

            <About
                text={configs["home.about.text"]?.valor}
            />
        </main>
    );
}