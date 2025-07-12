"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import SearchBar from "@/components/searchbar"
import FilterSection from "@/components/filter-selection"
import QuestionsList from "@/components/questions-list"
import AskQuestionModal from "@/components/ask-question-modal"
import type { Question, User } from "@/types/questions"
import { useNavigate } from "react-router-dom"

export default function HomePage() {
    const router = useNavigate()
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedSort, setSelectedSort] = useState("newest")
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [questions, setQuestions] = useState<Question[]>([])
    const [loading, setLoading] = useState(true)
    const [isAskModalOpen, setIsAskModalOpen] = useState(false)
    const [user, setUser] = useState<User | null>(null)

    const handleCategoryToggle = (categoryValue: string) => {
        setSelectedCategories((prev) =>
            prev.includes(categoryValue) ? prev.filter((cat) => cat !== categoryValue) : [...prev, categoryValue],
        )
    }

    const clearFilters = () => {
        setSelectedSort("newest")
        setSelectedCategories([])
        setSearchQuery("")
    }

    const handleAskQuestion = async (data: { title: string; description: string; tags: string[] }) => {
        try {
            const user = JSON.parse(localStorage.getItem("user") || "{}")
            const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/questions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, author: user.id }),
            })

            if (res.ok) {
                setLoading(true) // Refresh questions list
            }
        } catch (err) {
            console.error("Error posting question:", err)
        }
    }

    const handleQuestionClick = (id: string) => {
        router(`/question/${id}`)
    }

    useEffect(() => {
        // Load user from localStorage
        const userData = localStorage.getItem("user")
        if (userData) {
            setUser(JSON.parse(userData))
        }
    }, [])

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/questions`)
                const json = await res.json()

                if (!res.ok) throw new Error(json.message)

                let filtered = [...json.data]

                // Apply search filter
                if (searchQuery.trim()) {
                    const query = searchQuery.toLowerCase()
                    filtered = filtered.filter(
                        (q) => q.title.toLowerCase().includes(query) || q.description.toLowerCase().includes(query),
                    )
                }

                // Apply category filter
                if (selectedCategories.length > 0) {
                    filtered = filtered.filter((q) => selectedCategories.every((tag) => q.tags.includes(tag)))
                }

                // Apply sorting
                switch (selectedSort) {
                    case "oldest":
                        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                        break
                    case "most_votes":
                        filtered.sort((a, b) => b.votes.length - a.votes.length)
                        break
                    case "newest":
                    default:
                        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                }
                console.log(filtered);
                setQuestions(filtered)
            } catch (err) {
                console.error("Error fetching questions:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchQuestions()
    }, [searchQuery, selectedSort, selectedCategories, loading])

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
            <div className="container mx-auto px-4 py-8 space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4 py-8"
                >
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Ask & Answer
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Join our community of developers and get answers to your questions
                    </p>
                </motion.div>

                {/* Search Bar */}
                <SearchBar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onAskQuestion={() => setIsAskModalOpen(true)}
                />

                {/* Filters */}
                <FilterSection
                    selectedSort={selectedSort}
                    onSortChange={setSelectedSort}
                    selectedCategories={selectedCategories}
                    onCategoryToggle={handleCategoryToggle}
                    onClearFilters={clearFilters}
                    searchQuery={searchQuery}
                />

                {/* Questions List */}
                <QuestionsList
                    questions={questions}
                    loading={loading}
                    onQuestionClick={handleQuestionClick}
                    userId={user?.id}
                />

                {/* Ask Question Modal */}
                <AskQuestionModal
                    isOpen={isAskModalOpen}
                    onClose={() => setIsAskModalOpen(false)}
                    onSubmit={handleAskQuestion}
                />
            </div>
        </div>
    )
}
