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

const backendDisponivel = process.env.NEXT_PUBLIC_BACKEND_ENABLED === "true";

/*
 * Fallbacks temporários para a hospedagem emergencial na Vercel.
 *
 * O CMS continua sendo consultado normalmente.
 * Se o backend estiver disponível, o conteúdo do CMS prevalece.
 * Se estiver indisponível, usamos estes valores locais para que
 * nenhuma seção da página desapareça.
 */
const FALLBACK_CONFIGS: Record<string, string> = {
    "home.title": "Pilates para transformar sua rotina",

    "home.subtitle":
        "Aulas, conteúdo e acompanhamento para evoluir com consciência corporal.",

    "home.hero.image": "/img/alongar.jpg",

    "home.benefits.title":
        "Ao praticar Pilates na Rocker, você...",

    "home.benefits.item.1":
        "Melhore sua postura e alivie dores nas costas com exercícios supervisionados.",

    "home.benefits.item.2":
        "Ganhe mais flexibilidade e força sem impacto nas articulações.",

    "home.benefits.item.3":
        "Aumente sua consciência corporal e previna lesões no dia a dia.",

    "home.benefits.item.4":
        "Desenvolva equilíbrio, coordenação e consciência dos seus movimentos.",

    "home.benefits.item.5":
        "Tenha acompanhamento profissional durante a prática.",

    "home.evelyn.title":
        "Prazer, Evelyn Pinheiro",

    "home.evelyn.subtitle":
        "Especialista em Pilates e movimento consciente",

    "home.evelyn.description":
        "Minha missão é ajudar você a construir um corpo forte, consciente e livre de dores através do Pilates.",

    "home.evelyn.image":
        "/img/evelin.jpg",

    "home.evelyn.cta.text":
        "Comece sua prática na Rocker Pilates.",

    "home.evelyn.cta.button":
        "Agendar aula",

    "home.app.title":
        "Agende e acompanhe suas aulas pelo app",

    "home.app.description":
        "Marque horários, acompanhe sua rotina e solicite o QR Code de acesso diretamente no studio.",

    "home.app.image":
        "/img/mockup2.png",

    "home.about.text":
        "Rocker Pilates Studio — movimento, consciência corporal e acompanhamento profissional.",

    "home.cta.title":
        "Agende sua aula na Rocker Pilates",

    "home.cta.button":
        "Agendar aula",

    "home.cta.image":
        "/img/alongar.jpg",
};

function valorConfig(
    configs: Record<string, SiteConfig | null>,
    chave: string
) {
    const valorCms = configs[chave]?.valor?.trim();

    if (valorCms) {
        return valorCms;
    }

    return FALLBACK_CONFIGS[chave];
}

function tipoConfig(
    configs: Record<string, SiteConfig | null>,
    chave: string
) {
    const tipoCms = configs[chave]?.tipo;

    if (tipoCms) {
        return tipoCms;
    }

    if (chave.includes("image")) {
        return "IMAGE";
    }

    return "TEXT";
}

