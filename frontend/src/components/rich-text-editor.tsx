"use client"

import { useRef } from "react"
import { Textarea } from "@/components/ui/textarea"
import RichTextToolbar from "./rich-text-toolbar.tsx"

interface RichTextEditorProps {
	value: string
	onChange: (value: string) => void
	placeholder?: string
	className?: string
}

export default function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
	const textareaRef = useRef<HTMLTextAreaElement>(null)

	const insertText = (before: string, after = "", placeholder = "") => {
		const textarea = textareaRef.current
		if (!textarea) return

		const start = textarea.selectionStart
		const end = textarea.selectionEnd
		const selectedText = value.substring(start, end)
		const textToInsert = selectedText || placeholder

		const newText = value.substring(0, start) + before + textToInsert + after + value.substring(end)
		onChange(newText)

		// Set cursor position after state update
		setTimeout(() => {
			const newCursorPos = start + before.length + textToInsert.length
			textarea.setSelectionRange(newCursorPos, newCursorPos)
			textarea.focus()
		}, 0)
	}

	const handleFormat = (format: string, customValue?: string) => {
		switch (format) {
			case "bold":
				insertText("**", "**", "bold text")
				break
			case "italic":
				insertText("*", "*", "italic text")
				break
			case "underline":
				insertText("<u>", "</u>", "underlined text")
				break
			case "code":
				insertText("`", "`", "code")
				break
			case "unorderedList":
				insertText("- ", "", "list item")
				break
			case "orderedList":
				insertText("1. ", "", "list item")
				break
			case "quote":
				insertText("> ", "", "quote")
				break
			case "heading":
				insertText("## ", "", "heading")
				break
			case "link":
				const url = prompt("Enter URL:")
				if (url) {
					insertText("[", `](${url})`, "link text")
				}
				break
			case "image":
				const imageUrl = prompt("Enter image URL:")
				if (imageUrl) {
					const alt = prompt("Enter alt text (optional):") || "image"
					insertText(`![${alt}](${imageUrl})`)
				}
				break
			case "emoji":
				insertText("😊")
				break
			case "alignLeft":
				insertText('<div align="left">', "</div>", "left aligned text")
				break
			case "alignCenter":
				insertText('<div align="center">', "</div>", "centered text")
				break
			case "alignRight":
				insertText('<div align="right">', "</div>", "right aligned text")
				break
			default:
				break
		}
	}

	return (
		<div className="space-y-0">
			<RichTextToolbar onFormat={handleFormat} />
			<Textarea
				ref={textareaRef}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				className={`min-h-[300px] bg-background border-border border-t-0 rounded-t-none text-foreground placeholder-muted-foreground resize-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 ${className}`}
				onKeyDown={(e) => {
					if (e.ctrlKey || e.metaKey) {
						switch (e.key) {
							case "b":
								e.preventDefault()
								handleFormat("bold")
								break
							case "i":
								e.preventDefault()
								handleFormat("italic")
								break
						}
					}
				}}
			/>
		</div>
	)
}
