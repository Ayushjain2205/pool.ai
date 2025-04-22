"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ImageAnnotationTask } from "@/components/tasks/image-annotation-task"
import { AudioRecordingTask } from "@/components/tasks/audio-recording-task"
import { TextClassificationTask } from "@/components/tasks/text-classification-task"
import { Sparkles, ArrowLeft, Trophy, Zap, HelpCircle } from "lucide-react"

// Mock task data - in a real app, this would come from an API
const MOCK_TASKS = {
  "image-task-1": {
    id: "image-task-1",
    title: "Label Objects in Street Scene",
    type: "Image",
    description: "Draw bounding boxes around vehicles, pedestrians, and traffic signs in this street scene.",
    reward: 0.45,
    xp: 8,
    imageUrl: "/bustling-cityscape.png",
    objectsToLabel: ["Car", "Pedestrian", "Traffic Sign", "Bicycle"],
  },
  "audio-task-1": {
    id: "audio-task-1",
    title: "Record Voice Command",
    type: "Audio",
    description:
      "Record yourself saying the following phrase clearly: 'Set an alarm for seven thirty tomorrow morning'",
    reward: 0.3,
    xp: 6,
    phraseToRecord: "Set an alarm for seven thirty tomorrow morning",
    minDuration: 2, // seconds
    maxDuration: 5, // seconds
  },
  "text-task-1": {
    id: "text-task-1",
    title: "Classify Text Sentiment",
    type: "Text",
    description: "Read each text and classify its sentiment as positive, negative, neutral, or mixed.",
    reward: 0.2,
    xp: 4,
    textToClassify:
      "I've been using this phone for about a month now. The battery life is impressive and the camera quality is excellent. However, I find the user interface a bit confusing at times.",
    options: ["Positive", "Negative", "Neutral", "Mixed"],
  },
}

// Map task type to color
const getTaskTypeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case "text":
      return "#FF44A4"
    case "audio":
      return "#44FFD2"
    case "image":
      return "#7F5AF0"
    case "sensor":
      return "#FFD700"
    default:
      return "#FFFFFF"
  }
}

export default function TaskPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [task, setTask] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showReward, setShowReward] = useState(false)

  // Fetch task data
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      const taskData = MOCK_TASKS[params.id as keyof typeof MOCK_TASKS]
      if (taskData) {
        setTask(taskData)
      }
      setLoading(false)
    }, 500)
  }, [params.id])

  // Handle task completion
  const handleTaskComplete = (result: any) => {
    console.log("Task completed with result:", result)
    setProgress(100)
    setIsCompleted(true)

    // Show reward animation
    setTimeout(() => {
      setShowReward(true)
    }, 500)

    // Redirect after showing reward
    setTimeout(() => {
      router.push("/tasks")
    }, 3000)
  }

  // Loading state
  if (loading) {
    return (
      <div className="fixed inset-0 bg-true-black flex justify-center items-center z-50">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-16 h-16 border-4 border-t-mint-green border-r-transparent border-b-transparent border-l-transparent rounded-full mx-auto mb-4"
          ></motion.div>
          <p className="text-off-white/70">Loading task...</p>
        </motion.div>
      </div>
    )
  }

  // Task not found state
  if (!task) {
    return (
      <div className="fixed inset-0 bg-true-black flex justify-center items-center z-50">
        <div className="bg-deep-violet/80 backdrop-blur-md p-8 rounded-xl border border-indigo-glow/30 max-w-md w-full text-center">
          <h2 className="text-2xl font-mono mb-4">Task Not Found</h2>
          <p className="text-off-white/70 mb-6">
            The task you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Button onClick={() => router.push("/tasks")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tasks
          </Button>
        </div>
      </div>
    )
  }

  // Task color based on type
  const taskColor = getTaskTypeColor(task.type)

  return (
    <div className="min-h-screen bg-true-black">
      {/* Simple header with back button and task info */}
      <div className="bg-deep-violet/80 backdrop-blur-md border-b border-indigo-glow/20 sticky top-16 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/tasks")}
              className="mr-3 h-10 w-10 rounded-full"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center">
                <Badge
                  variant={task.type.toLowerCase() as any}
                  className="mr-2"
                  style={{ backgroundColor: `${taskColor}30`, color: taskColor }}
                >
                  {task.type}
                </Badge>
                <h1 className="text-lg font-mono truncate max-w-[200px] md:max-w-md">{task.title}</h1>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <div className="text-mint-green font-mono font-bold">{task.reward} POOL</div>
            <div className="text-indigo-glow text-sm ml-2 hidden md:block">+{task.xp} XP</div>
          </div>
        </div>

        {/* Progress bar */}
        <Progress value={progress} className="h-1" />
      </div>

      {/* Main content area */}
      <div className="container mx-auto px-4 py-6">
        {/* Task description */}
        <div className="bg-deep-violet/30 rounded-xl border border-indigo-glow/20 p-4 mb-6">
          <div className="flex items-start">
            <HelpCircle className="text-mint-green h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-off-white/90">{task.description}</p>
          </div>
        </div>

        {/* Task interface */}
        <div className="bg-deep-violet/30 rounded-xl border border-indigo-glow/20 p-6">
          {!isCompleted ? renderTaskInterface() : renderCompletionState()}
        </div>
      </div>

      {/* Completion overlay */}
      <AnimatePresence>
        {isCompleted && showReward && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-deep-violet/90 rounded-xl border border-indigo-glow/30 p-8 max-w-md w-full text-center"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-24 h-24 rounded-full bg-mint-green/20 flex items-center justify-center mx-auto mb-6"
              >
                <Trophy className="h-12 w-12 text-mint-green" />
              </motion.div>

              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-2xl font-mono mb-4"
              >
                Task Completed!
              </motion.h2>

              <div className="flex justify-center gap-6 mb-6">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center"
                >
                  <Sparkles className="h-5 w-5 text-mint-green mr-2" />
                  <span className="text-xl font-mono text-mint-green">{task.reward} POOL</span>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-center"
                >
                  <Zap className="h-5 w-5 text-indigo-glow mr-2" />
                  <span className="text-xl font-mono text-indigo-glow">+{task.xp} XP</span>
                </motion.div>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-off-white/70"
              >
                Redirecting to more tasks...
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  // Helper function to render the appropriate task interface
  function renderTaskInterface() {
    switch (task.type) {
      case "Image":
        return (
          <div className="flex flex-col h-full">
            <ImageAnnotationTask
              imageUrl={task.imageUrl}
              objectsToLabel={task.objectsToLabel}
              onProgress={setProgress}
              onComplete={handleTaskComplete}
            />
          </div>
        )
      case "Audio":
        return (
          <AudioRecordingTask
            phraseToRecord={task.phraseToRecord}
            minDuration={task.minDuration}
            maxDuration={task.maxDuration}
            onProgress={setProgress}
            onComplete={handleTaskComplete}
          />
        )
      case "Text":
        return (
          <TextClassificationTask
            text={task.textToClassify}
            options={task.options}
            onProgress={setProgress}
            onComplete={handleTaskComplete}
          />
        )
      default:
        return <div>Unsupported task type</div>
    }
  }

  // Helper function to render completion state
  function renderCompletionState() {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="w-16 h-16 border-4 border-t-mint-green border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-off-white/70">Processing your submission...</p>
      </div>
    )
  }
}
