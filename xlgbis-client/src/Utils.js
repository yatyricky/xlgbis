export function GetViewportWidth() {
    return Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
}

export function GetViewportHeight() {
    return Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
}
