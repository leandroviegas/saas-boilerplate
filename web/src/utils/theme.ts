export const defaultTheme = 'dark';

export function getTheme(theme?: string, headers?: Headers) : string {
    if (theme == 'light' || theme == 'dark') {
        return theme;
    }

    if (typeof window !== "undefined") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    const prefersDark = headers?.get("Sec-CH-Prefers-Color-Scheme") === "dark";
    if (prefersDark) {
        return "dark";
    }

    return defaultTheme;
}
