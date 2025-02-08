
export const getCSRFToken = () => {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
}

export const getXsrfToken = () => {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
};

export const getFetchOptions = () => ({
    headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": getCSRFToken() || "",
        "X-XSRF-TOKEN": getXsrfToken() || "",
        "X-Inertia": "true"
    },
    credentials: "include",
}) as RequestInit