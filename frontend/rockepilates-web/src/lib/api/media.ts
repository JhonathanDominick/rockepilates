export async function uploadMedia(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BFF_URL}/bff/media/upload`,
        {
            method: "POST",
            body: formData,
            credentials: "include", // importante por causa do cookie
        }
    );

    if (!response.ok) {
        throw new Error("Erro ao fazer upload");
    }

    const data = await response.json();
    return data.url;
}