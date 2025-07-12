"use client"

import { motion } from "framer-motion"
import { ChevronUp, ChevronDown } from 'lucide-react'
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/authContext"

interface VotingButtonsProps {
	questionId: string
	initialVotes: string[]
	userId?: string
	onVote?: (questionId: string, voteType: 'up' | 'down') => void
}

export default function VotingButtons({ questionId, initialVotes, userId, onVote }: VotingButtonsProps) {
	const [votes, setVotes] = useState(initialVotes)
	const [userVote, setUserVote] = useState<'up' | 'down' | null>(null)
	const { token } = useAuth();

	const handleVote = async (voteType: 'up' | 'down') => {
		if (!userId) return

		const newUserVote = userVote === voteType ? null : voteType
		setUserVote(newUserVote)

		handleVoteChange(voteType, userId, questionId);

		let newVotes = [...votes]
		if (userVote === 'up') {
			newVotes = newVotes.filter(v => v !== userId)
		} else if (userVote === 'down') {
			newVotes = newVotes.filter(v => v !== userId)
		}

		if (newUserVote === 'up') {
			newVotes.push(userId)
		} else if (newUserVote === 'down') {
			newVotes = newVotes.filter(v => v !== userId)
		}

		setVotes(newVotes)
		onVote?.(questionId, voteType)
	}

	const handleVoteChange = async (type: string, userId: string, questionId: string) => {
		let vtype = type == "up" ? 1 : -1;
		await fetch(`${import.meta.env.VITE_APP_API_URL}/questions/${questionId}/vote`, {
			method: "POST",
			body: JSON.stringify({
				vType: vtype,
				userId: userId
			}
			)
		}).then((res) => res.json());
	}

	const voteCount = votes.length

	return (
		<div className="flex flex-col items-center space-y-2 min-w-[60px]">
			<motion.div
				whileHover={{ scale: 1.1 }}
				whileTap={{ scale: 0.9 }}
			>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => handleVote('up')}
					className={`p-2 rounded-full transition-all duration-200 ${userVote === 'up'
						? 'bg-green-100 text-green-600 hover:bg-green-200'
						: 'hover:bg-accent text-muted-foreground hover:text-foreground'
						}`}
				>
					<ChevronUp className="h-5 w-5" />
				</Button>
			</motion.div>

			<motion.div
				key={voteCount}
				initial={{ scale: 1.2 }}
				animate={{ scale: 1 }}
				className={`text-lg font-bold transition-colors duration-200 ${voteCount > 0 ? 'text-green-600' : voteCount < 0 ? 'text-red-600' : 'text-muted-foreground'
					}`}
			>
				{voteCount}
			</motion.div>

			<motion.div
				whileHover={{ scale: 1.1 }}
				whileTap={{ scale: 0.9 }}
			>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => handleVote('down')}
					className={`p-2 rounded-full transition-all duration-200 ${userVote === 'down'
						? 'bg-red-100 text-red-600 hover:bg-red-200'
						: 'hover:bg-accent text-muted-foreground hover:text-foreground'
						}`}
				>
					<ChevronDown className="h-5 w-5" />
				</Button>
			</motion.div>
		</div>
	)
}
