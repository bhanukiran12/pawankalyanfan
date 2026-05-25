"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, MessageCircle, MapPin, Share2, Phone, Flag } from "lucide-react";
import { toast } from "sonner";
import { PageShell } from "@/components/layout/section-background";
import { FadeIn } from "@/components/motion/fade-in";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/ui/skeleton";
import { UrgencyBadge } from "@/components/charity/urgency-badge";
import { api, type BloodRequest } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";

export default function BloodRequestDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [request, setRequest] = useState<BloodRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    api
      .getBloodRequest(slug)
      .then(setRequest)
      .catch(() => setRequest(null))
      .finally(() => setLoading(false));
  }, [slug]);

  function whatsappShare() {
    if (!request) return;
    const text = encodeURIComponent(
      `Urgent blood needed: ${request.bloodGroup} at ${request.hospitalName}, ${request.city}. ${window.location.href}`,
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  }

  async function reportFake() {
    if (!request) return;
    try {
      await api.reportCharityAbuse({
        reason: "Suspected fake request",
        bloodRequestId: request.id,
      });
      toast.success("Report submitted.");
    } catch {
      toast.error("Could not submit report.");
    }
  }

  if (loading) {
    return (
      <PageShell background="form">
        <PageLoader />
      </PageShell>
    );
  }

  if (!request) {
    return (
      <PageShell background="form">
        <div className="container-page py-12">
          <p className="text-white/70">Request not found.</p>
          <Link href="/jana-seva/blood" className="text-brand-red mt-4 inline-block">
            ← Back to listings
          </Link>
        </div>
      </PageShell>
    );
  }

  const wa = request.whatsapp || request.phone;

  return (
    <PageShell background="form" overlay="gradient">
      <div className="container-page py-8 sm:py-12 max-w-2xl">
        <Link href="/jana-seva/blood" className="text-sm text-white/60 hover:text-white inline-flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> All requests
        </Link>

        <FadeIn className="mt-6">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="font-display text-4xl text-white">{request.bloodGroup}</span>
            <UrgencyBadge urgency={request.urgency} />
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-white">
            {request.patientName || "Patient"} — {request.unitsRequired} unit(s)
          </h1>
          <p className="mt-2 text-white/75">{request.hospitalName}</p>
          <p className="text-sm text-white/55">{request.hospitalAddress}</p>
          <p className="mt-2 flex items-center gap-2 text-white/65 text-sm">
            <MapPin className="h-4 w-4" />
            {request.city}, {request.state}
          </p>
          <p className="mt-2 text-xs text-white/45">Expires {formatDate(request.expiresAt)}</p>
        </FadeIn>

        <FadeIn delay={0.15} className="mt-8 glass rounded-xl p-5 border border-white/10 space-y-4">
          <div className="space-y-2 text-white">
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-brand-red" />
              <strong>Phone:</strong>{" "}
              <a href={`tel:${request.phone}`} className="text-brand-red hover:underline">
                {request.phone}
              </a>
            </p>
            {request.alternatePhone && (
              <p>
                <strong>Alt:</strong>{" "}
                <a href={`tel:${request.alternatePhone}`} className="text-brand-red hover:underline">
                  {request.alternatePhone}
                </a>
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={whatsappShare} className="flex-1 min-w-[140px]">
              <Share2 className="mr-2 h-4 w-4" /> WhatsApp share
            </Button>
            <a href={`https://wa.me/91${wa.replace(/\D/g, "").slice(-10)}`} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="glass">
                <MessageCircle className="mr-2 h-4 w-4" /> Chat
              </Button>
            </a>
            <Button variant="ghost" size="sm" onClick={reportFake} className="text-white/50">
              <Flag className="mr-1 h-4 w-4" /> Report
            </Button>
          </div>
        </FadeIn>
      </div>
    </PageShell>
  );
}
