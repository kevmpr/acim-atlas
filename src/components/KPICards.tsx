import { Database, CreditCard, Tag, AlertTriangle } from 'lucide-react'
import type { KPIData } from '../types/atlas'

export function KPICards({ kpi }: { kpi: KPIData }) {
  const tagColor = kpi.untaggedPercent > 30 ? 'text-red-500 bg-red-50 dark:bg-red-950'
    : kpi.untaggedPercent > 15 ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-950'
    : 'text-green-500 bg-green-50 dark:bg-green-950'

  const cards = [
    { label: 'Total Recursos', value: kpi.totalResources, icon: Database, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950' },
    { label: 'Suscripciones', value: kpi.activeSubscriptions, icon: CreditCard, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950' },
    { label: 'Sin Tags', value: `${kpi.untaggedPercent}%`, icon: Tag, color: tagColor },
    { label: 'Advisor Crítico', value: kpi.advisorHigh, icon: AlertTriangle, color: 'text-red-500 bg-red-50 dark:bg-red-950' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${color}`}>
            <Icon size={22} />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
