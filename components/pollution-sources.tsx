"use client"

import { useState } from "react"
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from "recharts"

// Update the data colors to be more vibrant
const data = [
  { name: "Traffic", value: 45, color: "#FF0000" }, // Bright red
  { name: "Industries", value: 30, color: "#FF9900" }, // Bright orange
  { name: "Construction", value: 15, color: "#FFFF00" }, // Bright yellow
  { name: "Household", value: 10, color: "#00FF00" }, // Bright green
]

export function PollutionSources() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }

  const onPieLeave = () => {
    setActiveIndex(null)
  }

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180))
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180))

    return (
      <text
        x={x}
        y={y}
        fill="#fff"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
        fontWeight={activeIndex === index ? "bold" : "normal"}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke={activeIndex === index ? "#fff" : "transparent"}
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                border: "none",
                borderRadius: "4px",
                color: "#fff",
              }}
              formatter={(value: number) => [`${value}%`, "Contribution"]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3 text-white">
        <h3 className="text-lg font-medium">Major Contributors</h3>
        <div className="space-y-2">
          {data.map((source, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }} />
                <span>{source.name}</span>
              </div>
              <span className="font-medium">{source.value}%</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-white/70 mt-2">
          Traffic is the leading contributor to air pollution in Delhi, followed by industrial emissions.
        </p>
      </div>
    </div>
  )
}

