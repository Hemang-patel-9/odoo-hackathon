"use client"

import type React from "react"
import { useState } from "react"
import {
    ArrowLeft,
    Bold,
    Italic,
    List,
    Link2,
    ImageIcon,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Smile,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useNavigate } from "react-router-dom"

export default function AskQuestionPage() {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [tags, setTags] = useState<string[]>([])
    const [tagInput, setTagInput] = useState("")
    const navigate = useNavigate();

    const addTag = (tag: string) => {
        if (tag.trim() && !tags.includes(tag.trim()) && tags.length < 5) {
            setTags([...tags, tag.trim()])
            setTagInput("")
        }
    }

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter((tag) => tag !== tagToRemove))
    }

    const handleTagKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault()
            addTag(tagInput)
        }
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Form */}
                    <div className="lg:col-span-2">
                        <Card className="bg-background border-foreground/10">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <span>
                                        <Button variant="ghost" size="icon" onClick={() => {
                                            navigate('/homepage')
                                        }}>
                                            <ArrowLeft className="h-5 w-5" />
                                        </Button>
                                    </span> Ask a Question</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Title <span className="text-red-400">*</span>
                                    </label>
                                    <Input
                                        placeholder="e.g. How to implement JWT authentication in React?"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="bg-background border-foreground/10 text-foreground placeholder-gray-400"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">
                                        Be specific and imagine you're asking a question to another person
                                    </p>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Description <span className="text-red-400">*</span>
                                    </label>

                                    {/* Rich Text Editor Toolbar */}
                                    <div className="border bg-background border-foreground/10 rounded-t-md p-2">
                                        <div className="flex flex-wrap gap-1">
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                <Bold className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                <Italic className="h-4 w-4" />
                                            </Button>
                                            <Separator orientation="vertical" className="h-6 mx-1" />
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                <List className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                <Link2 className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                <ImageIcon className="h-4 w-4" />
                                            </Button>
                                            <Separator orientation="vertical" className="h-6 mx-1" />
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                <AlignLeft className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                <AlignCenter className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                <AlignRight className="h-4 w-4" />
                                            </Button>
                                            <Separator orientation="vertical" className="h-6 mx-1" />
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                <Smile className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <Textarea
                                        placeholder="Provide details about your question. Include what you've tried, what you expected to happen, and what actually happened..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="min-h-[200px]  bg-background border-foreground/10 border-t-0 rounded-t-none text-foreground placeholder-gray-400 resize-none"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">
                                        Include all the information someone would need to answer your question
                                    </p>
                                </div>

                                {/* Tags */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Tags <span className="text-red-400">*</span>
                                    </label>
                                    <div className="space-y-2">
                                        <Input
                                            placeholder="Add up to 5 tags (e.g. React, JavaScript, Node.js)"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyDown={handleTagKeyPress}
                                            className=" bg-background border-foreground/10 text-foreground placeholder-gray-400"
                                        />
                                        {tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {tags.map((tag) => (
                                                    <Badge
                                                        key={tag}
                                                        variant="secondary"
                                                        className=" bg-background border-foreground/10 text-blue-500 hover:bg-blue-500/30 cursor-pointer"
                                                        onClick={() => removeTag(tag)}
                                                    >
                                                        {tag} ×
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-xs text-background mt-1">
                                        Add tags to describe what your question is about. Press Enter or comma to add a tag.
                                    </p>
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end space-x-4 pt-4">
                                    <Button
                                        variant="outline"
                                        className="border-foreground/10 text-foreground/65 hover:bg-foreground/20 bg-transparent"
                                        onClick={() => {
                                            navigate('/homepage')
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        className="bg-blue-600 hover:bg-blue-700"
                                        disabled={!title.trim() || !description.trim() || tags.length === 0}
                                    >
                                        Post Question
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}

                    <div className="space-y-6">

                        {/* Popular Tags */}
                        <Card className="bg-background border-foreground/15">
                            <CardHeader>
                                <CardTitle className="text-lg">Popular Tags</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        "React",
                                        "JavaScript",
                                        "Node.js",
                                        "Python",
                                        "TypeScript",
                                        "CSS",
                                        "HTML",
                                        "Vue.js",
                                        "Angular",
                                        "Express",
                                    ].map((tag) => (
                                        <Badge
                                            key={tag}
                                            variant="outline"
                                            className="border-foreground/30 text-foreground/50 hover:bg-foreground/20 cursor-pointer"
                                            onClick={() => addTag(tag)}
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Guidelines */}
                        <Card className="bg-background border-foreground/10">
                            <CardHeader>
                                <CardTitle className="text-lg">Community Guidelines</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm text-foreground/40">
                                <p>• Be respectful and constructive</p>
                                <p>• Search before asking</p>
                                <p>• Use clear, descriptive titles</p>
                                <p>• Include relevant code examples</p>
                                <p>• Accept helpful answers</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
