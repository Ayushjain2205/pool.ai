"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Check, ArrowLeft, ArrowRight } from "lucide-react"

interface Question {
  id: number
  text: string
  options: string[]
}

interface TextClassificationTaskProps {
  text: string
  options: string[]
  onProgress: (progress: number) => void
  onComplete: (result: { selectedOptions: Record<number, string> }) => void
}

export function TextClassificationTask({ text, options, onProgress, onComplete }: TextClassificationTaskProps) {
  // Generate 5 questions from the single text
  const [questions] = useState<Question[]>(() => {
    // In a real app, these would be different questions
    // For now, we'll create 5 variations of the same question
    return [
      {
        id: 1,
        text: "I've been using this phone for about a month now. The battery life is impressive and the camera quality is excellent. However, I find the user interface a bit confusing at times.",
        options: ["Positive", "Negative", "Neutral", "Mixed"],
      },
      {
        id: 2,
        text: "The new restaurant downtown has amazing food and atmosphere. The service was a bit slow, but the staff was very friendly and apologetic about the wait.",
        options: ["Positive", "Negative", "Neutral", "Mixed"],
      },
      {
        id: 3,
        text: "This movie was neither good nor bad. The acting was decent, the plot was predictable, and the special effects were average at best.",
        options: ["Positive", "Negative", "Neutral", "Mixed"],
      },
      {
        id: 4,
        text: "I absolutely hated this product. It broke within a week, customer service was unhelpful, and it was way overpriced for the quality.",
        options: ["Positive", "Negative", "Neutral", "Mixed"],
      },
      {
        id: 5,
        text: "The online course exceeded all my expectations! The content was comprehensive, the instructor was knowledgeable, and I learned so much in such a short time.",
        options: ["Positive", "Negative", "Neutral", "Mixed"],
      },
    ]
  })

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>({})

  // Update progress based on how many questions have been answered
  useEffect(() => {
    const answeredCount = Object.keys(selectedOptions).length
    const progressPercentage = (answeredCount / questions.length) * 100
    onProgress(progressPercentage)
  }, [selectedOptions, questions.length, onProgress])

  // Handle option selection
  const handleOptionSelect = (option: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questions[currentQuestionIndex].id]: option,
    }))
  }

  // Navigate to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  // Navigate to previous question
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  // Submit all classifications
  const handleSubmit = () => {
    onComplete({ selectedOptions })
  }

  // Check if all questions have been answered
  const allQuestionsAnswered = Object.keys(selectedOptions).length === questions.length

  // Current question
  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div className="flex flex-col h-full">
      {/* Question navigation */}
      <div className="flex justify-between items-center mb-6">
        {/* Left arrow */}
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="flex-shrink-0">
          <button
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
            className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
              currentQuestionIndex === 0
                ? "border-off-white/20 text-off-white/20 cursor-not-allowed"
                : "border-indigo-glow text-indigo-glow hover:bg-indigo-glow/10"
            }`}
            style={{ padding: 0 }}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Question indicators */}
        <div className="flex space-x-4 mx-6">
          {questions.map((question, index) => (
            <motion.div key={question.id} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <button
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
                  index === currentQuestionIndex
                    ? "bg-indigo-glow border-indigo-glow text-off-white"
                    : selectedOptions[question.id]
                      ? "bg-mint-green/10 border-mint-green text-mint-green"
                      : "border-off-white/40 text-off-white/70"
                }`}
                style={{ padding: 0 }}
              >
                <span className="flex items-center justify-center w-full h-full">
                  {selectedOptions[question.id] ? <Check className="w-5 h-5" /> : index + 1}
                </span>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Right arrow */}
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="flex-shrink-0">
          <button
            onClick={handleNextQuestion}
            disabled={currentQuestionIndex === questions.length - 1}
            className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
              currentQuestionIndex === questions.length - 1
                ? "border-off-white/20 text-off-white/20 cursor-not-allowed"
                : "border-indigo-glow text-indigo-glow hover:bg-indigo-glow/10"
            }`}
            style={{ padding: 0 }}
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>

      {/* Text to classify */}
      <Card className="p-4 mb-6 bg-deep-violet/30 border-indigo-glow/30">
        <div className="text-lg leading-relaxed text-off-white">{currentQuestion.text}</div>
      </Card>

      {/* Classification options */}
      <div className="flex-1">
        <h3 className="text-lg font-mono mb-4">Select the sentiment of this text:</h3>

        <div className="grid grid-cols-2 gap-4">
          {currentQuestion.options.map((option) => (
            <motion.div key={option} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                className={`w-full h-16 text-lg ${
                  selectedOptions[currentQuestion.id] === option ? "bg-indigo-glow/20 border-indigo-glow" : ""
                }`}
                onClick={() => handleOptionSelect(option)}
              >
                {option}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Submit button */}
      <div className="mt-6 flex justify-end">
        <Button onClick={handleSubmit} disabled={!allQuestionsAnswered} className="px-6">
          Submit All ({Object.keys(selectedOptions).length}/{questions.length})
        </Button>
      </div>
    </div>
  )
}
