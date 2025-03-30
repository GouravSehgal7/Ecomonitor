"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AirVentIcon as Lung, AlertTriangle, Heart, Brain, Eye, Baby } from "lucide-react"

interface AQILevel {
  range: string
  category: string
  color: string
  icon: React.ReactNode
  description: string
  healthEffects: string[]
  sensitivePeople: string[]
  recommendations: string[]
}

const aqiLevels: AQILevel[] = [
  {
    range: "0-50",
    category: "Good",
    color: "#10b981", // green-500
    icon: <Lung className="h-8 w-8 text-green-500" />,
    description: "Air quality is satisfactory, and air pollution poses little or no risk.",
    healthEffects: ["Air quality is considered satisfactory", "Air pollution poses little or no risk"],
    sensitivePeople: [],
    recommendations: [
      "Enjoy outdoor activities",
      "Open windows to bring in fresh air",
      "Perfect air quality for everyone",
    ],
  },
  {
    range: "51-100",
    category: "Moderate",
    color: "#f59e0b", // amber-500
    icon: <Lung className="h-8 w-8 text-amber-500" />,
    description:
      "Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.",
    healthEffects: ["May cause minor breathing discomfort to sensitive people"],
    sensitivePeople: ["People with respiratory disorders"],
    recommendations: [
      "Sensitive people should consider reducing prolonged outdoor exertion",
      "Keep windows closed during peak traffic hours",
      "Good air quality for most",
    ],
  },
  {
    range: "101-150",
    category: "Unhealthy for Sensitive Groups",
    color: "#f97316", // orange-500
    icon: <Lung className="h-8 w-8 text-orange-500" />,
    description:
      "Members of sensitive groups may experience health effects. The general public is less likely to be affected.",
    healthEffects: [
      "May cause breathing discomfort to people with lung disease",
      "Can cause respiratory issues during prolonged exposure",
    ],
    sensitivePeople: [
      "Children and older adults",
      "People with heart and lung disease",
      "People who are active outdoors",
    ],
    recommendations: [
      "People with respiratory or heart disease should limit outdoor exertion",
      "Everyone else should limit prolonged outdoor exertion",
      "Keep windows closed",
      "Use air purifiers indoors",
    ],
  },
  {
    range: "151-200",
    category: "Unhealthy",
    color: "#ef4444", // red-500
    icon: <Lung className="h-8 w-8 text-red-500" />,
    description:
      "Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.",
    healthEffects: [
      "Increased likelihood of respiratory symptoms in sensitive individuals",
      "Aggravation of heart or lung disease",
      "Potential for respiratory effects in general population",
    ],
    sensitivePeople: ["Children and older adults", "People with heart and lung disease", "Pregnant women"],
    recommendations: [
      "People with respiratory or heart disease should avoid outdoor exertion",
      "Everyone else should limit outdoor exertion",
      "Run air purifiers",
      "Wear masks outdoors (N95 or better)",
      "Keep all windows closed",
    ],
  },
  {
    range: "201-300",
    category: "Very Unhealthy",
    color: "#8b5cf6", // purple-500
    icon: <Lung className="h-8 w-8 text-purple-500" />,
    description: "Health alert: The risk of health effects is increased for everyone.",
    healthEffects: [
      "Significant increase in respiratory symptoms",
      "Aggravation of heart or lung disease",
      "Premature mortality in people with cardiopulmonary disease",
      "Significant respiratory effects in general population",
    ],
    sensitivePeople: [
      "Everyone, especially children and older adults",
      "People with respiratory and heart conditions",
      "Pregnant women",
      "Outdoor workers",
    ],
    recommendations: [
      "Everyone should avoid outdoor physical activities",
      "Sensitive groups should remain indoors",
      "Use air purifiers on maximum setting",
      "Wear N95 masks if going outdoors is necessary",
      "Consider relocating temporarily if possible",
    ],
  },
  {
    range: "301+",
    category: "Hazardous",
    color: "#7f1d1d", // red-900
    icon: <Lung className="h-8 w-8 text-red-900" />,
    description: "Health warning of emergency conditions: everyone is more likely to be affected.",
    healthEffects: [
      "Serious aggravation of heart or lung disease",
      "Premature mortality risk to people with cardiopulmonary disease and elderly",
      "Serious risk of respiratory effects in general population",
      "Increased risk of premature death",
    ],
    sensitivePeople: [
      "Everyone is considered sensitive at these levels",
      "Extremely dangerous for children, elderly, and those with respiratory or heart conditions",
    ],
    recommendations: [
      "Everyone should avoid all physical activity outdoors",
      "Remain indoors with windows and doors closed",
      "Run multiple air purifiers",
      "Wear N95 masks even indoors if air filtration is inadequate",
      "Evacuate to areas with better air quality if possible",
      "Seek medical attention if experiencing symptoms",
    ],
  },
]

interface AffectedOrgan {
  name: string
  icon: React.ReactNode
  effects: {
    low: string
    medium: string
    high: string
    severe: string
  }
}

