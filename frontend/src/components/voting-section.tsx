"use client"

import { motion } from "framer-motion"
import { ChevronUp, ChevronDown, Bookmark, BookmarkCheck } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface VotingSectionProps {
	itemId: string
	initialVotes: string[]
	userId?: string
	onVote?: (itemId: string, voteType: "up" | "down") => void
	showBookmark?: boolean
}

export default function VotingSection({
	itemId,
	initialVotes,
	userId,
	onVote,
	showBookmark = false,
}: VotingSectionProps) {
	const [votes, setVotes] = useState(initialVotes)
	const [userVote, setUserVote] = useState<"up" | "down" | null>(null)
	const [isBookmarked, setIsBookmarked] = useState(false)

	const handleVote = async (voteType: "up" | "down") => {
		if (!userId) return

		const newUserVote = userVote === voteType ? null : voteType
		setUserVote(newUserVote)

		// Simulate vote change
		let newVotes = [...votes]
		if (userVote === "up") {
			newVotes = newVotes.filter((v) => v !== userId)
		} else if (userVote === "down") {
			newVotes = newVotes.filter((v) => v !== userId)
		}

		if (newUserVote === "up") {
			newVotes.push(userId)
		} else if (newUserVote === "down") {
			newVotes = newVotes.filter((v) => v !== userId)
		}

		setVotes(newVotes)
		onVote?.(itemId, voteType)
	}

	const voteCount = votes.length

	return (
		<div className="flex flex-col items-center space-y-2 min-w-[60px]">
			<motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => handleVote("up")}
					className={`p-2 rounded-full transition-all duration-200 ${userVote === "up"
							? "bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
							: "hover:bg-accent text-muted-foreground hover:text-foreground"
						}`}
				>
					<ChevronUp className="h-6 w-6" />
				</Button>
			</motion.div>

			<motion.div
				key={voteCount}
				initial={{ scale: 1.2 }}
				animate={{ scale: 1 }}
				className={`text-xl font-bold transition-colors duration-200 ${voteCount > 0 ? "text-green-600" : voteCount < 0 ? "text-red-600" : "text-muted-foreground"
					}`}
			>
				{voteCount}
			</motion.div>

			<motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => handleVote("down")}
					className={`p-2 rounded-full transition-all duration-200 ${userVote === "down"
							? "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
							: "hover:bg-accent text-muted-foreground hover:text-foreground"
						}`}
				>
					<ChevronDown className="h-6 w-6" />
				</Button>
			</motion.div>

			{showBookmark && (
				<motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="mt-4">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => setIsBookmarked(!isBookmarked)}
						className={`p-2 rounded-full transition-all duration-200 ${isBookmarked
								? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400"
								: "hover:bg-accent text-muted-foreground hover:text-foreground"
							}`}
					>
						{isBookmarked ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
					</Button>
				</motion.div>
			)}
		</div>
	)
}
