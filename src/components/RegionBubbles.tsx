import { Treemap, ResponsiveContainer, Tooltip } from 'recharts'

interface Props {
  data: { name: string; count: number }[]
}

const COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#ec4899', '#14b8a6', '#10b981', '#f59e0b']

interface TreemapContentProps {
  x?: number
  y?: number
  width?: number
  height?: number
  name?: string
  fill?: string
  value?: number
}

function TreemapContent({ x = 0, y = 0, width = 0, height = 0, name = '', fill = '#000', value = 0 }: TreemapContentProps) {
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={fill} rx={4} opacity={0.85} />
      {width > 40 && height > 25 && (
        <>
          <text x={x + width / 2} y={y + height / 2 - 6} textAnchor="middle" fill="white" fontSize={10} fontWeight={600}>{name}</text>
          <text x={x + width / 2} y={y + height / 2 + 8} textAnchor="middle" fill="white" fontSize={10}>{value}</text>
        </>
      )}
    </g>
  )
}

export function RegionBubbles({ data }: Props) {
  const treemapData = data.slice(0, 8).map((d, i) => ({
    name: d.name,
    size: d.count,
    fill: COLORS[i % COLORS.length],
  }))

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <h3 className="text-sm font-semibold text-foreground mb-4">Distribución por Región</h3>
      <ResponsiveContainer width="100%" height={200}>
        <Treemap
          data={treemapData}
          dataKey="size"
          aspectRatio={4 / 3}
          content={<TreemapContent />}
        >
          <Tooltip
            contentStyle={{
              background: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: 8,
              color: 'hsl(var(--foreground))',
            }}
          />
        </Treemap>
      </ResponsiveContainer>
    </div>
  )
}
