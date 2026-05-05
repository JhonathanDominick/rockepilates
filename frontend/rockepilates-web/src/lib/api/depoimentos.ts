export async function listarDepoimentos() {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BFF_URL}/bff/depoimentos`,
        {
            cache: "no-store",
        }
    );

    if (!response.ok) {
        throw new Error("Erro ao buscar depoimentos");
    }

    return response.json();
}

export async function criarDepoimento(data: {
    nome: string;
    mensagem: string;
}) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BFF_URL}/bff/depoimentos`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }
    );

    if (!response.ok) {
        throw new Error("Erro ao enviar depoimento");
    }

    return response.json();
}