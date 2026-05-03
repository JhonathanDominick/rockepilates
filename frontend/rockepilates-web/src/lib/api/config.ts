export type ConfigTipo = "TEXT" | "IMAGE" | "VIDEO";

export type SiteConfig = {
    id: number;
    chave: string;
    valor: string;
    tipo: ConfigTipo;
};

function getBaseUrl(): string {
    const baseUrl = process.env.NEXT_PUBLIC_BFF_URL;

    if (!baseUrl) {
        throw new Error("NEXT_PUBLIC_BFF_URL não configurada");
    }

    return baseUrl;
}

export async function getConfig(chave: string): Promise<SiteConfig> {
    const baseUrl = getBaseUrl();

    const response = await fetch(`${baseUrl}/bff/configs/${chave}`, {
        cache: "no-store",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Erro ao buscar configuração do site");
    }

    return response.json();
}

export async function getAllConfigs(): Promise<SiteConfig[]> {
    const baseUrl = getBaseUrl();

    const response = await fetch(`${baseUrl}/bff/configs`, {
        cache: "no-store",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Erro ao buscar configurações do site");
    }

    return response.json();
}

export async function getConfigs(
    chaves: string[]
): Promise<Record<string, SiteConfig | null>> {
    const results = await Promise.all(
        chaves.map(async (chave) => {
            try {
                const config = await getConfig(chave);
                return [chave, config] as const;
            } catch (error) {
                console.error(`Erro ao buscar config ${chave}:`, error);
                return [chave, null] as const;
            }
        })
    );

    return Object.fromEntries(results);
}