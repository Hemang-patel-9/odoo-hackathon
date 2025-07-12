"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, MessageCircle, Clock, User, Tag, Eye, Share2, Flag, Loader2, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import VotingSection from "@/components/voting-section"
import AnswerCard from "@/components/answer-card"
import AnswerModal from "@/components/answer-modal"
import type { Question } from "@/types/questions"
import type { Answer } from "@/types/answer"
import { useNavigate, useParams } from "react-router-dom"
import { useSocket } from "@/contexts/socketContext"

export default function QuestionDetailPage() {
    const router = useNavigate();
    const { toast } = useToast()
    const { id } = useParams();
    const socket = useSocket();

    const [question, setQuestion] = useState<Question | null>(null)
    const [answers, setAnswers] = useState<Answer[]>([])
    const [loading, setLoading] = useState(true)
    const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false)
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        // Load user from localStorage
        const userData = localStorage.getItem("user")
        if (userData) {
            setUser(JSON.parse(userData))
        }
    }, [])

    const fetchQuestion = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/questions/${id}`)
            const json = await res.json()
            if (!res.ok) throw new Error(json.message)
            setQuestion(json.data)
        } catch (err) {
            console.error("Error fetching question:", err)
            toast({
                title: "Error",
                description: "Failed to load question",
                variant: "destructive",
            })
        }
    }

    const fetchAnswers = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/answers/question/${id}`)
            const json = await res.json()
            if (!res.ok) throw new Error(json.message)
            setAnswers(json.data)
        } catch (err) {
            console.error("Error fetching answers:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (id) {
            fetchQuestion()
            fetchAnswers()
        }
    }, [id]);

    const handleAnswerSubmit = async (content: string) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/answers/${id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content,
                    author: user?.id,
                }),
            })

            const json = await res.json()
            console.log(json, "this is my json");
            if (!res.ok) throw new Error(json.message)
            await fetchAnswers()

            socket?.emit('notify', {
                qauthor: json.qauth,
                data: json
            });

            toast({
                title: "Answer Posted!",
                description: "Your answer has been posted successfully",
            })
        } catch (err) {
            console.error("Error posting answer:", err)
            toast({
                title: "Error",
                description: "Failed to post answer. Please try again.",
                variant: "destructive",
            })
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

        if (diffInHours < 1) return "Just now"
        if (diffInHours < 24) return `${diffInHours}h ago`
        if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
        return date.toLocaleDateString()
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 flex items-center justify-center">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center space-y-4">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    >
                        <Loader2 className="h-8 w-8 text-primary" />
                    </motion.div>
                    <p className="text-muted-foreground">Loading question...</p>
                </motion.div>
            </div>
        )
    }

    if (!question) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 flex items-center justify-center">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
                    <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto" />
                    <h2 className="text-2xl font-semibold">Question not found</h2>
                    <p className="text-muted-foreground">The question you're looking for doesn't exist.</p>
                    <Button onClick={() => router("/")} className="mt-4">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Questions
                    </Button>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
            <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router(-1)}
                            className="rounded-full hover:bg-accent/50 transition-all duration-200"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </motion.div>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Question Details</h1>
                        <p className="text-muted-foreground">View and answer community questions</p>
                    </div>
                </motion.div>

                {/* Question Card */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                    <Card className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-8">
                            <div className="flex gap-6">
                                {/* Voting Section */}
                                <VotingSection
                                    itemId={question._id}
                                    initialVotes={question.votes}
                                    userId={user?.id}
                                    showBookmark={true}
                                />

                                {/* Question Content */}
                                <div className="flex-1 space-y-6">
                                    {/* Title */}
                                    <motion.h1
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="text-3xl font-bold text-foreground leading-tight"
                                    >
                                        {question.title}
                                    </motion.h1>

                                    {/* Meta Information */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="flex items-center gap-6 text-sm text-muted-foreground"
                                    >
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            <span>Asked {formatDate(question.createdAt)}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Eye className="h-4 w-4" />
                                            <span>123 views</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MessageCircle className="h-4 w-4" />
                                            <span>{answers.length} answers</span>
                                        </div>
                                    </motion.div>

                                    {/* Description */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className="prose prose-lg max-w-none dark:prose-invert"
                                    >
                                        <p className="text-foreground leading-relaxed whitespace-pre-wrap">{question.description}</p>
                                    </motion.div>

                                    {/* Tags */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                        className="flex flex-wrap gap-2"
                                    >
                                        {question.tags.map((tag, index) => (
                                            <motion.div
                                                key={tag}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.5 + index * 0.05 }}
                                                whileHover={{ scale: 1.05 }}
                                            >
                                                <Badge
                                                    variant="secondary"
                                                    className="bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer transition-all duration-200 rounded-full px-3 py-1 flex items-center gap-1"
                                                >
                                                    <Tag className="h-3 w-3" />
                                                    {tag}
                                                </Badge>
                                            </motion.div>
                                        ))}
                                    </motion.div>

                                    {/* Author and Actions */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.6 }}
                                        className="flex items-center justify-between pt-6 border-t border-border/50"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10 ring-2 ring-transparent hover:ring-primary/20 transition-all duration-200">
                                                <AvatarImage src={question.author.avatar || "/placeholder.svg"} />
                                                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                                    {question.author.name[0].toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="flex items-center gap-1 text-sm">
                                                    <User className="h-3 w-3" />
                                                    <span className="font-medium text-foreground">{question.author.name}</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground">Asked {formatDate(question.createdAt)}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                                                <Share2 className="h-4 w-4 mr-1" />
                                                Share
                                            </Button>
                                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                                                <Flag className="h-4 w-4 mr-1" />
                                                Report
                                            </Button>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Answers Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="space-y-6"
                >
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                            <MessageCircle className="h-6 w-6 text-primary" />
                            {answers.length} {answers.length === 1 ? "Answer" : "Answers"}
                        </h2>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                onClick={() => setIsAnswerModalOpen(true)}
                                className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 rounded-xl px-6 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Add Answer
                            </Button>
                        </motion.div>
                    </div>

                    {/* Answers List */}
                    <AnimatePresence>
                        {answers.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-16 space-y-4"
                            >
                                <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto" />
                                <div className="space-y-2">
                                    <h3 className="text-lg font-semibold text-foreground">No answers yet</h3>
                                    <p className="text-muted-foreground">Be the first to answer this question!</p>
                                </div>
                                <Button onClick={() => setIsAnswerModalOpen(true)} className="mt-4">
                                    Write an Answer
                                </Button>
                            </motion.div>
                        ) : (
                            <div className="space-y-6">
                                {answers.map((answer, index) => (
                                    <AnswerCard
                                        key={answer._id}
                                        answer={answer}
                                        index={index}
                                        userId={user?.id}
                                        isAccepted={answer.acceptedAnswer}
                                    />
                                ))}
                            </div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Answer Modal */}
                <AnswerModal
                    isOpen={isAnswerModalOpen}
                    onClose={() => setIsAnswerModalOpen(false)}
                    onSubmit={handleAnswerSubmit}
                    questionTitle={question.title}
                />
            </div>
        </div>
    )
}
