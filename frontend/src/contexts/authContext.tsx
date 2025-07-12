import React, {
	createContext,
	useContext,
	useEffect,
	useState,
} from "react"
import type { User } from "@/types/User"

interface AuthContextType {
	user: User | null
	token: string | null
	login: (user: User, token: string) => void
	logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<User | null>(null)
	const [token, setToken] = useState<string | null>(() => {
		return localStorage.getItem("token")
	})

	const login = (user: User, token: string) => {
		setUser(user)
		setToken(token)
		localStorage.setItem("token", token)

		localStorage.setItem("user", JSON.stringify(user));

	}

	const logout = () => {
		setUser(null)
		setToken(null)
		localStorage.removeItem("token")
		localStorage.removeItem("user")
	}

	useEffect(() => {
		const u = localStorage.getItem("user");
		if (u) {
			try {
				const parsedUser = JSON.parse(u);
				setUser(parsedUser);
			} catch (error) {
				console.error("Failed to parse user from localStorage:", error);
				setUser(null);
			}
		}
	}, []);


	const value = {
		user,
		token,
		login,
		logout,
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
	const context = useContext(AuthContext)
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider")
	}
	return context
}
