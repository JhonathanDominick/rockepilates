import type { ReactNode } from "react";

type AdminSectionProps = {
    title: string;
    description: string;
    children: ReactNode;
};

export function AdminSection({ title, description, children }: AdminSectionProps) {
    return (
        <section>
            <div className="mb-4">
                <h2 className="text-xl font-bold uppercase text-gray-900">
                    {title}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    {description}
                </p>
            </div>

            <div className="flex flex-col gap-5">
                {children}
            </div>
        </section>
    );
}