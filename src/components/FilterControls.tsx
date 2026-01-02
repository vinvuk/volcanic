"use client";

import { Volcano, STATUS_CONFIG, VolcanoStatus } from "@/lib/types";

interface FilterControlsProps {
  volcanoes: Volcano[];
  visibleStatuses: Set<string>;
  onToggleStatus: (status: string) => void;
}

/**
 * Filter controls for volcano status visibility
 * Shows counts and allows toggling each status category
 * @param volcanoes - Array of all volcanoes
 * @param visibleStatuses - Currently visible status set
 * @param onToggleStatus - Toggle callback
 */
export function FilterControls({
  volcanoes,
  visibleStatuses,
  onToggleStatus,
}: FilterControlsProps) {
  /**
   * Count volcanoes by status
   */
  const statusCounts = volcanoes.reduce((acc, v) => {
    acc[v.status] = (acc[v.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusOrder: VolcanoStatus[] = ["erupting", "warning", "watch", "advisory", "normal"];

  return (
    <div className="fixed left-4 bottom-4 glass-panel rounded-2xl p-4 pointer-events-auto w-52">
      <h3 className="font-mono text-xs text-muted uppercase tracking-wider mb-3">
        Volcano Status
      </h3>

      <div className="space-y-1.5">
        {statusOrder.map((status) => {
          const config = STATUS_CONFIG[status];
          const count = statusCounts[status] || 0;
          const isVisible = visibleStatuses.has(status);

          return (
            <button
              key={status}
              onClick={() => onToggleStatus(status)}
              className={`w-full flex items-center justify-between p-2 rounded-lg transition-all ${
                isVisible
                  ? "bg-white/5 border border-white/10"
                  : "opacity-50 hover:opacity-75"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-3 h-3 rounded-full flex-shrink-0 ${
                    status === "erupting" ? "animate-eruption" : ""
                  }`}
                  style={{
                    backgroundColor: config.color,
                    boxShadow: isVisible ? `0 0 8px ${config.color}` : "none",
                  }}
                />
                <span className="text-sm text-cream">{config.label}</span>
              </div>
              <span className="font-mono text-xs text-silver tabular-nums w-10 text-right">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Total Count */}
      <div className="mt-3 pt-3 border-t border-white/5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted">Total Volcanoes</span>
          <span className="font-mono text-xs text-cream tabular-nums">{volcanoes.length}</span>
        </div>
      </div>
    </div>
  );
}
