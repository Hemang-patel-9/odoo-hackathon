"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    User,
    HelpCircle,
    MessageCircle,
    Ban,
    Trash2,
    Calendar,
    ThumbsUp,
    Clock,
    Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface LocalUser {
    role: "admin" | "user";
    token: string;
}

interface User {
    _id: string;
    name: string;
    email: string;
    role: "admin" | "user";
    banned: boolean;
    createdAt: string;
    avatar?: string;
}

interface Question {
    _id: string;
    title: string;
    description: string;
    tags: string[];
    author: { _id: string; name: string; avatar?: string };
    createdAt: string;
    votes: { user: string; vote: number }[];
}

interface Answer {
    _id: string;
    content: string;
    question: { _id: string; title: string };
    author: { _id: string; name: string; avatar?: string };
    createdAt: string;
    votes: { user: string; vote: number }[];
    acceptedAnswer: boolean;
}

export default function AdminPanel() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState<"users" | "questions" | "answers">("users");
    const [users, setUsers] = useState<User[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Get user from localStorage
    const user: LocalUser | null = (() => {
        try {
            const storedUser = localStorage.getItem("user");
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (err) {
            console.error("Failed to parse user from localStorage:", err);
            return null;
        }
    })();

    // Get token from user
    const token = user?.token;

    // Restrict access to admins
    useEffect(() => {
        if (!user || user.role !== "admin") {
            navigate("/");
            toast({
                title: "Access Denied",
                description: "Only admins can access the admin panel.",
                variant: "destructive",
            });
        }
    }, [user, navigate, toast]);

    // Fetch all data
    const fetchData = async () => {
        if (!user || !token) {
            setError("No valid user session found.");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const headers = { Authorization: `Bearer ${token}` };

            // Fetch users
            const usersRes = await fetch(`${import.meta.env.VITE_APP_API_URL}/users`, { headers });
            const usersJson = await usersRes.json();
            if (!usersRes.ok) {
                if (usersRes.status === 401 || usersRes.status === 403) {
                    throw new Error("Unauthorized access. Please log in as an admin.");
                }
                throw new Error(usersJson.message || "Failed to fetch users");
            }
            setUsers(usersJson.data || usersJson);

            // Fetch questions
            const questionsRes = await fetch(`${import.meta.env.VITE_APP_API_URL}/questions`, { headers });
            const questionsJson = await questionsRes.json();
            if (!questionsRes.ok) {
                if (questionsRes.status === 401 || questionsRes.status === 403) {
                    throw new Error("Unauthorized access. Please log in as an admin.");
                }
                throw new Error(questionsJson.message || "Failed to fetch questions");
            }
            setQuestions(questionsJson.data || questionsJson);

            // Fetch answers
            const answersRes = await fetch(`${import.meta.env.VITE_APP_API_URL}/answers`, { headers });
            const answersJson = await answersRes.json();
            if (!answersRes.ok) {
                if (answersRes.status === 401 || usersRes.status === 403) {
                    throw new Error("Unauthorized access. Please log in as an admin.");
                }
                throw new Error(answersJson.message || "Failed to fetch answers");
            }
            setAnswers(answersJson.data || answersJson);
        } catch (err: any) {
            setError(err.message || "Failed to fetch data");
            toast({
                title: "Error",
                description: err.message || "Failed to fetch data",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user?.role === "admin") {
            fetchData();
        }
    }, [user]);

    // Handle ban/unban user
    const handleBanUser = async (userId: string, currentStatus: boolean) => {
        if (!token) {
            toast({
                title: "Error",
                description: "No valid session. Please log in again.",
                variant: "destructive",
            });
            return;
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/user/${userId}/ban`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ banned: !currentStatus }),
            });
            const json = await res.json();
            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    throw new Error("Unauthorized action. Please log in as an admin.");
                }
                throw new Error(json.message || "Failed to update user status");
            }
            setUsers(users.map((u) => (u._id === userId ? { ...u, banned: !currentStatus } : u)));
            toast({
                title: "Success",
                description: `User ${!currentStatus ? "banned" : "unbanned"} successfully.`,
            });
        } catch (err: any) {
            toast({
                title: "Error",
                description: err.message || "Failed to update user status",
                variant: "destructive",
            });
        }
    };

    // Handle delete question
    const handleDeleteQuestion = async (questionId: string) => {
        if (!token) {
            toast({
                title: "Error",
                description: "No valid session. Please log in again.",
                variant: "destructive",
            });
            return;
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/questions/${questionId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            const json = await res.json();
            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    throw new Error("Unauthorized action. Please log in as an admin.");
                }
                throw new Error(json.message || "Failed to delete question");
            }
            setQuestions(questions.filter((q) => q._id !== questionId));
            toast({
                title: "Success",
                description: "Question deleted successfully.",
            });
        } catch (err: any) {
            toast({
                title: "Error",
                description: err.message || "Failed to delete question",
                variant: "destructive",
            });
        }
    };

    // Handle delete answer
    const handleDeleteAnswer = async (answerId: string) => {
        if (!token) {
            toast({
                title: "Error",
                description: "No valid session. Please log in again.",
                variant: "destructive",
            });
            return;
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/answers/${answerId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            const json = await res.json();
            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    throw new Error("Unauthorized action. Please log in as an admin.");
                }
                throw new Error(json.message || "Failed to delete answer");
            }
            setAnswers(answers.filter((a) => a._id !== answerId));
            toast({
                title: "Success",
                description: "Answer deleted successfully.",
            });
        } catch (err: any) {
            toast({
                title: "Error",
                description: err.message || "Failed to delete answer",
                variant: "destructive",
            });
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
                />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Card className="bg-card border border-border rounded-md shadow-sm max-w-md w-full">
                    <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground mb-4">{error}</p>
                        <Button
                            onClick={fetchData}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md"
                        >
                            Retry
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="bg-card border border-border shadow-sm mb-8">
                        <CardHeader>
                            <CardTitle className="text-3xl font-bold text-foreground">Admin Panel</CardTitle>
                            <p className="text-muted-foreground">Manage users, questions, and answers</p>
                        </CardHeader>
                    </Card>

                    {/* Navigation Tabs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex gap-2 mb-6 overflow-x-auto"
                    >
                        <Button
                            onClick={() => setActiveTab("users")}
                            className={`px-4 py-2 rounded-md font-medium transition-colors duration-150 ${activeTab === "users"
                                    ? "bg-primary text-primary-foreground shadow-md"
                                    : "bg-background border border-border text-foreground hover:bg-accent hover:text-accent-foreground"
                                }`}
                        >
                            Users ({users.length})
                        </Button>
                        <Button
                            onClick={() => setActiveTab("questions")}
                            className={`px-4 py-2 rounded-md font-medium transition-colors duration-150 ${activeTab === "questions"
                                    ? "bg-primary text-primary-foreground shadow-md"
                                    : "bg-background border border-border text-foreground hover:bg-accent hover:text-accent-foreground"
                                }`}
                        >
                            Questions ({questions.length})
                        </Button>
                        <Button
                            onClick={() => setActiveTab("answers")}
                            className={`px-4 py-2 rounded-md font-medium transition-colors duration-150 ${activeTab === "answers"
                                    ? "bg-primary text-primary-foreground shadow-md"
                                    : "bg-background border border-border text-foreground hover:bg-accent hover:text-accent-foreground"
                                }`}
                        >
                            Answers ({answers.length})
                        </Button>
                    </motion.div>

                    {/* Users Tab */}
                    {activeTab === "users" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <Card className="bg-card border border-border rounded-md shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold text-foreground">Users</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {users.length === 0 ? (
                                        <p className="text-muted-foreground text-center">No users found.</p>
                                    ) : (
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Name</TableHead>
                                                    <TableHead>Email</TableHead>
                                                    <TableHead>Role</TableHead>
                                                    <TableHead>Joined</TableHead>
                                                    <TableHead>Banned</TableHead>
                                                    <TableHead>Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {users.map((user) => (
                                                    <TableRow key={user._id}>
                                                        <TableCell className="font-medium text-foreground">{user.name}</TableCell>
                                                        <TableCell>{user.email}</TableCell>
                                                        <TableCell>{user.role}</TableCell>
                                                        <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                                        <TableCell>
                                                            <Switch
                                                                checked={user.banned}
                                                                onCheckedChange={() => handleBanUser(user._id, user.banned)}
                                                                className={user.banned ? "bg-destructive" : "bg-primary"}
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => navigate(`/profile/${user._id}`)}
                                                                className="text-primary hover:text-primary/80"
                                                            >
                                                                View Profile
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* Questions Tab */}
                    {activeTab === "questions" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <Card className="bg-card border border-border rounded-md shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold text-foreground">Questions</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {questions.length === 0 ? (
                                        <p className="text-muted-foreground text-center">No questions found.</p>
                                    ) : (
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Title</TableHead>
                                                    <TableHead>Author</TableHead>
                                                    <TableHead>Tags</TableHead>
                                                    <TableHead>Votes</TableHead>
                                                    <TableHead>Created</TableHead>
                                                    <TableHead>Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {questions.map((question) => (
                                                    <TableRow key={question._id}>
                                                        <TableCell
                                                            className="font-medium text-primary hover:text-primary/80 cursor-pointer"
                                                            onClick={() => navigate(`/question/${question._id}`)}
                                                        >
                                                            {question.title}
                                                        </TableCell>
                                                        <TableCell>{question.author.name}</TableCell>
                                                        <TableCell>
                                                            <div className="flex flex-wrap gap-2">
                                                                {question.tags.map((tag) => (
                                                                    <Badge
                                                                        key={tag}
                                                                        className="bg-accent text-accent-foreground hover:bg-accent/80 rounded-md px-2 py-1 text-sm"
                                                                    >
                                                                        {tag}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{question.votes.filter((v) => v.vote === 1).length}</TableCell>
                                                        <TableCell>{new Date(question.createdAt).toLocaleDateString()}</TableCell>
                                                        <TableCell>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => handleDeleteQuestion(question._id)}
                                                                className="flex items-center gap-1"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                                Delete
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* Answers Tab */}
                    {activeTab === "answers" && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <Card className="bg-card border border-border rounded-md shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold text-foreground">Answers</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {answers.length === 0 ? (
                                        <p className="text-muted-foreground text-center">No answers found.</p>
                                    ) : (
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Content</TableHead>
                                                    <TableHead>Question</TableHead>
                                                    <TableHead>Author</TableHead>
                                                    <TableHead>Votes</TableHead>
                                                    <TableHead>Accepted</TableHead>
                                                    <TableHead>Created</TableHead>
                                                    <TableHead>Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {answers.map((answer) => (
                                                    <TableRow key={answer._id}>
                                                        <TableCell className="max-w-xs truncate">{answer.content}</TableCell>
                                                        <TableCell
                                                            className="text-primary hover:text-primary/80 cursor-pointer"
                                                            onClick={() => navigate(`/question/${answer.question._id}`)}
                                                        >
                                                            {answer.question.title}
                                                        </TableCell>
                                                        <TableCell>{answer.author.name}</TableCell>
                                                        <TableCell>{answer.votes.filter((v) => v.vote === 1).length}</TableCell>
                                                        <TableCell>
                                                            {answer.acceptedAnswer && (
                                                                <Star className="w-4 h-4 text-green-600 fill-current" />
                                                            )}
                                                        </TableCell>
                                                        <TableCell>{new Date(answer.createdAt).toLocaleDateString()}</TableCell>
                                                        <TableCell>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => handleDeleteAnswer(answer._id)}
                                                                className="flex items-center gap-1"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                                Delete
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}