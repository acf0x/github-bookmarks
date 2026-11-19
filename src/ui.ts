const paths: Record<string, string> = {
  bookmark:
    "M5 3.5A1.5 1.5 0 0 1 6.5 2h5A1.5 1.5 0 0 1 13 3.5V15l-4-2.8L5 15V3.5Z",
  close: "M4 4l8 8m0-8-8 8",
  search: "M11.5 11.5 15 15M13 7.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0Z",
  pin: "M5 2h6l-1 4 2 2v1H4V8l2-2-1-4ZM8 9v5",
  chevron: "m5 3 5 5-5 5",
  settings:
    "M7.5 1v2m0 9v2M1 7.5h2m9 0h2M3 3l1.5 1.5m6 6L12 12M12 3l-1.5 1.5m-6 6L3 12M10 7.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z",
  trash: "M3 4h9m-7-2h5m1 2-.5 10h-6L4 4m2 2v6m3-6v6",
  up: "m3 10 4.5-5L12 10",
  down: "m3 5 4.5 5L12 5",
  grip: "M5 4h.01M10 4h.01M5 8h.01M10 8h.01M5 12h.01M10 12h.01",
  plus: "M8 2v12M2 8h12",
  arrow: "M3 8h10m-4-4 4 4-4 4",
};

export function icon(name: string, size = 16): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 16 16");
  svg.setAttribute("width", String(size));
  svg.setAttribute("height", String(size));
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "1.6");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("aria-hidden", "true");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", paths[name] ?? paths.bookmark ?? "");
  svg.append(path);
  return svg;
}

export function button(
  label: string,
  iconName: string,
  className = "icon-button",
): HTMLButtonElement {
  const element = document.createElement("button");
  element.type = "button";
  element.className = className;
  element.setAttribute("aria-label", label);
  element.title = label;
  element.append(icon(iconName));
  return element;
}
