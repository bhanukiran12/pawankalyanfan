import { SITE } from "@/lib/constants";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const res = await fetch(SITE.logo, { next: { revalidate: 86400 } });
  if (!res.ok) {
    return new Response(null, { status: 404 });
  }
  return new Response(await res.arrayBuffer(), {
    headers: { "Content-Type": "image/png" },
  });
}
