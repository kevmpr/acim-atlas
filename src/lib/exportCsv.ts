import type { AzureResource } from '../types/atlas'

export function exportUntaggedToCsv(resources: AzureResource[]) {
  const headers = ['Name', 'Type', 'ResourceGroup', 'Subscription', 'Location', 'ProvisioningState']
  const rows = resources.map(r => [
    r.name,
    r.type,
    r.resourceGroup,
    r.subscriptionName,
    r.location,
    r.provisioningState ?? '',
  ])
  const csv = [headers, ...rows].map(row => row.map(v => `"${v}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `untagged-resources-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
