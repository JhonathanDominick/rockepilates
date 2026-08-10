import { Hero } from "@/components/Hero";
import { PracticeStrip } from "@/components/PracticeStrip";
import { Benefits } from "@/components/Benefits";
import { ScrollRevealSection } from "@/components/ScrollRevealSection";
import { Plans } from "@/components/Plans";
import { EvelynSection } from "@/components/EvelynSection";
import { CTA } from "@/components/CTA";
import { About } from "@/components/About";
import { getPublicConfigs } from "@/lib/api/config";
import { listarDepoimentos } from "@/lib/api/depoimentos";
import { Testimonials } from "@/components/Testimonials";
import { TestimonialForm } from "@/components/TestimonialForm";
import { ClientAppSection } from "@/components/ClientAppSection";
import {
    DEFAULT_AGENDA_URL,
    DEFAULT_APP_ANDROID_URL,
    DEFAULT_APP_IOS_URL,
    DEFAULT_MAPS_REVIEWS_URL,
    DEFAULT_WHATSAPP_URL,
    normalizarUrlExterna,
} from "@/lib/site-links";
import type { SiteConfig } from "@/lib/api/config";
import type { DepoimentoPublico } from "@/lib/api/depoimentos";

export const dynamic = "force-dynamic";

function valorConfig(configs: Record<string, SiteConfig | null>, chave: string) {
    return configs[chave]?.valor;
}

export default async function HomePage() {
    let configs: Record<string, SiteConfig | null> = {};
    let depoimentos: DepoimentoPublico[] = [];

    try {
        configs = await getPublicConfigs();
    } catch (error) {
        console.error("Erro ao buscar configuracoes publicas do site:", error);
    }

    try {
        depoimentos = await listarDepoimentos();
    } catch (error) {
        console.error("Erro ao buscar depoimentos públicos:", error);
    }

    const agendaUrl = normalizarUrlExterna(
        valorConfig(configs, "external.seufisio.agendaUrl"),
        DEFAULT_AGENDA_URL
    );
    const appAndroidUrl = normalizarUrlExterna(
        valorConfig(configs, "external.seufisio.appAndroidUrl"),
        DEFAULT_APP_ANDROID_URL
    );
    const appIosUrl = normalizarUrlExterna(
        valorConfig(configs, "external.seufisio.appIosUrl"),
        DEFAULT_APP_IOS_URL
    );
    const mapsReviewsUrl = normalizarUrlExterna(
        valorConfig(configs, "external.maps.reviewsUrl"),
        DEFAULT_MAPS_REVIEWS_URL
    );
    const whatsappUrl = normalizarUrlExterna(
        valorConfig(configs, "external.whatsappUrl"),
        DEFAULT_WHATSAPP_URL
    );

    const benefits = [1, 2, 3, 4, 5]
        .map((index) => configs[`home.benefits.item.${index}`]?.valor?.trim())
        .filter((item): item is string => Boolean(item));

    const plans = [1, 2, 3]
        .map((index) => {
            const title = configs[`home.plans.${index}.title`]?.valor?.trim();
            const price = configs[`home.plans.${index}.price`]?.valor?.trim();

            if (!title || !price) {
                return null;
            }

            return {
                title,
                price,
                description: configs[`home.plans.${index}.description`]?.valor ?? "",
            };
        })
        .filter((plan): plan is { title: string; price: string; description: string } =>
            Boolean(plan)
        );

    return (
        <>
            <Hero
                title={configs["home.title"]?.valor}
                subtitle={configs["home.subtitle"]?.valor}
                backgroundImage={configs["home.hero.image"]?.valor}
                mediaType={configs["home.hero.image"]?.tipo}
                agendaUrl={agendaUrl}
                mapsUrl={mapsReviewsUrl}
            />

            <PracticeStrip />

            <Benefits title={configs["home.benefits.title"]?.valor} items={benefits} />

            <ScrollRevealSection />

            <Plans plans={plans} agendaUrl={agendaUrl} />

            <EvelynSection
                title={configs["home.evelyn.title"]?.valor}
                subtitle={configs["home.evelyn.subtitle"]?.valor}
                description={configs["home.evelyn.description"]?.valor}
                image={configs["home.evelyn.image"]?.valor}
                mediaType={configs["home.evelyn.image"]?.tipo}
                ctaText={configs["home.evelyn.cta.text"]?.valor}
                ctaButton={configs["home.evelyn.cta.button"]?.valor}
                ctaUrl={agendaUrl}
            />

            <Testimonials depoimentos={depoimentos} mapsReviewsUrl={mapsReviewsUrl} />

            <TestimonialForm />

            <ClientAppSection
                agendaUrl={agendaUrl}
                appAndroidUrl={appAndroidUrl}
                appIosUrl={appIosUrl}
                mapsReviewsUrl={mapsReviewsUrl}
                whatsappUrl={whatsappUrl}
                title={configs["home.app.title"]?.valor}
                description={configs["home.app.description"]?.valor}
                image={configs["home.app.image"]?.valor}
                mediaType={configs["home.app.image"]?.tipo}
            />

            <About text={configs["home.about.text"]?.valor} />

            <CTA
                title={configs["home.cta.title"]?.valor}
                button={configs["home.cta.button"]?.valor}
                backgroundImage={configs["home.cta.image"]?.valor}
                mediaType={configs["home.cta.image"]?.tipo}
                agendaUrl={agendaUrl}
                mapsUrl={mapsReviewsUrl}
            />
        </>
    );
}