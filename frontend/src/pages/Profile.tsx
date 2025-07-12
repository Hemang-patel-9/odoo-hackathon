"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import { User, Mail, Eye, EyeOff, Upload, Check, X, Camera, Trash2, Save, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/contexts/authContext"

interface UserData {
	id: string
	name: string
	email: string
	avatar?: string
}

interface FormData {
	name: string
	email: string
	currentPassword: string
	newPassword: string
	confirmPassword: string
	avatar: File | null
	removeImage: boolean
}

interface ValidationErrors {
	name?: string
	email?: string
	currentPassword?: string
	newPassword?: string
	confirmPassword?: string
}

const passwordRequirements = [
	{ label: "At least 5 characters", test: (pwd: string) => pwd.length >= 5 },
	{ label: "Contains uppercase letter", test: (pwd: string) => /[A-Z]/.test(pwd) },
	{ label: "Contains lowercase letter", test: (pwd: string) => /[a-z]/.test(pwd) },
	{ label: "Contains digit", test: (pwd: string) => /\d/.test(pwd) },
	{ label: "Contains symbol", test: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) },
]

export default function EditProfile() {
	const { toast } = useToast()
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [showCurrentPassword, setShowCurrentPassword] = useState(false)
	const [showNewPassword, setShowNewPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [imagePreview, setImagePreview] = useState<string | null>(null)
	const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null)
	const [changePassword, setChangePassword] = useState(false)
	const { user } = useAuth();
	// Mock user data - replace with actual user data fetching
	const [userData, setUserData] = useState<UserData | null>(null)

	const [formData, setFormData] = useState<FormData>({
		name: "",
		email: "",
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
		avatar: null,
		removeImage: false,
	})

	const [errors, setErrors] = useState<ValidationErrors>({})
	const [touched, setTouched] = useState<Record<string, boolean>>({})

	// Mock function to fetch user data
	const fetchUserData = async () => {
		setIsLoading(true)
		try {
			const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/user/${user.id}`)
				.then((res) => res.json());

			console.log(response);
			setUserData(response.data);
			setFormData((prev) => ({
				...prev,
				name: response.data.name,
				email: response.data.email,
			}))
			setCurrentImageUrl(response.data.avatar || null)
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to load user data",
				variant: "destructive",
			})
		} finally {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		fetchUserData()
	}, [])

	const validateName = (name: string): string | undefined => {
		if (!name) return "Name is required"
		if (name.length < 3) return "Name must be at least 3 characters"
		if (name.length > 100) return "Name must not exceed 100 characters"
		if (!/^[a-zA-Z ]+$/.test(name)) return "Name can only contain letters and spaces"
		return undefined
	}

	const validatePassword = (password: string): string | undefined => {
		if (!changePassword) return undefined
		if (!password) return "Password is required when changing password"
		const failedRequirements = passwordRequirements.filter((req) => !req.test(password))
		if (failedRequirements.length > 0) {
			return `Password must meet all requirements`
		}
		return undefined
	}

	const validateEmail = (email: string): string | undefined => {
		if (!email) return "Email is required"
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(email)) return "Please enter a valid email address"
		return undefined
	}

	const validateForm = (): boolean => {
		const newErrors: ValidationErrors = {}

		newErrors.name = validateName(formData.name)
		newErrors.email = validateEmail(formData.email)

		if (changePassword) {
			if (!formData.currentPassword) {
				newErrors.currentPassword = "Current password is required"
			}
			newErrors.newPassword = validatePassword(formData.newPassword)
			if (formData.newPassword !== formData.confirmPassword) {
				newErrors.confirmPassword = "Passwords do not match"
			}
		}

		setErrors(newErrors)
		return Object.values(newErrors).every((error) => !error)
	}

	const handleInputChange = (field: keyof FormData, value: string | boolean) => {
		setFormData((prev) => ({ ...prev, [field]: value }))
		setTouched((prev) => ({ ...prev, [field]: true }))

		// Real-time validation
		const newErrors = { ...errors }
		switch (field) {
			case "name":
				newErrors.name = validateName(value as string)
				break
			case "email":
				newErrors.email = validateEmail(value as string)
				break
			case "newPassword":
				if (changePassword) {
					newErrors.newPassword = validatePassword(value as string)
					if (formData.confirmPassword && value !== formData.confirmPassword) {
						newErrors.confirmPassword = "Passwords do not match"
					} else if (formData.confirmPassword && value === formData.confirmPassword) {
						newErrors.confirmPassword = undefined
					}
				}
				break
			case "confirmPassword":
				if (changePassword) {
					newErrors.confirmPassword = value !== formData.newPassword ? "Passwords do not match" : undefined
				}
				break
		}
		setErrors(newErrors)
	}

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			if (file.size > 5 * 1024 * 1024) {
				toast({
					title: "File too large",
					description: "Please select an image smaller than 5MB",
					variant: "destructive",
				})
				return
			}

			if (!file.type.startsWith("image/")) {
				toast({
					title: "Invalid file type",
					description: "Please select an image file",
					variant: "destructive",
				})
				return
			}

			setFormData((prev) => ({ ...prev, avatar: file, removeImage: false }))
			const reader = new FileReader()
			reader.onload = (e) => {
				setImagePreview(e.target?.result as string)
			}
			reader.readAsDataURL(file)
		}
	}

	const handleRemoveImage = () => {
		setFormData((prev) => ({ ...prev, avatar: null, removeImage: true }))
		setImagePreview(null)
		if (fileInputRef.current) {
			fileInputRef.current.value = ""
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsSubmitting(true)

		if (!validateForm()) {
			setIsSubmitting(false)
			toast({
				title: "Validation Error",
				description: "Please fix the errors before submitting",
				variant: "destructive",
			})
			return
		}

		try {
			const form = new FormData()
			form.append("name", formData.name)
			form.append("email", formData.email)

			if (changePassword) {
				form.append("currentPassword", formData.currentPassword)
				form.append("newPassword", formData.newPassword)
			}

			if (formData.avatar) {
				form.append("avatar", formData.avatar)
			}

			if (formData.removeImage) {
				form.append("removeImage", "true")
			}

			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 2000))

			toast({
				title: "Profile Updated Successfully!",
				description: "Your profile has been updated.",
			})

			// Reset password fields if they were changed
			if (changePassword) {
				setFormData((prev) => ({
					...prev,
					currentPassword: "",
					newPassword: "",
					confirmPassword: "",
				}))
				setChangePassword(false)
			}

			setTouched({})
			setErrors({})
		} catch (error: any) {
			toast({
				title: "Update Failed",
				description: error.message || "An error occurred while updating your profile",
				variant: "destructive",
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	const getFieldError = (field: keyof FormData) => {
		return touched[field] ? errors[field] : undefined
	}

	const getCurrentImage = () => {
		if (formData.removeImage) return null
		if (imagePreview) return imagePreview
		return currentImageUrl
	}

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
				<motion.div
					animate={{ rotate: 360 }}
					transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
					className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
				/>
			</div>
		)
	}

	return (
		<div className="h-screen w-screen overflow-scroll">
			<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="w-full max-w-2xl"
				>
					<Card className="shadow-2xl border-0 bg-card/95 backdrop-blur">
						<CardHeader className="text-center pb-6">
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								transition={{ duration: 0.5, delay: 0.2 }}
								className="mx-auto mb-4"
							>
								<div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
									<User className="h-8 w-8 text-primary-foreground text-white" />
								</div>
							</motion.div>
							<CardTitle className="text-3xl font-bold">Edit Profile</CardTitle>
							<p className="text-muted-foreground">Update your account information</p>
						</CardHeader>

						<CardContent>
							<form onSubmit={handleSubmit} className="space-y-6">
								{/* Profile Image */}
								<motion.div
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.5, delay: 0.3 }}
									className="flex flex-col items-center space-y-4"
								>
									<div className="relative">
										<motion.div
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
											className="w-24 h-24 rounded-full border-2 border-dashed border-muted-foreground/50 flex items-center justify-center cursor-pointer hover:border-primary transition-colors overflow-hidden bg-muted/50"
											onClick={() => fileInputRef.current?.click()}
										>
											{getCurrentImage() ? (
												<img
													src={getCurrentImage() || "/placeholder.svg"}
													alt="Profile"
													className="w-full h-full object-cover rounded-full"
												/>
											) : (
												<Camera className="h-8 w-8 text-muted-foreground" />
											)}
										</motion.div>
										<input
											ref={fileInputRef}
											type="file"
											accept="image/*"
											onChange={handleImageUpload}
											className="hidden"
										/>
									</div>
									<div className="flex gap-2">
										<Button
											type="button"
											variant="outline"
											size="sm"
											onClick={() => fileInputRef.current?.click()}
											className="flex items-center gap-2"
										>
											<Upload className="h-4 w-4" />
											Change Image
										</Button>
										{(getCurrentImage() || currentImageUrl) && (
											<Button
												type="button"
												variant="outline"
												size="sm"
												onClick={handleRemoveImage}
												className="flex items-center gap-2 text-destructive hover:text-destructive bg-transparent"
											>
												<Trash2 className="h-4 w-4" />
												Remove
											</Button>
										)}
									</div>
								</motion.div>

								{/* Name */}
								<motion.div
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.5, delay: 0.4 }}
									className="space-y-2"
								>
									<Label htmlFor="name">Full Name *</Label>
									<div className="relative">
										<User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
										<Input
											id="name"
											value={formData.name}
											onChange={(e) => handleInputChange("name", e.target.value)}
											placeholder="Enter your full name"
											className={cn("pl-10", getFieldError("name") && "border-destructive")}
										/>
									</div>
									<AnimatePresence>
										{getFieldError("name") && (
											<motion.p
												initial={{ opacity: 0, height: 0 }}
												animate={{ opacity: 1, height: "auto" }}
												exit={{ opacity: 0, height: 0 }}
												className="text-sm text-destructive"
											>
												{getFieldError("name")}
											</motion.p>
										)}
									</AnimatePresence>
								</motion.div>

								{/* Email */}
								<motion.div
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.5, delay: 0.5 }}
									className="space-y-2"
								>
									<Label htmlFor="email">Email *</Label>
									<div className="relative">
										<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
										<Input
											id="email"
											type="email"
											value={formData.email}
											onChange={(e) => handleInputChange("email", e.target.value)}
											placeholder="Enter your email"
											className={cn("pl-10", getFieldError("email") && "border-destructive")}
										/>
									</div>
									<AnimatePresence>
										{getFieldError("email") && (
											<motion.p
												initial={{ opacity: 0, height: 0 }}
												animate={{ opacity: 1, height: "auto" }}
												exit={{ opacity: 0, height: 0 }}
												className="text-sm text-destructive"
											>
												{getFieldError("email")}
											</motion.p>
										)}
									</AnimatePresence>
								</motion.div>

								{/* Change Password Toggle */}
								<motion.div
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.5, delay: 0.6 }}
									className="flex items-center space-x-2 p-4 border rounded-lg bg-muted/20"
								>
									<Switch id="change-password" checked={changePassword} onCheckedChange={setChangePassword} />
									<Label htmlFor="change-password" className="cursor-pointer">
										Change Password
									</Label>
								</motion.div>

								{/* Password Fields */}
								<AnimatePresence>
									{changePassword && (
										<motion.div
											initial={{ opacity: 0, height: 0 }}
											animate={{ opacity: 1, height: "auto" }}
											exit={{ opacity: 0, height: 0 }}
											className="space-y-6"
										>
											{/* Current Password */}
											<div className="space-y-2">
												<Label htmlFor="currentPassword">Current Password *</Label>
												<div className="relative">
													<Input
														id="currentPassword"
														type={showCurrentPassword ? "text" : "password"}
														value={formData.currentPassword}
														onChange={(e) => handleInputChange("currentPassword", e.target.value)}
														placeholder="Enter your current password"
														className={cn("pr-10", getFieldError("currentPassword") && "border-destructive")}
													/>
													<button
														type="button"
														onClick={() => setShowCurrentPassword(!showCurrentPassword)}
														className="absolute right-3 top-1/2 transform -translate-y-1/2"
													>
														{showCurrentPassword ? (
															<EyeOff className="h-4 w-4 text-muted-foreground" />
														) : (
															<Eye className="h-4 w-4 text-muted-foreground" />
														)}
													</button>
												</div>
												<AnimatePresence>
													{getFieldError("currentPassword") && (
														<motion.p
															initial={{ opacity: 0, height: 0 }}
															animate={{ opacity: 1, height: "auto" }}
															exit={{ opacity: 0, height: 0 }}
															className="text-sm text-destructive"
														>
															{getFieldError("currentPassword")}
														</motion.p>
													)}
												</AnimatePresence>
											</div>

											{/* New Password */}
											<div className="space-y-2">
												<Label htmlFor="newPassword">New Password *</Label>
												<div className="relative">
													<Input
														id="newPassword"
														type={showNewPassword ? "text" : "password"}
														value={formData.newPassword}
														onChange={(e) => handleInputChange("newPassword", e.target.value)}
														placeholder="Enter your new password"
														className={cn("pr-10", getFieldError("newPassword") && "border-destructive")}
													/>
													<button
														type="button"
														onClick={() => setShowNewPassword(!showNewPassword)}
														className="absolute right-3 top-1/2 transform -translate-y-1/2"
													>
														{showNewPassword ? (
															<EyeOff className="h-4 w-4 text-muted-foreground" />
														) : (
															<Eye className="h-4 w-4 text-muted-foreground" />
														)}
													</button>
												</div>

												{/* Password Requirements */}
												{formData.newPassword && (
													<div className="space-y-1">
														{passwordRequirements.map((req, index) => {
															const isValid = req.test(formData.newPassword)
															return (
																<motion.div
																	key={index}
																	initial={{ opacity: 0 }}
																	animate={{ opacity: 1 }}
																	transition={{ delay: index * 0.1 }}
																	className="flex items-center gap-2 text-xs"
																>
																	{isValid ? (
																		<Check className="h-3 w-3 text-green-500" />
																	) : (
																		<X className="h-3 w-3 text-muted-foreground" />
																	)}
																	<span className={isValid ? "text-green-600" : "text-muted-foreground"}>
																		{req.label}
																	</span>
																</motion.div>
															)
														})}
													</div>
												)}
											</div>

											{/* Confirm New Password */}
											<div className="space-y-2">
												<Label htmlFor="confirmPassword">Confirm New Password *</Label>
												<div className="relative">
													<Input
														id="confirmPassword"
														type={showConfirmPassword ? "text" : "password"}
														value={formData.confirmPassword}
														onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
														placeholder="Confirm your new password"
														className={cn("pr-10", getFieldError("confirmPassword") && "border-destructive")}
													/>
													<button
														type="button"
														onClick={() => setShowConfirmPassword(!showConfirmPassword)}
														className="absolute right-3 top-1/2 transform -translate-y-1/2"
													>
														{showConfirmPassword ? (
															<EyeOff className="h-4 w-4 text-muted-foreground" />
														) : (
															<Eye className="h-4 w-4 text-muted-foreground" />
														)}
													</button>
												</div>
												<AnimatePresence>
													{getFieldError("confirmPassword") && (
														<motion.p
															initial={{ opacity: 0, height: 0 }}
															animate={{ opacity: 1, height: "auto" }}
															exit={{ opacity: 0, height: 0 }}
															className="text-sm text-destructive"
														>
															{getFieldError("confirmPassword")}
														</motion.p>
													)}
												</AnimatePresence>
											</div>
										</motion.div>
									)}
								</AnimatePresence>

								{/* Action Buttons */}
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: 0.8 }}
									className="flex gap-4 pt-4"
								>
									<Button
										type="button"
										variant="outline"
										className="flex-1 h-12 bg-transparent"
										onClick={() => window.history.back()}
									>
										<ArrowLeft className="h-4 w-4 mr-2" />
										Cancel
									</Button>
									<Button type="submit" className="flex-1 h-12 text-lg" disabled={isSubmitting}>
										{isSubmitting ? (
											<motion.div
												animate={{ rotate: 360 }}
												transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
												className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
											/>
										) : (
											<>
												<Save className="h-4 w-4 mr-2" />
												Save Changes
											</>
										)}
									</Button>
								</motion.div>
							</form>
						</CardContent>
					</Card>
				</motion.div>
			</div>
		</div>
	)
}
