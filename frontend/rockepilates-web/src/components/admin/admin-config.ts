import type { SecaoAdmin } from "./admin-types";

export const MAX_IMAGE_SIZE_MB = 10;
export const ALLOWED_IMAGE_EXTENSIONS = ".jpg,.jpeg,.png,.webp";

export const secoesAdmin: SecaoAdmin[] = [
    {
        titulo: "Topo da página",
        descricao: "Conteúdo principal que aparece assim que o visitante entra no site.",
        campos: [
            {
                chave: "home.title",
                label: "Título principal",
                ajuda: "Frase grande de destaque da página inicial.",
            },
            {
                chave: "home.subtitle",
                label: "Subtítulo",
                ajuda: "Texto curto que complementa o título principal.",
            },
            {
                chave: "home.hero.image",
                label: "Mídia principal",
                ajuda: "Imagem ou vídeo exibido no topo da página.",
            },
        ],
    },
    {
        titulo: "Benefícios",
        descricao: "Textos da seção que mostra os principais benefícios do pilates.",
        campos: [
            { chave: "home.benefits.title", label: "Título da seção" },
            { chave: "home.benefits.item.1", label: "Benefício 1" },
            { chave: "home.benefits.item.2", label: "Benefício 2" },
            { chave: "home.benefits.item.3", label: "Benefício 3" },
            { chave: "home.benefits.item.4", label: "Benefício 4" },
            { chave: "home.benefits.item.5", label: "Benefício 5" },
        ],
    },
    {
        titulo: "Planos",
        descricao: "Textos dos planos exibidos na página inicial.",
        campos: [
            { chave: "home.plans.1.title", label: "Plano 1 — título" },
            { chave: "home.plans.1.price", label: "Plano 1 — preço" },
            { chave: "home.plans.1.description", label: "Plano 1 — descrição" },
            { chave: "home.plans.2.title", label: "Plano 2 — título" },
            { chave: "home.plans.2.price", label: "Plano 2 — preço" },
            { chave: "home.plans.2.description", label: "Plano 2 — descrição" },
            { chave: "home.plans.3.title", label: "Plano 3 — título" },
            { chave: "home.plans.3.price", label: "Plano 3 — preço" },
            { chave: "home.plans.3.description", label: "Plano 3 — descrição" },
        ],
    },
    {
        titulo: "Evelyn Pinheiro",
        descricao: "Seção de apresentação profissional da Evelyn.",
        campos: [
            { chave: "home.evelyn.title", label: "Título" },
            { chave: "home.evelyn.subtitle", label: "Subtítulo" },
            { chave: "home.evelyn.description", label: "Descrição" },
            { chave: "home.evelyn.image", label: "Mídia da Evelyn" },
            { chave: "home.evelyn.cta.text", label: "Texto antes do botão" },
            { chave: "home.evelyn.cta.button", label: "Texto do botão" },
        ],
    },
    {
        titulo: "Chamada final",
        descricao: "Última chamada de ação antes do fim da página.",
        campos: [
            { chave: "home.cta.title", label: "Título da chamada" },
            { chave: "home.cta.button", label: "Texto do botão" },
            { chave: "home.cta.image", label: "Mídia de fundo" },
        ],
    },
    {
        titulo: "Sobre",
        descricao: "Texto institucional da seção sobre.",
        campos: [{ chave: "home.about.text", label: "Texto sobre" }],
    },
];
