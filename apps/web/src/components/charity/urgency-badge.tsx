import { Badge } from "@/components/ui/badge";

export function UrgencyBadge({ urgency }: { urgency: string }) {
  if (urgency === "CRITICAL") {
    return <Badge className="bg-red-600 text-white border-0 animate-pulse">Critical</Badge>;
  }
  if (urgency === "URGENT") {
    return <Badge className="bg-orange-600 text-white border-0">Urgent</Badge>;
  }
  return <Badge variant="outline" className="border-white/30 text-white/80">Normal</Badge>;
}
