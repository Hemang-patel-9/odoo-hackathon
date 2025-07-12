"use client"

import { motion } from "framer-motion"
import { CheckCircle, AlertCircle, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const guidelines = [
	{ text: "Be respectful and constructive", icon: Users },
	{ text: "Search before asking", icon: CheckCircle },
	{ text: "Use clear, descriptive titles", icon: AlertCircle },
	{ text: "Include relevant code examples", icon: CheckCircle },
	{ text: "Accept helpful answers", icon: CheckCircle },
]

export default function GuidelinesCard() {
	return (
		<motion.div
			initial={{ opacity: 0, x: 20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.5, delay: 0.3 }}
		>
			<Card className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
				<CardHeader className="pb-4">
					<CardTitle className="text-lg flex items-center gap-2">
						<CheckCircle className="h-5 w-5 text-green-500" />
						Community Guidelines
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					{guidelines.map((guideline, index) => {
						const Icon = guideline.icon
						return (
							<motion.div
								key={index}
								initial={{ opacity: 0, x: -10 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: index * 0.1 }}
								className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 p-2 rounded-lg hover:bg-accent/30"
							>
								<Icon className="h-4 w-4 text-primary flex-shrink-0" />
								<span>{guideline.text}</span>
							</motion.div>
						)
					})}
				</CardContent>
			</Card>
		</motion.div>
	)
}
