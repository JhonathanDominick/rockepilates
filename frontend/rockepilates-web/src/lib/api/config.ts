export type SiteConfig = {
    id: number;
    chave: string;
    valor: string;
};

export async function getConfig(chave: string): Promise<SiteConfig> {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BFF_URL}/bff/configs/${chave}`,
        { cache: "no-store" }
    );

    if (!response.ok) {
        throw new Error("Erro ao buscar configuração do site");
    }

    return response.json();
}