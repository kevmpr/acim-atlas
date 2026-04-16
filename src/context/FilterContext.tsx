import { createContext, useContext, useState, type ReactNode } from 'react'
import type { AtlasFilters } from '../types/atlas'

interface FilterContextValue {
  filters: AtlasFilters
  toggleFilter: (key: keyof AtlasFilters, value: string) => void
  clearFilters: () => void
}

const DEFAULT_FILTERS: AtlasFilters = {
  subscriptionIds: [],
  resourceGroups: [],
  locations: [],
  resourceTypes: [],
}

const FilterContext = createContext<FilterContextValue | null>(null)

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<AtlasFilters>(DEFAULT_FILTERS)

  const toggleFilter = (key: keyof AtlasFilters, value: string) => {
    setFilters(prev => {
      const current = prev[key]
      const next = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value]
      return { ...prev, [key]: next }
    })
  }

  const clearFilters = () => setFilters(DEFAULT_FILTERS)

  return (
    <FilterContext.Provider value={{ filters, toggleFilter, clearFilters }}>
      {children}
    </FilterContext.Provider>
  )
}

export function useFilters() {
  const ctx = useContext(FilterContext)
  if (!ctx) throw new Error('useFilters must be used inside FilterProvider')
  return ctx
}
