import { X } from 'lucide-react'
import { useFilters } from '../context/FilterContext'

interface Props {
  options: {
    subscriptions: { id: string; name: string }[]
    resourceGroups: string[]
    locations: string[]
    resourceTypes: string[]
  }
}

export function FilterBar({ options }: Props) {
  const { filters, setFilter, clearFilters } = useFilters()
  const hasFilters = Object.values(filters).some(v => v !== null)

  const selectClass = (active: boolean) =>
    `text-sm rounded-lg border px-3 py-1.5 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer ${
      active ? 'border-primary ring-1 ring-primary' : 'border-border'
    }`

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-card border border-border rounded-xl">
      <span className="text-sm font-medium text-muted-foreground">Filtrar:</span>

      <select
        className={selectClass(!!filters.subscriptionId)}
        value={filters.subscriptionId ?? ''}
        onChange={e => setFilter('subscriptionId', e.target.value || null)}
      >
        <option value="">Todas las suscripciones</option>
        {options.subscriptions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
      </select>

      <select
        className={selectClass(!!filters.resourceGroup)}
        value={filters.resourceGroup ?? ''}
        onChange={e => setFilter('resourceGroup', e.target.value || null)}
      >
        <option value="">Todos los Resource Groups</option>
        {options.resourceGroups.map(rg => <option key={rg} value={rg}>{rg}</option>)}
      </select>

      <select
        className={selectClass(!!filters.location)}
        value={filters.location ?? ''}
        onChange={e => setFilter('location', e.target.value || null)}
      >
        <option value="">Todas las regiones</option>
        {options.locations.map(l => <option key={l} value={l}>{l}</option>)}
      </select>

      <select
        className={selectClass(!!filters.resourceType)}
        value={filters.resourceType ?? ''}
        onChange={e => setFilter('resourceType', e.target.value || null)}
      >
        <option value="">Todos los tipos</option>
        {options.resourceTypes.map(t => <option key={t} value={t}>{t.split('/').slice(-1)[0]}</option>)}
      </select>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive transition-colors"
        >
          <X size={14} /> Limpiar
        </button>
      )}
    </div>
  )
}
