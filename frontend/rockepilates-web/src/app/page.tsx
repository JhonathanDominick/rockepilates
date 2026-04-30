import { getConfigs } from "@/lib/api/config";

export default async function Home() {
    const configs = await getConfigs([
        "home.title",
        "home.subtitle",
    ]);

    return (
        <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center">
            <h1 className="text-4xl font-bold">
                {configs["home.title"]?.valor ?? "Título padrão"}
            </h1>

            <p className="text-lg text-gray-600 max-w-xl">
                {configs["home.subtitle"]?.valor ?? "Descrição padrão"}
            </p>
        </main>
    );
}