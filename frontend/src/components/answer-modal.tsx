"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Send, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import RichTextEditor from "./rich-text-editor"

interface AnswerModalProps {
	isOpen: boolean
	onClose: () => void
	onSubmit: (content: string) => Promise<void>
	questionTitle: string
}

export default function AnswerModal({ isOpen, onClose, onSubmit, questionTitle }: AnswerModalProps) {
	const [content, setContent] = useState("")
	const [isSubmitting, setIsSubmitting] = useState(false)

	const handleSubmit = async () => {
		if (!content.trim()) return

		setIsSubmitting(true)
		try {
			await onSubmit(content)
			setContent("")
			onClose()
		} catch (error) {
			console.error("Error submitting answer:", error)
		} finally {
			setIsSubmitting(false)
		}
	}

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
						Answer Question
					</DialogTitle>
					<p className="text-muted-foreground text-sm mt-2 line-clamp-2">Answering: "{questionTitle}"</p>
				</DialogHeader>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3 }}
					className="space-y-6"
				>
					<div className="space-y-3">
						<label className="text-sm font-medium text-foreground">Your Answer</label>
						<RichTextEditor
							value={content}
							onChange={setContent}
							placeholder="Write your answer here. Be clear and provide examples if possible..."
						/>
					</div>

					<div className="flex justify-end gap-4 pt-4 border-t border-border/50">
						<Button
							variant="outline"
							onClick={onClose}
							className="border-border text-foreground hover:bg-muted hover:text-foreground rounded-xl px-6 transition-all duration-200 bg-transparent"
						>
							<X className="h-4 w-4 mr-2" />
							Cancel
						</Button>
						<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
							<Button
								onClick={handleSubmit}
								disabled={!content.trim() || isSubmitting}
								className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 rounded-xl px-6 transition-all duration-300 shadow-lg hover:shadow-xl"
							>
								{isSubmitting ? (
									<>
										<motion.div
											animate={{ rotate: 360 }}
											transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
											className="w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"
										/>
										Posting...
									</>
								) : (
									<>
										<Send className="h-4 w-4 mr-2" />
										Post Answer
									</>
								)}
							</Button>
						</motion.div>
					</div>
				</motion.div>
			</DialogContent>
		</Dialog>
	)
}
