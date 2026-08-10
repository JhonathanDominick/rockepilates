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
    "Aulas, conteudo e acompanhamento para evoluir com consciencia corporal.";

const DEFAULT_BENEFITS_TITLE = "Ao praticar Pilates na Rocker, voce...";
const DEFAULT_BENEFITS = [
    "Melhore sua postura e alivie dores nas costas com exercicios supervisionados.",
    "Ganhe mais flexibilidade e forca sem impacto nas articulacoes.",
    "Aumente sua consciencia corporal e previna lesoes no dia a dia.",
];

const DEFAULT_PLANS = [
    {
        title: "Sessoes em grupo",
        price: "Agende online",
        description:
            "Aulas com atencao proxima, ritmo seguro e foco nas necessidades de cada aluno.",
    },
    {
        title: "Sessoes individuais",
        price: "Horarios pelo app",
        description:
            "Atendimento personalizado para quem precisa de acompanhamento exclusivo.",
    },
    {
        title: "Pilates clinico",
        price: "Consulte disponibilidade",
        description:
            "Pratica orientada para reabilitacao, mobilidade e melhora da qualidade de vida.",
    },
];

const DEFAULT_EVELYN_TITLE = "Prazer, Evelyn Pinheiro";
const DEFAULT_EVELYN_SUBTITLE = "Especialista em Pilates e movimento consciente";
const DEFAULT_EVELYN_DESCRIPTION =
    "Minha missao e ajudar voce a construir um corpo forte, consciente e livre de dores atraves do pilates.";
const DEFAULT_EVELYN_CTA_BUTTON = "Agendar aula";

const DEFAULT_APP_TITLE = "Agende e acompanhe suas aulas pelo app";
const DEFAULT_APP_DESCRIPTION =
    "Marque horarios, acompanhe sua rotina e solicite o QR Code de acesso diretamente no studio.";

const DEFAULT_CTA_TITLE = "Agende sua aula na Rocker Pilates";
const DEFAULT_CTA_BUTTON = "Agendar aula";

export const secoesAdmin: SecaoAdmin[] = [
    {
        titulo: "Topo da pagina",
        descricao: "Conteudo principal que aparece assim que o visitante entra no site.",
        campos: [
            {
                chave: "home.title",
                label: "Titulo principal",
                ajuda: "Frase grande de destaque da pagina inicial.",
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
                label: "Midia principal",
                ajuda: "Imagem ou video exibido no topo da pagina.",
                tipo: "IMAGE",
            },
        ],
    },
    {
        titulo: "Links externos da primeira versao",
        descricao: "Destinos dos botoes da landing. Nesta v1, os visitantes sao enviados para os canais que a cliente ja usa.",
        campos: [
            {
                chave: "external.seufisio.agendaUrl",
                label: "Agenda online",
                ajuda: "Link principal dos botoes Agendar aula.",
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
                ajuda: "Opcional. Use um link wa.me ou API do WhatsApp, se a cliente quiser exibir esse botao.",
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
        titulo: "Beneficios",
        descricao: "Textos da secao que mostra os principais beneficios do pilates.",
        campos: [
            {
                chave: "home.benefits.title",
                label: "Titulo da secao",
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
        descricao: "Textos exibidos na pagina publica. Os botoes levam para a agenda online atual.",
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
                label: "Titulo",
                valorPadrao: DEFAULT_EVELYN_TITLE,
            },
            {
                chave: "home.evelyn.subtitle",
                label: "Subtitulo",
                valorPadrao: DEFAULT_EVELYN_SUBTITLE,
            },
            {
                chave: "home.evelyn.description",
                label: "Descricao",
                valorPadrao: DEFAULT_EVELYN_DESCRIPTION,
            },
            { chave: "home.evelyn.image", label: "Midia da Evelyn", tipo: "IMAGE" },
            { chave: "home.evelyn.cta.text", label: "Texto antes do botao" },
            {
                chave: "home.evelyn.cta.button",
                label: "Texto do botao",
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
                label: "Titulo",
                valorPadrao: DEFAULT_APP_TITLE,
            },
            {
                chave: "home.app.description",
                label: "Descricao",
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
        descricao: "Ultima chamada de acao antes do fim da pagina. O botao tambem leva para a agenda online.",
        campos: [
            {
                chave: "home.cta.title",
                label: "Titulo da chamada",
                valorPadrao: DEFAULT_CTA_TITLE,
            },
            {
                chave: "home.cta.button",
                label: "Texto do botao",
                valorPadrao: DEFAULT_CTA_BUTTON,
            },
            { chave: "home.cta.image", label: "Midia de fundo", tipo: "IMAGE" },
        ],
    },
    {
        titulo: "Sobre",
        descricao: "Texto institucional da secao sobre. Se ficar vazio, a secao nao aparece na landing.",
        campos: [{ chave: "home.about.text", label: "Texto sobre" }],
    },
];