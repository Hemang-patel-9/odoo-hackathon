"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Navbar from "./navbar"
// import Sidebar from "./sidebar"
import { useLocation } from "react-router-dom"

interface LayoutProps {
	children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
	const [sidebarOpen, setSidebarOpen] = useState(false)
	const location = useLocation()

	const hideLayoutRoutes = ["/login", "/signup"]

	if (hideLayoutRoutes.includes(location.pathname)) {
		return <div className="min-h-screen bg-background text-foreground">
			<div className="fixed top-0 left-0 right-0 z-40">
				<Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
			</div>
			<main className="flex-1 min-h-screen">
				<div className="pt-16 h-screen overflow-y-auto">
					<div className="p-4">
						<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
							{children}
						</motion.div>
					</div>
				</div>
			</main>
		</div>
	}

	return (
		<div className="min-h-screen bg-background text-foreground">
			{/* Fixed Navbar */}
			<div className="fixed top-0 left-0 right-0 z-40">
				<Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
			</div>

			<div className="flex">
				<AnimatePresence>
					{sidebarOpen && (
						<>
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="fixed inset-0 z-40 bg-black/50 lg:hidden"
								onClick={() => setSidebarOpen(false)}
							/>
							<motion.div
								initial={{ x: -300 }}
								animate={{ x: 0 }}
								exit={{ x: -300 }}
								transition={{ type: "spring", damping: 30, stiffness: 300 }}
								className="fixed left-0 top-0 z-50 h-full lg:hidden"
							>
							</motion.div>
						</>
					)}
				</AnimatePresence>

				{/* Main Content Area */}
				<main className="flex-1 min-h-screen">
					<div className="pt-16 h-screen overflow-y-auto">
						<div className="p-4">
							<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
								{children}
							</motion.div>
						</div>
					</div>
				</main>
			</div>
		</div>
	)
}
