"use client"

import { motion } from "framer-motion";
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/authContext";

interface Vote {
	user: string;
	vote: number; // 1 = upvote, -1 = downvote
	_id?: string;
}

interface VotingButtonsProps {
	questionId: string;
	initialVotes: Vote[];
	userId?: string;
	onVote?: (questionId: string, voteType: 'up' | 'down') => void;
}

export default function VotingButtons({
	questionId,
	initialVotes,
	userId,
	onVote,
}: VotingButtonsProps) {
	const [votes, setVotes] = useState<Vote[]>(initialVotes || []);
	const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
	const { token } = useAuth();

	// Detect existing vote on mount
	useEffect(() => {
		if (!userId) return;

		const existing = initialVotes.find((v) => v.user === userId);
		if (existing?.vote === 1) setUserVote('up');
		else if (existing?.vote === -1) setUserVote('down');
		else setUserVote(null);
	}, [initialVotes, userId]);

	const upvotes = votes.filter((v) => v.vote === 1).length;
	const downvotes = votes.filter((v) => v.vote === -1).length;

	const handleVote = async (voteType: 'up' | 'down') => {
		if (!userId) return;

		const newVote: 'up' | 'down' | null = userVote === voteType ? null : voteType;
		setUserVote(newVote);
		await handleVoteChange(newVote, userId, questionId);

		let updatedVotes = votes.filter((v) => v.user !== userId);

		if (newVote) {
			updatedVotes.push({
				user: userId,
				vote: newVote === 'up' ? 1 : -1,
			});
		}

		setVotes(updatedVotes);
		onVote?.(questionId, voteType);
	};

	const handleVoteChange = async (
		type: 'up' | 'down' | null,
		userId: string,
		questionId: string
	): Promise<void> => {
		try {
			const vType = type === 'up' ? 1 : type === 'down' ? -1 : 0;

			const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/questions/${questionId}/vote`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					vType,
					userId,
				}),
			});

			const result = await response.json();

			if (!response.ok) {
				console.error('❌ Vote failed:', result.message || 'Unknown error');
				return;
			}

			console.log('✅ Vote response:', result);
		} catch (error) {
			console.error('❌ Error while voting:', error);
		}
	};

	return (
		<div className="flex flex-col items-center space-y-2 min-w-[60px]">
			<motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
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
				key={upvotes - downvotes}
				initial={{ scale: 1.2 }}
				animate={{ scale: 1 }}
				className={`text-lg font-bold transition-colors duration-200 ${upvotes - downvotes > 0
					? 'text-green-600'
					: upvotes - downvotes < 0
						? 'text-red-600'
						: 'text-muted-foreground'
					}`}
			>
				{upvotes - downvotes}
			</motion.div>

			<motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
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
	);
}
