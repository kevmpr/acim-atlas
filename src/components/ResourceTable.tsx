import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Search, X, Copy, Check } from 'lucide-react'
import type { AzureResource } from '../types/atlas'

interface Props { resources: AzureResource[] }

const PAGE_SIZE = 15

function TagChips({ tags }: { tags: Record<string, string> }) {
  const entries = Object.entries(tags)
  if (entries.length === 0) return (
    <span className="text-xs text-muted-foreground italic">sin tags</span>
  )
  return (
    <div className="flex flex-wrap gap-1">
      {entries.slice(0, 2).map(([k, v]) => (
        <span key={k} className="text-xs bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded">
          {k}={v}
        </span>
      ))}
      {entries.length > 2 && (
        <span className="text-xs text-muted-foreground">+{entries.length - 2}</span>
      )}
    </div>
  )
}

function ResourceModal({ resource, onClose }: { resource: AzureResource; onClose: () => void }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(resource.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h2 className="font-semibold text-foreground">{resource.name}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{resource.type}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
            <X size={16} className="text-muted-foreground" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          {/* Resource ID */}
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Resource ID</p>
            <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
              <code className="text-xs text-foreground flex-1 break-all">{resource.id}</code>
              <button
                onClick={copy}
                className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
              >
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              </button>
            </div>
          </div>
          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3">
            {([
              ['Suscripción', resource.subscriptionName],
              ['Resource Group', resource.resourceGroup],
              ['Región', resource.location],
              ['Estado', resource.provisioningState ?? '—'],
              ...(resource.kind ? [['Kind', resource.kind] as [string, string]] : []),
            ] as [string, string][]).map(([label, value]) => (
              <div key={label}>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
                <p className="text-sm text-foreground">{value}</p>
              </div>
            ))}
          </div>
          {/* Tags */}
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              Tags ({Object.keys(resource.tags).length})
            </p>
            {Object.keys(resource.tags).length === 0 ? (
              <p className="text-sm text-muted-foreground italic">Sin tags asignados</p>
            ) : (
              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium text-muted-foreground">Clave</th>
                      <th className="px-3 py-2 text-left font-medium text-muted-foreground">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(resource.tags).map(([k, v]) => (
                      <tr key={k} className="border-t border-border">
                        <td className="px-3 py-2 font-medium text-foreground">{k}</td>
                        <td className="px-3 py-2 text-muted-foreground">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function ResourceTable({ resources }: Props) {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<AzureResource | null>(null)

  const filtered = useMemo(() => {
    if (!search.trim()) return resources
    const q = search.toLowerCase()
    return resources.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.type.toLowerCase().includes(q) ||
      r.resourceGroup.toLowerCase().includes(q) ||
      r.subscriptionName.toLowerCase().includes(q) ||
      r.location.toLowerCase().includes(q)
    )
  }, [resources, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const handleSearch = (v: string) => { setSearch(v); setPage(1) }

  return (
    <>
      {selected && <ResourceModal resource={selected} onClose={() => setSelected(null)} />}
      <div data-atlas="resource-table" className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Inventario de Recursos</h3>
            <p className="text-xs text-muted-foreground">
              {filtered.length} de {resources.length} recursos · clic en fila para detalles
            </p>
          </div>
          <div className="flex items-center gap-2 ml-auto w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                data-atlas="table-search"
                value={search}
                onChange={e => handleSearch(e.target.value)}
                placeholder="Buscar recursos..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {search && (
                <button
                  onClick={() => handleSearch('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X size={12} />
                </button>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="p-1 rounded hover:bg-muted disabled:opacity-40"
              >
                <ChevronLeft size={14} />
              </button>
              <span>{safePage}/{totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="p-1 rounded hover:bg-muted disabled:opacity-40"
              >
                <ChevronRight size={14} />
              </button>
            </div>
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
                <tr
                  key={r.id}
                  onClick={() => setSelected(r)}
                  className="border-t border-border hover:bg-muted/40 transition-colors cursor-pointer"
                >
                  <td className="px-3 py-2 font-medium text-foreground whitespace-nowrap">{r.name}</td>
                  <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">{r.type.split('/').slice(-1)[0]}</td>
                  <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">{r.resourceGroup}</td>
                  <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">{r.subscriptionName}</td>
                  <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">{r.location}</td>
                  <td className="px-3 py-2"><TagChips tags={r.tags} /></td>
                  <td className="px-3 py-2">
                    <span className={`flex items-center gap-1 ${r.provisioningState === 'Succeeded' ? 'text-emerald-500' : 'text-red-500'}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />
                      {r.provisioningState ?? 'Unknown'}
                    </span>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-muted-foreground">
                    No se encontraron recursos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
