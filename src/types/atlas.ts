export interface AzureResource {
  id: string
  name: string
  type: string           // e.g. "microsoft.compute/virtualmachines"
  location: string       // e.g. "eastus"
  subscriptionId: string
  subscriptionName: string
  resourceGroup: string
  tags: Record<string, string>
  sku?: string
  kind?: string
  provisioningState?: string
}

export interface AdvisorRecommendation {
  id: string
  category: string       // Cost, Security, Reliability, OperationalExcellence, Performance
  impact: 'High' | 'Medium' | 'Low'
  resourceId: string
  description: string
  impactedField?: string
}

export interface AtlasFilters {
  subscriptionIds: string[]
  resourceGroups: string[]
  locations: string[]
  resourceTypes: string[]
}

export interface KPIData {
  totalResources: number
  activeSubscriptions: number
  untaggedPercent: number
  advisorHigh: number
  advisorMedium: number
  advisorLow: number
}
