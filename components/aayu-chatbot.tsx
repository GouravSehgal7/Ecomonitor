"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mic, MicOff, Send, X, Bot, Loader2 } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
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
      content: "Hello! I'm Aayu, your environmental assistant. How can I help you today?",
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

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = "en-US"

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript
        setInput(transcript)
        // Auto-submit after voice input
        setTimeout(() => {
          handleSendMessage(transcript)
        }, 500)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.onerror = (event: Event) => {
        console.error("Speech recognition error", event)
        setIsListening(false)
      }

      setSpeechRecognition(recognition)
    }
  }, [])

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

  const toggleChatbot = () => {
    setIsOpen(!isOpen)
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
      // Process the message and generate a response
      const response = await generateResponse(messageText)

      // Add assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Speak the response if it's not too long
      if (response.length < 200) {
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleListening = () => {
    if (!speechRecognition) return

    if (isListening) {
      speechRecognition.stop()
      setIsListening(false)
    } else {
      setIsListening(true)
      speechRecognition.start()
    }
  }

  // Generate response based on user input
  const generateResponse = async (message: string): Promise<string> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const lowerMessage = message.toLowerCase()

    // Simple rule-based responses
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
      return "Hello! How can I assist you with environmental monitoring today?"
    }

    if (lowerMessage.includes("air quality") || lowerMessage.includes("aqi")) {
      return "The current Air Quality Index (AQI) in your area is in the 'Poor' category with a value of 218. I recommend limiting outdoor activities today."
    }

    if (lowerMessage.includes("water quality")) {
      return "The water quality parameters are within safe limits, except for TDS which is slightly elevated at 520 mg/L (safe limit is 500 mg/L)."
    }

    if (lowerMessage.includes("uv") || lowerMessage.includes("uv index")) {
      return "The current UV index is 8, which is in the 'Very High' category. Please use sunscreen and protective clothing if going outdoors."
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
      return "You're welcome! If you have any more questions about environmental monitoring, feel free to ask."
    }

    if (lowerMessage.includes("help")) {
      return "I can help you with information about air quality, water quality, UV index, traffic conditions, and how to use our monitoring system. What would you like to know about?"
    }

    // Default response
    return "I'm not sure how to respond to that. I can provide information about air quality, water quality, UV index, traffic conditions, or help you navigate our monitoring system."
  }

  // Text-to-speech function
  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "en-US"
      utterance.rate = 1.0
      window.speechSynthesis.speak(utterance)
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
            <Button variant="ghost" size="icon" onClick={toggleChatbot} className="text-white hover:bg-blue-700">
              <X className="h-4 w-4" />
            </Button>
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
              <div ref={messagesEndRef} />
            </div>
          </CardContent>

          <CardFooter className="p-2 border-t border-white/10 bg-white/5">
            <div className="flex items-center w-full gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleListening}
                className={cn("text-white", isListening ? "bg-red-500 hover:bg-red-600" : "hover:bg-white/10")}
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

