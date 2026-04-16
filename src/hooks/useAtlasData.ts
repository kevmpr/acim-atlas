import { useMemo } from 'react'
import { useAtlasDataContext } from '../context/AtlasDataContext'
import { useFilters } from '../context/FilterContext'
import type { KPIData } from '../types/atlas'

export function useAtlasData() {
  const { resources: allResources, advisor, loading, error, isLive } = useAtlasDataContext()
  const { filters } = useFilters()

  const filteredResources = useMemo(() => {
    return allResources.filter(r => {
      if (filters.subscriptionId && r.subscriptionId !== filters.subscriptionId) return false
      if (filters.resourceGroup && r.resourceGroup !== filters.resourceGroup) return false
      if (filters.location && r.location !== filters.location) return false
      if (filters.resourceType && r.type !== filters.resourceType) return false
      return true
    })
  }, [allResources, filters])

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
    const map = new Map<string, number>()
    filteredResources.forEach(r => map.set(r.subscriptionName, (map.get(r.subscriptionName) ?? 0) + 1))
    return Array.from(map.entries()).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count)
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
    subscriptions: [...new Map(allResources.map(r => [r.subscriptionId, { id: r.subscriptionId, name: r.subscriptionName }])).values()],
    resourceGroups: [...new Set(filteredResources.map(r => r.resourceGroup))].sort(),
    locations: [...new Set(allResources.map(r => r.location))].sort(),
    resourceTypes: [...new Set(allResources.map(r => r.type))].sort(),
  }), [allResources, filteredResources])

  return {
    filteredResources, kpi, bySubscription, byType, byLocation,
    advisorByImpact, untaggedResources, availableOptions,
    loading, error, isLive,
  }
}
