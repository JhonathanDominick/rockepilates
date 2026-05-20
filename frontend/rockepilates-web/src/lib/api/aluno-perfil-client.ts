function getPublicBffUrl() {
    return process.env.NEXT_PUBLIC_BFF_URL || "http://localhost:8080";
}

async function extrairErro(response: Response, fallback: string) {
    try {
        const data = await response.json();
        return data?.message || data?.error || fallback;
    } catch {
        return fallback;
    }
}

export type AlterarSenhaAlunoRequest = {
    senhaAtual: string;
    novaSenha: string;
};

export async function alterarSenhaAluno(data: AlterarSenhaAlunoRequest) {
    const response = await fetch(
        `${getPublicBffUrl()}/bff/alunos/me/senha`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(data),
        }
    );

    if (!response.ok) {
        throw new Error(
            await extrairErro(response, "Erro ao alterar senha")
        );
    }
}