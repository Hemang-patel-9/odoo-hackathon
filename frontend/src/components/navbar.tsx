
import { Bell, Home, Info, LogIn, Menu, Moon, Package, Phone, Sun, User, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/authContext"
import { useSocket } from "@/hooks/use-socket"

interface NavbarProps {
	onMenuClick?: () => void
}

// Mock theme and auth hooks - replace with your actual implementations
const useTheme = () => {
	const [theme, setTheme] = useState<"light" | "dark">("light")

	const toggleTheme = () => {
		setTheme((prev) => (prev === "light" ? "dark" : "light"))
		document.documentElement.classList.toggle("dark")
	}

	return { theme, toggleTheme }
}

const navItems = [
	{ name: "Home", href: "/", icon: Home },
	{ name: "About", href: "/about", icon: Info },
	{ name: "Contact", href: "/contact", icon: Phone },
]

export default function Navbar({ onMenuClick }: NavbarProps) {
	const navigate = useNavigate();
	const { theme, toggleTheme } = useTheme()
	const { logout, user } = useAuth()
	const router = useNavigate()
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
	const [showAvatar, setShowAvatar] = useState(false)
	const isLoggedIn = localStorage.getItem("user");
	const [notifications, setNotifications] = useState<any[]>([{}])

	const socket = useSocket();

	const handleMobileMenuToggle = () => {
		setMobileMenuOpen(!mobileMenuOpen)
		onMenuClick?.()
	}

	useEffect(() => {
		if (!socket) return;
		console.log(socket)
		const handleNotif = (notif: any) => {
			console.log(notif, " iiiiiiiiiii")
			setNotifications((prev: any) => [notif, ...prev]);
		};
		socket.on('get-notification', handleNotif);
		return () => {
			socket.off('get-notification', handleNotif);
		};
	}, [socket]);

	const getNoficationsByUser = async (getUser: any) => {
		const jsoncode = JSON.parse(getUser);
		const resp = await fetch(`${import.meta.env.VITE_APP_API_URL}/notifications/user/${jsoncode?.id}`).then((res) => {
			return res.json();
		});
		console.log(resp, " rrrr")
		setNotifications(resp.data);
	}

	useEffect(() => {
		const getUser = localStorage.getItem("user");
		if (getUser) {
			setTimeout(() => {
				setShowAvatar(true);
			}, 1000);
			getNoficationsByUser(getUser)
		}
		else {
			router("/login");
		}
	}, []);

	return (
		<>
			<motion.nav
				initial={{ y: -100, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ type: "spring", damping: 25, stiffness: 300 }}
				className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 border-b border-border/40"
			>
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16">
						{/* Left Section - Logo */}
						<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center">
							<Link to="/" className="flex items-center space-x-3 group">
								<motion.div
									className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
									whileHover={{ rotate: 5 }}
									transition={{ type: "spring", stiffness: 400 }}
								>
									<span className="text-white font-bold text-lg">S</span>
								</motion.div>
								<span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300">
									StackIt
								</span>
							</Link>
						</motion.div>

						{/* Center Section - Navigation (Desktop) */}
						<div className="hidden md:flex items-center space-x-1">
							{navItems.map((item, index) => (
								<motion.div
									key={item.name}
									initial={{ opacity: 0, y: -20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: index * 0.1 }}
								>
									<Link to={item.href}>
										<Button
											variant="ghost"
											className="relative group px-4 py-2 rounded-lg hover:bg-accent/50 transition-all duration-200"
										>
											<item.icon className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
											{item.name}
											<motion.div
												className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
												initial={{ scaleX: 0 }}
												whileHover={{ scaleX: 1 }}
												transition={{ duration: 0.2 }}
											/>
										</Button>
									</Link>
								</motion.div>
							))}
						</div>

						{/* Right Section */}
						<div className="flex items-center space-x-2">
							{/* Notifications */}
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="icon" className="relative group">
										<motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
											<Bell className="h-5 w-5" />
										</motion.div>
										{notifications.length > 0 && (
											<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1">
												<Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
													{notifications.length}
												</Badge>
											</motion.div>
										)}
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-80">
									<div className="p-3 border-b">
										<h3 className="font-semibold">Notifications</h3>
									</div>

									{notifications.length > 0 ? (
										notifications.map((notification: any) => (
											<DropdownMenuItem key={notification._id} className="p-3">
												<div className="flex flex-col space-y-1">
													<p className="text-sm font-medium">{notification.message}</p>
													<p className="text-xs text-muted-foreground">{notification.createdAt}</p>
												</div>
											</DropdownMenuItem>
										))
									) : (
										<DropdownMenuItem className="p-3 text-sm text-muted-foreground justify-center">
											No new notifications
										</DropdownMenuItem>
									)}
								</DropdownMenuContent>

							</DropdownMenu>

							{/* Theme Toggle */}
							<Button variant="ghost" size="icon" onClick={toggleTheme} className="group">
								<motion.div
									initial={false}
									animate={{ rotate: theme === "dark" ? 180 : 0 }}
									transition={{ duration: 0.3, ease: "easeInOut" }}
									className="group-hover:scale-110 transition-transform"
								>
									{theme === "dark" ? (
										<Sun className="h-5 w-5 text-yellow-500" />
									) : (
										<Moon className="h-5 w-5 text-slate-700" />
									)}
								</motion.div>
							</Button>

							{/* User Menu / Login */}
							{isLoggedIn ? (
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" className="relative h-10 w-10 rounded-full group overflow-hidden">
											<motion.div whileHover={{ scale: 1.05 }} className="absolute inset-0 w-full h-full">
												{user && showAvatar ? (
													<img
														src={`${import.meta.env.VITE_APP_API_URL}/${user.avatar}`}
														alt={user.name}
														className="rounded-full object-cover w-full h-full ring-2 ring-transparent group-hover:ring-primary/20 transition-all"
													/>
												) : (
													<div className="h-full w-full rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
														<User className="h-4 w-4 text-white" />
													</div>
												)}
											</motion.div>
										</Button>

									</DropdownMenuTrigger>
									<DropdownMenuContent align="end" className="w-56">
										<div className="px-3 py-2 border-b border-border">
											<p className="font-semibold text-sm">{user?.name ?? "Guest"}</p>
											<p className="text-xs text-muted-foreground">{user?.email ?? "example@gmail.com"}</p>
										</div>
										<DropdownMenuItem onClick={() => {
											navigate(`/profile/${user?.id}`)
										}}>
											<User className="h-4 w-4 mr-2" />
											Profile
										</DropdownMenuItem>
										<DropdownMenuItem>
											<Package className="h-4 w-4 mr-2" />
											Dashboard
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600">
											<LogIn className="h-4 w-4 mr-2" />
											Logout
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							) : (
								<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
									<Button
										onClick={() => router("/login")}
										className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg"
									>
										<LogIn className="h-4 w-4 mr-2" />
										Sign In
									</Button>
								</motion.div>
							)}

							{/* Mobile Menu Button */}
							<Button variant="ghost" size="icon" onClick={handleMobileMenuToggle} className="md:hidden">
								<motion.div animate={{ rotate: mobileMenuOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
									{mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
								</motion.div>
							</Button>
						</div>
					</div>
				</div>
			</motion.nav>

			{/* Mobile Menu */}
			<AnimatePresence>
				{mobileMenuOpen && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.3, ease: "easeInOut" }}
						className="fixed top-16 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b border-border md:hidden"
					>
						<div className="px-4 py-6 space-y-4">
							{navItems.map((item, index) => (
								<motion.div
									key={item.name}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: index * 0.1 }}
								>
									<Link
										to={item.href}
										onClick={() => setMobileMenuOpen(false)}
										className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
									>
										<item.icon className="h-5 w-5" />
										<span className="font-medium">{item.name}</span>
									</Link>
								</motion.div>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	)
}
