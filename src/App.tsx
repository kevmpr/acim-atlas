import { AtlasDashboard } from './components/AtlasDashboard'
import { FilterProvider } from './context/FilterContext'
import { AtlasDataProvider } from './context/AtlasDataContext'

interface Props { token: string | null; tenantId: string | null }

export default function App({ token, tenantId: _tenantId }: Props) {
  return (
    <AtlasDataProvider token={token}>
      <FilterProvider>
        <div className="min-h-screen bg-background text-foreground">
          <AtlasDashboard />
        </div>
      </FilterProvider>
    </AtlasDataProvider>
  )
}
