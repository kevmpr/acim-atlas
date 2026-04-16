import { useState, useRef, useEffect } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { useFilters } from '../context/FilterContext'

interface MultiSelectProps {
  label: string
  options: { value: string; label: string }[]
  selected: string[]
  onToggle: (value: string) => void
}

function MultiSelect({ label, options, selected, onToggle }: MultiSelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const isActive = selected.length > 0

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={[
          'flex items-center gap-2 text-sm rounded-lg border px-3 py-1.5 bg-card text-foreground transition-colors whitespace-nowrap',
          isActive ? 'border-primary ring-1 ring-primary' : 'border-border hover:border-primary/50',
        ].join(' ')}
      >
        <span>{label}</span>
        {isActive && (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
            {selected.length}
          </span>
        )}
        <ChevronDown size={14} className={`text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 w-56 bg-card border border-border rounded-xl shadow-xl overflow-hidden">
          <div className="max-h-56 overflow-y-auto py-1">
            {options.length === 0 && (
              <p className="px-3 py-2 text-xs text-muted-foreground">Sin opciones</p>
            )}
            {options.map(opt => (
              <label
                key={opt.value}
                className="flex items-center gap-2.5 px-3 py-2 hover:bg-muted cursor-pointer text-sm text-foreground"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(opt.value)}
                  onChange={() => onToggle(opt.value)}
                  className="w-3.5 h-3.5 accent-primary"
                />
                <span className="truncate">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

interface Props {
  options: {
    subscriptions: { id: string; name: string }[]
    resourceGroups: string[]
    locations: string[]
    resourceTypes: string[]
  }
}

export function FilterBar({ options }: Props) {
  const { filters, toggleFilter, clearFilters } = useFilters()
  const hasFilters = Object.values(filters).some((arr: string[]) => arr.length > 0)

  return (
    <div data-atlas="filter-bar" className="flex flex-wrap items-center gap-2 p-4 bg-card border border-border rounded-xl">
      <span className="text-sm font-medium text-muted-foreground mr-1">Filtrar:</span>

      <div data-atlas="filter-subs">
        <MultiSelect
          label="Suscripciones"
          options={options.subscriptions.map(s => ({ value: s.id, label: s.name }))}
          selected={filters.subscriptionIds}
          onToggle={v => toggleFilter('subscriptionIds', v)}
        />
      </div>
      <div data-atlas="filter-rgs">
        <MultiSelect
          label="Resource Groups"
          options={options.resourceGroups.map(rg => ({ value: rg, label: rg }))}
          selected={filters.resourceGroups}
          onToggle={v => toggleFilter('resourceGroups', v)}
        />
      </div>
      <div data-atlas="filter-regions">
        <MultiSelect
          label="Regiones"
          options={options.locations.map(l => ({ value: l, label: l }))}
          selected={filters.locations}
          onToggle={v => toggleFilter('locations', v)}
        />
      </div>
      <div data-atlas="filter-types">
        <MultiSelect
          label="Tipos"
          options={options.resourceTypes.map(t => ({ value: t, label: t.split('/').slice(-1)[0] }))}
          selected={filters.resourceTypes}
          onToggle={v => toggleFilter('resourceTypes', v)}
        />
      </div>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive transition-colors ml-1"
        >
          <X size={14} /> Limpiar todo
        </button>
      )}
    </div>
  )
}
