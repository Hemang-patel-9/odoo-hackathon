"use client"

import { motion } from "framer-motion"
import { Clock, User, Award } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import VotingSection from "./voting-section"
import type { Answer } from "@/types/answer"

interface AnswerCardProps {
	answer: Answer
	index: number
	userId?: string
	isAccepted?: boolean
}

export default function AnswerCard({ answer, index, userId, isAccepted = false }: AnswerCardProps) {
	const formatDate = (dateString: string) => {
		const date = new Date(dateString)
		const now = new Date()
		const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

		if (diffInHours < 1) return "Just now"
		if (diffInHours < 24) return `${diffInHours}h ago`
		if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
		return date.toLocaleDateString()
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: index * 0.1 }}
			whileHover={{ y: -2 }}
			className="group"
		>
			<Card
				className={`bg-card/50 backdrop-blur-sm border transition-all duration-300 group-hover:shadow-lg rounded-xl ${isAccepted
						? "border-green-500/50 bg-green-50/50 dark:bg-green-900/10"
						: "border-border/50 hover:border-primary/20"
					}`}
			>
				<CardContent className="p-6">
					<div className="flex gap-6">
						{/* Voting Section */}
						<VotingSection itemId={answer._id} initialVotes={answer.votes} userId={userId} />

						{/* Answer Content */}
						<div className="flex-1 space-y-4">
							{/* Accepted Badge */}
							{isAccepted && (
								<motion.div
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{ opacity: 1, scale: 1 }}
									className="flex items-center gap-2"
								>
									<Badge className="bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400">
										<Award className="h-3 w-3 mr-1" />
										Accepted Answer
									</Badge>
								</motion.div>
							)}

							{/* Answer Content */}
							<div className="prose prose-sm max-w-none dark:prose-invert">
								<p className="text-foreground leading-relaxed whitespace-pre-wrap">{answer.content}</p>
							</div>

							{/* Author and Date */}
							<div className="flex items-center justify-between pt-4 border-t border-border/50">
								<motion.div
									whileHover={{ scale: 1.02 }}
									className="flex items-center gap-3 text-sm text-muted-foreground"
								>
									<Avatar className="h-8 w-8 ring-2 ring-transparent hover:ring-primary/20 transition-all duration-200">
										<AvatarImage src={answer.author.avatar || "/placeholder.svg"} />
										<AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
											{answer.author.name[0].toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<div className="flex items-center gap-1">
										<User className="h-3 w-3" />
										<span className="hover:text-foreground transition-colors duration-200">{answer.author.name}</span>
									</div>
								</motion.div>

								<div className="flex items-center gap-1 text-xs text-muted-foreground">
									<Clock className="h-3 w-3" />
									<span>{formatDate(answer.createdAt)}</span>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	)
}
