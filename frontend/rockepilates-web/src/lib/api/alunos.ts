function getBffUrl() {
    return process.env.NEXT_PUBLIC_BFF_URL || "http://localhost:8080";
}

export type CadastroAlunoRequest = {
    nome: string;
    email: string;
    telefone: string;
    dataNascimento: string;
    objetivo: string;
    observacoesSaude: string;
    tipoPlano: string;
    senha: string;
    aceiteTermos: boolean;
};

export async function cadastrarAluno(data: CadastroAlunoRequest) {
    const res = await fetch(`${getBffUrl()}/bff/alunos`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        let message = "Erro ao cadastrar";

        try {
            const error = await res.json();
            message = error?.message || message;
        } catch {}

        throw new Error(message);
    }

    return;
}
