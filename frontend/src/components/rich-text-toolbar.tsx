"use client"

import { motion } from "framer-motion"
import {
	Bold,
	Italic,
	Underline,
	List,
	ListOrdered,
	Link2,
	ImageIcon,
	Code,
	Quote,
	Type,
	AlignLeft,
	AlignCenter,
	AlignRight,
	Smile,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface RichTextToolbarProps {
	onFormat: (format: string, value?: string) => void
}

export default function RichTextToolbar({ onFormat }: RichTextToolbarProps) {
	const toolbarGroups = [
		[
			{ icon: Bold, action: () => onFormat("bold"), tooltip: "Bold" },
			{ icon: Italic, action: () => onFormat("italic"), tooltip: "Italic" },
			{ icon: Underline, action: () => onFormat("underline"), tooltip: "Underline" },
			{ icon: Code, action: () => onFormat("code"), tooltip: "Code" },
		],
		[
			{ icon: List, action: () => onFormat("unorderedList"), tooltip: "Bullet List" },
			{ icon: ListOrdered, action: () => onFormat("orderedList"), tooltip: "Numbered List" },
			{ icon: Quote, action: () => onFormat("quote"), tooltip: "Quote" },
		],
		[
			{ icon: AlignLeft, action: () => onFormat("alignLeft"), tooltip: "Align Left" },
			{ icon: AlignCenter, action: () => onFormat("alignCenter"), tooltip: "Align Center" },
			{ icon: AlignRight, action: () => onFormat("alignRight"), tooltip: "Align Right" },
		],
		[
			{ icon: Link2, action: () => onFormat("link"), tooltip: "Insert Link" },
			{ icon: ImageIcon, action: () => onFormat("image"), tooltip: "Insert Image" },
			{ icon: Type, action: () => onFormat("heading"), tooltip: "Heading" },
			{ icon: Smile, action: () => onFormat("emoji"), tooltip: "Emoji" },
		],
	]

	return (
		<motion.div
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			className="border border-border rounded-t-xl bg-muted/30 p-3"
		>
			<div className="flex flex-wrap gap-1">
				{toolbarGroups.map((group, groupIndex) => (
					<div key={groupIndex} className="flex gap-1">
						{group.map((button, index) => {
							const Icon = button.icon
							return (
								<motion.div key={index} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-all duration-200"
										onClick={button.action}
										title={button.tooltip}
									>
										<Icon className="h-4 w-4" />
									</Button>
								</motion.div>
							)
						})}
						{groupIndex < toolbarGroups.length - 1 && <Separator orientation="vertical" className="h-8 mx-1" />}
					</div>
				))}
			</div>
		</motion.div>
	)
}
