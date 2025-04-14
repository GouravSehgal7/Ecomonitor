"use client"

import { useState } from "react"
import {
  Bar,
  BarChart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for monthly water quality trends
const monthlyData = [
  { month: "Jan", ph: 7.2, tds: 320, hardness: 180, chlorine: 1.8 },
  { month: "Feb", ph: 7.3, tds: 340, hardness: 190, chlorine: 1.9 },
  { month: "Mar", ph: 7.1, tds: 310, hardness: 175, chlorine: 1.7 },
  { month: "Apr", ph: 7.4, tds: 350, hardness: 200, chlorine: 2.0 },
  { month: "May", ph: 7.6, tds: 380, hardness: 220, chlorine: 2.2 },
  { month: "Jun", ph: 7.8, tds: 420, hardness: 240, chlorine: 2.5 },
  { month: "Jul", ph: 7.9, tds: 450, hardness: 260, chlorine: 2.8 },
  { month: "Aug", ph: 8.0, tds: 470, hardness: 270, chlorine: 3.0 },
  { month: "Sep", ph: 7.7, tds: 430, hardness: 250, chlorine: 2.6 },
  { month: "Oct", ph: 7.5, tds: 400, hardness: 230, chlorine: 2.3 },
  { month: "Nov", ph: 7.3, tds: 360, hardness: 210, chlorine: 2.1 },
  { month: "Dec", ph: 7.2, tds: 330, hardness: 190, chlorine: 1.9 },
]

// Mock data for seasonal comparison
const seasonalData = [
  { season: "Winter", ph: 7.2, tds: 330, hardness: 185, chlorine: 1.9, rainfall: 50 },
  { season: "Spring", ph: 7.3, tds: 340, hardness: 190, chlorine: 1.9, rainfall: 120 },
  { season: "Summer", ph: 7.8, tds: 450, hardness: 260, chlorine: 2.8, rainfall: 200 },
  { season: "Monsoon", ph: 7.9, tds: 470, hardness: 270, chlorine: 3.0, rainfall: 350 },
  { season: "Autumn", ph: 7.5, tds: 400, hardness: 230, chlorine: 2.3, rainfall: 150 },
]

// Mock data for source comparison
const sourceData = [
  { source: "Municipal", ph: 7.4, tds: 350, hardness: 200, chlorine: 2.5 },
  { source: "Groundwater", ph: 7.8, tds: 520, hardness: 310, chlorine: 0.8 },
  { source: "Rainwater", ph: 6.8, tds: 120, hardness: 80, chlorine: 0.2 },
  { source: "Bottled", ph: 7.2, tds: 180, hardness: 120, chlorine: 0.5 },
]

export function WaterQualityTrends() {
  const [tooltipData, setTooltipData] = useState<any>(null)

  return (
    <div className="space-y-6">
      <Tabs defaultValue="monthly">
        <TabsList className="grid w-full grid-cols-3 bg-white/10 text-white">
          <TabsTrigger value="monthly" className="data-[state=active]:bg-white/20 max-sm:text-[3vw]">
            Monthly Trends
          </TabsTrigger>
          <TabsTrigger value="seasonal" className="data-[state=active]:bg-white/20 max-sm:text-[3vw]">
            Seasonal Impact
          </TabsTrigger>
          <TabsTrigger value="source" className="data-[state=active]:bg-white/20 max-sm:text-[2.5vw]">
            Source Comparison
          </TabsTrigger>
        </TabsList>

        <TabsContent value="monthly" className="pt-4">
          <div className="space-y-4">
            <p className="text-sm text-white/80">
              Monthly water quality trends over the past year show seasonal variations in all parameters. TDS and
              hardness increase during summer months due to lower water levels and higher mineral concentration.
            </p>

            <ChartContainer height={350}>
              <LineChart
                data={monthlyData}
                onMouseLeave={() => setTooltipData(null)}
                onMouseMove={(data) => {
                  if (data && data.activePayload) {
                    setTooltipData(data.activePayload[0].payload)
                  }
                }}
              >
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "rgba(255, 255, 255, 0.7)" }} />
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  label={{
                    value: "pH",
                    position: "insideLeft",
                    angle: -90,
                    dy: 50,
                    fill: "rgba(255, 255, 255, 0.7)",
                  }}
                  domain={[6, 9]}
                  tick={{ fontSize: 12, fill: "rgba(255, 255, 255, 0.7)" }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  label={{
                    value: "TDS (mg/L)",
                    position: "insideRight",
                    angle: 90,
                    dy: -50,
                    fill: "rgba(255, 255, 255, 0.7)",
                  }}
                  domain={[0, 500]}
                  tick={{ fontSize: 12, fill: "rgba(255, 255, 255, 0.7)" }}
                />
                <Line yAxisId="left" type="monotone" dataKey="ph" stroke="#00FFFF" strokeWidth={3} name="pH" />
                <Line yAxisId="right" type="monotone" dataKey="tds" stroke="#FF00FF" strokeWidth={3} name="TDS" />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      className="bg-black/80 border-white/20"
                      items={[
                        {
                          label: "Month",
                          value: tooltipData?.month,
                          color: "transparent",
                        },
                        {
                          label: "pH",
                          value: tooltipData?.ph,
                          color: "#6366f1",
                        },
                        {
                          label: "TDS",
                          value: tooltipData?.tds + " mg/L",
                          color: "#8b5cf6",
                        },
                        {
                          label: "Hardness",
                          value: tooltipData?.hardness + " mg/L",
                          color: "#ec4899",
                        },
                        {
                          label: "Chlorine",
                          value: tooltipData?.chlorine + " mg/L",
                          color: "#14b8a6",
                        },
                      ]}
                    />
                  }
                />
              </LineChart>
            </ChartContainer>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="p-2 bg-indigo-500/20 rounded-md border border-indigo-500/20 text-center">
                <div className="text-xs text-white/70">pH Range</div>
                <div className="text-sm font-medium text-white">7.1 - 8.0</div>
              </div>
              <div className="p-2 bg-violet-500/20 rounded-md border border-violet-500/20 text-center">
                <div className="text-xs text-white/70">TDS Range</div>
                <div className="text-sm font-medium text-white">310 - 470 mg/L</div>
              </div>
              <div className="p-2 bg-pink-500/20 rounded-md border border-pink-500/20 text-center">
                <div className="text-xs text-white/70">Hardness Range</div>
                <div className="text-sm font-medium text-white">175 - 270 mg/L</div>
              </div>
              <div className="p-2 bg-teal-500/20 rounded-md border border-teal-500/20 text-center">
                <div className="text-xs text-white/70">Chlorine Range</div>
                <div className="text-sm font-medium text-white">1.7 - 3.0 mg/L</div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="seasonal" className="pt-4">
          <div className="space-y-4">
            <p className="text-sm text-white/80">
              Seasonal variations significantly impact water quality. Monsoon season shows the highest TDS and chlorine
              levels, likely due to increased runoff and higher disinfection requirements.
            </p>

            <ChartContainer height={350}>
              <BarChart
                data={seasonalData}
                onMouseLeave={() => setTooltipData(null)}
                onMouseMove={(data) => {
                  if (data && data.activePayload) {
                    setTooltipData(data.activePayload[0].payload)
                  }
                }}
              >
                <XAxis dataKey="season" tick={{ fontSize: 12, fill: "rgba(255, 255, 255, 0.7)" }} />
                <YAxis tick={{ fontSize: 12, fill: "rgba(255, 255, 255, 0.7)" }} />
                <Bar dataKey="tds" name="TDS" fill="#FF00FF" />
                <Bar dataKey="hardness" name="Hardness" fill="#FFFF00" />
                <Bar dataKey="rainfall" name="Rainfall (mm)" fill="#00FFFF" />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      className="bg-black/80 border-white/20"
                      items={[
                        {
                          label: "Season",
                          value: tooltipData?.season,
                          color: "transparent",
                        },
                        {
                          label: "pH",
                          value: tooltipData?.ph,
                          color: "#6366f1",
                        },
                        {
                          label: "TDS",
                          value: tooltipData?.tds + " mg/L",
                          color: "#8b5cf6",
                        },
                        {
                          label: "Hardness",
                          value: tooltipData?.hardness + " mg/L",
                          color: "#ec4899",
                        },
                        {
                          label: "Chlorine",
                          value: tooltipData?.chlorine + " mg/L",
                          color: "#14b8a6",
                        },
                        {
                          label: "Rainfall",
                          value: tooltipData?.rainfall + " mm",
                          color: "#0ea5e9",
                        },
                      ]}
                    />
                  }
                />
              </BarChart>
            </ChartContainer>

            <div className="p-3 bg-blue-500/20 rounded-md border border-blue-500/20">
              <h3 className="text-sm font-medium text-white mb-1">Seasonal Impact Analysis</h3>
              <ul className="text-xs text-white/80 space-y-1 list-disc pl-4">
                <li>Monsoon season shows 42% higher TDS levels compared to winter</li>
                <li>Chlorine dosage increases by 58% during monsoon to counter microbial contamination</li>
                <li>pH levels are most stable during winter and spring months</li>
                <li>Water hardness correlates strongly with seasonal rainfall patterns</li>
              </ul>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="source" className="pt-4">
          <div className="space-y-4">
            <p className="text-sm text-white/80">
              Different water sources show distinct quality profiles. Groundwater typically has higher TDS and hardness
              but lower chlorine levels compared to municipal water.
            </p>

            <ChartContainer height={350}>
              <BarChart
                data={sourceData}
                onMouseLeave={() => setTooltipData(null)}
                onMouseMove={(data) => {
                  if (data && data.activePayload) {
                    setTooltipData(data.activePayload[0].payload)
                  }
                }}
              >
                <XAxis dataKey="source" tick={{ fontSize: 12, fill: "rgba(255, 255, 255, 0.7)" }} />
                <YAxis tick={{ fontSize: 12, fill: "rgba(255, 255, 255, 0.7)" }} />
                <Bar dataKey="tds" name="TDS" fill="#FF00FF" />
                <Bar dataKey="hardness" name="Hardness" fill="#FFFF00" />
                <Bar dataKey="chlorine" name="Chlorine" fill="#00FF00" />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      className="bg-black/80 border-white/20"
                      items={[
                        {
                          label: "Source",
                          value: tooltipData?.source,
                          color: "transparent",
                        },
                        {
                          label: "pH",
                          value: tooltipData?.ph,
                          color: "#6366f1",
                        },
                        {
                          label: "TDS",
                          value: tooltipData?.tds + " mg/L",
                          color: "#8b5cf6",
                        },
                        {
                          label: "Hardness",
                          value: tooltipData?.hardness + " mg/L",
                          color: "#ec4899",
                        },
                        {
                          label: "Chlorine",
                          value: tooltipData?.chlorine + " mg/L",
                          color: "#14b8a6",
                        },
                      ]}
                    />
                  }
                />
              </BarChart>
            </ChartContainer>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-blue-500/20 rounded-md border border-blue-500/20">
                <h3 className="text-sm font-medium text-white mb-1">Municipal Water</h3>
                <p className="text-xs text-white/80">
                  Treated water with balanced mineral content and controlled chlorine levels for disinfection. Generally
                  meets all safety standards but quality can vary by neighborhood and season.
                </p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-md border border-purple-500/20">
                <h3 className="text-sm font-medium text-white mb-1">Groundwater</h3>
                <p className="text-xs text-white/80">
                  Higher mineral content resulting in elevated TDS and hardness. May contain natural contaminants like
                  fluoride or arsenic in some regions. Requires testing before consumption.
                </p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-md border border-green-500/20">
                <h3 className="text-sm font-medium text-white mb-1">Rainwater</h3>
                <p className="text-xs text-white/80">
                  Naturally soft with low mineral content. May be slightly acidic. Requires proper collection and
                  storage to prevent contamination. Not typically chlorinated.
                </p>
              </div>
              <div className="p-3 bg-amber-500/20 rounded-md border border-amber-500/20">
                <h3 className="text-sm font-medium text-white mb-1">Bottled Water</h3>
                <p className="text-xs text-white/80">
                  Processed water with controlled mineral content. Quality varies by brand and source. Usually has
                  minimal chlorine and moderate hardness levels.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

