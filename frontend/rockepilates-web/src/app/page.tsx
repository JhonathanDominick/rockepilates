import { getConfig } from "@/lib/api/config";

export default async function Home() {
    try {
        const homeTitle = await getConfig("home.title");

        return <h1>{homeTitle.valor}</h1>;
    } catch (error) {
        return <h1>Erro ao carregar conteúdo</h1>;
    }
}