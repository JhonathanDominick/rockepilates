export type ConfigTipo = "TEXT" | "IMAGE" | "VIDEO";

export type SiteConfig = {
    id: number;
    chave: string;
    valor: string;
    tipo: ConfigTipo;
};

function getBaseUrl(): string {
    return (
        process.env.BFF_INTERNAL_URL ||
        process.env.NEXT_PUBLIC_BFF_URL ||
        "http://localhost:8080"
    );
}

export async function getConfig(chave: string): Promise<SiteConfig> {
    const response = await fetch(
        `${getBaseUrl()}/bff/configs/${chave}`,
        {
            cache: "no-store",
        }
    );

    if (!response.ok) {
        throw new Error("Erro ao buscar configuração do site");
    }

    return response.json();
}

export async function getAllConfigs(): Promise<SiteConfig[]> {
    const response = await fetch(
        `${getBaseUrl()}/bff/configs`,
        {
            cache: "no-store",
        }
    );

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

export async function salvarConfigSite(config: {
    chave: string;
    valor: string;
    tipo: ConfigTipo;
}) {
    const response = await fetch(
        `${getBaseUrl()}/bff/configs`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(config),
        }
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `Erro ao salvar configuração. Status: ${response.status}. Body: ${errorText}`
        );
    }

    const responseData = await response.json();

    return responseData?.data ?? responseData;
}