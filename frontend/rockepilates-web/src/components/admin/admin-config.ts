import type { SecaoAdmin } from "./admin-types";
import {
    DEFAULT_AGENDA_URL,
    DEFAULT_APP_ANDROID_URL,
    DEFAULT_APP_IOS_URL,
    DEFAULT_MAPS_REVIEWS_URL,
    DEFAULT_ROCKER_ACADEMY_URL,
    DEFAULT_WHATSAPP_URL,
} from "@/lib/site-links";
import { DEFAULT_APP_IMAGE_URL } from "@/lib/site-media";

export const MAX_IMAGE_SIZE_MB = 10;
export const ALLOWED_IMAGE_EXTENSIONS = ".jpg,.jpeg,.png,.webp";

const DEFAULT_HOME_TITLE = "Pilates para transformar sua rotina";
const DEFAULT_HOME_SUBTITLE =
    "Aulas, conteúdo e acompanhamento para evoluir com consciência corporal.";

const DEFAULT_BENEFITS_TITLE = "Ao praticar Pilates na Rocker, você...";
const DEFAULT_BENEFITS = [
    "Melhore sua postura e alivie dores nas costas com exercícios supervisionados.",
    "Ganhe mais flexibilidade e força sem impacto nas articulações.",
    "Aumente sua consciência corporal e previna lesões no dia a dia.",
];

const DEFAULT_PLANS = [
    {
        title: "Sessões em grupo",
        price: "Agende online",
        description:
            "Aulas com atenção próxima, ritmo seguro e foco nas necessidades de cada aluno.",
    },
    {
        title: "Sessões individuais",
        price: "Horarios pelo app",
        description:
            "Atendimento personalizado para quem precisa de acompanhamento exclusivo.",
    },
    {
        title: "Pilates clínico",
        price: "Consulte disponibilidade",
        description:
            "Prática orientada para reabilitação, mobilidade e melhora da qualidade de vida.",
    },
];

const DEFAULT_EVELYN_TITLE = "Prazer, Evelyn Pinheiro";
const DEFAULT_EVELYN_SUBTITLE = "Especialista em Pilates e movimento consciente";
const DEFAULT_EVELYN_DESCRIPTION =
    "Minha missão é ajudar você a construir um corpo forte, consciente e livre de dores através do pilates.";
const DEFAULT_EVELYN_CTA_BUTTON = "Agendar aula";

const DEFAULT_APP_TITLE = "Agende e acompanhe suas aulas pelo app";
const DEFAULT_APP_DESCRIPTION =
    "Marque horários, acompanhe sua rotina e solicite o QR Code de acesso diretamente no studio.";

const DEFAULT_CTA_TITLE = "Agende sua aula na Rocker Pilates";
const DEFAULT_CTA_BUTTON = "Agendar aula";

