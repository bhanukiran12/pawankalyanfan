import { NextResponse } from "next/server";
import { getGatewayApiUrl } from "@/lib/gateway-url";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** Serve VAPID public key from this container's env (no Next rebuild required). */
export async function GET() {
  const fromEnv =
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim() ||
    process.env.VAPID_PUBLIC_KEY?.trim();

  if (fromEnv) {
    return NextResponse.json({ success: true, data: { publicKey: fromEnv } });
  }

  try {
    const upstream = await fetch(getGatewayApiUrl("push/vapid-public-key"), { cache: "no-store" });
    const json = await upstream.json();
    if (upstream.ok && json.success && json.data?.publicKey) {
      return NextResponse.json(json);
    }
  } catch {
    /* gateway not ready */
  }

  return NextResponse.json(
    { success: false, error: "Push notifications are not configured" },
    { status: 503 },
  );
}
