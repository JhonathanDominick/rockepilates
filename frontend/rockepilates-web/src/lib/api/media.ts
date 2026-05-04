export async function uploadMedia(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BFF_URL}/bff/media/upload`,
        {
            method: "POST",
            body: formData,
            credentials: "include",
        }
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ao fazer upload: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return data.url;
}