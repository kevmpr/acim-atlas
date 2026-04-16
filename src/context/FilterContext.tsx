import { createContext, useContext, useState, type ReactNode } from 'react'
import type { AtlasFilters } from '../types/atlas'

interface FilterContextValue {
  filters: AtlasFilters
  setFilter: (key: keyof AtlasFilters, value: string | null) => void
  clearFilters: () => void
}

const DEFAULT_FILTERS: AtlasFilters = {
  subscriptionId: null,
  resourceGroup: null,
  location: null,
  resourceType: null,
}

const FilterContext = createContext<FilterContextValue | null>(null)

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<AtlasFilters>(DEFAULT_FILTERS)

  const setFilter = (key: keyof AtlasFilters, value: string | null) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => setFilters(DEFAULT_FILTERS)

  return (
    <FilterContext.Provider value={{ filters, setFilter, clearFilters }}>
      {children}
    </FilterContext.Provider>
  )
}

export function useFilters() {
  const ctx = useContext(FilterContext)
  if (!ctx) throw new Error('useFilters must be used inside FilterProvider')
  return ctx
}
