"use client"

import { useState } from "react"
import { InvoiceTypeSelector } from "@/components/invoice-type-selector"
import { MeasurementSheetForm } from "@/components/measurement-sheet-form"
import { AbstractSheetForm } from "@/components/abstract-sheet-form"
import { TaxInvoiceForm } from "@/components/tax-invoice-form"
import type { Invoice, MeasurementSheetData, AbstractSheetData, TaxInvoiceData } from "@/types/invoice"

export default function BillingPage() {
	const [selectedType, setSelectedType] = useState<"measurement" | "abstract" | "tax" | null>(null)
	const [invoices, setInvoices] = useState<Invoice[]>([])

	const generateInvoiceNumber = () => {
		const lastInvoice = invoices[invoices.length - 1]
		const lastNumber = lastInvoice ? Number.parseInt(lastInvoice.number.split("-")[1]) : 0
		return `INV-${(lastNumber + 1).toString().padStart(3, "0")}`
	}

	const handleMeasurementGenerate = (data: MeasurementSheetData) => {
		const newInvoice: Invoice = {
			id: Date.now().toString(),
			number: generateInvoiceNumber(),
			type: "measurement",
			date: new Date().toLocaleDateString(),
			status: "draft",
			clientName: data.floorLevel,
			totalAmount: Math.random() * 50000 + 10000, // Mock calculation
		}
		setInvoices([...invoices, newInvoice])
		setSelectedType(null)
	}

	const handleAbstractGenerate = (data: AbstractSheetData) => {
		const newInvoice: Invoice = {
			id: Date.now().toString(),
			number: generateInvoiceNumber(),
			type: "abstract",
			date: new Date().toLocaleDateString(),
			status: "draft",
			clientName: data.materialType,
			totalAmount: Math.random() * 40000 + 8000, // Mock calculation
		}
		setInvoices([...invoices, newInvoice])
		setSelectedType(null)
	}

	const handleTaxGenerate = (data: TaxInvoiceData) => {
		const totalAmount = data.items.reduce((sum, item) => sum + item.amount, 0)
		const newInvoice: Invoice = {
			id: Date.now().toString(),
			number: data.invoiceNumber,
			type: "tax",
			date: data.date,
			status: "draft",
			clientName: data.clientDetails.split("\n")[0] || "Client",
			totalAmount,
		}
		setInvoices([...invoices, newInvoice])
		setSelectedType(null)
	}

	const renderForm = () => {
		switch (selectedType) {
			case "measurement":
				return <MeasurementSheetForm onGenerate={handleMeasurementGenerate} />
			case "abstract":
				return <AbstractSheetForm onGenerate={handleAbstractGenerate} />
			case "tax":
				return <TaxInvoiceForm onGenerate={handleTaxGenerate} />
			default:
				return null
		}
	}

	return (
		<div className="container mx-auto p-6 space-y-8">
			<div>
				<h1 className="text-3xl font-bold mb-2">Invoice Management System</h1>
				<p className="text-gray-600">Generate & View Invoices for Clients</p>
			</div>

			<div>
				<h2 className="text-xl font-semibold mb-6">Generate New Invoice</h2>
				<InvoiceTypeSelector selectedType={selectedType} onTypeSelect={setSelectedType} />
				{renderForm()}
			</div>

		</div>
	)
}
