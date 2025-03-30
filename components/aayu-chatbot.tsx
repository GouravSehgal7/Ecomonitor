"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mic, MicOff, Send, X, Bot, Loader2, Volume2, VolumeX } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { saveHealthProfile, getHealthProfile } from "@/app/actions/health-profile-actions"
import { useToast } from "@/components/ui/use-toast"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

interface UserHealthProfile {
  age?: number
  conditions?: string[]
  location?: string
  isSet: boolean
}

// Define SpeechRecognition interface
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
  interface SpeechRecognition extends EventTarget {
    continuous: boolean
    interimResults: boolean
    lang: string
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null
    onend: ((this: SpeechRecognition, ev: Event) => any) | null
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null
    start: () => void
    stop: () => void
  }

  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList
  }

  interface SpeechRecognitionResultList {
    [index: number]: SpeechRecognitionResult
    length: number
    item(index: number): SpeechRecognitionResult
  }

  interface SpeechRecognitionResult {
    [index: number]: SpeechRecognitionAlternative
    length: number
    item(index: number): SpeechRecognitionAlternative
    isFinal: boolean
  }

  interface SpeechRecognitionAlternative {
    transcript: string
    confidence: number
  }

  interface SpeechRecognitionErrorEvent extends Event {
    error: SpeechRecognitionError
  }

  type SpeechRecognitionError =
    | "no-speech"
    | "aborted"
    | "audio-capture"
    | "network"
    | "not-allowed"
    | "service-not-allowed"
    | "bad-grammar"
    | "language-not-supported"
}

