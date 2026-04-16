import { useMemo } from 'react'
import { useAtlasDataContext } from '../context/AtlasDataContext'
import { useFilters } from '../context/FilterContext'
import type { KPIData } from '../types/atlas'

export function useAtlasData() {
  const { resources: allResources, advisor, subscriptions, loading, error, isLive, hasToken } = useAtlasDataContext()
  const { filters } = useFilters()

  const filteredResources = useMemo(() => {
    return allResources.filter(r => {
      if (filters.subscriptionIds.length > 0 && !filters.subscriptionIds.includes(r.subscriptionId)) return false
      if (filters.resourceGroups.length > 0 && !filters.resourceGroups.includes(r.resourceGroup)) return false
      if (filters.locations.length > 0 && !filters.locations.includes(r.location)) return false
      if (filters.resourceTypes.length > 0 && !filters.resourceTypes.includes(r.type)) return false
      return true
    })
  }, [filters, allResources])

  const kpi: KPIData = useMemo(() => {
    const untagged = filteredResources.filter(r => Object.keys(r.tags).length === 0).length
    return {
      totalResources: filteredResources.length,
      activeSubscriptions: new Set(filteredResources.map(r => r.subscriptionId)).size,
      untaggedPercent: filteredResources.length > 0 ? Math.round((untagged / filteredResources.length) * 100) : 0,
      advisorHigh: advisor.filter(a => a.impact === 'High').length,
      advisorMedium: advisor.filter(a => a.impact === 'Medium').length,
      advisorLow: advisor.filter(a => a.impact === 'Low').length,
    }
  }, [filteredResources, advisor])

  const bySubscription = useMemo(() => {
    const map = new Map<string, { count: number; id: string }>()
    filteredResources.forEach(r => {
      const existing = map.get(r.subscriptionName)
      map.set(r.subscriptionName, { count: (existing?.count ?? 0) + 1, id: r.subscriptionId })
    })
    return Array.from(map.entries())
      .map(([name, { count, id }]) => ({ name, count, id }))
      .sort((a, b) => b.count - a.count)
  }, [filteredResources])

  const byType = useMemo(() => {
    const map = new Map<string, { count: number; fullType: string }>()
    filteredResources.forEach(r => {
      const short = r.type.split('/').slice(-1)[0]
      const existing = map.get(short)
      if (existing) {
        map.set(short, { count: existing.count + 1, fullType: r.type })
      } else {
        map.set(short, { count: 1, fullType: r.type })
      }
    })
    return Array.from(map.entries())
      .map(([name, { count, fullType }]) => ({ name, count, fullType }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
  }, [filteredResources])

  const byLocation = useMemo(() => {
    const map = new Map<string, number>()
    filteredResources.forEach(r => map.set(r.location, (map.get(r.location) ?? 0) + 1))
    return Array.from(map.entries()).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count)
  }, [filteredResources])

  const advisorByImpact = useMemo(() => [
    { name: 'High', value: advisor.filter(a => a.impact === 'High').length, color: '#ef4444' },
    { name: 'Medium', value: advisor.filter(a => a.impact === 'Medium').length, color: '#f97316' },
    { name: 'Low', value: advisor.filter(a => a.impact === 'Low').length, color: '#eab308' },
  ], [advisor])

  const untaggedResources = useMemo(() =>
    filteredResources.filter(r => Object.keys(r.tags).length === 0),
    [filteredResources]
  )

  const availableOptions = useMemo(() => ({
    subscriptions: subscriptions,
    resourceGroups: [...new Set(allResources.map(r => r.resourceGroup))].sort(),
    locations: [...new Set(allResources.map(r => r.location))].sort(),
    resourceTypes: [...new Set(allResources.map(r => r.type))].sort(),
  }), [subscriptions, allResources])

  return {
    filteredResources, kpi, bySubscription, byType, byLocation,
    advisorByImpact, untaggedResources, availableOptions,
    loading, error, isLive, hasToken,
  }
}