export default async function HomePage() {
    let configs: Record<string, SiteConfig | null> = {};
    let depoimentos: DepoimentoPublico[] = [];

    /*
     * Continua tentando utilizar o CMS original.
     * Na Vercel, enquanto o backend estiver fora do ar,
     * a página simplesmente segue usando os fallbacks locais.
     */
    if (backendDisponivel) {
        try {
            configs = await getPublicConfigs();
        } catch (error) {
            console.error(
                "Backend indisponível. Usando conteúdo local temporário:",
                error
            );
        }

        /*
         * Mantemos também a busca original dos depoimentos.
         * Quando o backend voltar, eles reaparecem automaticamente.
         */
        try {
            depoimentos = await listarDepoimentos();
        } catch (error) {
            console.error(
                "Backend de depoimentos indisponível:",
                error
            );
        }
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

    /*
     * Benefícios:
     * primeiro usa CMS;
     * se não existir, utiliza os mesmos espaços com conteúdo local.
     */
    const benefits = [1, 2, 3, 4, 5]
        .map((index) =>
            valorConfig(
                configs,
                `home.benefits.item.${index}`
            )?.trim()
        )
        .filter(
            (item): item is string =>
                Boolean(item)
        );

    /*
     * Planos continuam usando exatamente a estrutura original.
     *
     * Caso o CMS esteja fora do ar e plans fique vazio,
     * o próprio componente Plans utiliza seus cards de fallback.
     */
    const plans = [1, 2, 3]
        .map((index) => {
            const title =
                configs[
                    `home.plans.${index}.title`
                ]?.valor?.trim();

            const price =
                configs[
                    `home.plans.${index}.price`
                ]?.valor?.trim();

            if (!title || !price) {
                return null;
            }

            return {
                title,
                price,
                description:
                    configs[
                        `home.plans.${index}.description`
                    ]?.valor ?? "",
            };
        })
        .filter(
            (
                plan
            ): plan is {
                title: string;
                price: string;
                description: string;
            } => Boolean(plan)
        );

    return (
        <>
            {/* HERO */}
            <Hero
                title={valorConfig(
                    configs,
                    "home.title"
                )}
                subtitle={valorConfig(
                    configs,
                    "home.subtitle"
                )}
                backgroundImage={valorConfig(
                    configs,
                    "home.hero.image"
                )}
                mediaType={tipoConfig(
                    configs,
                    "home.hero.image"
                )}
                agendaUrl={agendaUrl}
                mapsUrl={mapsReviewsUrl}
            />

            {/* FAIXA */}
            <PracticeStrip />

            {/* BENEFÍCIOS */}
            <Benefits
                title={valorConfig(
                    configs,
                    "home.benefits.title"
                )}
                items={benefits}
            />

            {/* SEÇÃO VISUAL */}
            <ScrollRevealSection />

            {/* AULAS E PLANOS */}
            <Plans
                plans={plans}
                agendaUrl={agendaUrl}
            />

            {/* EVELYN */}
            <EvelynSection
                title={valorConfig(
                    configs,
                    "home.evelyn.title"
                )}
                subtitle={valorConfig(
                    configs,
                    "home.evelyn.subtitle"
                )}
                description={valorConfig(
                    configs,
                    "home.evelyn.description"
                )}
                image={valorConfig(
                    configs,
                    "home.evelyn.image"
                )}
                mediaType={tipoConfig(
                    configs,
                    "home.evelyn.image"
                )}
                ctaText={valorConfig(
                    configs,
                    "home.evelyn.cta.text"
                )}
                ctaButton={valorConfig(
                    configs,
                    "home.evelyn.cta.button"
                )}
                ctaUrl={agendaUrl}
            />

            {/* DEPOIMENTOS */}
            <Testimonials
                depoimentos={depoimentos}
                mapsReviewsUrl={
                    mapsReviewsUrl
                }
            />

            {/*
             * FORMULÁRIO ORIGINAL.
             * NÃO FOI REMOVIDO.
             */}
            <TestimonialForm />

            {/* APP PARA CLIENTES */}
            <ClientAppSection
                agendaUrl={agendaUrl}
                appAndroidUrl={
                    appAndroidUrl
                }
                appIosUrl={appIosUrl}
                mapsReviewsUrl={
                    mapsReviewsUrl
                }
                whatsappUrl={whatsappUrl}
                title={valorConfig(
                    configs,
                    "home.app.title"
                )}
                description={valorConfig(
                    configs,
                    "home.app.description"
                )}
                image={valorConfig(
                    configs,
                    "home.app.image"
                )}
                mediaType={tipoConfig(
                    configs,
                    "home.app.image"
                )}
            />

            {/* SOBRE */}
            <About
                text={valorConfig(
                    configs,
                    "home.about.text"
                )}
            />

            {/* CTA + LOCALIZAÇÃO */}
            <CTA
                title={valorConfig(
                    configs,
                    "home.cta.title"
                )}
                button={valorConfig(
                    configs,
                    "home.cta.button"
                )}
                backgroundImage={valorConfig(
                    configs,
                    "home.cta.image"
                )}
                mediaType={tipoConfig(
                    configs,
                    "home.cta.image"
                )}
                agendaUrl={agendaUrl}
                mapsUrl={mapsReviewsUrl}
            />
        </>
    );
}
