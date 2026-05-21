import { SITE } from "@/lib/constants";

export const size = { width: 48, height: 48 };
export const contentType = "image/png";

export default async function Icon() {
  const res = await fetch(SITE.logo, { next: { revalidate: 86400 } });
  if (!res.ok) {
    return new Response(null, { status: 404 });
  }
  return new Response(await res.arrayBuffer(), {
    headers: { "Content-Type": "image/png" },
  });
}
