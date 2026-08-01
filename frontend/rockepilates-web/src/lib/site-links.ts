export const DEFAULT_AGENDA_URL =
    "https://agenda.seufisio.com.br/xxee-rocker-pilates-studio";

export const DEFAULT_ROCKER_ACADEMY_URL = "https://www.rockeracademy.com/";

export const DEFAULT_MAPS_REVIEWS_URL =
    "https://maps.app.goo.gl/orVpSiQqMdMPGam98";

export const DEFAULT_WHATSAPP_URL = "";

export const DEFAULT_APP_ANDROID_URL =
    "https://play.google.com/store/apps/details?id=br.com.seufisio.checkIn&hl=pt_BR";

export const DEFAULT_APP_IOS_URL =
    "https://apps.apple.com/br/app/seufisio-check-in/id1568549346";

export function normalizarUrlExterna(
    url: string | null | undefined,
    fallback = ""
) {
    const valor = url?.trim() || fallback;

    if (!valor) {
        return "";
    }

    try {
        const parsed = new URL(valor);

        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
            return fallback;
        }

        return parsed.toString();
    } catch {
        return fallback;
    }
}