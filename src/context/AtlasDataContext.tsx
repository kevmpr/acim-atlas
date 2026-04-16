import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { fetchResources, fetchSubscriptions, fetchAdvisor } from '../lib/argService'
import { MOCK_RESOURCES, MOCK_ADVISOR } from '../mock/mockData'
import type { AzureResource, AdvisorRecommendation } from '../types/atlas'

interface CtxValue {
  resources: AzureResource[]
  advisor: AdvisorRecommendation[]
  subscriptions: { id: string; name: string }[]
  loading: boolean
  error: string | null
  isLive: boolean
}

const Ctx = createContext<CtxValue | null>(null)

export function AtlasDataProvider({
  token, children,
}: { token: string | null; children: ReactNode }) {
  const [resources, setResources]         = useState<AzureResource[]>(MOCK_RESOURCES)
  const [advisor, setAdvisor]             = useState<AdvisorRecommendation[]>(MOCK_ADVISOR)
  const [subscriptions, setSubscriptions] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading]             = useState(false)
  const [error, setError]                 = useState<string | null>(null)
  const [isLive, setIsLive]               = useState(false)

  useEffect(() => {
    if (!token) {
      setResources(MOCK_RESOURCES)
      setAdvisor(MOCK_ADVISOR)
      const mockSubs = [...new Map(MOCK_RESOURCES.map(r => [r.subscriptionId, { id: r.subscriptionId, name: r.subscriptionName }])).values()]
      setSubscriptions(mockSubs)
      setIsLive(false)
      return
    }

    setLoading(true)
    setError(null)

    Promise.all([fetchResources(token), fetchSubscriptions(token), fetchAdvisor(token)])
      .then(([rawRes, subs, rawAdv]) => {
        const subMap = new Map(subs.map(s => [s.subscriptionId, s.name]))
        setSubscriptions(subs.map(s => ({
          id: s.subscriptionId,
          name: (s.name && s.name !== 'null' && s.name.trim() !== '') ? s.name : s.subscriptionId,
        })))

        setResources(rawRes.map(r => ({
          id: r.id,
          name: r.name,
          type: r.type,
          location: r.location,
          subscriptionId: r.subscriptionId,
          subscriptionName: subMap.get(r.subscriptionId) ?? r.subscriptionId,
          resourceGroup: r.resourceGroup,
          tags: r.tags ?? {},
          kind: r.kind,
          provisioningState: 'Succeeded',
        })))

        setAdvisor(rawAdv.map(a => ({
          id: a.id,
          category: a.category,
          impact: (['High','Medium','Low'].includes(a.impact) ? a.impact : 'Low') as 'High'|'Medium'|'Low',
          resourceId: a.resourceId,
          description: a.description,
        })))

        setIsLive(true)
      })
      .catch(err => {
        const msg = err instanceof Error ? err.message : String(err)
        setError(msg)
        setResources(MOCK_RESOURCES)
        setAdvisor(MOCK_ADVISOR)
        setSubscriptions([])
        setIsLive(false)
      })
      .finally(() => setLoading(false))
  }, [token])

  return <Ctx.Provider value={{ resources, advisor, subscriptions, loading, error, isLive }}>{children}</Ctx.Provider>
}

export function useAtlasDataContext() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useAtlasDataContext outside provider')
  return c
}
