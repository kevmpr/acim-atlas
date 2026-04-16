export interface AtlasStep {
  target: string
  title: string
  description: string
  position: 'top' | 'bottom' | 'left' | 'right'
}

export function buildAtlasSteps(): AtlasStep[] {
  const steps: AtlasStep[] = []
  const vis = (el: Element | null) => el && (el as HTMLElement).offsetParent !== null

  // 1. KPI Inventory row
  const kpiInv = document.querySelector('[data-atlas="kpi-inventory"]')
  if (vis(kpiInv)) steps.push({
    target: '[data-atlas="kpi-inventory"]',
    title: 'Métricas de inventario',
    description: 'Total de recursos, suscripciones activas, resource groups y tipos de recursos únicos en tiempo real desde Azure Resource Graph.',
    position: 'bottom',
  })

  // 2. KPI Health row
  const kpiHealth = document.querySelector('[data-atlas="kpi-health"]')
  if (vis(kpiHealth)) steps.push({
    target: '[data-atlas="kpi-health"]',
    title: 'Métricas de salud',
    description: 'Porcentaje de recursos sin tags y conteo de recomendaciones de Advisor por nivel de impacto (Alto, Medio, Bajo).',
    position: 'bottom',
  })

  // 3. Compliance Score
  const compliance = document.querySelector('[data-atlas="compliance-score"]')
  if (vis(compliance)) steps.push({
    target: '[data-atlas="compliance-score"]',
    title: 'Compliance Score',
    description: 'Puntuación de gobernanza de 0 a 100 basada en cobertura de tags y recomendaciones críticas de Advisor.',
    position: 'left',
  })

  // 4. Filter bar
  const filterBar = document.querySelector('[data-atlas="filter-bar"]')
  if (vis(filterBar)) steps.push({
    target: '[data-atlas="filter-bar"]',
    title: 'Filtros globales',
    description: 'Filtrá todos los gráficos y la tabla simultáneamente por suscripción, resource group, región o tipo de recurso. Podés seleccionar múltiples valores.',
    position: 'bottom',
  })

  // 5. Filter subs
  const filterSubs = document.querySelector('[data-atlas="filter-subs"]')
  if (vis(filterSubs)) steps.push({
    target: '[data-atlas="filter-subs"]',
    title: 'Filtro por suscripción',
    description: 'Seleccioná una o más suscripciones. El número en el badge indica cuántas tenés activas. Al hacer clic en las barras del gráfico también se activa este filtro.',
    position: 'bottom',
  })

  // 6. Tag governance
  const tagGov = document.querySelector('[data-atlas="tag-governance"]')
  if (vis(tagGov)) steps.push({
    target: '[data-atlas="tag-governance"]',
    title: 'Gobernanza de Tags',
    description: 'Visualizá qué porcentaje de tus recursos no tiene tags asignados. Un recurso sin tags es difícil de costear y de asignar a equipos.',
    position: 'top',
  })

  // 7. Export button
  const exportBtn = document.querySelector('[data-atlas="export-btn"]')
  if (vis(exportBtn)) steps.push({
    target: '[data-atlas="export-btn"]',
    title: 'Exportar reporte',
    description: 'Descargá un CSV con todos los recursos sin tags. Es el reporte de incumplimiento que necesitás para identificar qué equipos deben corregir su gobernanza.',
    position: 'top',
  })

  // 8. Resource table
  const table = document.querySelector('[data-atlas="resource-table"]')
  if (vis(table)) steps.push({
    target: '[data-atlas="resource-table"]',
    title: 'Inventario completo',
    description: 'Tabla paginada con todos tus recursos de Azure. Podés buscar por nombre, tipo, resource group o suscripción, y hacer clic en cualquier fila para ver todos sus detalles y tags.',
    position: 'top',
  })

  // 9. Table search
  const search = document.querySelector('[data-atlas="table-search"]')
  if (vis(search)) steps.push({
    target: '[data-atlas="table-search"]',
    title: 'Búsqueda instantánea',
    description: 'Buscá recursos por nombre, tipo, resource group, suscripción o región. Los resultados se filtran en tiempo real.',
    position: 'top',
  })

  if (steps.length === 0) {
    steps.push({
      target: 'body',
      title: 'Atlas',
      description: 'Activá un Service Principal desde el Shell para comenzar a ver tus recursos de Azure.',
      position: 'bottom',
    })
  }

  return steps
}
