"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Loader2, MessageSquare } from "lucide-react"
import QuestionCard from "./question-card"
import type { Question } from "@/types/questions"

interface QuestionsListProps {
	questions: Question[]
	loading: boolean
	onQuestionClick: (id: string) => void
	userId?: string
}

export default function QuestionsList({ questions, loading, onQuestionClick, userId }: QuestionsListProps) {
	if (loading) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className="flex flex-col items-center justify-center py-16 space-y-4"
			>
				<motion.div
					animate={{ rotate: 360 }}
					transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
				>
					<Loader2 className="h-8 w-8 text-primary" />
				</motion.div>
				<p className="text-muted-foreground">Loading questions...</p>
			</motion.div>
		)
	}

	if (questions.length === 0) {
		return (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className="flex flex-col items-center justify-center py-16 space-y-4"
			>
				<motion.div
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					transition={{ delay: 0.2 }}
					className="w-16 h-16 bg-muted rounded-full flex items-center justify-center"
				>
					<MessageSquare className="h-8 w-8 text-muted-foreground" />
				</motion.div>
				<div className="text-center space-y-2">
					<h3 className="text-lg font-semibold text-foreground">No questions found</h3>
					<p className="text-muted-foreground">Try adjusting your search or filters</p>
				</div>
			</motion.div>
		)
	}

	return (
		<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
			<AnimatePresence>
				{questions.map((question, index) => (
					<QuestionCard
						key={question._id}
						question={question}
						index={index}
						onQuestionClick={onQuestionClick}
						userId={userId}
					/>
				))}
			</AnimatePresence>
		</motion.div>
	)
}
