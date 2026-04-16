import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { AzureResource } from '../types/atlas'

interface Props { resources: AzureResource[] }

const PAGE_SIZE = 10

export function ResourceTable({ resources }: Props) {
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(resources.length / PAGE_SIZE))
  const paged = resources.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Inventario de Recursos ({resources.length})</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1 rounded hover:bg-muted disabled:opacity-40"
          >
            <ChevronLeft size={16} />
          </button>
          <span>{page} / {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-1 rounded hover:bg-muted disabled:opacity-40"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-muted">
            <tr>
              {['Nombre', 'Tipo', 'Resource Group', 'Suscripción', 'Región', 'Tags', 'Estado'].map(h => (
                <th key={h} className="px-3 py-2 text-left font-medium text-muted-foreground whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map(r => (
              <tr key={r.id} className="border-t border-border hover:bg-muted/40 transition-colors">
                <td className="px-3 py-2 font-medium text-foreground whitespace-nowrap">{r.name}</td>
                <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">{r.type.split('/').slice(-1)[0]}</td>
                <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">{r.resourceGroup}</td>
                <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">{r.subscriptionName}</td>
                <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">{r.location}</td>
                <td className="px-3 py-2">
                  <span className={`px-1.5 py-0.5 rounded text-xs ${
                    Object.keys(r.tags).length > 0
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                      : 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400'
                  }`}>
                    {Object.keys(r.tags).length > 0 ? Object.keys(r.tags).length : 'Sin tags'}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <span className={`flex items-center gap-1 ${r.provisioningState === 'Succeeded' ? 'text-emerald-500' : 'text-red-500'}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />
                    {r.provisioningState}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
