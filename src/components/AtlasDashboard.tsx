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
    loading,
    error,
    isLive,
  } = useAtlasData()

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-muted-foreground">Consultando Azure Resource Graph…</p>
      </div>
    </div>
  )

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">Atlas</h1>
            {isLive ? (
              <span className="text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-medium">
                ● Datos en vivo
              </span>
            ) : (
              <span className="text-xs bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300 px-2 py-0.5 rounded-full font-medium">
                ● Demo
              </span>
            )}
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Gobernanza y visibilidad de recursos Azure · {filteredResources.length} recursos activos
          </p>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200 text-xs px-4 py-2 rounded-lg">
          ⚠ No se pudo conectar a Azure Resource Graph — mostrando datos de demostración. ({error})
        </div>
      )}

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
