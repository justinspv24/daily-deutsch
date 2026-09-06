/** Tiny DOM helpers — enough structure to keep the views declarative. */

type Attrs = Record<string, string | number | boolean | undefined>;
type Child = Node | string | null | undefined | false;

export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Attrs = {},
  ...children: Child[]
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value === undefined || value === false) continue;
    if (key === "class") node.className = String(value);
    else if (key === "html") node.innerHTML = String(value);
    else node.setAttribute(key, String(value));
  }
  for (const child of children) {
    if (child === null || child === undefined || child === false) continue;
    node.append(typeof child === "string" ? document.createTextNode(child) : child);
  }
  return node;
}

export function esc(value: string): string {
  return value.replace(/[&<>"]/g, (c) => {
    switch (c) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      default:
        return "&quot;";
    }
  });
}

export function clear(node: HTMLElement): HTMLElement {
  node.replaceChildren();
  return node;
}

export function svgIcon(paths: string, label: string): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "1.7");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML = paths;
  svg.dataset.label = label;
  return svg;
}

export const ICON_SUN =
  '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>';

export const ICON_MOON = '<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5Z"/>';

export const ICON_CHECK = '<path d="M20 6 9 17l-5-5"/>';

export const ICON_X = '<path d="M18 6 6 18M6 6l12 12"/>';

export const ICON_TILDE = '<path d="M4 14c2-3.5 4-3.5 6 0s4 3.5 6 0 3-2.5 4-1"/>';

export const ICON_ARROW = '<path d="M5 12h14M13 6l6 6-6 6"/>';

export const ICON_FLAME =
  '<path d="M12 22c4.4 0 8-3.2 8-7.5 0-3.6-2.3-5.6-3.6-7.3-.5 1.7-1.3 2.6-2.4 3.3.2-3.2-1.2-6.4-4-8.5.3 3.3-1.8 4.6-3.3 6.4A7.6 7.6 0 0 0 4 14.5C4 18.8 7.6 22 12 22Z"/>';

export const ICON_STAR =
  '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z"/>';

export const ICON_TARGET =
  '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>';

export const ICON_USER = '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>';
