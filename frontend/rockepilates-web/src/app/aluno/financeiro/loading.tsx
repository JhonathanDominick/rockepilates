export default function LoadingFinanceiroAluno() {
    return (
        <main className="min-h-screen bg-[#f6fbfa] px-4 py-6 md:px-6 md:py-10">
            <div className="mx-auto max-w-6xl animate-pulse">
                <div className="h-10 w-40 rounded-full bg-[#dce8e5]" />

                <section className="mt-5 rounded-[28px] border border-[#dce8e5] bg-white p-5 md:p-8">
                    <div className="h-4 w-32 rounded bg-[#dce8e5]" />
                    <div className="mt-4 h-10 w-full max-w-xl rounded bg-[#dce8e5]" />
                    <div className="mt-4 h-4 w-full max-w-md rounded bg-[#eaf3f1]" />
                </section>

                <section className="mt-5 rounded-[28px] border border-[#dce8e5] bg-white p-4 md:p-6">
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item}>
                                <div className="h-3 w-24 rounded bg-[#dce8e5]" />
                                <div className="mt-2 h-12 rounded-2xl bg-[#eef7f6]" />
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mt-5 rounded-[28px] border border-[#dce8e5] bg-white p-4 md:p-6">
                    <div className="space-y-4 md:space-y-6">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="rounded-[24px] border border-[#e2ece9] bg-[#fcfefe] p-4 md:p-5"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="h-7 w-24 rounded-full bg-[#dce8e5]" />
                                    <div className="h-8 w-32 rounded bg-[#dce8e5]" />
                                </div>

                                <div className="mt-5 grid gap-3 md:grid-cols-2">
                                    <div className="h-4 w-44 rounded bg-[#eaf3f1]" />
                                    <div className="h-4 w-52 rounded bg-[#eaf3f1]" />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 flex justify-between border-t border-[#edf3f1] pt-5">
                        <div className="h-4 w-28 rounded bg-[#dce8e5]" />
                        <div className="h-10 w-28 rounded-2xl bg-[#dce8e5]" />
                    </div>
                </section>
            </div>
        </main>
    );
}