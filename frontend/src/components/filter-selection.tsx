"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Filter, X } from 'lucide-react'
import { useState } from "react"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface FilterSectionProps {
	selectedSort: string
	onSortChange: (sort: string) => void
	selectedCategories: string[]
	onCategoryToggle: (category: string) => void
	onClearFilters: () => void
	searchQuery: string
}

const sortOptions = [
	{ value: 'newest', label: 'Newest' },
	{ value: 'oldest', label: 'Oldest' },
	{ value: 'most_votes', label: 'Most Votes' },
	{ value: 'most_answers', label: 'Most Answers' },
	{ value: 'trending', label: 'Trending' }
]

const categoryOptions = [
	{ value: 'technology', label: 'Technology', emoji: '🔧' },
	{ value: 'science', label: 'Science', emoji: '🔬' },
	{ value: 'programming', label: 'Programming', emoji: '💻' },
	{ value: 'general', label: 'General', emoji: '💬' },
	{ value: 'career', label: 'Career', emoji: '💼' },
	{ value: 'education', label: 'Education', emoji: '📚' },
	{ value: 'health', label: 'Health', emoji: '🏥' },
	{ value: 'finance', label: 'Finance', emoji: '💰' },
	{ value: 'lifestyle', label: 'Lifestyle', emoji: '🌟' },
	{ value: 'gaming', label: 'Gaming', emoji: '🎮' },
	{ value: 'javascript', label: 'JavaScript', emoji: '🟨' },
	{ value: 'typescript', label: 'TypeScript', emoji: '🔷' },
	{ value: 'react', label: 'React', emoji: '⚛️' },
	{ value: 'nodejs', label: 'Node.js', emoji: '🟩' },
	{ value: 'python', label: 'Python', emoji: '🐍' },
]

export default function FilterSection({
	selectedSort,
	onSortChange,
	selectedCategories,
	onCategoryToggle,
	onClearFilters,
	searchQuery
}: FilterSectionProps) {
	const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)

	const hasActiveFilters = searchQuery || selectedCategories.length > 0 || selectedSort !== 'newest'

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: 0.1 }}
			className="space-y-4"
		>
			<div className="flex flex-col lg:flex-row gap-4">
				{/* Sort Section */}
				<motion.div
					whileHover={{ scale: 1.02 }}
					className="flex-1"
				>
					<label className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
						<Filter className="h-4 w-4" />
						Sort by
					</label>
					<Select value={selectedSort} onValueChange={onSortChange}>
						<SelectTrigger className="w-full bg-background/50 border-2 border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 shadow-sm hover:shadow-md">
							<SelectValue placeholder="Select sort option" />
						</SelectTrigger>
						<SelectContent className="bg-background/95 border border-border rounded-xl text-foreground shadow-xl">
							{sortOptions.map(option => (
								<SelectItem
									key={option.value}
									value={option.value}
									className="hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors duration-200"
								>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</motion.div>

				{/* Categories Section */}
				
				<motion.div
					whileHover={{ scale: 1.02 }}
					className="flex-1 z-50 relative"
				>
					<label className="block text-sm font-medium text-muted-foreground mb-2">
						Categories ({selectedCategories.length} selected)
					</label>
					<button
						type="button"
						onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
						className="w-full px-4 py-3 border-2 border-border rounded-xl bg-background/50 text-foreground text-left flex items-center justify-between focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 shadow-sm hover:shadow-md"
					>
						<span className="text-sm">
							{selectedCategories.length === 0 ? "Select categories..." : `${selectedCategories.length} selected`}
						</span>
						<motion.div
							animate={{ rotate: showCategoryDropdown ? 180 : 0 }}
							transition={{ duration: 0.3 }}
						>
							<ChevronDown className="h-5 w-5" />
						</motion.div>
					</button>

					<AnimatePresence>
						{showCategoryDropdown && (
							<motion.div
								initial={{ opacity: 0, y: -10, scale: 0.95 }}
								animate={{ opacity: 1, y: 0, scale: 1 }}
								exit={{ opacity: 0, y: -10, scale: 0.95 }}
								transition={{ duration: 0.2 }}
								className="absolute z-50 w-full mt-2 bg-background/95 border border-border rounded-xl shadow-2xl max-h-80 overflow-y-auto"
							>
								<div className="p-3 z-50 space-y-1">
									{categoryOptions.map((option, index) => (
										<motion.label
											key={option.value}
											initial={{ opacity: 0, x: -20 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: index * 0.05 }}
											className="flex items-center gap-3 p-3 hover:bg-accent hover:text-accent-foreground cursor-pointer rounded-lg transition-all duration-200 group"
										>
											<input
												type="checkbox"
												checked={selectedCategories.includes(option.value)}
												onChange={() => onCategoryToggle(option.value)}
												className="h-4 w-4 text-primary border-input rounded focus:ring-primary transition-colors duration-200"
											/>
											<span className="text-sm flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-200">
												<span className="text-lg">{option.emoji}</span>
												{option.label}
											</span>
										</motion.label>
									))}
								</div>
								<div className="border-t border-border p-3">
									<button
										onClick={() => {
											selectedCategories.forEach(cat => onCategoryToggle(cat))
											setShowCategoryDropdown(false)
										}}
										className="w-full text-sm text-destructive hover:text-destructive/80 transition-colors duration-200 py-2 rounded-lg hover:bg-destructive/10"
									>
										Clear all categories
									</button>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</motion.div>
			</div>

			{/* Active Filters */}
			<AnimatePresence>
				{selectedCategories.length > 0 && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						className="flex flex-wrap gap-2"
					>
						{selectedCategories.map((category, index) => {
							const option = categoryOptions.find(opt => opt.value === category)
							return (
								<motion.div
									key={category}
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.8 }}
									transition={{ delay: index * 0.05 }}
								>
									<Badge
										variant="secondary"
										className="bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer transition-colors duration-200 px-3 py-1 rounded-full"
										onClick={() => onCategoryToggle(category)}
									>
										{option?.emoji} {option?.label}
										<X className="ml-2 h-3 w-3" />
									</Badge>
								</motion.div>
							)
						})}
					</motion.div>
				)}
			</AnimatePresence>

			{/* Clear Filters Button */}
			<AnimatePresence>
				{hasActiveFilters && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
					>
						<Button
							variant="ghost"
							onClick={onClearFilters}
							className="text-sm text-destructive hover:text-destructive/80 hover:bg-destructive/10 transition-all duration-200 rounded-lg"
						>
							<X className="h-4 w-4 mr-2" />
							Clear all filters
						</Button>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	)
}
