"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Quote = { id: string; text: string; source?: string | null };

export function QuoteSlider({ quotes }: { quotes: Quote[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (quotes.length <= 1) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % quotes.length), 5000);
    return () => clearInterval(timer);
  }, [quotes.length]);

  if (!quotes.length) return null;

  return (
    <div className="glass rounded-lg p-6 cinematic-shadow">
      <AnimatePresence mode="wait">
        <motion.blockquote
          key={quotes[index].id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-lg italic text-white/90">&ldquo;{quotes[index].text}&rdquo;</p>
          {quotes[index].source && (
            <cite className="mt-2 block text-sm text-brand-red not-italic">— {quotes[index].source}</cite>
          )}
        </motion.blockquote>
      </AnimatePresence>
      <div className="mt-4 flex gap-2">
        {quotes.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-brand-red" : "w-1.5 bg-white/30"}`}
            aria-label={`Quote ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
