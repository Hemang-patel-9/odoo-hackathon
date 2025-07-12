"use client"

import { motion } from "framer-motion"
import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
	searchQuery: string
	onSearchChange: (query: string) => void
	onAskQuestion: () => void
}

export default function SearchBar({ searchQuery, onSearchChange, onAskQuestion }: SearchBarProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="flex flex-col md:flex-row gap-4"
		>
			<div className="relative flex-1">
				<motion.div
					whileFocus={{ scale: 1.02 }}
					transition={{ duration: 0.2 }}
				>
					<Input
						type="text"
						placeholder="Search questions..."
						value={searchQuery}
						onChange={(e) => onSearchChange(e.target.value)}
						className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-border bg-background/50 backdrop-blur-sm text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 shadow-sm hover:shadow-md"
					/>
					<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
				</motion.div>
			</div>
			<motion.div
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
			>
				<Button
					onClick={onAskQuestion}
					className="px-6 py-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl hover:from-primary/90 hover:to-primary/70 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
				>
					Ask New Question
				</Button>
			</motion.div>
		</motion.div>
	)
}
