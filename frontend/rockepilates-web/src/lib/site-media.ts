const YOUTUBE_VIDEO_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;

export const DEFAULT_YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@rockerpilates";

export const DEFAULT_APP_IMAGE_URL = "/img/mockup2.png";

function getPublicBffUrl() {
    return (
        process.env.NEXT_PUBLIC_BFF_URL ||
        process.env.BFF_INTERNAL_URL ||
        "http://localhost:8080"
    ).replace(/\/+$/, "");
}

function extrairIdYoutubePorPath(pathname: string) {
    const segments = pathname.split("/").filter(Boolean);
    const prefixosComId = ["embed", "shorts", "live"];

    if (prefixosComId.includes(segments[0]) && segments[1]) {
        return segments[1];
    }

    return null;
}

export function resolveMediaUrl(valor: string | null | undefined) {
    const media = valor?.trim();

    if (!media) {
        return null;
    }

    if (/^https?:\/\//i.test(media)) {
        return media;
    }

    if (media.startsWith("/uploads/")) {
        return `${getPublicBffUrl()}${media}`;
    }

    if (media.startsWith("/")) {
        return media;
    }

    return media;
}

export function getYoutubeVideoId(valor: string | null | undefined) {
    const media = valor?.trim();

    if (!media) {
        return null;
    }

    if (YOUTUBE_VIDEO_ID_PATTERN.test(media)) {
        return media;
    }

    try {
        const parsed = new URL(media);
        const hostname = parsed.hostname.replace(/^www\./, "").toLowerCase();

        if (hostname === "youtu.be") {
            const id = parsed.pathname.split("/").filter(Boolean)[0];
            return id && YOUTUBE_VIDEO_ID_PATTERN.test(id) ? id : null;
        }

        if (hostname === "youtube.com" || hostname === "m.youtube.com") {
            const idFromQuery = parsed.searchParams.get("v");
            if (idFromQuery && YOUTUBE_VIDEO_ID_PATTERN.test(idFromQuery)) {
                return idFromQuery;
            }

            const idFromPath = extrairIdYoutubePorPath(parsed.pathname);
            if (idFromPath && YOUTUBE_VIDEO_ID_PATTERN.test(idFromPath)) {
                return idFromPath;
            }
        }
    } catch {
        return null;
    }

    return null;
}

export function getYoutubeEmbedUrl(
    valor: string | null | undefined,
    options: { autoplay?: boolean } = {}
) {
    const videoId = getYoutubeVideoId(valor);

    if (!videoId) {
        return null;
    }

    const params = new URLSearchParams({
        rel: "0",
        modestbranding: "1",
    });

    if (options.autoplay) {
        params.set("autoplay", "1");
        params.set("mute", "1");
        params.set("playsinline", "1");
        params.set("loop", "1");
        params.set("playlist", videoId);
    }

    return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}

export function getYoutubeWatchUrl(valor: string | null | undefined) {
    const videoId = getYoutubeVideoId(valor);

    return videoId ? `https://www.youtube.com/watch?v=${videoId}` : "";
}
