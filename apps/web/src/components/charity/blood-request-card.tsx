import Link from "next/link";
import { Droplet, MapPin, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { UrgencyBadge } from "@/components/charity/urgency-badge";
import type { BloodRequest } from "@/lib/api-client";

export function BloodRequestCard({ request }: { request: BloodRequest }) {
  return (
    <Link href={`/jana-seva/blood/${request.slug}`}>
      <Card className="glass border-white/10 hover:border-brand-red/50 transition-colors h-full">
        <CardContent className="p-4 sm:p-5 space-y-3">
          <div className="flex flex-wrap items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <Droplet className="h-5 w-5 text-brand-red" />
              <span className="font-display text-xl text-white tracking-wide">{request.bloodGroup}</span>
            </div>
            <UrgencyBadge urgency={request.urgency} />
          </div>
          <p className="text-white font-medium line-clamp-1">
            {request.patientName || "Patient"} · {request.unitsRequired} unit(s)
          </p>
          <div className="flex items-start gap-2 text-sm text-white/70">
            <Building2 className="h-4 w-4 shrink-0 mt-0.5" />
            <span className="line-clamp-2">{request.hospitalName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/60">
            <MapPin className="h-4 w-4 shrink-0" />
            {request.city}, {request.state}
          </div>
          <p className="text-xs text-white/50 pt-1 flex items-center gap-1">
            <span className="text-brand-red">●</span> {request.phone}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
