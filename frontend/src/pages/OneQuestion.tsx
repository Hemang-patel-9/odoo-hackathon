"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Question } from "@/types/question";
import { Answer } from "@/types/answer";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
    Bold, Italic, List, Link2, Image,
    AlignLeft, AlignCenter, AlignRight, Smile
} from "lucide-react";

export default function QuestionDetailPage() {
    const { id } = useParams();
    const [question, setQuestion] = useState<Question | null>(null);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [loading, setLoading] = useState(true);
    const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
    const [replyText, setReplyText] = useState("");

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/questions/${id}`);
                const json = await res.json();
                if (!res.ok) throw new Error(json.message);
                setQuestion(json.data);
            } catch (err) {
                console.error("Error fetching question:", err);
            }
        };

        const fetchAnswers = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/answers/question/${id}`);
                const json = await res.json();
                if (!res.ok) throw new Error(json.message);
                setAnswers(json.data);
            } catch (err) {
                console.error("Error fetching answers:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestion();
        fetchAnswers();
    }, [id]);

    const handleReplySubmit = async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user") || "{}");

            const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/answers/${id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: replyText,
                    author: user.id,
                })
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.message);
            await fetchAnswers();
            setReplyText("");
            setIsReplyModalOpen(false);
        } catch (err) {
            console.error("Error posting reply:", err);
        }
    };

    if (loading) return <p className="text-center mt-10 text-muted-foreground">Loading...</p>;
    if (!question) return <p className="text-center mt-10 text-muted-foreground">Question not found</p>;

    return (
        <div className="container mx-auto px-4 py-8 space-y-8 bg-background text-foreground min-h-screen">
            {/* Question Section */}
            <Card className="bg-card border border-border rounded-md shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-6 space-y-4">
                    <h1 className="text-2xl font-semibold text-primary hover:text-primary/80 transition-colors duration-150">{question.title}</h1>
                    <p className="text-muted-foreground text-base leading-relaxed">{question.description}</p>

                    <div className="flex flex-wrap gap-2">
                        {question.tags.map(tag => (
                            <span
                                key={tag}
                                className="bg-accent text-accent-foreground px-3 py-1 rounded-md text-sm font-medium hover:bg-accent/80 transition-colors duration-150"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t border-border">
                        <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="/placeholder.svg" />
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                    {question.author.name[0].toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <span>{question.author.name}</span>
                        </div>
                        <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                    </div>
                </CardContent>
            </Card>

            {/* Answers Section */}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-foreground">Answers ({answers.length})</h2>
                <Button
                    onClick={() => setIsReplyModalOpen(true)}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors duration-200"
                >
                    Add Answer
                </Button>
            </div>

            {answers.length === 0 ? (
                <p className="text-muted-foreground text-center">No answers yet.</p>
            ) : (
                <div className="space-y-4">
                    {answers.map((answer) => (
                        <Card
                            key={answer._id}
                            className="bg-card border border-border border-l-4 border-primary rounded-md shadow-sm hover:shadow-md transition-shadow duration-200"
                        >
                            <CardContent className="p-6">
                                <p className="text-foreground mb-4 leading-relaxed">{answer.content}</p>

                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src="/placeholder.svg" />
                                            <AvatarFallback className="bg-primary text-primary-foreground">
                                                {answer.author.name[0].toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span>{answer.author.name}</span>
                                    </div>
                                    <span>{new Date(answer.createdAt).toLocaleDateString()}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Reply Modal */}
            <Dialog open={isReplyModalOpen} onOpenChange={setIsReplyModalOpen}>
                <DialogContent className="bg-background border border-border text-foreground max-w-2xl rounded-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-foreground">Reply to Question</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="border border-border rounded-t-md bg-muted p-2">
                            <div className="flex flex-wrap gap-1">
                                {[Bold, Italic, List, Link2, Image, AlignLeft, AlignCenter, AlignRight, Smile].map((Icon, i) => (
                                    <Button
                                        key={i}
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-sm transition-colors duration-150"
                                    >
                                        <Icon className="h-4 w-4" />
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <Textarea
                            placeholder="Write your reply here..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="min-h-[150px] bg-background border border-border border-t-0 rounded-t-none text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                        />

                        <div className="flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setIsReplyModalOpen(false)}
                                className="border-border text-foreground hover:bg-muted hover:text-foreground rounded-md"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleReplySubmit}
                                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md"
                                disabled={!replyText.trim()}
                            >
                                Post Reply
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}