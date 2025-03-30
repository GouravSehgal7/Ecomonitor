"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Droplet, FlaskRoundIcon as Flask, AlertTriangle, BugIcon as Bacteria, Leaf, Beaker, Skull } from "lucide-react"

interface WaterParameter {
  name: string
  icon: React.ReactNode
  description: string
  safeRange: string
  effects: {
    safe: string
    moderate: string
    unsafe: string
  }
  sources: string[]
  treatments: string[]
}

const waterParameters: WaterParameter[] = [
  {
    name: "pH",
    icon: <Beaker className="h-8 w-8 text-blue-400" />,
    description: "Measure of how acidic or basic water is on a scale of 0-14.",
    safeRange: "6.5-8.5",
    effects: {
      safe: "Optimal for drinking and aquatic life.",
      moderate: "May cause mild taste issues and minor pipe corrosion.",
      unsafe: "Can cause digestive issues, metal leaching from pipes, and damage to aquatic life.",
    },
    sources: ["Natural minerals in water", "Industrial waste", "Mining activities", "Acid rain"],
    treatments: [
      "Neutralization with lime or soda ash for acidic water",
      "Addition of acids for basic water",
      "Water filtration systems",
    ],
  },
  {
    name: "TDS (Total Dissolved Solids)",
    icon: <Droplet className="h-8 w-8 text-blue-400" />,
    description: "Measure of all dissolved substances in water, including minerals, salts, and metals.",
    safeRange: "< 500 mg/L",
    effects: {
      safe: "Good mineral content, pleasant taste.",
      moderate: "Noticeable taste, possible scaling on pipes and appliances.",
      unsafe: "Unpleasant taste, excessive scaling, potential health effects from specific contaminants.",
    },
    sources: ["Natural minerals from soil and rocks", "Urban runoff", "Agricultural runoff", "Wastewater discharges"],
    treatments: ["Reverse osmosis", "Distillation", "Ion exchange", "Carbon filtration"],
  },
  {
    name: "Hardness",
    icon: <Flask className="h-8 w-8 text-blue-400" />,
    description: "Measure of calcium and magnesium dissolved in water, expressed as mg/L of calcium carbonate (CaCO₃).",
    safeRange: "< 300 mg/L",
    effects: {
      safe: "No significant effects, good mineral content.",
      moderate: "Scale buildup in pipes and appliances, reduced soap effectiveness.",
      unsafe: "Excessive scaling, appliance damage, very poor soap lathering.",
    },
    sources: ["Limestone and chalk deposits", "Soil and rock minerals", "Industrial discharges"],
    treatments: [
      "Water softeners (ion exchange)",
      "Reverse osmosis",
      "Magnetic water conditioners",
      "Chemical precipitation",
    ],
  },
  {
    name: "Chlorine",
    icon: <Beaker className="h-8 w-8 text-green-400" />,
    description: "Disinfectant added to water to kill harmful bacteria and viruses.",
    safeRange: "0.2-4 mg/L",
    effects: {
      safe: "Effective disinfection without noticeable taste or odor.",
      moderate: "Noticeable chlorine taste and odor.",
      unsafe:
        "Strong chlorine taste and odor, potential respiratory and skin irritation, formation of harmful byproducts.",
    },
    sources: ["Added during water treatment", "Municipal water disinfection"],
    treatments: [
      "Activated carbon filtration",
      "Letting water stand (chlorine will evaporate)",
      "UV treatment as alternative disinfection",
    ],
  },
  {
    name: "Bacteria",
    icon: <Bacteria className="h-8 w-8 text-red-400" />,
    description: "Microorganisms that can cause disease, measured in Colony Forming Units (CFU) per 100mL.",
    safeRange: "0 CFU/100mL for E. coli",
    effects: {
      safe: "No health effects.",
      moderate: "Potential for mild gastrointestinal issues in sensitive individuals.",
      unsafe: "Gastrointestinal illness, infections, serious health risks especially for vulnerable populations.",
    },
    sources: ["Sewage contamination", "Animal waste", "Inadequate water treatment", "Biofilm in pipes"],
    treatments: ["Chlorination", "UV disinfection", "Ozonation", "Boiling water", "Membrane filtration"],
  },
  {
    name: "Nitrates",
    icon: <Leaf className="h-8 w-8 text-green-400" />,
    description: "Compounds containing nitrogen that can indicate agricultural runoff or sewage contamination.",
    safeRange: "< 10 mg/L",
    effects: {
      safe: "No health effects.",
      moderate: "Generally safe for adults but may be concerning for infants.",
      unsafe: "Can cause blue baby syndrome in infants, potential links to certain cancers with long-term exposure.",
    },
    sources: ["Agricultural fertilizers", "Animal waste", "Sewage leakage", "Natural deposits"],
    treatments: ["Ion exchange", "Reverse osmosis", "Distillation", "Biological denitrification"],
  },
  {
    name: "Heavy Metals",
    icon: <Skull className="h-8 w-8 text-red-400" />,
    description: "Toxic metals like lead, arsenic, mercury that can contaminate water supplies.",
    safeRange: "Varies by metal (e.g., Lead < 0.015 mg/L)",
    effects: {
      safe: "No health effects.",
      moderate: "Potential for bioaccumulation with chronic exposure.",
      unsafe: "Neurological damage, organ failure, developmental issues, cancer risk depending on the metal.",
    },
    sources: [
      "Old plumbing (lead)",
      "Industrial discharges",
      "Mining activities",
      "Natural deposits",
      "Improper waste disposal",
    ],
    treatments: [
      "Reverse osmosis",
      "Activated carbon filtration",
      "Ion exchange",
      "Distillation",
      "Chemical precipitation",
    ],
  },
]

