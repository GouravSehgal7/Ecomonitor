"use client"

import type React from "react"

import { ResponsiveContainer, Line, LineChart, XAxis, YAxis, Tooltip, Bar, BarChart, Legend } from "recharts"

export { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Bar, BarChart, Legend }

interface ChartTooltipContentProps {
  className?: string
  items: {
    label: string
    value: string | number | undefined
    color: string
  }[]
}

export function ChartTooltipContent({ className, items }: ChartTooltipContentProps) {
  return (
    <div className={className}>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2 py-1">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
          <span className="text-sm font-medium">{item.label}:</span>
          <span className="text-sm">{item.value}</span>
        </div>
      ))}
    </div>
  )
}

interface ChartContainerProps {
  children: React.ReactNode
  height?: number
  className?: string
}

export function ChartContainer({ children, height = 300, className }: ChartContainerProps) {
  return (
    <ResponsiveContainer width="100%" height={height} className={className}>
      {children}
    </ResponsiveContainer>
  )
}

interface ChartTooltipProps {
  content: React.ReactNode
}

export function ChartTooltip({ content }: ChartTooltipProps) {
  return <Tooltip cursor={{ stroke: "#6366f1", strokeWidth: 1 }} wrapperStyle={{ outline: "none" }} content={content} />
}

