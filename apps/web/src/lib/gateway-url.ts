/** Resolve API gateway origin (no trailing slash, no /api suffix). */
export function getGatewayOrigin(): string {
  const raw = process.env.API_GATEWAY_URL || process.env.API_GATEWAY_HOST;
  if (!raw) return "http://localhost:4000";
  let trimmed = raw.replace(/\/$/, "");
  if (trimmed.endsWith("/api")) trimmed = trimmed.slice(0, -4);
  return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
}

export function getGatewayApiUrl(path: string, search = ""): string {
  const base = getGatewayOrigin();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}/api${normalized}${search}`;
}
