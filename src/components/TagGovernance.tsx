import { Tag, Download } from 'lucide-react'
import { exportUntaggedToCsv } from '../lib/exportCsv'
import type { AzureResource } from '../types/atlas'

interface Props {
  untagged: AzureResource[]
  total: number
}

export function TagGovernance({ untagged, total }: Props) {
  const pct = total > 0 ? Math.round((untagged.length / total) * 100) : 0
  const barColor = pct > 30 ? 'bg-red-500' : pct > 15 ? 'bg-yellow-500' : 'bg-emerald-500'

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Tag size={16} className="text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Gobernanza de Tags</h3>
        </div>
        <button
          onClick={() => exportUntaggedToCsv(untagged)}
          className="flex items-center gap-1.5 text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
        >
          <Download size={12} />
          Exportar reporte
        </button>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-muted-foreground">{untagged.length} recursos sin tags</span>
          <span className="font-medium text-foreground">{pct}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${barColor}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {untagged.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-xs">
            <thead className="bg-muted">
              <tr>
                {['Nombre', 'Tipo', 'Resource Group', 'Región'].map(h => (
                  <th key={h} className="px-3 py-2 text-left font-medium text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {untagged.slice(0, 5).map(r => (
                <tr key={r.id} className="border-t border-border hover:bg-muted/50 transition-colors">
                  <td className="px-3 py-2 text-foreground font-medium">{r.name}</td>
                  <td className="px-3 py-2 text-muted-foreground">{r.type.split('/').slice(-1)[0]}</td>
                  <td className="px-3 py-2 text-muted-foreground">{r.resourceGroup}</td>
                  <td className="px-3 py-2 text-muted-foreground">{r.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {untagged.length > 5 && (
            <p className="text-xs text-muted-foreground text-center py-2 bg-muted/30">
              +{untagged.length - 5} más — Exportar CSV para ver todos
            </p>
          )}
        </div>
      )}
    </div>
  )
}