export function AayuChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content:
        "Hello! I'm Aayu, your environmental assistant. I can provide personalized health recommendations based on environmental conditions. How can I help you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [speechRecognition, setSpeechRecognition] = useState<SpeechRecognition | null>(null)
  const [isSpeechSupported, setIsSpeechSupported] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [recognitionError, setRecognitionError] = useState<string | null>(null)

  const [healthProfile, setHealthProfile] = useState<UserHealthProfile>({
    isSet: false,
  })
  const [isSettingHealthProfile, setIsSettingHealthProfile] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null)

  const { toast } = useToast()
  const [userId, setUserId] = useState<string | null>(null)

  // Add this useEffect to get the user ID from localStorage
  useEffect(() => {
    // Try to get user ID from localStorage
    const storedUserId = localStorage.getItem("userId")
    if (storedUserId) {
      setUserId(storedUserId)

      // Fetch health profile if user ID exists
      const fetchHealthProfile = async () => {
        if (storedUserId) {
          const result = await getHealthProfile(storedUserId)
          if (result.success && result.data) {
            setHealthProfile({
              age: result.data.age,
              conditions: result.data.conditions,
              location: result.data.location,
              isSet: true,
            })
          }
        }
      }

      fetchHealthProfile()
    } else {
      // Generate a random user ID if none exists
      const newUserId = "user_" + Math.random().toString(36).substring(2, 15)
      localStorage.setItem("userId", newUserId)
      setUserId(newUserId)
    }

    // Check if speech synthesis is supported
    if (typeof window !== "undefined") {
      setIsSpeechSupported(
        ("speechSynthesis" in window && "SpeechRecognition" in window) || "webkitSpeechRecognition" in window,
      )
    }
  }, [])

  // Initialize speech recognition with improved error handling
  useEffect(() => {
    if (typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        const recognition = new SpeechRecognition()

        // Configure recognition
        recognition.continuous = false
        recognition.interimResults = true
        recognition.lang = "en-US"
        recognition.maxAlternatives = 3

        // Handle results with confidence scoring
        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let finalTranscript = ""
          let interimTranscript = ""

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              // Get the most confident result
              const alternatives = Array.from({ length: event.results[i].length }, (_, j) => ({
                transcript: event.results[i][j].transcript,
                confidence: event.results[i][j].confidence,
              })).sort((a, b) => b.confidence - a.confidence)

              finalTranscript += alternatives[0].transcript
            } else {
              interimTranscript += event.results[i][0].transcript
            }
          }

          if (finalTranscript) {
            setInput(finalTranscript.trim())
            // Auto-submit after voice input if we have a final result
            setTimeout(() => {
              handleSendMessage(finalTranscript.trim())
            }, 500)
          } else if (interimTranscript) {
            // Show interim results while speaking
            setInput(interimTranscript.trim())
          }
        }

        recognition.onend = () => {
          setIsListening(false)
        }

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          let errorMessage = "Speech recognition error"

          // Provide more specific error messages
          switch (event.error) {
            case "no-speech":
              errorMessage = "No speech detected. Please try again."
              break
            case "audio-capture":
              errorMessage = "Microphone not detected. Please check your device."
              break
            case "not-allowed":
              errorMessage = "Microphone access denied. Please allow microphone access."
              break
            case "network":
              errorMessage = "Network error occurred. Please check your connection."
              break
            case "aborted":
              errorMessage = "Speech recognition aborted."
              break
            default:
              errorMessage =` Speech recognition error: ${event.error}`
          }

          setRecognitionError(errorMessage)
          console.error(errorMessage)

          // Show toast for errors except aborted (which is normal when stopping)
          if (event.error !== "aborted") {
            toast({
              title: "Voice Recognition Error",
              description: errorMessage,
              variant: "destructive",
            })
          }

          setIsListening(false)
        }

        setSpeechRecognition(recognition)
      } catch (error) {
        console.error("Error initializing speech recognition:", error)
        setIsSpeechSupported(false)
      }
    } else {
      setIsSpeechSupported(false)
    }
  }, [toast])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  // Clean up speech synthesis when component unmounts
  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  // Add this function to generate health alerts based on current conditions and user profile
  const generateHealthAlert = (): string | null => {
    if (!healthProfile.isSet) return null

    const alerts = []

    // Check for respiratory conditions during poor air quality
    const hasRespiratoryCondition = healthProfile.conditions?.some((condition) =>
      ["asthma", "copd", "bronchitis", "emphysema", "lung", "respiratory"].some((term) =>
        condition.toLowerCase().includes(term),
      ),
    )

    if (hasRespiratoryCondition) {
      alerts.push(
        "⚠ HEALTH ALERT: Air quality is currently poor (AQI 218). With your respiratory condition, you should stay indoors and use air purifiers. Consider wearing an N95 mask if you must go outside.",
      )
    }

    // Check for skin conditions during high UV
    const hasSkinCondition = healthProfile.conditions?.some((condition) =>
      ["skin", "eczema", "psoriasis", "dermatitis", "melanoma"].some((term) => condition.toLowerCase().includes(term)),
    )

    if (hasSkinCondition) {
      alerts.push(
        "⚠ HEALTH ALERT: UV index is very high (8) today. With your skin condition, avoid direct sun exposure and use SPF 50+ sunscreen if you must go outside.",
      )
    }

    // Check for cardiovascular conditions during high pollution
    const hasCardiovascularCondition = healthProfile.conditions?.some((condition) =>
      ["heart", "hypertension", "blood pressure", "cardiovascular", "cholesterol"].some((term) =>
        condition.toLowerCase().includes(term),
      ),
    )

    if (hasCardiovascularCondition) {
      alerts.push(
        "⚠ HEALTH ALERT: Current pollution levels may affect your cardiovascular health. Avoid strenuous outdoor activities and monitor your blood pressure regularly.",
      )
    }

    // Check for age-related vulnerabilities
    const isElderly = healthProfile.age ? healthProfile.age >= 65 : false
    const isChild = healthProfile.age ? healthProfile.age <= 12 : false

    if (isElderly) {
      alerts.push(
        "⚠ HEALTH ALERT: As someone in your age group, you may be more vulnerable to current environmental conditions. Limit outdoor exposure and stay hydrated.",
      )
    }

    if (isChild) {
      alerts.push(
        "⚠ HEALTH ALERT: Children are particularly vulnerable to current air quality conditions. Limit outdoor playtime and ensure proper hydration.",
      )
    }

    return alerts.length > 0 ? alerts.join("\n\n") : null
  }

  // Add this to the toggleChatbot function to show health alerts when opening the chatbot
  const toggleChatbot = () => {
    const newIsOpen = !isOpen
    setIsOpen(newIsOpen)

    // Show health alert when opening the chatbot if profile is set
    if (newIsOpen && healthProfile.isSet) {
      const healthAlert = generateHealthAlert()

      if (healthAlert) {
        // Add a slight delay to show the alert after the chatbot opens
        setTimeout(() => {
          const alertMessage: Message = {
            id: Date.now().toString(),
            content: healthAlert,
            role: "assistant",
            timestamp: new Date(),
          }

          setMessages((prev) => [...prev, alertMessage])
        }, 500)
      }
    }
  }

  const startHealthProfileSetup = () => {
    setIsSettingHealthProfile(true)
    setCurrentQuestion("age")

    // Add assistant message to start the health profile setup
    const assistantMessage: Message = {
      id: Date.now().toString(),
      content: "I'd like to provide personalized health recommendations based on your profile. What's your age?",
      role: "assistant",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, assistantMessage])
  }

  const handleSendMessage = async (messageText = input) => {
    if (!messageText.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageText,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsProcessing(true)

    try {
      let response: string

      // Handle health profile setup flow
      if (isSettingHealthProfile) {
        response = handleHealthProfileSetup(messageText)
      } else {
        // Process the message and generate a response
        response = await generateResponse(messageText)
      }

      // Add assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Speak the response if audio is enabled and it's not too long
      if (audioEnabled && response.length < 200) {
        speakText(response)
      }
    } catch (error) {
      console.error("Error generating response:", error)

      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I encountered an error. Please try again.",
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsProcessing(false)
    }
  }

  const handleHealthProfileSetup = (userInput: string): string => {
    const input = userInput.trim().toLowerCase()

    if (currentQuestion === "age") {
      const age = Number.parseInt(input.replace(/\D/g, ""))

      if (isNaN(age) || age <= 0 || age > 120) {
        return "I couldn't understand that age. Please enter a valid age (e.g., 35)."
      }

      setHealthProfile((prev) => ({ ...prev, age }))
      setCurrentQuestion("conditions")
      return "Thank you! Do you have any health conditions I should be aware of? For example: asthma, diabetes, heart disease, etc. (separate multiple conditions with commas)"
    }

    if (currentQuestion === "conditions") {
      let conditions: string[] = []

      if (input !== "no" && input !== "none") {
        conditions = userInput
          .split(",")
          .map((condition) => condition.trim())
          .filter((condition) => condition.length > 0)
      }

      setHealthProfile((prev) => ({ ...prev, conditions }))
      setCurrentQuestion("location")
      return "Great! What's your current location? This helps me provide more accurate recommendations."
    }

    if (currentQuestion === "location") {
      // Save health profile to database if user ID exists
      if (userId) {
        const updatedProfile = {
          ...healthProfile,
          location: userInput.trim(),
          userId,
        }

        saveHealthProfile(updatedProfile)
          .then((result:any) => {
            if (result.success) {
              toast({
                title: "Health profile saved",
                description: "Your health profile has been saved successfully.",
              })
            } else {
              console.error("Failed to save health profile")
            }
          })
          .catch((error:any) => {
            console.error("Error saving health profile:", error)
          })
      }

      setHealthProfile((prev) => ({
        ...prev,
        location: userInput.trim(),
        isSet: true,
      }))
      setIsSettingHealthProfile(false)
      setCurrentQuestion(null)

      return `Thank you! Your health profile is now set up. I'll provide personalized recommendations based on your age${healthProfile.age ? ` (${healthProfile.age})` : ""}, health conditions${healthProfile.conditions && healthProfile.conditions.length > 0 ? ` (${healthProfile.conditions.join(", ")})` : " (none)"}, and location (${userInput.trim()}). You can ask me for health recommendations anytime!`
    }

    // Fallback
    setIsSettingHealthProfile(false)
    setCurrentQuestion(null)
    return "I've saved your information. You can now ask me for personalized recommendations!"
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleListening = () => {
    if (!speechRecognition || !isSpeechSupported) {
      toast({
        title: "Speech Recognition Not Available",
        description: "Your browser doesn't support speech recognition or microphone access is denied.",
        variant: "destructive",
      })
      return
    }

    if (isListening) {
      speechRecognition.stop()
      setIsListening(false)
    } else {
      // Clear any previous errors
      setRecognitionError(null)

      try {
        setIsListening(true)
        speechRecognition.start()

        // Add a safety timeout in case onend doesn't fire
        setTimeout(() => {
          if (isListening) {
            setIsListening(false)
          }
        }, 10000)
      } catch (error) {
        console.error("Error starting speech recognition:", error)
        setIsListening(false)
        toast({
          title: "Speech Recognition Error",
          description: "Failed to start speech recognition. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  // Toggle audio output
  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled)

    // If currently speaking, stop it
    if (isSpeaking && "speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }

    toast({
      title: audioEnabled ? "Voice Output Disabled" : "Voice Output Enabled",
      description: audioEnabled ? "Aayu will no longer speak responses." : "Aayu will now speak responses.",
    })
  }

  // Generate response based on user input
  const generateResponse = async (message: string): Promise<string> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const lowerMessage = message.toLowerCase()

    // Check if user wants to set up health profile
    if (
      (lowerMessage.includes("set up") && lowerMessage.includes("health profile")) ||
      (lowerMessage.includes("health information") &&
        (lowerMessage.includes("add") || lowerMessage.includes("update"))) ||
      (lowerMessage.includes("my health") && lowerMessage.includes("details"))
    ) {
      startHealthProfileSetup()
      return "I'll help you set up your health profile."
    }

    // Update the generateResponse function to handle health profile updates
    // Add this condition to the generateResponse function, after the existing health profile setup check
    if (
      (lowerMessage.includes("update") || lowerMessage.includes("change")) &&
      (lowerMessage.includes("health profile") || lowerMessage.includes("health information"))
    ) {
      startHealthProfileSetup()
      return (
        "Let's update your health profile. " + (healthProfile.isSet ? "Your current information will be replaced." : "")
      )
    }

    // Add a condition to show the current health profile
    if (
      (lowerMessage.includes("show") || lowerMessage.includes("view") || lowerMessage.includes("what is")) &&
      (lowerMessage.includes("health profile") ||
        lowerMessage.includes("my profile") ||
        lowerMessage.includes("my health"))
    ) {
      if (!healthProfile.isSet) {
        startHealthProfileSetup()
        return "You don't have a health profile set up yet. Let's create one now."
      }

      return (
       ` Here's your current health profile:\n\n +
        Age: ${healthProfile.age || "Not specified"}\n +
        Health Conditions: ${healthProfile.conditions && healthProfile.conditions.length > 0 ? healthProfile.conditions.join(", ") : "None"}\n +
        Location: ${healthProfile.location || "Not specified"}\n\n +
        You can update this information by saying "update my health profile".`
      )
    }

    // Add this condition to the generateResponse function
    if (
      (lowerMessage.includes("emergency") || lowerMessage.includes("urgent")) &&
      (lowerMessage.includes("advice") || lowerMessage.includes("help"))
    ) {
      if (!healthProfile.isSet) {
        return "For emergency health advice, please contact emergency services immediately by dialing 102 or 108. If you set up your health profile, I can provide more personalized emergency guidance in the future."
      }

      let emergencyAdvice =
        "If you're experiencing a medical emergency, please contact emergency services immediately by dialing 102 or 108. Based on your health profile, here's some additional guidance:\n\n"

      const hasRespiratoryCondition = healthProfile.conditions?.some((condition) =>
        ["asthma", "copd", "bronchitis", "emphysema", "lung", "respiratory"].some((term) =>
          condition.toLowerCase().includes(term),
        ),
      )

      const hasCardiovascularCondition = healthProfile.conditions?.some((condition) =>
        ["heart", "hypertension", "blood pressure", "cardiovascular", "cholesterol"].some((term) =>
          condition.toLowerCase().includes(term),
        ),
      )

      const hasDiabetes = healthProfile.conditions?.some((condition) => condition.toLowerCase().includes("diabetes"))

      if (hasRespiratoryCondition) {
        emergencyAdvice +=
          "- For respiratory distress: Use your prescribed inhaler or medication. Sit upright, loosen tight clothing, and try to breathe slowly through pursed lips.\n\n"
      }

      if (hasCardiovascularCondition) {
        emergencyAdvice +=
          "- For chest pain: Sit down and rest immediately. If you have prescribed nitroglycerin, take it as directed. If pain persists for more than a few minutes, call emergency services.\n\n"
      }

      if (hasDiabetes) {
        emergencyAdvice +=
          "- For hypoglycemia: Consume 15-20 grams of fast-acting carbohydrates (juice, honey, glucose tablets). Check blood sugar after 15 minutes and repeat if necessary.\n\n"
      }

      emergencyAdvice +=
        "Remember, this advice is not a substitute for professional medical care. Always seek immediate medical attention in emergencies."

      return emergencyAdvice
    }

    // Handle voice commands
    if (
      lowerMessage.includes("turn on voice") ||
      lowerMessage.includes("enable voice") ||
      lowerMessage.includes("speak to me")
    ) {
      setAudioEnabled(true)
      return "Voice output is now enabled. I will speak my responses."
    }

    if (
      lowerMessage.includes("turn off voice") ||
      lowerMessage.includes("disable voice") ||
      lowerMessage.includes("stop speaking") ||
      lowerMessage.includes("be quiet")
    ) {
      setAudioEnabled(false)
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel()
      }
      return "Voice output is now disabled. I will not speak my responses."
    }

    // Check if user is asking for personalized recommendations
    if (
      (lowerMessage.includes("recommendation") ||
        lowerMessage.includes("advice") ||
        lowerMessage.includes("suggest")) &&
      (lowerMessage.includes("health") || lowerMessage.includes("personal") || lowerMessage.includes("me"))
    ) {
      if (!healthProfile.isSet) {
        startHealthProfileSetup()
        return "To provide personalized recommendations, I need to know a bit about your health profile first."
      }

      return generateHealthRecommendation()
    }

    // Simple rule-based responses (existing code)
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
      return "Hello! How can I assist you with environmental monitoring today?"
    }

    if (lowerMessage.includes("air quality") || lowerMessage.includes("aqi")) {
      const baseResponse =
        "The current Air Quality Index (AQI) in your area is in the 'Poor' category with a value of 218. I recommend limiting outdoor activities today."

      if (healthProfile.isSet) {
        return baseResponse + getPersonalizedAirQualityAdvice()
      }

      return baseResponse
    }

    if (lowerMessage.includes("water quality")) {
      const baseResponse =
        "The water quality parameters are within safe limits, except for TDS which is slightly elevated at 520 mg/L (safe limit is 500 mg/L)."

      if (healthProfile.isSet) {
        return baseResponse + getPersonalizedWaterQualityAdvice()
      }

      return baseResponse
    }

    if (lowerMessage.includes("uv") || lowerMessage.includes("uv index")) {
      const baseResponse =
        "The current UV index is 8, which is in the 'Very High' category. Please use sunscreen and protective clothing if going outdoors."

      if (healthProfile.isSet) {
        return baseResponse + getPersonalizedUVAdvice()
      }

      return baseResponse
    }

    if (lowerMessage.includes("traffic")) {
      return "Current traffic congestion is at 75% in your area. Major congestion reported on NH-48 near Dhaula Kuan."
    }

    if (lowerMessage.includes("register") || lowerMessage.includes("sign up")) {
      return "You can register for our service by clicking on the 'Register' button in the navigation menu or by clicking on 'Get Notifications' button."
    }

    if (lowerMessage.includes("notification") || lowerMessage.includes("alert")) {
      return "We provide real-time notifications for air quality, water quality, UV index, and traffic conditions. You can customize your notification preferences in your profile settings."
    }

    if (lowerMessage.includes("thank")) {
      return "You're welcome! If you have any more questions about environmental monitoring or health recommendations, feel free to ask."
    }

    if (lowerMessage.includes("help")) {
      return "I can help you with information about air quality, water quality, UV index, traffic conditions, and provide personalized health recommendations. What would you like to know about?"
    }

    // Default response
    return "I'm not sure how to respond to that. I can provide information about air quality, water quality, UV index, traffic conditions, or help you navigate our monitoring system. I can also provide personalized health recommendations if you share your health profile with me."
  }

  const generateHealthRecommendation = (): string => {
    let recommendation =` Based on your health profile (Age: ${healthProfile.age || "unknown"}, Conditions: ${healthProfile.conditions && healthProfile.conditions.length > 0 ? healthProfile.conditions.join(", ") : "none"}), here are my personalized recommendations:\n\n`

    // Add air quality recommendations
    recommendation += "🌬 Air Quality: " + getPersonalizedAirQualityAdvice() + "\n\n"

    // Add water quality recommendations
    recommendation += "💧 Water Quality: " + getPersonalizedWaterQualityAdvice() + "\n\n"

    // Add UV recommendations
    recommendation += "☀ UV Protection: " + getPersonalizedUVAdvice() + "\n\n"

    // Add general health recommendations
    recommendation += "🏥 General Health: " + getGeneralHealthAdvice()

    return recommendation
  }

  const getPersonalizedAirQualityAdvice = (): string => {
    const hasRespiratoryCondition = healthProfile.conditions?.some((condition) =>
      ["asthma", "copd", "bronchitis", "emphysema", "lung", "respiratory"].some((term) =>
        condition.toLowerCase().includes(term),
      ),
    )

    const isElderly = healthProfile.age ? healthProfile.age >= 65 : false
    const isChild = healthProfile.age ? healthProfile.age <= 12 : false

    if (hasRespiratoryCondition) {
      return " Since you have respiratory conditions, I strongly advise staying indoors with air purifiers running. Consider wearing an N95 mask if you must go outside."
    } else if (isElderly) {
      return " As someone in your age group, you should minimize outdoor activities until air quality improves. Your respiratory system may be more sensitive to pollutants."
    } else if (isChild) {
      return " Children are particularly vulnerable to air pollution. Please limit outdoor playtime and ensure proper hydration."
    } else {
      return " Consider using an air purifier indoors and wearing a mask when outside for extended periods."
    }
  }

  const getPersonalizedWaterQualityAdvice = (): string => {
    const hasDigestiveCondition = healthProfile.conditions?.some((condition) =>
      ["ibs", "crohn", "colitis", "digestive", "stomach", "gastro", "kidney"].some((term) =>
        condition.toLowerCase().includes(term),
      ),
    )

    if (hasDigestiveCondition) {
      return " With your digestive health conditions, I recommend using a water purifier with reverse osmosis to remove excess TDS. Avoid tap water until levels normalize."
    } else {
      return " Consider using a basic water filter to reduce TDS levels for drinking water."
    }
  }

  const getPersonalizedUVAdvice = (): string => {
    const hasSkinCondition = healthProfile.conditions?.some((condition) =>
      ["skin", "eczema", "psoriasis", "dermatitis", "melanoma"].some((term) => condition.toLowerCase().includes(term)),
    )

    const isElderly = healthProfile.age ? healthProfile.age >= 65 : false

    if (hasSkinCondition) {
      return " With your skin condition, you should be extra cautious. Use SPF 50+ sunscreen, wear long-sleeved clothing, and avoid direct sun exposure between 10 AM and 4 PM."
    } else if (isElderly) {
      return " As we age, our skin becomes more susceptible to UV damage. Apply SPF 30+ sunscreen every 2 hours and wear protective clothing and a wide-brimmed hat."
    } else {
      return " Apply SPF 30+ sunscreen 20 minutes before going outside and reapply every 2 hours."
    }
  }

  const getGeneralHealthAdvice = (): string => {
    const hasCardiovascularCondition = healthProfile.conditions?.some((condition) =>
      ["heart", "hypertension", "blood pressure", "cardiovascular", "cholesterol"].some((term) =>
        condition.toLowerCase().includes(term),
      ),
    )

    const hasDiabetes = healthProfile.conditions?.some((condition) => condition.toLowerCase().includes("diabetes"))

    let advice =
      "Stay hydrated and maintain a balanced diet rich in antioxidants to help your body cope with environmental stressors."

    if (hasCardiovascularCondition) {
      advice +=
        " With your cardiovascular condition, monitor your blood pressure regularly and avoid strenuous outdoor activities during high pollution days."
    }

    if (hasDiabetes) {
      advice +=
        " For diabetic individuals, extreme weather and pollution can affect blood sugar levels. Monitor your levels more frequently during poor air quality days."
    }

    return advice
  }

  // Improved text-to-speech function with better voice selection and error handling
  const speakText = (text: string) => {
    if (!audioEnabled) return

    if ("speechSynthesis" in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      try {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = "en-US"
        utterance.rate = 1.0
        utterance.pitch = 1.0

        // Try to select a female voice if available
        const voices = window.speechSynthesis.getVoices()
        const femaleVoice = voices.find(
          (voice) =>
            voice.name.includes("female") ||
            voice.name.includes("Samantha") ||
            voice.name.includes("Google UK English Female") ||
            voice.name.includes("Microsoft Zira"),
        )

        if (femaleVoice) {
          utterance.voice = femaleVoice
        }

        // Set event handlers
        utterance.onstart = () => {
          setIsSpeaking(true)
        }

        utterance.onend = () => {
          setIsSpeaking(false)
        }

        utterance.onerror = (event) => {
          console.error("Speech synthesis error:", event)
          setIsSpeaking(false)
        }

        window.speechSynthesis.speak(utterance)
      } catch (error) {
        console.error("Error with speech synthesis:", error)
        setIsSpeaking(false)
      }
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chatbot button */}
      <Button
        onClick={toggleChatbot}
        className={cn(
          "h-14 w-14 rounded-full shadow-lg",
          isOpen ? "bg-red-500 hover:bg-red-600" : "bg-blue-600 hover:bg-blue-700",
        )}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </Button>

      {/* Chatbot interface */}
      {isOpen && (
        <Card className="absolute bottom-16 right-0 w-80 md:w-96 shadow-xl bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="bg-blue-600 text-white p-3 flex flex-row items-center justify-between rounded-t-lg">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 bg-blue-800">
                <Bot className="h-5 w-5" />
              </Avatar>
              <div>
                <h3 className="font-medium">Aayu</h3>
                <p className="text-xs text-blue-100">Environmental Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleAudio}
                className="text-white hover:bg-blue-700"
                title={audioEnabled ? "Disable voice" : "Enable voice"}
              >
                {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={toggleChatbot} className="text-white hover:bg-blue-700">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-3 h-80 overflow-y-auto bg-white/5">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "rounded-lg px-3 py-2 max-w-[80%] text-sm",
                      message.role === "user" ? "bg-blue-600 text-white" : "bg-white/20 text-white",
                    )}
                  >
                    {message.content}
                    <div className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="rounded-lg px-3 py-2 bg-white/20 text-white">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              {recognitionError && (
                <div className="flex justify-center">
                  <div className="rounded-lg px-3 py-2 bg-red-500/20 text-white text-xs">{recognitionError}</div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>

          <CardFooter className="p-2 border-t border-white/10 bg-white/5">
            <div className="flex items-center w-full gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleListening}
                className={cn(
                  "text-white",
                  isListening ? "bg-red-500 hover:bg-red-600" : "hover:bg-white/10",
                  !isSpeechSupported && "opacity-50 cursor-not-allowed",
                )}
                disabled={!isSpeechSupported}
                title={
                  isSpeechSupported
                    ? isListening
                      ? "Stop listening"
                      : "Start voice input"
                    : "Speech recognition not supported"
                }
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>

              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={isListening ? "Listening..." : "Type a message..."}
                disabled={isListening}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />

              <Button
                onClick={() => handleSendMessage()}
                disabled={!input.trim() || isProcessing}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}