import { AtlasDashboard } from './components/AtlasDashboard'
import { FilterProvider } from './context/FilterContext'

export default function App() {
  return (
    <FilterProvider>
      <div className="min-h-screen bg-background text-foreground">
        <AtlasDashboard />
      </div>
    </FilterProvider>
  )
}
