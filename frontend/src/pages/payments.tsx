"use client"

import { motion } from "framer-motion"

export default function Payments() {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="space-y-6"
		>
			<h1 className="text-3xl font-bold text-foreground">Payments</h1>
			<p className="text-muted-foreground">Track payments and transactions</p>

			<div className="bg-card rounded-lg border p-8 text-center">
				<h2 className="text-xl font-semibold mb-2">Payment Management</h2>
				<p className="text-muted-foreground">This section will contain payment tracking features.</p>
			</div>
		</motion.div>
	)
}
