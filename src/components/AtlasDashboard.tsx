import { useAtlasData } from '../hooks/useAtlasData'
import { KPICards } from './KPICards'
import { FilterBar } from './FilterBar'
import { ResourcesBySubscription } from './ResourcesBySubscription'
import { TopResourceTypes } from './TopResourceTypes'
import { AdvisorChart } from './AdvisorChart'
import { RegionBubbles } from './RegionBubbles'
import { TagGovernance } from './TagGovernance'
import { ResourceTable } from './ResourceTable'
import { ComplianceScore } from './ComplianceScore'

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
    hasToken,
  } = useAtlasData()

  const resourceGroupCount = new Set(filteredResources.map(r => r.resourceGroup)).size
  const resourceTypeCount = new Set(filteredResources.map(r => r.type)).size

  if (!hasToken && !loading) return (
    <div className="flex flex-col items-center justify-center h-screen bg-background gap-4 text-center px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/></svg>
      </div>
      <div>
        <h2 className="text-lg font-semibold text-foreground">Sin Service Principal activo</h2>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs">Activá un SPN en la sección Service Principals del Shell para ver tus recursos reales de Azure.</p>
      </div>
    </div>
  )

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-muted-foreground">Consultando Azure Resource Graph…</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="flex flex-col items-center justify-center h-screen bg-background gap-4 text-center px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      </div>
      <div>
        <h2 className="text-lg font-semibold text-foreground">Error al conectar con Azure</h2>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">{error}</p>
      </div>
    </div>
  )

  if (hasToken && !loading && !error && kpi.totalResources === 0) return (
    <div className="flex flex-col items-center justify-center h-screen bg-background gap-4 text-center px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="M3 3h18v18H3z" opacity=".2"/><path d="M9 9h6v6H9z"/></svg>
      </div>
      <div>
        <h2 className="text-lg font-semibold text-foreground">Sin recursos encontrados</h2>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs">El Service Principal activo no tiene acceso a recursos en Azure, o no hay recursos en las suscripciones disponibles.</p>
      </div>
    </div>
  )

  return (
    <div data-atlas="dashboard" className="p-6 space-y-6 max-w-[1400px] mx-auto">
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

      {/* Filters */}
      <FilterBar options={availableOptions} />

      {/* KPI Rows (2 rows of 4) */}
      <KPICards
        kpi={kpi}
        resourceGroupCount={resourceGroupCount}
        resourceTypeCount={resourceTypeCount}
      />

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResourcesBySubscription data={bySubscription} subscriptions={availableOptions.subscriptions} />
        <TopResourceTypes data={byType} />
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AdvisorChart data={advisorByImpact} />
        <RegionBubbles data={byLocation} />
        <ComplianceScore kpi={kpi} total={filteredResources.length} />
      </div>

      {/* Tag governance */}
      <TagGovernance untagged={untaggedResources} total={filteredResources.length} />

      {/* Resource table */}
      <ResourceTable resources={filteredResources} />
    </div>
  )
}
