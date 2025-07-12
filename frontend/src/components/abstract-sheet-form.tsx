"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2 } from "lucide-react"
import type { AbstractSheetData, AbstractEntry } from "../types/invoice"

interface AbstractSheetFormProps {
	onGenerate: (data: AbstractSheetData) => void
}

export function AbstractSheetForm({ onGenerate }: AbstractSheetFormProps) {
	const [materialType, setMaterialType] = useState("")
	const [entries, setEntries] = useState<AbstractEntry[]>([{ id: "1", floor: "", quantity: 0 }])

	const addEntry = () => {
		const newEntry: AbstractEntry = {
			id: Date.now().toString(),
			floor: "",
			quantity: 0,
		}
		setEntries([...entries, newEntry])
	}

	const removeEntry = (id: string) => {
		setEntries(entries.filter((entry) => entry.id !== id))
	}

	const updateEntry = (id: string, field: keyof AbstractEntry, value: string | number) => {
		setEntries(entries.map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry)))
	}

	const handleGenerate = () => {
		onGenerate({
			materialType,
			entries,
		})
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Abstract Sheet</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<div>
					<Label htmlFor="materialType">Material Type</Label>
					<Input
						id="materialType"
						value={materialType}
						onChange={(e) => setMaterialType(e.target.value)}
						placeholder="e.g., Granite Stone"
					/>
				</div>

				<div className="space-y-4">
					<div className="grid grid-cols-3 gap-2 text-sm font-medium text-gray-600">
						<div>Floor</div>
						<div>Quantity</div>
						<div>Actions</div>
					</div>

					{entries.map((entry) => (
						<div key={entry.id} className="grid grid-cols-3 gap-2">
							<Input
								value={entry.floor}
								onChange={(e) => updateEntry(entry.id, "floor", e.target.value)}
								placeholder="Floor name"
							/>
							<Input
								type="number"
								value={entry.quantity}
								onChange={(e) => updateEntry(entry.id, "quantity", Number.parseFloat(e.target.value) || 0)}
								placeholder="Quantity"
							/>
							<Button variant="outline" size="sm" onClick={() => removeEntry(entry.id)} disabled={entries.length === 1}>
								<Trash2 className="h-4 w-4" />
							</Button>
						</div>
					))}
				</div>

				<div className="flex gap-4">
					<Button variant="outline" onClick={addEntry}>
						<Plus className="h-4 w-4 mr-2" />
						Add Floor
					</Button>
					<Button onClick={handleGenerate}>Generate Invoice</Button>
				</div>
			</CardContent>
		</Card>
	)
}
