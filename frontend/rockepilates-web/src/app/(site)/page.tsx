import { Hero } from "@/components/Hero";
import { PracticeStrip } from "@/components/PracticeStrip";
import { Benefits } from "@/components/Benefits";
import { ScrollRevealSection } from "@/components/ScrollRevealSection";
import { Plans } from "@/components/Plans";
import { EvelynSection } from "@/components/EvelynSection";
import { CTA } from "@/components/CTA";
import { About } from "@/components/About";
import { getConfigs } from "@/lib/api/config";
import { Testimonials } from "@/components/Testimonials";
import { listarDepoimentos } from "@/lib/api/depoimentos";
import { TestimonialForm } from "@/components/TestimonialForm";
import type { SiteConfig } from "@/lib/api/config";
import type { DepoimentoPublico } from "@/lib/api/depoimentos";

export const dynamic = "force-dynamic";

export default async function Home() {
    let configs: Record<string, SiteConfig | null> = {};
    let depoimentos: DepoimentoPublico[] = [];

    try {
        configs = await getConfigs([
            "home.title",
            "home.subtitle",
            "home.hero.image",

            "home.benefits.title",
            "home.benefits.item.1",
            "home.benefits.item.2",
            "home.benefits.item.3",
            "home.benefits.item.4",
            "home.benefits.item.5",

            "home.plans.1.title",
            "home.plans.1.price",
            "home.plans.1.description",
            "home.plans.2.title",
            "home.plans.2.price",
            "home.plans.2.description",
            "home.plans.3.title",
            "home.plans.3.price",
            "home.plans.3.description",

            "home.evelyn.title",
            "home.evelyn.subtitle",
            "home.evelyn.description",
            "home.evelyn.image",
            "home.evelyn.cta.text",
            "home.evelyn.cta.button",

            "home.cta.title",
            "home.cta.button",
            "home.cta.image",

            "home.about.text",
        ]);
    } catch (error) {
        console.error("Erro ao carregar configs do CMS:", error);
    }

    try {
        depoimentos = await listarDepoimentos();
    } catch (error) {
        console.error("Erro ao buscar depoimentos:", error);
    }

    const benefits = [
        configs["home.benefits.item.1"]?.valor,
        configs["home.benefits.item.2"]?.valor,
        configs["home.benefits.item.3"]?.valor,
        configs["home.benefits.item.4"]?.valor,
        configs["home.benefits.item.5"]?.valor,
    ].filter((item): item is string => !!item?.trim());

    const plans = [1, 2, 3].flatMap((index) => {
        const title = configs[`home.plans.${index}.title`]?.valor?.trim();
        const price = configs[`home.plans.${index}.price`]?.valor?.trim();

        if (!title || !price) {
            return [];
        }

        return [{
            title,
            price,
            description: configs[`home.plans.${index}.description`]?.valor ?? "",
        }];
    });

    return (
        <main className="flex flex-col">
            <Hero
                title={configs["home.title"]?.valor}
                subtitle={configs["home.subtitle"]?.valor}
                backgroundImage={configs["home.hero.image"]?.valor}
                mediaType={configs["home.hero.image"]?.tipo}
            />

            <PracticeStrip />

            <Benefits
                title={configs["home.benefits.title"]?.valor}
                items={benefits}
            />

            <ScrollRevealSection />

            <Plans plans={plans} />

            <EvelynSection
                title={configs["home.evelyn.title"]?.valor}
                subtitle={configs["home.evelyn.subtitle"]?.valor}
                description={configs["home.evelyn.description"]?.valor}
                image={configs["home.evelyn.image"]?.valor}
                mediaType={configs["home.evelyn.image"]?.tipo}
                ctaText={configs["home.evelyn.cta.text"]?.valor}
                ctaButton={configs["home.evelyn.cta.button"]?.valor}
            />

            <Testimonials depoimentos={depoimentos} />

            <TestimonialForm />

            <CTA
                title={configs["home.cta.title"]?.valor}
                button={configs["home.cta.button"]?.valor}
                backgroundImage={configs["home.cta.image"]?.valor}
                mediaType={configs["home.cta.image"]?.tipo}
            />

            <About text={configs["home.about.text"]?.valor} />
        </main>
    );
}
