"use client"

import { Card, CardContent } from "@/components/ui/card"
import { FileText, BarChart3, Receipt } from "lucide-react"

interface InvoiceTypeSelectorProps {
	selectedType: string | null
	onTypeSelect: (type: "measurement" | "abstract" | "tax") => void
}

export function InvoiceTypeSelector({ selectedType, onTypeSelect }: InvoiceTypeSelectorProps) {
	const invoiceTypes = [
		{
			id: "measurement",
			title: "Measurement Sheet",
			description: "Standard layout for detailed measurements",
			icon: FileText,
			color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
		},
		{
			id: "abstract",
			title: "Abstract Sheet",
			description: "Floor-wise material summary",
			icon: BarChart3,
			color: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
		},
		{
			id: "tax",
			title: "Tax Invoice",
			description: "Customizable template",
			icon: Receipt,
			color: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",
		},
	]

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
			{invoiceTypes.map((type) => {
				const Icon = type.icon
				return (
					<Card
						key={type.id}
						className={`cursor-pointer transition-all hover:shadow-md ${selectedType === type.id ? "ring-4 ring-blue-500" : ""
							} ${type.color}`}
						onClick={() => onTypeSelect(type.id as "measurement" | "abstract" | "tax")}
					>
						<CardContent className="p-6 text-center">
							<Icon className="h-12 w-12 mx-auto mb-4 text-gray-600" />
							<h3 className="font-semibold text-lg mb-2">{type.title}</h3>
							<p className="text-sm text-gray-600">{type.description}</p>
						</CardContent>
					</Card>
				)
			})}
		</div>
	)
}
