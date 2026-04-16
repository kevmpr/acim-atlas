import type { AzureResource, AdvisorRecommendation } from '../types/atlas'

// Subscriptions
const SUBS = [
  { id: 'sub-prod-001', name: 'Production' },
  { id: 'sub-dev-002',  name: 'Development' },
  { id: 'sub-qa-003',   name: 'QA/Staging' },
  { id: 'sub-shared-004', name: 'Shared Services' },
]

const LOCATIONS = [
  'eastus', 'eastus2', 'westus2', 'centralus',
  'brazilsouth', 'canadacentral',
  'westeurope', 'northeurope', 'uksouth',
  'southeastasia', 'australiaeast',
]

const RESOURCE_TYPES = [
  'microsoft.compute/virtualmachines',
  'microsoft.storage/storageaccounts',
  'microsoft.network/virtualnetworks',
  'microsoft.network/networksecuritygroups',
  'microsoft.network/publicipaddresses',
  'microsoft.keyvault/vaults',
  'microsoft.sql/servers',
  'microsoft.sql/servers/databases',
  'microsoft.web/sites',
  'microsoft.web/serverfarms',
  'microsoft.containerservice/managedclusters',
  'microsoft.insights/components',
  'microsoft.cache/redis',
  'microsoft.servicebus/namespaces',
  'microsoft.eventhub/namespaces',
  'microsoft.network/loadbalancers',
  'microsoft.network/applicationgateways',
  'microsoft.documentdb/databaseaccounts',
  'microsoft.cognitiveservices/accounts',
  'microsoft.logic/workflows',
]

const RGS = ['rg-app-prod', 'rg-data-prod', 'rg-network-prod', 'rg-security', 'rg-dev-app', 'rg-dev-data', 'rg-qa-app', 'rg-shared-infra', 'rg-monitoring', 'rg-backup']

function randomFrom<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length]
}

function makeTags(seed: number): Record<string, string> {
  if (seed % 3 === 0) return {} // ~33% untagged
  const tags: Record<string, string> = { Environment: seed % 4 === 0 ? 'Production' : seed % 4 === 1 ? 'Development' : seed % 4 === 2 ? 'QA' : 'Shared' }
  if (seed % 2 === 0) tags['CostCenter'] = `CC-${(seed % 5) + 1}00`
  if (seed % 7 === 0) tags['Owner'] = `team-${seed % 4 === 0 ? 'platform' : seed % 4 === 1 ? 'backend' : seed % 4 === 2 ? 'data' : 'security'}`
  return tags
}

export const MOCK_RESOURCES: AzureResource[] = Array.from({ length: 247 }, (_, i) => {
  const sub = SUBS[i % SUBS.length]
  const type = randomFrom(RESOURCE_TYPES, i * 7 + 3)
  const location = randomFrom(LOCATIONS, i * 13 + 5)
  const rg = RGS[i % RGS.length]
  return {
    id: `/subscriptions/${sub.id}/resourceGroups/${rg}/providers/${type}/res-${i.toString().padStart(4, '0')}`,
    name: `res-${i.toString().padStart(4, '0')}`,
    type,
    location,
    subscriptionId: sub.id,
    subscriptionName: sub.name,
    resourceGroup: rg,
    tags: makeTags(i),
    provisioningState: i % 20 === 0 ? 'Failed' : 'Succeeded',
  }
})

export const MOCK_ADVISOR: AdvisorRecommendation[] = [
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `adv-high-${i}`,
    category: ['Security', 'Cost', 'Reliability'][i % 3],
    impact: 'High' as const,
    resourceId: MOCK_RESOURCES[i].id,
    description: ['Enable MFA for privileged accounts', 'Resize underutilized VM', 'Add redundancy to single-instance resources', 'Enable soft delete on Key Vault'][i % 4],
  })),
  ...Array.from({ length: 28 }, (_, i) => ({
    id: `adv-med-${i}`,
    category: ['OperationalExcellence', 'Performance', 'Cost'][i % 3],
    impact: 'Medium' as const,
    resourceId: MOCK_RESOURCES[i + 12].id,
    description: ['Enable diagnostic logs', 'Use reserved instances', 'Enable auto-scaling', 'Upgrade SDK version'][i % 4],
  })),
  ...Array.from({ length: 19 }, (_, i) => ({
    id: `adv-low-${i}`,
    category: ['Cost', 'OperationalExcellence'][i % 2],
    impact: 'Low' as const,
    resourceId: MOCK_RESOURCES[i + 40].id,
    description: ['Remove unused public IPs', 'Apply resource tags', 'Enable backup policy'][i % 3],
  })),
]
