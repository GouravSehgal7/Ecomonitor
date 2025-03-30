"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Droplets, Heart, Utensils } from "lucide-react"
import { AirQualityChart } from "@/components/air-quality-chart"
import { HealthAnimation } from "@/components/health-animation"
import { NavigationBar } from "@/components/navigation-bar"

export default function RecommendationsPage() {
  const [age, setAge] = useState<string>("")
  const [healthCondition, setHealthCondition] = useState<string>("")
  const [showRecommendations, setShowRecommendations] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowRecommendations(true)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-indigo-900 via-purple-800 to-pink-700">
      <HealthAnimation />
      <NavigationBar />

      <div className="container relative mx-auto py-6 pt-20 space-y-6 z-10">
        <h1 className="text-3xl font-bold tracking-tight text-white">Personalized Recommendations</h1>

        {!showRecommendations ? (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Your Health Profile</CardTitle>
              <CardDescription className="text-white/70">
                Tell us about yourself to get personalized air quality recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-white">
                    Age Group
                  </Label>
                  <Select value={age} onValueChange={setAge} required>
                    <SelectTrigger id="age" className="bg-white/10 text-white border-white/20">
                      <SelectValue placeholder="Select your age group" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/80 border-white/20 text-white">
                      <SelectItem value="child">Child (0-12)</SelectItem>
                      <SelectItem value="teen">Teen (13-19)</SelectItem>
                      <SelectItem value="adult">Adult (20-59)</SelectItem>
                      <SelectItem value="senior">Senior (60+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Do you have any health conditions?</Label>
                  <RadioGroup
                    value={healthCondition}
                    onValueChange={setHealthCondition}
                    required
                    className="text-white"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="none" id="none" className="border-white/50 text-white" />
                      <Label htmlFor="none">None</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="respiratory" id="respiratory" className="border-white/50 text-white" />
                      <Label htmlFor="respiratory">Respiratory (Asthma, COPD, etc.)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="cardiovascular"
                        id="cardiovascular"
                        className="border-white/50 text-white"
                      />
                      <Label htmlFor="cardiovascular">Cardiovascular</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="allergies" id="allergies" className="border-white/50 text-white" />
                      <Label htmlFor="allergies">Allergies</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" className="border-white/50 text-white" />
                      <Label htmlFor="other">Other</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  Get Personalized Recommendations
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Your Personalized Air Quality Recommendations</CardTitle>
                <CardDescription className="text-white/70">
                  Based on your {age} age group and{" "}
                  {healthCondition === "none" ? "no health conditions" : healthCondition + " condition"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="outdoor">
                  <TabsList className="grid w-full grid-cols-3 bg-white/10 text-white">
                    <TabsTrigger value="outdoor" className="data-[state=active]:bg-white/20">
                      Outdoor Activity
                    </TabsTrigger>
                    <TabsTrigger value="health" className="data-[state=active]:bg-white/20">
                      Health Measures
                    </TabsTrigger>
                    <TabsTrigger value="nutrition" className="data-[state=active]:bg-white/20">
                      Nutrition
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="outdoor" className="space-y-4 pt-4">
                    <div className="rounded-lg border border-white/20 p-4 bg-white/5 backdrop-blur-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-5 w-5 text-purple-400" />
                        <h3 className="font-medium text-white">Best Times for Outdoor Activities</h3>
                      </div>

                      <AirQualityChart />

                      <div className="mt-4 space-y-2">
                        <p className="text-sm font-medium text-white">Recommended outdoor hours today:</p>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="rounded-md bg-green-500/20 p-2 text-green-100">
                            <p className="text-sm font-medium">6:00 AM - 8:00 AM</p>
                            <p className="text-xs">AQI: 85 (Moderate)</p>
                          </div>
                          <div className="rounded-md bg-green-500/20 p-2 text-green-100">
                            <p className="text-sm font-medium">7:00 PM - 9:00 PM</p>
                            <p className="text-xs">AQI: 92 (Moderate)</p>
                          </div>
                        </div>
                      </div>

                      {healthCondition === "respiratory" && (
                        <div className="mt-4 rounded-md bg-amber-500/20 p-3 text-amber-100">
                          <p className="text-sm font-medium">Special Note for Respiratory Conditions:</p>
                          <p className="text-xs mt-1">
                            Even during "moderate" air quality periods, consider wearing an N95 mask and limiting
                            outdoor exposure to 30 minutes.
                          </p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="health" className="space-y-4 pt-4">
                    <div className="rounded-lg border border-white/20 p-4 bg-white/5 backdrop-blur-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Heart className="h-5 w-5 text-pink-400" />
                        <h3 className="font-medium text-white">Health Protection Measures</h3>
                      </div>

                      <ul className="space-y-2 mt-2">
                        <li className="flex items-start gap-2">
                          <div className="mt-1 h-2 w-2 rounded-full bg-purple-400" />
                          <p className="text-sm text-white">Use air purifiers with HEPA filters indoors</p>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="mt-1 h-2 w-2 rounded-full bg-purple-400" />
                          <p className="text-sm text-white">Wear N95/KN95 masks when AQI exceeds 150</p>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="mt-1 h-2 w-2 rounded-full bg-purple-400" />
                          <p className="text-sm text-white">
                            Keep windows closed during high pollution hours (10 AM - 4 PM)
                          </p>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="mt-1 h-2 w-2 rounded-full bg-purple-400" />
                          <p className="text-sm text-white">
                            Monitor symptoms and use prescribed medications as needed
                          </p>
                        </li>
                      </ul>

                      {healthCondition === "respiratory" && (
                        <div className="mt-4 rounded-md bg-amber-500/20 p-3 text-amber-100">
                          <p className="text-sm font-medium">For Respiratory Conditions:</p>
                          <ul className="space-y-1 mt-1 text-xs">
                            <li>• Keep rescue inhalers accessible at all times</li>
                            <li>• Consider using a peak flow meter to monitor lung function</li>
                            <li>• Consult your doctor about adjusting medication during high pollution days</li>
                          </ul>
                        </div>
                      )}

                      {healthCondition === "cardiovascular" && (
                        <div className="mt-4 rounded-md bg-amber-500/20 p-3 text-amber-100">
                          <p className="text-sm font-medium">For Cardiovascular Conditions:</p>
                          <ul className="space-y-1 mt-1 text-xs">
                            <li>• Monitor blood pressure more frequently during high pollution days</li>
                            <li>• Reduce physical exertion when AQI exceeds 100</li>
                            <li>• Stay well-hydrated to maintain healthy blood viscosity</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="nutrition" className="space-y-4 pt-4">
                    <div className="rounded-lg border border-white/20 p-4 bg-white/5 backdrop-blur-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Utensils className="h-5 w-5 text-green-400" />
                        <h3 className="font-medium text-white">Nutrition & Hydration Recommendations</h3>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <h4 className="text-sm font-medium mb-2 text-white">Recommended Foods</h4>
                          <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                              <div className="mt-1 h-2 w-2 rounded-full bg-green-400" />
                              <p className="text-sm text-white">Antioxidant-rich fruits (berries, citrus)</p>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="mt-1 h-2 w-2 rounded-full bg-green-400" />
                              <p className="text-sm text-white">Leafy greens (spinach, kale)</p>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="mt-1 h-2 w-2 rounded-full bg-green-400" />
                              <p className="text-sm text-white">Omega-3 rich foods (flaxseeds, walnuts)</p>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="mt-1 h-2 w-2 rounded-full bg-green-400" />
                              <p className="text-sm text-white">Turmeric and ginger (anti-inflammatory)</p>
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium mb-2 text-white">Hydration Guide</h4>
                          <div className="flex items-center gap-2 mb-2">
                            <Droplets className="h-4 w-4 text-blue-400" />
                            <p className="text-sm text-white">
                              {age === "child" && "1-1.5 liters of water daily"}
                              {age === "teen" && "2-2.5 liters of water daily"}
                              {age === "adult" && "2.5-3 liters of water daily"}
                              {age === "senior" && "2-2.5 liters of water daily"}
                            </p>
                          </div>
                          <p className="text-xs text-white/70">
                            Increase intake by 500ml on high pollution days to help flush toxins
                          </p>
                          <div className="mt-2 rounded-md bg-blue-500/20 p-2 text-blue-100 text-xs">
                            <p>Tip: Herbal teas and fresh fruit juices also count toward daily fluid intake</p>
                          </div>
                        </div>
                      </div>

                      {(healthCondition === "respiratory" || healthCondition === "allergies") && (
                        <div className="mt-4 rounded-md bg-amber-500/20 p-3 text-amber-100">
                          <p className="text-sm font-medium">Special Dietary Recommendations:</p>
                          <ul className="space-y-1 mt-1 text-xs">
                            <li>• Vitamin C and E supplements may help reduce inflammation</li>
                            <li>• Consider adding N-Acetylcysteine (NAC) supplements after consulting your doctor</li>
                            <li>• Limit dairy consumption which may increase mucus production</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Button
              onClick={() => setShowRecommendations(false)}
              variant="outline"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              Update Health Profile
            </Button>
          </div>
        )}

        <div><a href="https://www.google.com/search?q=hospital+near+me&rlz=1C1RXQR_enIN1090IN1090&oq=hospital+near+me&gs_lcrp=EgZjaHJvbWUyDwgAEEUYORixAxjJAxiABDINCAEQABiSAxiABBiKBTINCAIQABiSAxiABBiKBTIHCAMQABiABDIHCAQQABiABDIHCAUQABiABDIHCAYQABiABDIHCAcQABiABDIHCAgQABiABDIHCAkQABiABNIBCDQ3OTRqMGo3qAIAsAIA&sourceid=chrome&ie=UTF-8&dlnr=1&ved=2ahUKEwiV0dnokrKMAxW_wzgGHRWTETgQl6ENegQIDBAG" >Health care near me click me</a></div>
      </div>
    </div>
  )
}

