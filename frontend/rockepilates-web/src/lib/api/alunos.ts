export async function cadastrarAluno(data: any) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BFF_URL}/bff/alunos`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }
    );

    if (!res.ok) {
        let message = "Erro ao cadastrar";

        try {
            const error = await res.json();
            message = error?.message || message;
        } catch {}

        throw new Error(message);
    }

    return res.json();
}