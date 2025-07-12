"use client"

import { motion } from "framer-motion"

export default function Reports() {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="space-y-6"
		>
			<h1 className="text-3xl font-bold text-foreground">Reports</h1>
			<p className="text-muted-foreground">View detailed reports and analytics</p>

			<div className="bg-card rounded-lg border p-8 text-center">
				<h2 className="text-xl font-semibold mb-2">Reports & Analytics</h2>
				<p className="text-muted-foreground">This section will contain reporting features.</p>
			</div>
		</motion.div>
	)
}
