import { Footer } from "@/components/layout/Footer";

export default function SiteLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <>
            {children}
            <Footer />
        </>
    );
}