"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2 } from "lucide-react"
import type { TaxInvoiceData, TaxInvoiceItem } from "../types/invoice"

interface TaxInvoiceFormProps {
	onGenerate: (data: TaxInvoiceData) => void
}

export function TaxInvoiceForm({ onGenerate }: TaxInvoiceFormProps) {
	const [invoiceNumber, setInvoiceNumber] = useState("INV-001")
	const [date, setDate] = useState(new Date().toISOString().split("T")[0])
	const [clientDetails, setClientDetails] = useState("")
	const [items, setItems] = useState<TaxInvoiceItem[]>([{ id: "1", item: "", quantity: 0, rate: 0, amount: 0 }])

	const addItem = () => {
		const newItem: TaxInvoiceItem = {
			id: Date.now().toString(),
			item: "",
			quantity: 0,
			rate: 0,
			amount: 0,
		}
		setItems([...items, newItem])
	}

	const removeItem = (id: string) => {
		setItems(items.filter((item) => item.id !== id))
	}

	const updateItem = (id: string, field: keyof TaxInvoiceItem, value: string | number) => {
		setItems(
			items.map((item) => {
				if (item.id === id) {
					const updatedItem = { ...item, [field]: value }
					if (field === "quantity" || field === "rate") {
						updatedItem.amount = updatedItem.quantity * updatedItem.rate
					}
					return updatedItem
				}
				return item
			}),
		)
	}

	const handleGenerate = () => {
		onGenerate({
			invoiceNumber,
			date,
			clientDetails,
			items,
		})
	}

	const totalAmount = items.reduce((sum, item) => sum + item.amount, 0)

	return (
		<Card>
			<CardHeader>
				<CardTitle>Tax Invoice</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<Label htmlFor="invoiceNumber">Invoice Number</Label>
						<Input id="invoiceNumber" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
					</div>
					<div>
						<Label htmlFor="date">Date</Label>
						<Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
					</div>
				</div>

				<div>
					<Label htmlFor="clientDetails">Client Details</Label>
					<Textarea
						id="clientDetails"
						value={clientDetails}
						onChange={(e) => setClientDetails(e.target.value)}
						placeholder="Enter client details"
						rows={3}
					/>
				</div>

				<div className="space-y-4">
					<div className="grid grid-cols-5 gap-2 text-sm font-medium text-gray-600">
						<div>Item</div>
						<div>Quantity</div>
						<div>Rate</div>
						<div>Amount</div>
						<div>Actions</div>
					</div>

					{items.map((item) => (
						<div key={item.id} className="grid grid-cols-5 gap-2">
							<Input
								value={item.item}
								onChange={(e) => updateItem(item.id, "item", e.target.value)}
								placeholder="Item description"
							/>
							<Input
								type="number"
								value={item.quantity}
								onChange={(e) => updateItem(item.id, "quantity", Number.parseFloat(e.target.value) || 0)}
								placeholder="Qty"
							/>
							<Input
								type="number"
								value={item.rate}
								onChange={(e) => updateItem(item.id, "rate", Number.parseFloat(e.target.value) || 0)}
								placeholder="Rate"
							/>
							<Input type="number" value={item.amount} readOnly className="bg-gray-50" />
							<Button variant="outline" size="sm" onClick={() => removeItem(item.id)} disabled={items.length === 1}>
								<Trash2 className="h-4 w-4" />
							</Button>
						</div>
					))}
				</div>

				<div className="flex justify-between items-center pt-4 border-t">
					<div className="text-lg font-semibold">Total: ₹{totalAmount.toFixed(2)}</div>
				</div>

				<div className="flex gap-4">
					<Button variant="outline" onClick={addItem}>
						<Plus className="h-4 w-4 mr-2" />
						Add Item
					</Button>
					<Button onClick={handleGenerate}>Generate Invoice</Button>
				</div>
			</CardContent>
		</Card>
	)
}
