const ARG_ENDPOINT = 'https://management.azure.com/providers/Microsoft.ResourceGraph/resources?api-version=2021-03-01'

async function argQuery<T>(token: string, query: string): Promise<T[]> {
  const res = await fetch(ARG_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: query.trim() }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`ARG ${res.status}: ${text}`)
  }
  const json = await res.json()
  return (json.data ?? []) as T[]
}

export interface RawResource {
  id: string; name: string; type: string; location: string
  subscriptionId: string; resourceGroup: string
  tags: Record<string, string> | null; kind?: string
}
export interface RawSubscription { subscriptionId: string; name: string }
export interface RawAdvisor {
  id: string; impact: string; category: string
  description: string; resourceId: string
}

export const fetchResources = (token: string) =>
  argQuery<RawResource>(token, `
    Resources
    | project id, name, type, location, subscriptionId, resourceGroup, tags, kind
    | limit 1000
  `)

export const fetchSubscriptions = (token: string) =>
  argQuery<RawSubscription>(token, `
    ResourceContainers
    | where type == 'microsoft.resources/subscriptions'
    | project subscriptionId, name = tostring(properties.displayName)
  `)

export const fetchAdvisor = (token: string) =>
  argQuery<RawAdvisor>(token, `
    AdvisorResources
    | where type == 'microsoft.advisor/recommendations'
    | project id,
              impact      = tostring(properties.impact),
              category    = tostring(properties.category),
              description = tostring(properties.shortDescription.problem),
              resourceId  = tostring(properties.resourceMetadata.resourceId)
    | limit 500
  `)
