const HTTP_PROTOCOLS = new Set(["http:", "https:"]);

function getBffOrigin(): URL {
    const configuredUrl =
        process.env.BFF_INTERNAL_URL ||
        process.env.NEXT_PUBLIC_BFF_URL ||
        "http://localhost:8080";
    const url = new URL(configuredUrl);

    if (!HTTP_PROTOCOLS.has(url.protocol)) {
        throw new Error("Protocolo inválido para o BFF");
    }

    return new URL(url.origin);
}

export function normalizarId(value: number): string {
    if (!Number.isSafeInteger(value) || value <= 0) {
        throw new Error("Identificador inválido");
    }

    return String(value);
}

export function criarUrlBff(pathname: string): URL {
    if (!pathname.startsWith("/") || pathname.startsWith("//")) {
        throw new Error("Caminho inválido para o BFF");
    }

    const baseUrl = getBffOrigin();
    const targetUrl = new URL(pathname, baseUrl);

    if (targetUrl.origin !== baseUrl.origin) {
        throw new Error("Origem externa não permitida");
    }

    return targetUrl;
}
