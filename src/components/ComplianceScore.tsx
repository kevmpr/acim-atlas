import type { KPIData } from '../types/atlas'

function ScoreRing({ score, color }: { score: number; color: string }) {
  const r = 36
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  return (
    <svg width="96" height="96" className="-rotate-90">
      <circle cx="48" cy="48" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
      <circle
        cx="48"
        cy="48"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
    </svg>
  )
}

export function ComplianceScore({ kpi, total }: { kpi: KPIData; total: number }) {
  const tagScore = total > 0 ? ((total - total * kpi.untaggedPercent / 100) / total) * 50 : 50
  const advisorScore = Math.max(0, 50 - kpi.advisorHigh * 2)
  const score = Math.round(Math.min(100, tagScore + advisorScore))
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#eab308' : '#ef4444'
  const label = score >= 80 ? 'Bueno' : score >= 60 ? 'Regular' : 'Crítico'

  return (
    <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
      <div className="relative flex-shrink-0">
        <ScoreRing score={score} color={color} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-foreground">{score}</span>
          <span className="text-xs text-muted-foreground">/ 100</span>
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <p className="text-sm font-semibold text-foreground">Compliance Score</p>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: color + '20', color }}
          >
            {label}
          </span>
        </div>
        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Cobertura de tags</span>
            <span className="font-medium text-foreground">{100 - kpi.untaggedPercent}%</span>
          </div>
          <div className="flex justify-between">
            <span>Advisor crítico</span>
            <span
              className="font-medium"
              style={{ color: kpi.advisorHigh > 0 ? '#ef4444' : '#10b981' }}
            >
              {kpi.advisorHigh} issues
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
