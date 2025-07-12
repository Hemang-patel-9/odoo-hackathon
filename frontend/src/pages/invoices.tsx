"use client"

import { InvoiceTable } from "@/components/invoice-table"
import type { Invoice } from "@/types/invoice"
import { motion } from "framer-motion"
import { useState } from "react"

export default function Invoices() {

	const [invoices, setInvoices] = useState<Invoice[]>([
			{
				id: "1",
				number: "INV-191",
				type: "measurement",
				date: "6/2/2025",
				status: "pending",
				clientName: "ABC Construction",
				totalAmount: 25000,
			},
			{
				id: "2",
				number: "INV-351",
				type: "abstract",
				date: "6/2/2025",
				status: "pending",
				clientName: "XYZ Builders",
				totalAmount: 18500,
			},
		])

	const handleEdit = (invoice: Invoice) => {
		console.log("Edit invoice:", invoice)
	}

	const handleDelete = (id: string) => {
		setInvoices(invoices.filter((invoice) => invoice.id !== id))
	}
	const handleView = (invoice: Invoice) => {
		console.log("View invoice:", invoice)
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="space-y-6"
		>
			<h1 className="text-3xl font-bold text-foreground">Invoices</h1>
			<p className="text-muted-foreground">Create and manage invoices</p>

			<InvoiceTable invoices={invoices} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
		</motion.div>
	)
}
