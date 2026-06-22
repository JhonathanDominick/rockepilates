function getBffUrl() {
    return process.env.NEXT_PUBLIC_BFF_URL || "http://localhost:8080";
}

export async function loginAluno(email: string, senha: string) {
    const response = await fetch(`${getBffUrl()}/bff/alunos/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
            email,
            senha,
        }),
    });

    if (!response.ok) {
        throw new Error("E-mail ou senha inválidos");
    }
}

export async function logoutAluno() {
    const response = await fetch(`${getBffUrl()}/bff/alunos/logout`, {
        method: "POST",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Erro ao sair da conta");
    }
}