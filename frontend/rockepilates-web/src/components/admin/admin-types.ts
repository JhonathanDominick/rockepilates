export type ConfigTipo = "TEXT" | "IMAGE" | "VIDEO";

export type SiteConfig = {
    id: number;
    chave: string;
    valor: string;
    tipo: ConfigTipo;
};

export type Depoimento = {
    id: number;
    nome: string;
    mensagem: string;
    aprovado: boolean;
    criadoEm?: string;
};

export type CampoAdmin = {
    chave: string;
    label: string;
    ajuda?: string;
};

export type SecaoAdmin = {
    titulo: string;
    descricao: string;
    campos: CampoAdmin[];
};