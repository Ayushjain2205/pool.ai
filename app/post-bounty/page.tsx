"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, Database, ArrowRight, Check, FileText, ImageIcon, Mic, Info, Settings } from "lucide-react"

interface TaskOption {
  id: string
  name: string
  description: string
  selected: boolean
}

export default function PostBountyPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [detectedFileType, setDetectedFileType] = useState<"text" | "image" | "audio" | null>(null)
  const [taskOptions, setTaskOptions] = useState<TaskOption[]>([])
  const [bountyDetails, setBountyDetails] = useState({
    name: "",
    description: "",
    reward: 0,
    tasksPerContributor: 10,
    totalContributors: 100,
  })

  // Handle file upload and auto-detect file type
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setUploadProgress(0)

    // Get file extension to detect type
    const fileName = files[0].name.toLowerCase()
    let fileType: "text" | "image" | "audio" | null = null
    let tasks: TaskOption[] = []

    // Auto-detect file type based on extension
    if (fileName.endsWith(".csv") || fileName.endsWith(".txt") || fileName.endsWith(".json")) {
      fileType = "text"
      tasks = [
        {
          id: "sentiment",
          name: "Sentiment Analysis",
          description: "Classify text as positive, negative, or neutral",
          selected: true,
        },
        {
          id: "classification",
          name: "Text Classification",
          description: "Categorize text into predefined categories",
          selected: false,
        },
        {
          id: "entity",
          name: "Entity Recognition",
          description: "Identify and label entities like names, places, etc.",
          selected: false,
        },
        {
          id: "summarization",
          name: "Text Summarization",
          description: "Create concise summaries of longer texts",
          selected: false,
        },
      ]
    } else if (
      fileName.endsWith(".jpg") ||
      fileName.endsWith(".png") ||
      fileName.endsWith(".webp") ||
      fileName.endsWith(".zip")
    ) {
      fileType = "image"
      tasks = [
        {
          id: "object",
          name: "Object Detection",
          description: "Draw bounding boxes around objects in images",
          selected: true,
        },
        {
          id: "classification",
          name: "Image Classification",
          description: "Categorize images into predefined classes",
          selected: false,
        },
        {
          id: "captioning",
          name: "Image Captioning",
          description: "Write descriptive captions for images",
          selected: false,
        },
        {
          id: "segmentation",
          name: "Image Segmentation",
          description: "Create pixel-level masks for objects in images",
          selected: false,
        },
      ]
    } else if (fileName.endsWith(".mp3") || fileName.endsWith(".wav") || fileName.endsWith(".ogg")) {
      fileType = "audio"
      tasks = [
        {
          id: "transcription",
          name: "Speech Transcription",
          description: "Convert spoken words to written text",
          selected: true,
        },
        {
          id: "classification",
          name: "Audio Classification",
          description: "Categorize audio clips by content type",
          selected: false,
        },
        {
          id: "speaker",
          name: "Speaker Identification",
          description: "Identify who is speaking in audio clips",
          selected: false,
        },
        {
          id: "emotion",
          name: "Emotion Recognition",
          description: "Detect emotions in spoken language",
          selected: false,
        },
      ]
    }

    setDetectedFileType(fileType)
    setTaskOptions(tasks)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploading(false)
          setUploadComplete(true)
          return 100
        }
        return prev + 5
      })
    }, 200)
  }

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setBountyDetails((prev) => ({
      ...prev,
      [name]:
        name === "reward" || name === "tasksPerContributor" || name === "totalContributors" ? Number(value) : value,
    }))
  }

  // Toggle task selection
  const toggleTaskSelection = (taskId: string) => {
    setTaskOptions(taskOptions.map((task) => (task.id === taskId ? { ...task, selected: !task.selected } : task)))
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 1 && uploadComplete) {
      setStep(2)
    } else if (step === 2) {
      // Submit the bounty
      router.push("/dashboard")
    }
  }

  // Calculate total cost
  const totalCost = bountyDetails.reward * bountyDetails.tasksPerContributor * bountyDetails.totalContributors

  // Get file type icon
  const getFileTypeIcon = () => {
    switch (detectedFileType) {
      case "text":
        return <FileText className="h-6 w-6 text-[#FF44A4]" />
      case "image":
        return <ImageIcon className="h-6 w-6 text-indigo-glow" />
      case "audio":
        return <Mic className="h-6 w-6 text-mint-green" />
      default:
        return <Database className="h-6 w-6 text-indigo-glow/70" />
    }
  }

  // Get selected tasks
  const selectedTasks = taskOptions.filter((task) => task.selected)

  return (
    <main className="min-h-screen bg-true-black">
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-4xl font-mono mb-2">Post a Data Bounty</h1>
        <p className="text-off-white/70 mb-8">Upload your dataset and create tasks for the POOL.AI community</p>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span>Upload Dataset</span>
            <span>Configure Tasks</span>
            <span>Review & Publish</span>
          </div>
          <Progress value={step * 33.33} className="h-2" />
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Upload Dataset */}
          {step === 1 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Upload className="h-5 w-5 mr-2 text-mint-green" />
                    Upload Your Dataset
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Bounty Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="E.g., Product Review Analysis"
                        value={bountyDetails.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Describe what you want contributors to do"
                        className="min-h-[100px]"
                        value={bountyDetails.description}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="border-2 border-dashed border-indigo-glow/30 rounded-lg p-8 text-center">
                      {!uploading && !uploadComplete ? (
                        <div className="space-y-4">
                          <div className="flex justify-center">
                            <Database className="h-12 w-12 text-indigo-glow/70" />
                          </div>
                          <div>
                            <p className="text-lg font-mono mb-2">Drag & drop your dataset here</p>
                            <p className="text-sm text-off-white/70 mb-4">We'll automatically detect the file type</p>
                            <Input id="dataset" type="file" className="hidden" onChange={handleFileUpload} />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById("dataset")?.click()}
                            >
                              Select File
                            </Button>
                          </div>
                        </div>
                      ) : uploading ? (
                        <div className="space-y-4">
                          <p className="text-lg font-mono">Uploading dataset...</p>
                          <Progress value={uploadProgress} className="h-2 max-w-md mx-auto" />
                          <p className="text-sm text-off-white/70">{uploadProgress}% complete</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex justify-center">
                            <div className="w-12 h-12 rounded-full bg-mint-green/20 flex items-center justify-center">
                              <Check className="h-6 w-6 text-mint-green" />
                            </div>
                          </div>
                          <p className="text-lg font-mono">Upload complete!</p>
                          <div className="flex items-center justify-center gap-2">
                            {getFileTypeIcon()}
                            <Badge variant={detectedFileType || "default"}>
                              {detectedFileType === "text" && "Text Dataset"}
                              {detectedFileType === "image" && "Image Dataset"}
                              {detectedFileType === "audio" && "Audio Dataset"}
                              {!detectedFileType && "Unknown Format"}
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button type="submit" disabled={!uploadComplete || !bountyDetails.name || !bountyDetails.description}>
                  Configure Tasks <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Configure Tasks */}
          {step === 2 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-mint-green" />
                    Configure Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-deep-violet/30 p-4 rounded-lg flex items-start">
                      <Info className="h-5 w-5 text-mint-green mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm">
                          Based on your {detectedFileType} dataset, we've suggested the following task types. Select the
                          ones you want to include in your bounty:
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {taskOptions.map((task) => (
                        <div
                          key={task.id}
                          className={`p-4 rounded-lg border transition-colors ${
                            task.selected
                              ? "bg-deep-violet/50 border-mint-green"
                              : "bg-deep-violet/20 border-indigo-glow/30"
                          }`}
                        >
                          <div className="flex items-start">
                            <Checkbox
                              id={task.id}
                              checked={task.selected}
                              onCheckedChange={() => toggleTaskSelection(task.id)}
                              className="mt-1"
                            />
                            <div className="ml-3">
                              <label htmlFor={task.id} className="font-medium cursor-pointer block mb-1">
                                {task.name}
                              </label>
                              <p className="text-sm text-off-white/70">{task.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="reward">Reward per Task (POOL)</Label>
                        <div className="flex items-center mt-2">
                          <div className="w-6 h-6 mr-2 relative overflow-hidden rounded-full">
                            <img src="/pool-logo.png" alt="POOL Coin" className="w-full h-full object-contain" />
                          </div>
                          <Input
                            id="reward"
                            name="reward"
                            type="number"
                            min="0.01"
                            step="0.01"
                            placeholder="0.25"
                            value={bountyDetails.reward || ""}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="tasksPerContributor">Tasks per Contributor</Label>
                        <Input
                          id="tasksPerContributor"
                          name="tasksPerContributor"
                          type="number"
                          min="1"
                          placeholder="10"
                          value={bountyDetails.tasksPerContributor || ""}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="totalContributors">Total Contributors</Label>
                        <Input
                          id="totalContributors"
                          name="totalContributors"
                          type="number"
                          min="1"
                          placeholder="100"
                          value={bountyDetails.totalContributors || ""}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div>
                        <Label>Total Cost</Label>
                        <div className="flex items-center h-10 mt-2 px-3 rounded-md border bg-deep-violet/30 border-input">
                          <div className="w-6 h-6 mr-2 relative overflow-hidden rounded-full">
                            <img src="/pool-logo.png" alt="POOL Coin" className="w-full h-full object-contain" />
                          </div>
                          <span className="font-mono">{totalCost.toFixed(2)} POOL</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={selectedTasks.length === 0 || !bountyDetails.reward || bountyDetails.reward <= 0}
                >
                  Review & Publish <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Publish */}
          {step === 3 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Database className="h-5 w-5 mr-2 text-mint-green" />
                    Review & Publish
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-mono mb-4">Bounty Details</h3>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-off-white/70">Name</Label>
                          <p>{bountyDetails.name}</p>
                        </div>
                        <div>
                          <Label className="text-off-white/70">Description</Label>
                          <p className="text-sm">{bountyDetails.description}</p>
                        </div>
                        <div>
                          <Label className="text-off-white/70">Dataset Type</Label>
                          <div className="flex items-center mt-1">
                            {getFileTypeIcon()}
                            <Badge variant={detectedFileType || "default"} className="ml-2">
                              {detectedFileType === "text" && "Text Dataset"}
                              {detectedFileType === "image" && "Image Dataset"}
                              {detectedFileType === "audio" && "Audio Dataset"}
                              {!detectedFileType && "Unknown Format"}
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <Label className="text-off-white/70">Selected Tasks</Label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {selectedTasks.map((task) => (
                              <Badge key={task.id} variant={detectedFileType || "default"}>
                                {task.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-mono mb-4">Payment Summary</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-off-white/70">Reward per Task:</span>
                          <div className="flex items-center">
                            <div className="w-4 h-4 mr-1 relative overflow-hidden rounded-full">
                              <img src="/pool-logo.png" alt="POOL Coin" className="w-full h-full object-contain" />
                            </div>
                            <span>{bountyDetails.reward.toFixed(2)} POOL</span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-off-white/70">Tasks per Contributor:</span>
                          <span>{bountyDetails.tasksPerContributor}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-off-white/70">Total Contributors:</span>
                          <span>{bountyDetails.totalContributors}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-off-white/70">Platform Fee (5%):</span>
                          <div className="flex items-center">
                            <div className="w-4 h-4 mr-1 relative overflow-hidden rounded-full">
                              <img src="/pool-logo.png" alt="POOL Coin" className="w-full h-full object-contain" />
                            </div>
                            <span>{(totalCost * 0.05).toFixed(2)} POOL</span>
                          </div>
                        </div>
                        <div className="border-t border-indigo-glow/20 pt-2 mt-2">
                          <div className="flex justify-between font-bold">
                            <span>Total:</span>
                            <div className="flex items-center">
                              <div className="w-5 h-5 mr-1 relative overflow-hidden rounded-full">
                                <img src="/pool-logo.png" alt="POOL Coin" className="w-full h-full object-contain" />
                              </div>
                              <span>{(totalCost * 1.05).toFixed(2)} POOL</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 p-4 bg-deep-violet/30 rounded-lg">
                        <p className="text-sm">
                          By publishing this bounty, you agree to the POOL.AI Terms of Service. Once published,
                          contributors can start working on your tasks immediately.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button type="submit">Publish Bounty</Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </main>
  )
}
