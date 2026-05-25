import type { LucideIcon } from "lucide-react";
import {
  Droplet,
  Ambulance,
  Pill,
  Wind,
  Truck,
  GraduationCap,
  LifeBuoy,
  Calendar,
  Presentation,
  Award,
  HandHeart,
} from "lucide-react";

export const JANA_SEVA_SESSION_KEY = "janaSevaSession";
export const JANA_SEVA_EMAIL_KEY = "janaSevaEmail";

export type NeedHelpCategory = {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

export const NEED_HELP_CATEGORIES: NeedHelpCategory[] = [
  {
    id: "blood",
    label: "Blood donation",
    description: "Urgent blood requirement at hospital",
    href: "/jana-seva/blood/new",
    icon: Droplet,
  },
  {
    id: "ambulance",
    label: "Ambulance",
    description: "Emergency ambulance or medical transport",
    href: "/jana-seva/emergency/new?category=AMBULANCE",
    icon: Ambulance,
  },
  {
    id: "medicine",
    label: "Medicine availability",
    description: "Critical medicines or pharmacy leads",
    href: "/jana-seva/emergency/new?category=MEDICINE",
    icon: Pill,
  },
  {
    id: "oxygen",
    label: "Oxygen support",
    description: "Oxygen cylinder, concentrator, or refill",
    href: "/jana-seva/emergency/new?category=OXYGEN",
    icon: Wind,
  },
  {
    id: "transport",
    label: "Emergency transport",
    description: "Patient transfer or emergency ride",
    href: "/jana-seva/emergency/new?category=TRANSPORT",
    icon: Truck,
  },
  {
    id: "education",
    label: "Education help",
    description: "Scholarship, books, coaching, or mentorship",
    href: "/jana-seva/education/new",
    icon: GraduationCap,
  },
  {
    id: "urgent",
    label: "Other urgent help",
    description: "Any verified community assistance need",
    href: "/jana-seva/emergency/new?category=URGENT_ASSISTANCE",
    icon: LifeBuoy,
  },
];

export const OFFER_HELP_CATEGORIES: NeedHelpCategory[] = [
  {
    id: "blood-camp",
    label: "Blood donation camp",
    description: "Organize or announce a blood donation drive",
    href: "/jana-seva/camps/new",
    icon: Calendar,
  },
  {
    id: "workshop",
    label: "Free workshop",
    description: "Conduct a free session — coding, UPSC, career, health, etc.",
    href: "/jana-seva/workshops/new",
    icon: Presentation,
  },
  {
    id: "scholarship",
    label: "Scholarship or opportunity",
    description: "Share a scholarship, coaching, or mentorship program",
    href: "/jana-seva/scholarships/new",
    icon: Award,
  },
  {
    id: "volunteer",
    label: "Volunteer skills",
    description: "Register as a donor, mentor, or community volunteer",
    href: "/jana-seva/volunteers/register",
    icon: HandHeart,
  },
];

export const WORKSHOP_CATEGORIES = [
  "coding",
  "upsc",
  "career",
  "health",
  "language",
  "finance",
  "other",
] as const;

export const EMERGENCY_CATEGORY_LABELS: Record<string, string> = {
  AMBULANCE: "Ambulance",
  MEDICINE: "Medicine availability",
  TRANSPORT: "Emergency transport",
  OXYGEN: "Oxygen support",
  URGENT_ASSISTANCE: "Urgent assistance",
};