export const secoesAdmin: SecaoAdmin[] = [
    {
        titulo: "Topo da página",
        descricao: "Conteúdo principal que aparece assim que o visitante entra no site.",
        campos: [
            {
                chave: "home.title",
                label: "Título principal",
                ajuda: "Frase grande de destaque da página inicial.",
                valorPadrao: DEFAULT_HOME_TITLE,
            },
            {
                chave: "home.subtitle",
                label: "Subtitulo",
                ajuda: "Texto curto que complementa o titulo principal.",
                valorPadrao: DEFAULT_HOME_SUBTITLE,
            },
            {
                chave: "home.hero.image",
                label: "Mídia principal",
                ajuda: "Imagem ou vídeo exibido no topo da página.",
                tipo: "IMAGE",
            },
        ],
    },
    {
        titulo: "Links externos da primeira versão",
        descricao: "Destinos dos botões da landing. Nesta v1, os visitantes são enviados para os canais que a cliente já usa.",
        campos: [
            {
                chave: "external.seufisio.agendaUrl",
                label: "Agenda online",
                ajuda: "Link principal dos botões Agendar aula.",
                valorPadrao: DEFAULT_AGENDA_URL,
            },
            {
                chave: "external.rockeracademy.url",
                label: "RockerAcademy",
                ajuda: "Link secundario para formacao de professores.",
                valorPadrao: DEFAULT_ROCKER_ACADEMY_URL,
            },
            {
                chave: "external.maps.reviewsUrl",
                label: "Google Maps / avaliações",
                ajuda: "Link usado em prova social, localização e avaliações públicas.",
                valorPadrao: DEFAULT_MAPS_REVIEWS_URL,
            },
            {
                chave: "external.whatsappUrl",
                label: "WhatsApp",
                ajuda: "Opcional. Use um link wa.me ou API do WhatsApp, se a cliente quiser exibir esse botão.",
                valorPadrao: DEFAULT_WHATSAPP_URL,
            },
            {
                chave: "external.seufisio.appAndroidUrl",
                label: "App para clientes - Google Play",
                ajuda: "Opcional. Preencher quando a cliente confirmar o link oficial do app Android.",
                valorPadrao: DEFAULT_APP_ANDROID_URL,
            },
            {
                chave: "external.seufisio.appIosUrl",
                label: "App para clientes - App Store",
                ajuda: "Opcional. Preencher quando a cliente confirmar o link oficial do app iOS.",
                valorPadrao: DEFAULT_APP_IOS_URL,
            },
        ],
    },
    {
        titulo: "Benefícios",
        descricao: "Textos da seção que mostra os principais benefícios do pilates.",
        campos: [
            {
                chave: "home.benefits.title",
                label: "Título da seção",
                valorPadrao: DEFAULT_BENEFITS_TITLE,
            },
            {
                chave: "home.benefits.item.1",
                label: "Beneficio 1",
                valorPadrao: DEFAULT_BENEFITS[0],
            },
            {
                chave: "home.benefits.item.2",
                label: "Beneficio 2",
                valorPadrao: DEFAULT_BENEFITS[1],
            },
            {
                chave: "home.benefits.item.3",
                label: "Beneficio 3",
                valorPadrao: DEFAULT_BENEFITS[2],
            },
        ],
    },
    {
        titulo: "Aulas e planos da landing",
        descricao: "Textos exibidos na página pública. Os botões levam para a agenda online atual.",
        campos: [
            {
                chave: "home.plans.1.title",
                label: "Card 1 - titulo",
                valorPadrao: DEFAULT_PLANS[0].title,
            },
            {
                chave: "home.plans.1.price",
                label: "Card 1 - chamada",
                valorPadrao: DEFAULT_PLANS[0].price,
            },
            {
                chave: "home.plans.1.description",
                label: "Card 1 - descricao",
                valorPadrao: DEFAULT_PLANS[0].description,
            },
            {
                chave: "home.plans.2.title",
                label: "Card 2 - titulo",
                valorPadrao: DEFAULT_PLANS[1].title,
            },
            {
                chave: "home.plans.2.price",
                label: "Card 2 - chamada",
                valorPadrao: DEFAULT_PLANS[1].price,
            },
            {
                chave: "home.plans.2.description",
                label: "Card 2 - descricao",
                valorPadrao: DEFAULT_PLANS[1].description,
            },
            {
                chave: "home.plans.3.title",
                label: "Card 3 - titulo",
                valorPadrao: DEFAULT_PLANS[2].title,
            },
            {
                chave: "home.plans.3.price",
                label: "Card 3 - chamada",
                valorPadrao: DEFAULT_PLANS[2].price,
            },
            {
                chave: "home.plans.3.description",
                label: "Card 3 - descricao",
                valorPadrao: DEFAULT_PLANS[2].description,
            },
        ],
    },
    {
        titulo: "Evelyn Pinheiro",
        descricao: "Secao de apresentacao profissional da Evelyn.",
        campos: [
            {
                chave: "home.evelyn.title",
                label: "Título",
                valorPadrao: DEFAULT_EVELYN_TITLE,
            },
            {
                chave: "home.evelyn.subtitle",
                label: "Subtitulo",
                valorPadrao: DEFAULT_EVELYN_SUBTITLE,
            },
            {
                chave: "home.evelyn.description",
                label: "Descrição",
                valorPadrao: DEFAULT_EVELYN_DESCRIPTION,
            },
            { chave: "home.evelyn.image", label: "Mídia da Evelyn", tipo: "IMAGE" },
            { chave: "home.evelyn.cta.text", label: "Texto antes do botão" },
            {
                chave: "home.evelyn.cta.button",
                label: "Texto do botão",
                valorPadrao: DEFAULT_EVELYN_CTA_BUTTON,
            },
        ],
    },
    {
        titulo: "App para clientes",
        descricao: "Bloco com agenda, localização e app da rotina do aluno.",
        campos: [
            {
                chave: "home.app.title",
                label: "Título",
                valorPadrao: DEFAULT_APP_TITLE,
            },
            {
                chave: "home.app.description",
                label: "Descrição",
                valorPadrao: DEFAULT_APP_DESCRIPTION,
            },
            {
                chave: "home.app.image",
                label: "Imagem do app",
                ajuda: "Imagem exibida ao lado do texto. O padrao usa public/img/mockup2.png.",
                tipo: "IMAGE",
                valorPadrao: DEFAULT_APP_IMAGE_URL,
            },
        ],
    },
    {
        titulo: "Chamada final",
        descricao: "Última chamada de ação antes do fim da página. O botão também leva para a agenda online.",
        campos: [
            {
                chave: "home.cta.title",
                label: "Título da chamada",
                valorPadrao: DEFAULT_CTA_TITLE,
            },
            {
                chave: "home.cta.button",
                label: "Texto do botão",
                valorPadrao: DEFAULT_CTA_BUTTON,
            },
            { chave: "home.cta.image", label: "Mídia de fundo", tipo: "IMAGE" },
        ],
    },
    {
        titulo: "Sobre",
        descricao: "Texto institucional da seção sobre. Se ficar vazio, a seção não aparece na landing.",
        campos: [{ chave: "home.about.text", label: "Texto sobre" }],
    },
];
