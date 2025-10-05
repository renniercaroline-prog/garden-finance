"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { BookOpen, X, CheckCircle2, Clock, Star } from "lucide-react"
import { useGamification } from "@/context/gamification-context"
import type { EducationalContent } from "@/lib/types"

export default function LearningCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState<EducationalContent | null>(null)
  const { lessons, completeLesson } = useGamification()

  const completedCount = lessons.filter((l) => l.completed).length

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 pointer-events-auto z-20">
        <Button onClick={() => setIsOpen(true)} size="lg" className="shadow-lg bg-primary hover:bg-primary/90">
          <BookOpen className="w-5 h-5 mr-2" />
          Learning Center
          <Badge variant="secondary" className="ml-2">
            {completedCount}/{lessons.length}
          </Badge>
        </Button>
      </div>
    )
  }

  if (selectedLesson) {
    return (
      <div className="fixed inset-4 pointer-events-auto z-40 flex items-center justify-center">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSelectedLesson(null)} />
        <Card className="glass-panel border-primary/20 w-full max-w-2xl relative z-10">
          <div className="p-6 border-b border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-primary" />
              <div>
                <h3 className="text-xl font-bold text-foreground font-serif">{selectedLesson.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">{selectedLesson.difficulty}</Badge>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span className="text-xs">{selectedLesson.readTime} min read</span>
                  </div>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setSelectedLesson(null)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <ScrollArea className="h-[400px]">
            <div className="p-6">
              <p className="text-muted-foreground mb-4">{selectedLesson.description}</p>
              <div className="prose prose-sm max-w-none">
                <p className="text-foreground leading-relaxed">{selectedLesson.content}</p>
              </div>
            </div>
          </ScrollArea>

          <div className="p-6 border-t border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold text-accent">+{selectedLesson.xpReward} XP</span>
            </div>
            {!selectedLesson.completed ? (
              <Button
                onClick={() => {
                  completeLesson(selectedLesson.id)
                  setSelectedLesson(null)
                }}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Complete Lesson
              </Button>
            ) : (
              <Badge variant="default" className="text-sm py-2 px-4">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Completed
              </Badge>
            )}
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[700px] pointer-events-auto z-30">
      <Card className="glass-panel border-primary/20">
        <div className="p-4 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-foreground font-serif">Learning Center</h3>
            <Badge variant="secondary">
              {completedCount}/{lessons.length}
            </Badge>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <ScrollArea className="h-[400px]">
          <div className="p-4 grid grid-cols-2 gap-3">
            {lessons.map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} onSelect={setSelectedLesson} />
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  )
}

function LessonCard({
  lesson,
  onSelect,
}: {
  lesson: EducationalContent
  onSelect: (lesson: EducationalContent) => void
}) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "text-success"
      case "intermediate":
        return "text-primary"
      case "advanced":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <Card
      className={`p-4 cursor-pointer hover:border-primary/50 transition-colors ${
        lesson.completed ? "bg-success/10 border-success/30" : "bg-background/50 border-border/50"
      }`}
      onClick={() => onSelect(lesson)}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-foreground text-sm leading-tight">{lesson.title}</h4>
        {lesson.completed && <CheckCircle2 className="w-4 h-4 text-success shrink-0" />}
      </div>

      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{lesson.description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={`text-xs ${getDifficultyColor(lesson.difficulty)}`}>
            {lesson.difficulty}
          </Badge>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span className="text-xs">{lesson.readTime}m</span>
          </div>
        </div>
        <span className="text-xs font-semibold text-accent">+{lesson.xpReward} XP</span>
      </div>
    </Card>
  )
}
