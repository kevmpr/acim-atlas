import { useAtlasData } from '../hooks/useAtlasData'
import { KPICards } from './KPICards'
import { FilterBar } from './FilterBar'
import { ResourcesBySubscription } from './ResourcesBySubscription'
import { TopResourceTypes } from './TopResourceTypes'
import { AdvisorChart } from './AdvisorChart'
import { RegionBubbles } from './RegionBubbles'
import { TagGovernance } from './TagGovernance'
import { ResourceTable } from './ResourceTable'

export function AtlasDashboard() {
  const {
    filteredResources,
    kpi,
    bySubscription,
    byType,
    byLocation,
    advisorByImpact,
    untaggedResources,
    availableOptions,
  } = useAtlasData()

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Atlas</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Gobernanza y visibilidad de recursos Azure · {filteredResources.length} recursos activos
        </p>
      </div>

      {/* Filters */}
      <FilterBar options={availableOptions} />

      {/* KPIs */}
      <KPICards kpi={kpi} />

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResourcesBySubscription data={bySubscription} subscriptions={availableOptions.subscriptions} />
        <TopResourceTypes data={byType} />
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AdvisorChart data={advisorByImpact} />
        <RegionBubbles data={byLocation} />
        <TagGovernance untagged={untaggedResources} total={filteredResources.length} />
      </div>

      {/* Resource table */}
      <ResourceTable resources={filteredResources} />
    </div>
  )
}
