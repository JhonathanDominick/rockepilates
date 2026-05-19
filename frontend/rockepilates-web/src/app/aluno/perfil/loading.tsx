export default function LoadingPerfilAluno() {
    return (
        <main className="min-h-screen bg-[#f6fbfa] px-4 py-6 md:px-6 md:py-10">
            <div className="mx-auto max-w-6xl animate-pulse">

                <section className="rounded-[32px] border border-[#dce8e5] bg-white p-6 shadow-sm md:p-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

                        <div className="flex-1">
                            <div className="h-4 w-32 rounded bg-[#dce8e5]" />

                            <div className="mt-4 h-10 w-full max-w-md rounded bg-[#dce8e5]" />

                            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                {[1, 2, 3, 4].map((item) => (
                                    <div
                                        key={item}
                                        className="rounded-2xl border border-[#edf3f1] bg-[#f8fcfb] p-4"
                                    >
                                        <div className="h-3 w-24 rounded bg-[#dce8e5]" />
                                        <div className="mt-3 h-5 w-40 rounded bg-[#eaf3f1]" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="h-14 w-44 rounded-full bg-[#dce8e5]" />
                    </div>
                </section>

                <section className="mt-5 rounded-[28px] border border-[#dce8e5] bg-white p-5 shadow-sm md:p-6">
                    <div className="h-4 w-44 rounded bg-[#dce8e5]" />

                    <div className="mt-5 h-24 rounded-3xl bg-[#eef7f6]" />
                </section>

                <section className="mt-5 rounded-[28px] border border-[#dce8e5] bg-white p-5 shadow-sm md:p-6">

                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <div className="h-4 w-44 rounded bg-[#dce8e5]" />
                            <div className="mt-3 h-4 w-72 rounded bg-[#eef7f6]" />
                        </div>

                        <div className="h-12 w-64 rounded-2xl bg-[#eef7f6]" />
                    </div>

                    <div className="mt-6 space-y-4">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="rounded-[24px] border border-[#e2ece9] bg-[#fcfefe] p-5"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="h-7 w-24 rounded-full bg-[#dce8e5]" />
                                    <div className="h-8 w-32 rounded bg-[#dce8e5]" />
                                </div>

                                <div className="mt-5 grid gap-3 md:grid-cols-2">
                                    <div className="h-4 w-40 rounded bg-[#eef7f6]" />
                                    <div className="h-4 w-52 rounded bg-[#eef7f6]" />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 h-12 w-72 rounded-2xl bg-[#dce8e5]" />
                </section>
            </div>
        </main>
    );
}