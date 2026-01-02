"use client";

import { Volcano } from "@/lib/types";

interface StatsBarProps {
  volcanoes: Volcano[];
}

/**
 * Bottom stats bar showing key metrics
 * Inspired by satellite tracker UI
 */
export function StatsBar({ volcanoes }: StatsBarProps) {
  const eruptingCount = volcanoes.filter((v) => v.status === "erupting").length;
  const totalCount = volcanoes.length;
  const countriesCount = new Set(volcanoes.map((v) => v.country)).size;
  const activeCount = volcanoes.filter(
    (v) => v.status === "erupting" || v.status === "warning" || v.status === "watch"
  ).length;

  const stats = [
    { value: eruptingCount, label: "ERUPTING NOW" },
    { value: activeCount, label: "ACTIVE ALERTS" },
    { value: countriesCount, label: "COUNTRIES" },
    { value: totalCount.toLocaleString(), label: "VOLCANOES TRACKED" },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
      <div className="glass-panel rounded-full px-8 py-4 border border-white/10">
        <div className="flex items-center divide-x divide-white/20">
          {stats.map((stat, index) => (
            <div key={stat.label} className="px-8 first:pl-0 last:pr-0 text-center">
              <p className="font-display text-2xl md:text-3xl font-semibold text-lava tabular-nums">
                {stat.value}
              </p>
              <p className="text-[10px] md:text-xs text-silver tracking-widest mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
