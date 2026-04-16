import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useFilters } from '../context/FilterContext'

interface Props {
  data: { name: string; count: number; fullType: string }[]
}

export function TopResourceTypes({ data }: Props) {
  const { filters, toggleFilter } = useFilters()

  const handleClick = (entry: { name: string; fullType: string }) => {
    toggleFilter('resourceTypes', entry.fullType)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChartClick = (d: any) => {
    const payload = d?.activePayload as Array<{ payload: { name: string; fullType: string } }> | undefined
    if (payload && payload.length > 0) handleClick(payload[0].payload)
  }

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <h3 className="text-sm font-semibold text-foreground mb-4">Top 10 Tipos de Recursos</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          layout="vertical"
          data={data}
          onClick={handleChartClick}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
          <YAxis
            type="category"
            dataKey="name"
            width={120}
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
          />
          <Tooltip
            contentStyle={{
              background: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: 8,
              color: 'hsl(var(--foreground))',
            }}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} cursor="pointer">
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={filters.resourceTypes.includes(entry.fullType) ? 'hsl(var(--primary))' : 'hsl(217 91% 70%)'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
