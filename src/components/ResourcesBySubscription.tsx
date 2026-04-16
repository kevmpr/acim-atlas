import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useFilters } from '../context/FilterContext'

interface Props {
  data: { name: string; count: number }[]
  subscriptions: { id: string; name: string }[]
}

export function ResourcesBySubscription({ data, subscriptions }: Props) {
  const { filters, toggleFilter } = useFilters()

  const handleClick = (entry: { name: string }) => {
    const sub = subscriptions.find(s => s.name === entry.name)
    if (!sub) return
    toggleFilter('subscriptionIds', sub.id)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChartClick = (d: any) => {
    const payload = d?.activePayload as Array<{ payload: { name: string } }> | undefined
    if (payload && payload.length > 0) handleClick(payload[0].payload)
  }

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <h3 className="text-sm font-semibold text-foreground mb-4">Recursos por Suscripción</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={data}
          onClick={handleChartClick}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
          <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
          <Tooltip
            contentStyle={{
              background: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: 8,
              color: 'hsl(var(--foreground))',
            }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} cursor="pointer">
            {data.map((entry) => {
              const sub = subscriptions.find(s => s.name === entry.name)
              const isActive = filters.subscriptionIds.length === 0 || filters.subscriptionIds.includes(sub?.id ?? '')
              return <Cell key={entry.name} fill={isActive ? 'hsl(var(--primary))' : 'hsl(var(--muted))'} />
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
