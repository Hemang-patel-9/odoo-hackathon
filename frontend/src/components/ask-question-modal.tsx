"use client"

import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { Bold, Italic, List, Link2, ImageIcon, AlignLeft, AlignCenter, AlignRight, Smile, X, Send } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

interface AskQuestionModalProps {
	isOpen: boolean
	onClose: () => void
	onSubmit: (data: { title: string; description: string; tags: string[] }) => void
}

export default function AskQuestionModal({ isOpen, onClose, onSubmit }: AskQuestionModalProps) {
	const [title, setTitle] = useState("")
	const [description, setDescription] = useState("")
	const [tags, setTags] = useState<string[]>([])
	const [tagInput, setTagInput] = useState("")
	const [isSubmitting, setIsSubmitting] = useState(false)

	const addTag = (inputTags: string) => {
		const newTags = inputTags
			.split(/\s+/)
			.map((tag) => tag.trim().toLowerCase())
			.filter((tag) => tag && !tags.includes(tag) && tags.length < 5)

		if (newTags.length > 0) {
			const availableSlots = 5 - tags.length
			setTags([...tags, ...newTags.slice(0, availableSlots)])
			setTagInput("")
		}
	}

	const removeTag = (tagToRemove: string) => {
		setTags(tags.filter((tag) => tag !== tagToRemove))
	}

	const handleTagKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault()
			addTag(tagInput)
		}
	}

	const handleSubmit = async () => {
		if (!title.trim() || !description.trim() || tags.length === 0) return

		setIsSubmitting(true)
		try {
			await onSubmit({ title, description, tags })
			setTitle("")
			setDescription("")
			setTags([])
			setTagInput("")
			onClose()
		} catch (error) {
			console.error("Error submitting question:", error)
		} finally {
			setIsSubmitting(false)
		}
	}

	const toolbarIcons = [Bold, Italic, List, Link2, ImageIcon, AlignLeft, AlignCenter, AlignRight, Smile]

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="bg-background/95 backdrop-blur-sm border border-border/50 text-foreground max-w-4xl rounded-2xl shadow-2xl">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
						<motion.div
							initial={{ rotate: 0 }}
							animate={{ rotate: 360 }}
							transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
							className="w-6 h-6 bg-gradient-to-r from-primary to-primary/60 rounded-full"
						/>
						Ask a Question
					</DialogTitle>
				</DialogHeader>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3 }}
					className="space-y-6"
				>
					{/* Title Input */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.1 }}
						className="space-y-2"
					>
						<label className="text-sm font-medium text-foreground">Question Title</label>
						<Input
							placeholder="What's your question? Be specific and clear..."
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							className="rounded-xl border-2 border-border bg-background/50 backdrop-blur-sm text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
						/>
					</motion.div>

					{/* Description with Toolbar */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.2 }}
						className="space-y-2"
					>
						<label className="text-sm font-medium text-foreground">Description</label>
						<div className="border-2 border-border rounded-xl overflow-hidden bg-background/50 backdrop-blur-sm">
							<div className="bg-muted/30 p-3 border-b border-border/50">
								<div className="flex flex-wrap gap-1">
									{toolbarIcons.map((Icon, i) => (
										<motion.div key={i} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
											<Button
												variant="ghost"
												size="sm"
												className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-all duration-200"
											>
												<Icon className="h-4 w-4" />
											</Button>
										</motion.div>
									))}
								</div>
							</div>
							<Textarea
								placeholder="Provide details about your question. Include what you've tried and what you're expecting..."
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								className="min-h-[200px] bg-transparent border-0 text-foreground placeholder-muted-foreground focus:ring-0 focus:border-0 resize-none"
							/>
						</div>
					</motion.div>

					{/* Tags Input */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.3 }}
						className="space-y-3"
					>
						<label className="text-sm font-medium text-foreground">Tags ({tags.length}/5)</label>
						<Input
							placeholder="Add tags (space-separated, max 5)..."
							value={tagInput}
							onChange={(e) => setTagInput(e.target.value)}
							onKeyDown={handleTagKeyPress}
							className="rounded-xl border-2 border-border bg-background/50 backdrop-blur-sm text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
							disabled={tags.length >= 5}
						/>

						{/* Tags Display */}
						<AnimatePresence>
							{tags.length > 0 && (
								<motion.div
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: "auto" }}
									exit={{ opacity: 0, height: 0 }}
									className="flex flex-wrap gap-2"
								>
									{tags.map((tag, index) => (
										<motion.div
											key={tag}
											initial={{ opacity: 0, scale: 0.8 }}
											animate={{ opacity: 1, scale: 1 }}
											exit={{ opacity: 0, scale: 0.8 }}
											transition={{ delay: index * 0.05 }}
											whileHover={{ scale: 1.05 }}
										>
											<Badge
												onClick={() => removeTag(tag)}
												className="bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer px-3 py-1 rounded-full transition-all duration-200 flex items-center gap-2"
											>
												{tag}
												<X className="h-3 w-3" />
											</Badge>
										</motion.div>
									))}
								</motion.div>
							)}
						</AnimatePresence>
					</motion.div>

					{/* Action Buttons */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
						className="flex justify-end gap-4 pt-4 border-t border-border/50"
					>
						<Button
							variant="outline"
							onClick={onClose}
							className="border-border text-foreground hover:bg-muted hover:text-foreground rounded-xl px-6 transition-all duration-200 bg-transparent"
						>
							Cancel
						</Button>
						<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
							<Button
								onClick={handleSubmit}
								className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 rounded-xl px-6 transition-all duration-300 shadow-lg hover:shadow-xl"
								disabled={!(title.trim() && description.trim() && tags.length > 0) || isSubmitting}
							>
								{isSubmitting ? (
									<motion.div
										animate={{ rotate: 360 }}
										transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
										className="w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"
									/>
								) : (
									<Send className="h-4 w-4 mr-2" />
								)}
								{isSubmitting ? "Posting..." : "Post Question"}
							</Button>
						</motion.div>
					</motion.div>
				</motion.div>
			</DialogContent>
		</Dialog>
	)
}
