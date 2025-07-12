"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2 } from "lucide-react"
import type { MeasurementSheetData, MeasurementEntry } from "../types/invoice"

interface MeasurementSheetFormProps {
	onGenerate: (data: MeasurementSheetData) => void
}

export function MeasurementSheetForm({ onGenerate }: MeasurementSheetFormProps) {
	const [floorLevel, setFloorLevel] = useState("")
	const [materialType, setMaterialType] = useState("")
	const [entries, setEntries] = useState<MeasurementEntry[]>([
		{ id: "1", place: "", length: 0, width: 0, height: 0, quantity: 0 },
	])

	const addEntry = () => {
		const newEntry: MeasurementEntry = {
			id: Date.now().toString(),
			place: "",
			length: 0,
			width: 0,
			height: 0,
			quantity: 0,
		}
		setEntries([...entries, newEntry])
	}

	const removeEntry = (id: string) => {
		setEntries(entries.filter((entry) => entry.id !== id))
	}

	const updateEntry = (id: string, field: keyof MeasurementEntry, value: string | number) => {
		setEntries(entries.map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry)))
	}

	const handleGenerate = () => {
		onGenerate({
			floorLevel,
			materialType,
			entries,
		})
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Measurement Sheet</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<Label htmlFor="floorLevel">Floor Level</Label>
						<Input
							id="floorLevel"
							value={floorLevel}
							onChange={(e) => setFloorLevel(e.target.value)}
							placeholder="e.g., 2nd Floor Work"
						/>
					</div>
					<div>
						<Label htmlFor="materialType">Material Type</Label>
						<Input
							id="materialType"
							value={materialType}
							onChange={(e) => setMaterialType(e.target.value)}
							placeholder="e.g., Granite Stone Fitting"
						/>
					</div>
				</div>

				<div className="space-y-4">
					<div className="grid grid-cols-6 gap-2 text-sm font-medium text-gray-600">
						<div>Place</div>
						<div>Length</div>
						<div>Width</div>
						<div>Height</div>
						<div>Quantity</div>
						<div>Actions</div>
					</div>

					{entries.map((entry) => (
						<div key={entry.id} className="grid grid-cols-6 gap-2">
							<Input
								value={entry.place}
								onChange={(e) => updateEntry(entry.id, "place", e.target.value)}
								placeholder="Place name"
							/>
							<Input
								type="number"
								value={entry.length}
								onChange={(e) => updateEntry(entry.id, "length", Number.parseFloat(e.target.value) || 0)}
								placeholder="Length"
							/>
							<Input
								type="number"
								value={entry.width}
								onChange={(e) => updateEntry(entry.id, "width", Number.parseFloat(e.target.value) || 0)}
								placeholder="Width"
							/>
							<Input
								type="number"
								value={entry.height}
								onChange={(e) => updateEntry(entry.id, "height", Number.parseFloat(e.target.value) || 0)}
								placeholder="Height"
							/>
							<Input
								type="number"
								value={entry.quantity}
								onChange={(e) => updateEntry(entry.id, "quantity", Number.parseFloat(e.target.value) || 0)}
								placeholder="Qty"
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
						Add Entry
					</Button>
					<Button onClick={handleGenerate}>Generate Invoice</Button>
				</div>
			</CardContent>
		</Card>
	)
}
