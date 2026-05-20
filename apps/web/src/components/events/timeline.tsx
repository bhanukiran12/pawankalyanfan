"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Calendar, Film, Landmark, Mic2, Sparkles, Star, Users } from "lucide-react";
import { TimelineEvent } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";

const TYPE_STYLES: Record<
  string,
  { dot: string; badge: string; icon: typeof Calendar; glow: string }
> = {
  MOVIE_RELEASE: {
    dot: "bg-brand-red shadow-[0_0_12px_rgba(220,38,38,0.8)]",
    badge: "bg-brand-red/20 text-brand-red-light border-brand-red/30",
    icon: Film,
    glow: "from-brand-red/20",
  },
  POLITICAL: {
    dot: "bg-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.7)]",
    badge: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    icon: Landmark,
    glow: "from-purple-500/20",
  },
  SPEECH: {
    dot: "bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.7)]",
    badge: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    icon: Mic2,
    glow: "from-blue-500/20",
  },
  PUBLIC_APPEARANCE: {
    dot: "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.7)]",
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    icon: Users,
    glow: "from-emerald-500/20",
  },
  AWARD: {
    dot: "bg-brand-gold shadow-[0_0_12px_rgba(234,179,8,0.7)]",
    badge: "bg-brand-gold/20 text-brand-gold border-brand-gold/30",
    icon: Star,
    glow: "from-brand-gold/20",
  },
  OTHER: {
    dot: "bg-white/80 shadow-[0_0_10px_rgba(255,255,255,0.4)]",
    badge: "bg-white/10 text-white/80 border-white/20",
    icon: Sparkles,
    glow: "from-white/10",
  },
};

function TimelineCard({ event, index }: { event: TimelineEvent; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const style = TYPE_STYLES[event.type] ?? TYPE_STYLES.OTHER;
  const Icon = style.icon;
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.06, ease: "easeOut" }}
      className={`relative flex md:gap-10 ${isEven ? "md:flex-row" : "md:flex-row-reverse"}`}
    >
      <div className="hidden md:block md:w-1/2 shrink-0" aria-hidden />
      <div
        className={`absolute left-[11px] md:left-1/2 md:-translate-x-1/2 top-6 z-10 h-4 w-4 sm:h-5 sm:w-5 rounded-full border-4 border-black/60 ${style.dot}`}
      />

      <article
        className={`ml-8 sm:ml-10 md:ml-0 w-full md:w-1/2 shrink-0 ${isEven ? "md:pr-8 lg:pr-12 md:text-right" : "md:pl-8 lg:pl-12"}`}
      >
        <motion.div
          whileHover={{ scale: 1.01, y: -2 }}
          transition={{ type: "spring", stiffness: 320, damping: 22 }}
          className={`group overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br ${style.glow} to-black/60 p-4 sm:p-5 shadow-xl backdrop-blur-md`}
        >
          {event.imageUrl && (
            <div className="mb-4 overflow-hidden rounded-xl border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={event.imageUrl}
                alt=""
                className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          )}
          <div
            className={`flex flex-wrap items-center gap-2 ${isEven ? "md:justify-end" : ""}`}
          >
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${style.badge}`}
            >
              <Icon className="h-3 w-3" />
              {event.type.replace(/_/g, " ")}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-white/50">
              <Calendar className="h-3 w-3" />
              {formatDate(event.date)}
            </span>
          </div>
          <h3 className="mt-3 font-display text-lg sm:text-xl tracking-wide text-white">{event.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-white/75">{event.description}</p>
        </motion.div>
      </article>
    </motion.div>
  );
}

export function EventsTimeline({ events }: { events: TimelineEvent[] }) {
  const sorted = [...events].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <div className="relative mt-14 max-w-4xl mx-auto">
      <motion.div
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        className="absolute left-[7px] md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 origin-top bg-gradient-to-b from-brand-red via-purple-500/60 to-white/20"
      />
      <div className="space-y-10 md:space-y-14">
        {sorted.map((event, i) => (
          <TimelineCard key={event.id} event={event} index={i} />
        ))}
      </div>
    </div>
  );
}
