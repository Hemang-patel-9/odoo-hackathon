"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit, Trash2 } from "lucide-react"
import type { Invoice } from "../types/invoice"

interface InvoiceTableProps {
	invoices: Invoice[]
	onView: (invoice: Invoice) => void
	onEdit: (invoice: Invoice) => void
	onDelete: (id: string) => void
}

export function InvoiceTable({ invoices, onView, onEdit, onDelete }: InvoiceTableProps) {
	const getStatusColor = (status: string) => {
		switch (status) {
			case "paid":
				return "bg-green-100 text-green-800"
			case "pending":
				return "bg-yellow-100 text-yellow-800"
			case "overdue":
				return "bg-red-100 text-red-800"
			case "draft":
				return "bg-gray-100 text-gray-800"
			default:
				return "bg-gray-100 text-gray-800"
		}
	}

	const getTypeColor = (type: string) => {
		switch (type) {
			case "measurement":
				return "bg-blue-100 text-blue-800"
			case "abstract":
				return "bg-green-100 text-green-800"
			case "tax":
				return "bg-purple-100 text-purple-800"
			default:
				return "bg-gray-100 text-gray-800"
		}
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Generated Invoices</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b">
								<th className="text-left py-3 px-4">Invoice No.</th>
								<th className="text-left py-3 px-4">Type</th>
								<th className="text-left py-3 px-4">Client</th>
								<th className="text-left py-3 px-4">Date</th>
								<th className="text-left py-3 px-4">Amount</th>
								<th className="text-left py-3 px-4">Status</th>
								<th className="text-left py-3 px-4">Actions</th>
							</tr>
						</thead>
						<tbody>
							{invoices.map((invoice) => (
								<tr key={invoice.id} className="border-b hover:bg-gray-50">
									<td className="py-3 px-4 font-medium">{invoice.number}</td>
									<td className="py-3 px-4">
										<Badge className={getTypeColor(invoice.type)}>
											{invoice.type.charAt(0).toUpperCase() + invoice.type.slice(1)}
										</Badge>
									</td>
									<td className="py-3 px-4">{invoice.clientName || "-"}</td>
									<td className="py-3 px-4">{invoice.date}</td>
									<td className="py-3 px-4">{invoice.totalAmount ? `₹${invoice.totalAmount.toFixed(2)}` : "-"}</td>
									<td className="py-3 px-4">
										<Badge className={getStatusColor(invoice.status)}>
											{invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
										</Badge>
									</td>
									<td className="py-3 px-4">
										<div className="flex gap-2">
											<Button variant="outline" size="sm" onClick={() => onView(invoice)}>
												<Eye className="h-4 w-4" />
											</Button>
											<Button variant="outline" size="sm" onClick={() => onEdit(invoice)}>
												<Edit className="h-4 w-4" />
											</Button>
											<Button variant="outline" size="sm" onClick={() => onDelete(invoice.id)}>
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
					{invoices.length === 0 && <div className="text-center py-8 text-gray-500">No invoices generated yet</div>}
				</div>
			</CardContent>
		</Card>
	)
}