const affectedOrgans: AffectedOrgan[] = [
  {
    name: "Lungs",
    icon: <Lung className="h-8 w-8" />,
    effects: {
      low: "No significant effects on healthy lungs.",
      medium: "Mild irritation, coughing in sensitive individuals.",
      high: "Reduced lung function, increased respiratory symptoms.",
      severe: "Severe respiratory distress, aggravated asthma, bronchitis.",
    },
  },
  {
    name: "Heart",
    icon: <Heart className="h-8 w-8" />,
    effects: {
      low: "No significant effects on healthy cardiovascular system.",
      medium: "Slight increase in heart rate and blood pressure.",
      high: "Increased risk of cardiovascular events in vulnerable people.",
      severe: "Significant stress on cardiovascular system, increased risk of heart attacks.",
    },
  },
  {
    name: "Brain",
    icon: <Brain className="h-8 w-8" />,
    effects: {
      low: "No significant effects on cognitive function.",
      medium: "Possible mild headaches, reduced concentration.",
      high: "Headaches, dizziness, reduced cognitive performance.",
      severe: "Neurological symptoms, cognitive impairment, increased stroke risk.",
    },
  },
  {
    name: "Eyes",
    icon: <Eye className="h-8 w-8" />,
    effects: {
      low: "No significant effects on healthy eyes.",
      medium: "Mild irritation, redness in sensitive individuals.",
      high: "Eye irritation, burning sensation, excessive tearing.",
      severe: "Severe irritation, inflammation, blurred vision.",
    },
  },
  {
    name: "Children",
    icon: <Baby className="h-8 w-8" />,
    effects: {
      low: "No significant effects on healthy children.",
      medium: "Mild respiratory symptoms in sensitive children.",
      high: "Increased respiratory symptoms, reduced lung function development.",
      severe: "Severe respiratory effects, long-term impacts on lung development.",
    },
  },
]

export function PictorialAQIRepresentation() {
  const [selectedAQI, setSelectedAQI] = useState<AQILevel>(aqiLevels[5]) // Default to Hazardous based on Delhi data

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Visual AQI Health Impact Guide</CardTitle>
        <CardDescription className="text-white/70">
          Understanding how different AQI levels affect your health
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {aqiLevels.map((level, index) => (
            <button
              key={index}
              onClick={() => setSelectedAQI(level)}
              className={`px-3 py-2 rounded-md text-white text-sm font-medium transition-colors ${
                selectedAQI.category === level.category ? "ring-2 ring-white" : "opacity-70 hover:opacity-100"
              }`}
              style={{ backgroundColor: level.color }}
            >
              {level.category}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div
              className="p-4 rounded-lg mb-4 flex items-center gap-4"
              style={{ backgroundColor: `${selectedAQI.color}30` }}
            >
              {selectedAQI.icon}
              <div>
                <h3 className="text-white font-bold text-lg">{selectedAQI.category}</h3>
                <p className="text-white/70 text-sm">AQI Range: {selectedAQI.range}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-white font-medium mb-2">Health Effects</h4>
                <ul className="space-y-1">
                  {selectedAQI.healthEffects.map((effect, index) => (
                    <li key={index} className="flex items-start gap-2 text-white/80 text-sm">
                      <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <span>{effect}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {selectedAQI.sensitivePeople.length > 0 && (
                <div>
                  <h4 className="text-white font-medium mb-2">Sensitive Groups</h4>
                  <ul className="space-y-1">
                    {selectedAQI.sensitivePeople.map((group, index) => (
                      <li key={index} className="flex items-start gap-2 text-white/80 text-sm">
                        <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                        <span>{group}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-white font-medium mb-2">Recommendations</h4>
            <ul className="space-y-2">
              {selectedAQI.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2 p-2 rounded-md bg-white/10 text-white/90 text-sm">
                  <div className="h-4 w-4 rounded-full bg-blue-500 mt-0.5 flex-shrink-0" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10">
          <h4 className="text-white font-medium mb-4">Organ-Specific Effects</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {affectedOrgans.map((organ, index) => {
              let effectText = ""
              let bgColor = ""

              if (selectedAQI.range === "0-50") {
                effectText = organ.effects.low
                bgColor = "bg-green-500/20"
              } else if (selectedAQI.range === "51-100" || selectedAQI.range === "101-150") {
                effectText = organ.effects.medium
                bgColor = "bg-amber-500/20"
              } else if (selectedAQI.range === "151-200" || selectedAQI.range === "201-300") {
                effectText = organ.effects.high
                bgColor = "bg-red-500/20"
              } else {
                effectText = organ.effects.severe
                bgColor = "bg-purple-500/20"
              }

              return (
                <div key={index} className={`p-3 rounded-md ${bgColor} flex flex-col items-center text-center`}>
                  <div className="mb-2 text-white">{organ.icon}</div>
                  <h5 className="text-white font-medium text-sm mb-1">{organ.name}</h5>
                  <p className="text-white/80 text-xs">{effectText}</p>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

