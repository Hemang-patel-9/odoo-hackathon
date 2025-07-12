"use client"

import { motion } from "framer-motion"
import { MessageCircle, Clock, User } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import VotingButtons from "./voting-buttons"
import type { Question } from "@/types/questions"

interface QuestionCardProps {
	question: Question
	index: number
	onQuestionClick: (id: string) => void
	userId?: string
}

export default function QuestionCard({ question, index, onQuestionClick, userId }: QuestionCardProps) {
	const formatDate = (dateString: string) => {
		const date = new Date(dateString)
		const now = new Date()
		const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

		if (diffInHours < 1) return 'Just now'
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
			className="group z-0"
		>
			<Card className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 group-hover:border-primary/20">
				<CardContent className="p-6 z-0">
					<div className="flex gap-6 z-0">
						{/* Voting Section */}
						<VotingButtons
							questionId={question._id}
							initialVotes={question.votes}
							userId={userId}
						/>

						{/* Stats Section */}
						<div className="flex flex-col items-center space-y-3 text-sm text-muted-foreground min-w-[80px]">
							<motion.div
								whileHover={{ scale: 1.05 }}
								className="text-center p-3 rounded-xl bg-accent/50 hover:bg-accent transition-colors duration-200"
							>
								<div className="font-semibold text-foreground flex items-center gap-1">
									<MessageCircle className="h-4 w-4" />
									{question.answerCount || 0}
								</div>
								<div className="text-xs">Answers</div>
							</motion.div>
						</div>

						{/* Content Section */}
						<div className="flex-1 space-y-4">
							<motion.h3
								whileHover={{ x: 4 }}
								className="text-xl font-semibold text-foreground hover:text-primary cursor-pointer transition-all duration-200 line-clamp-2"
								onClick={() => onQuestionClick(question._id)}
							>
								{question.title}
							</motion.h3>

							<p className="text-muted-foreground line-clamp-2 leading-relaxed">
								{question.description}
							</p>

							{/* Tags */}
							<div className="flex flex-wrap gap-2">
								{question.tags.map((tag:any, tagIndex:number) => (
									<motion.div
										key={tag}
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{ delay: tagIndex * 0.05 }}
										whileHover={{ scale: 1.05 }}
									>
										<Badge
											variant="secondary"
											className="bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer transition-all duration-200 rounded-full px-3 py-1"
										>
											{tag}
										</Badge>
									</motion.div>
								))}
							</div>

							{/* Author and Date */}
							<div className="flex items-center justify-between pt-2 border-t border-border/50">
								<motion.div
									whileHover={{ scale: 1.02 }}
									className="flex items-center gap-3 text-sm text-muted-foreground"
								>
									<Avatar className="h-8 w-8 ring-2 ring-transparent hover:ring-primary/20 transition-all duration-200">
										<AvatarImage src={question.author.avatar || "/placeholder.svg"} />
										<AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
											{question.author.name[0].toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<div className="flex items-center gap-1">
										<User className="h-3 w-3" />
										<span className="hover:text-foreground transition-colors duration-200">
											{question.author.name}
										</span>
									</div>
								</motion.div>

								<div className="flex items-center gap-1 text-xs text-muted-foreground">
									<Clock className="h-3 w-3" />
									<span>{formatDate(question.createdAt)}</span>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	)
}
