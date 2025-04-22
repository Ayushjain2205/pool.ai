"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Mic, Square, Check, RefreshCw } from "lucide-react"
import { motion } from "framer-motion"

interface AudioRecordingTaskProps {
  phraseToRecord: string
  minDuration: number
  maxDuration: number
  onProgress: (progress: number) => void
  onComplete: (result: { audioBlob: Blob | null }) => void
}

export function AudioRecordingTask({
  phraseToRecord,
  minDuration,
  maxDuration,
  onProgress,
  onComplete,
}: AudioRecordingTaskProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [visualizerData, setVisualizerData] = useState<number[]>(Array(50).fill(5))
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const animationFrameRef = useRef<number | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Set up audio context and analyser
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    analyserRef.current = audioContextRef.current.createAnalyser()
    analyserRef.current.fftSize = 128

    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close()
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
      }
    }
  }, [])

  // Update progress based on recording state
  useEffect(() => {
    if (isRecording) {
      onProgress(Math.min((recordingTime / maxDuration) * 100, 100))
    } else if (audioBlob) {
      onProgress(80) // Recording done
    }
  }, [isRecording, recordingTime, audioBlob, maxDuration, onProgress])

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // Connect to visualizer
      if (audioContextRef.current && analyserRef.current) {
        const source = audioContextRef.current.createMediaStreamSource(stream)
        source.connect(analyserRef.current)

        // Start visualizer animation
        const bufferLength = analyserRef.current.frequencyBinCount
        const dataArray = new Uint8Array(bufferLength)

        const updateVisualizer = () => {
          if (!analyserRef.current) return

          analyserRef.current.getByteFrequencyData(dataArray)

          // Convert frequency data to visualizer heights
          const visualizerValues = Array.from({ length: 50 }, (_, i) => {
            const index = Math.floor((i * bufferLength) / 50)
            // Scale value between 5 and 50
            return 5 + (dataArray[index] / 255) * 45
          })

          setVisualizerData(visualizerValues)
          animationFrameRef.current = requestAnimationFrame(updateVisualizer)
        }

        updateVisualizer()
      }

      // Set up media recorder
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        const audioUrl = URL.createObjectURL(audioBlob)
        setAudioBlob(audioBlob)
        setAudioUrl(audioUrl)

        // Stop all tracks in the stream
        stream.getTracks().forEach((track) => track.stop())

        // Stop visualizer animation
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }

        // Reset visualizer
        setVisualizerData(Array(50).fill(5))
      }

      // Start recording
      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      // Set up timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          const newTime = prev + 0.1
          // Auto-stop if max duration reached
          if (newTime >= maxDuration) {
            stopRecording()
            return maxDuration
          }
          return newTime
        })
      }, 100)
    } catch (error) {
      console.error("Error accessing microphone:", error)
    }
  }

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current)
        recordingIntervalRef.current = null
      }
    }
  }

  // Reset recording
  const resetRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }
    setAudioBlob(null)
    setAudioUrl(null)
    setRecordingTime(0)
    onProgress(0)
  }

  // Submit recording
  const submitRecording = () => {
    onComplete({ audioBlob })
  }

  return (
    <div className="flex flex-col items-center">
      {/* Phrase to record */}
      <div className="text-center mb-8 p-4 bg-deep-violet/30 rounded-lg border border-indigo-glow/30 w-full">
        <h3 className="text-lg font-mono mb-2">Record this phrase:</h3>
        <p className="text-xl text-mint-green font-medium">"{phraseToRecord}"</p>
      </div>

      {/* Audio visualizer */}
      <div className="w-full h-24 mb-8 flex items-center justify-center">
        <div className="w-full flex items-center justify-center gap-1">
          {visualizerData.map((value, index) => (
            <motion.div
              key={index}
              className="w-1.5 bg-mint-green rounded-full"
              animate={{ height: `${value}px` }}
              transition={{ duration: 0.1 }}
            />
          ))}
        </div>
      </div>

      {/* Recording controls */}
      <div className="flex flex-col items-center mb-8">
        {!isRecording && !audioBlob && (
          <Button
            size="lg"
            onClick={startRecording}
            className="rounded-full h-16 w-16 p-0 bg-[#FF44A4] hover:bg-[#FF44A4]/90 hover:scale-110"
          >
            <Mic className="h-8 w-8" />
          </Button>
        )}

        {isRecording && (
          <Button
            size="lg"
            onClick={stopRecording}
            className="rounded-full h-16 w-16 p-0 bg-destructive hover:bg-destructive/90 hover:scale-110 animate-pulse"
          >
            <Square className="h-8 w-8" />
          </Button>
        )}

        {audioBlob && (
          <div className="flex flex-col items-center">
            <audio ref={audioRef} src={audioUrl || undefined} controls className="mb-4" />

            <div className="flex gap-4">
              <Button variant="outline" onClick={resetRecording}>
                <RefreshCw className="h-4 w-4 mr-2" /> Record Again
              </Button>

              <Button onClick={submitRecording} disabled={recordingTime < minDuration}>
                <Check className="h-4 w-4 mr-2" /> Submit Recording
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Recording time */}
      {(isRecording || audioBlob) && (
        <div className="w-full">
          <div className="flex justify-between text-sm mb-1">
            <span>{recordingTime.toFixed(1)}s</span>
            <span>{maxDuration}s</span>
          </div>
          <Progress value={(recordingTime / maxDuration) * 100} className="h-1" />

          {recordingTime < minDuration && (
            <p className="text-xs text-off-white/70 mt-1">Record for at least {minDuration}s</p>
          )}
        </div>
      )}

      {/* Instructions */}
      {!isRecording && !audioBlob && (
        <div className="text-center text-off-white/70">
          <p>Click the microphone button to start recording</p>
          <p className="text-xs mt-2">Speak clearly and at a normal pace</p>
        </div>
      )}
    </div>
  )
}
