import { Database, Building2, FolderOpen, Layers, Tag, ShieldAlert, AlertTriangle, Info } from 'lucide-react'
import type { KPIData } from '../types/atlas'

interface Props {
  kpi: KPIData
  subscriptionNames: string[]
  resourceGroupCount: number
  resourceTypeCount: number
}

export function KPICards({ kpi, subscriptionNames, resourceGroupCount, resourceTypeCount }: Props) {
  const tagColor = kpi.untaggedPercent > 30
    ? 'text-red-500 bg-red-50 dark:bg-red-950'
    : kpi.untaggedPercent > 15
    ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-950'
    : 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950'

  return (
    <div className="space-y-4">
      {/* Row 1 — Inventory */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Recursos */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg text-blue-500 bg-blue-50 dark:bg-blue-950">
              <Database size={16} />
            </div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Recursos</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{kpi.totalResources}</p>
        </div>

        {/* Suscripciones */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg text-indigo-500 bg-indigo-50 dark:bg-indigo-950">
              <Building2 size={16} />
            </div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Suscripciones</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{subscriptionNames.length}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {subscriptionNames.slice(0, 4).map(n => (
              <span key={n} className="text-xs bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full">{n}</span>
            ))}
            {subscriptionNames.length > 4 && (
              <span className="text-xs text-muted-foreground">+{subscriptionNames.length - 4}</span>
            )}
          </div>
        </div>

        {/* Resource Groups */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg text-violet-500 bg-violet-50 dark:bg-violet-950">
              <FolderOpen size={16} />
            </div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Resource Groups</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{resourceGroupCount}</p>
        </div>

        {/* Tipos de Recursos */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg text-cyan-500 bg-cyan-50 dark:bg-cyan-950">
              <Layers size={16} />
            </div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Tipos de Recursos</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{resourceTypeCount}</p>
        </div>
      </div>

      {/* Row 2 — Health */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Sin Tags */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${tagColor}`}>
              <Tag size={16} />
            </div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Sin Tags</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{kpi.untaggedPercent}%</p>
        </div>

        {/* Advisor Alto */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 bg-red-50 dark:bg-red-950">
              <ShieldAlert size={16} />
            </div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Advisor Alto</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{kpi.advisorHigh}</p>
        </div>

        {/* Advisor Medio */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg text-orange-500 bg-orange-50 dark:bg-orange-950">
              <AlertTriangle size={16} />
            </div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Advisor Medio</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{kpi.advisorMedium}</p>
        </div>

        {/* Advisor Bajo */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg text-yellow-500 bg-yellow-50 dark:bg-yellow-950">
              <Info size={16} />
            </div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Advisor Bajo</span>
          </div>
          <p className="text-3xl font-bold text-foreground">{kpi.advisorLow}</p>
        </div>
      </div>
    </div>
  )
}