export function PictorialWaterRepresentation() {
  const [selectedParameter, setSelectedParameter] = useState<WaterParameter>(waterParameters[0])

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Water Quality Visual Guide</CardTitle>
        <CardDescription className="text-white/70">
          Understanding water quality parameters and their health impacts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs
          defaultValue={waterParameters[0].name}
          onValueChange={(value) => {
            const param = waterParameters.find((p) => p.name === value)
            if (param) setSelectedParameter(param)
          }}
        >
          <TabsList className="grid grid-cols-4 md:grid-cols-7 bg-white/10 text-white h-auto flex-wrap">
            {waterParameters.map((param) => (
              <TabsTrigger key={param.name} value={param.name} className="data-[state=active]:bg-white/20 py-2">
                {param.name.split(" ")[0]}
              </TabsTrigger>
            ))}
          </TabsList>

          {waterParameters.map((param) => (
            <TabsContent key={param.name} value={param.name} className="pt-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="p-4 rounded-lg mb-4 flex items-center gap-4 bg-blue-500/20">
                    {param.icon}
                    <div>
                      <h3 className="text-white font-bold text-lg">{param.name}</h3>
                      <p className="text-white/70 text-sm">Safe Range: {param.safeRange}</p>
                    </div>
                  </div>

                  <p className="text-white/80 mb-4">{param.description}</p>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-white font-medium mb-2">Health Effects</h4>
                      <div className="space-y-2">
                        <div className="p-2 rounded-md bg-green-500/20">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="h-3 w-3 rounded-full bg-green-500" />
                            <span className="text-white font-medium text-sm">Safe Levels</span>
                          </div>
                          <p className="text-white/80 text-sm">{param.effects.safe}</p>
                        </div>

                        <div className="p-2 rounded-md bg-amber-500/20">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="h-3 w-3 rounded-full bg-amber-500" />
                            <span className="text-white font-medium text-sm">Moderate Levels</span>
                          </div>
                          <p className="text-white/80 text-sm">{param.effects.moderate}</p>
                        </div>

                        <div className="p-2 rounded-md bg-red-500/20">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="h-3 w-3 rounded-full bg-red-500" />
                            <span className="text-white font-medium text-sm">Unsafe Levels</span>
                          </div>
                          <p className="text-white/80 text-sm">{param.effects.unsafe}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-white font-medium mb-2">Common Sources</h4>
                    <ul className="space-y-1">
                      {param.sources.map((source, index) => (
                        <li key={index} className="flex items-start gap-2 text-white/80 text-sm">
                          <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                          <span>{source}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-white font-medium mb-2">Treatment Methods</h4>
                    <ul className="space-y-2">
                      {param.treatments.map((treatment, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 p-2 rounded-md bg-white/10 text-white/90 text-sm"
                        >
                          <div className="h-4 w-4 rounded-full bg-blue-500 mt-0.5 flex-shrink-0" />
                          <span>{treatment}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <h4 className="text-white font-medium mb-2 flex items-center gap-2">
                  <Droplet className="h-5 w-5 text-blue-400" />
                  Visual Representation
                </h4>
                <div className="relative h-16 bg-white/10 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 flex items-center">
                    <div className="h-full w-1/3 bg-green-500/70 flex items-center justify-center">
                      <span className="text-white text-xs font-medium">Safe</span>
                    </div>
                    <div className="h-full w-1/3 bg-amber-500/70 flex items-center justify-center">
                      <span className="text-white text-xs font-medium">Moderate</span>
                    </div>
                    <div className="h-full w-1/3 bg-red-500/70 flex items-center justify-center">
                      <span className="text-white text-xs font-medium">Unsafe</span>
                    </div>
                  </div>

                  <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4">
                    <div className="text-white text-xs">0</div>
                    <div className="text-white text-xs font-medium">
                      {param.safeRange.includes("<")
                        ? param.safeRange.replace("<", "").trim()
                        : param.safeRange.split("-")[1]}
                    </div>
                    <div className="text-white text-xs">{param.name === "pH" ? "14" : "High"}</div>
                  </div>
                </div>
                <p className="mt-2 text-xs text-white/70 text-center">
                  {param.name === "pH"
                    ? "pH scale runs from 0 (very acidic) to 14 (very alkaline), with 7 being neutral"
                    : `${param.name} levels increase from left to right`}
                </p>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="pt-4 border-t border-white/10">
          <h4 className="text-white font-medium mb-2">Water Quality Testing</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 rounded-md bg-white/10">
              <h5 className="text-white font-medium text-sm mb-1">Home Testing</h5>
              <p className="text-white/80 text-xs">
                Use water quality test kits available in stores or online to check basic parameters like pH, hardness,
                chlorine, and some contaminants.
              </p>
            </div>
            <div className="p-3 rounded-md bg-white/10">
              <h5 className="text-white font-medium text-sm mb-1">Professional Testing</h5>
              <p className="text-white/80 text-xs">
                Send water samples to certified laboratories for comprehensive analysis of all parameters, including
                bacteria and heavy metals.
              </p>
            </div>
            <div className="p-3 rounded-md bg-white/10">
              <h5 className="text-white font-medium text-sm mb-1">Municipal Reports</h5>
              <p className="text-white/80 text-xs">
                Check your local water utility's annual water quality reports, which are required by law and detail
                contaminant levels.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

