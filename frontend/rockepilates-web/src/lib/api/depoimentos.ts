function getBaseUrl(): string {
    return (
        process.env.BFF_INTERNAL_URL ||
        process.env.NEXT_PUBLIC_BFF_URL ||
        "http://localhost:8080"
    );
}

export async function listarDepoimentos() {
    const response = await fetch(
        `${getBaseUrl()}/bff/depoimentos`,
        {
            cache: "no-store",
        }
    );

    if (!response.ok) {
        let message = "Erro ao buscar depoimentos";

        try {
            const data = await response.json();
            message = data?.message || message;
        } catch {}

        throw new Error(message);
    }

    const responseData = await response.json();

    return responseData?.data ?? responseData;
}

export async function criarDepoimento(data: {
    nome: string;
    mensagem: string;
}) {
    const response = await fetch(
        `${getBaseUrl()}/bff/depoimentos`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }
    );

    if (!response.ok) {
        let message = "Erro ao enviar depoimento";

        try {
            const errorData = await response.json();

            message =
                errorData?.message ||
                errorData?.error ||
                message;
        } catch {}

        throw new Error(message);
    }

    const responseData = await response.json();

    return responseData?.data ?? responseData;
}