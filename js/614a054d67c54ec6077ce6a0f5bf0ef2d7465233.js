export function qs(sel, root = document) {
    return root.querySelector(sel);
}
export function qsAll(sel, root = document) {
    return Array.from(root.querySelectorAll(sel));
}
export function show(el) {
    if (el) {
        el.removeAttribute("hidden");
    }
}
export function hide(el) {
    if (el) {
        el.setAttribute("hidden", "");
    }
}
export function setText(sel, val) {
    const el = qs(sel);
    if (el) {
        el.textContent = val;
    }
}
export function showToast(msg, type = "default", sel = "#toast-container") {
    const container = qs(sel);
    if (!container) {
        return;
    }
    const toast = document.createElement("div");
    toast.className = `toast${type !== "default" ? " toast--" + type : ""}`;
    toast.textContent = msg;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = "toastOut 250ms ease forwards";
        setTimeout(() => toast.remove(), 260);
    }, 2800);
}
