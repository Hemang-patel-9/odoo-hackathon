'use client'

import React, { useState } from 'react';
import { User, Calendar, Award, MessageCircle, HelpCircle, TrendingUp, Star, ThumbsUp, MessageSquare, Eye, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState('questions');
    const navigate = useNavigate()
    // Sample user data
    const userData = {
        username: "alex_dev",
        displayName: "Alex Developer",
        joinDate: "January 2023",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        bio: "Full-stack developer passionate about web technologies and helping others learn to code.",
        location: "San Francisco, CA",
        website: "https://alexdev.com",
        stats: {
            totalQuestions: 47,
            totalAnswers: 156,
            reputation: 2847,
            badges: 12,
            views: 18432,
            upvotes: 892
        }
    };

    const questions = [
        {
            id: 1,
            title: "How to implement lazy loading in React components?",
            content: "I'm working on a large React application and want to implement lazy loading for better performance. What's the best approach?",
            tags: ["react", "performance", "lazy-loading"],
            votes: 23,
            answers: 8,
            views: 1547,
            timeAgo: "2 days ago",
            status: "answered"
        },
        {
            id: 2,
            title: "CSS Grid vs Flexbox: When to use which?",
            content: "I'm confused about when to use CSS Grid versus Flexbox. Can someone explain the key differences and use cases?",
            tags: ["css", "grid", "flexbox"],
            votes: 45,
            answers: 12,
            views: 2134,
            timeAgo: "5 days ago",
            status: "answered"
        },
        {
            id: 3,
            title: "Best practices for API error handling in JavaScript",
            content: "What are the recommended patterns for handling API errors in modern JavaScript applications?",
            tags: ["javascript", "api", "error-handling"],
            votes: 18,
            answers: 5,
            views: 892,
            timeAgo: "1 week ago",
            status: "answered"
        }
    ];

    const answers = [
        {
            id: 1,
            questionTitle: "How to center a div in CSS?",
            content: "The most reliable modern approach is using Flexbox. Simply add `display: flex; justify-content: center; align-items: center;` to the parent container...",
            votes: 34,
            accepted: true,
            timeAgo: "1 day ago",
            questionId: 101
        },
        {
            id: 2,
            questionTitle: "What's the difference between let and const in JavaScript?",
            content: "Both `let` and `const` are block-scoped variables introduced in ES6. The key difference is that `const` creates immutable bindings...",
            votes: 28,
            accepted: false,
            timeAgo: "3 days ago",
            questionId: 102
        },
        {
            id: 3,
            questionTitle: "How to optimize database queries in Node.js?",
            content: "Here are several strategies for optimizing database queries: 1. Use indexes properly, 2. Implement connection pooling, 3. Use query optimization...",
            votes: 19,
            accepted: true,
            timeAgo: "4 days ago",
            questionId: 103
        }
    ];
    const TabButton = ({ id, label, count, isActive, onClick }) => (
        <button
            onClick={() => onClick(id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${isActive
                ? 'bg-blue-500/60 text-background shadow-lg'
                : 'bg-foreground/10 text-foreground/60 hover:bg-foreground/20'
                }`}
        >
            {label} ({count})
        </button>
    );

    const QuestionCard = ({ question }) => (
        <div className="bg-foreground/10 rounded-lg shadow-sm border border-foreground/20 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <h3 onClick={() => {
                        navigate('/question/:id')
                    }} className="text-lg font-semibold text-foreground mb-2 hover:text-blue-700/50 cursor-pointer">
                        {question.title}
                    </h3>
                    <p className="text-foreground/30 mb-4 line-clamp-2">{question.content}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {question.tags.map(tag => (
                            <Badge key={tag}>
                                {tag}
                            </Badge>
                        ))}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                            <ThumbsUp className="w-4 h-4" />
                            {question.votes} votes
                        </span>
                        <span className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            {question.answers} answers
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {question.timeAgo}
                        </span>
                    </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${question.status === 'answered'
                    ? 'text-green-800 border border-green-800'
                    : 'text-yellow-800 border border-yellow-800'
                    }`}>
                    {question.status}
                </div>
            </div>
        </div>
    );

    const AnswerCard = ({ answer }) => (
        <div className="bg-foreground/10 rounded-lg shadow-sm border border-foreground/20 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-foreground mb-2 hover:text-blue-700/50 cursor-pointer">
                    {answer.questionTitle}
                </h3>
                {answer.accepted && (
                    <div className="flex items-center gap-1 text-green-800 border border-green-800 px-2 py-1 rounded-full text-sm">
                        <Star className="w-4 h-4 fill-current" />
                        Accepted
                    </div>
                )}
            </div>
            <p className="text-foreground/30 mb-4 line-clamp-2">{answer.content}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4" />
                    {answer.votes} votes
                </span>
                <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {answer.timeAgo}
                </span>
            </div>
        </div>
    );

    const StatCard = ({ icon: Icon, label, value, color }) => (
        <div className="bg-background rounded-lg shadow-sm border border-foreground/20 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-foreground/70">{label}</p>
                    <p className="text-2xl font-bold text-foreground/30">{value}</p>
                </div>
                <div className={`p-3 rounded-full ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );


    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-background shadow-sm">
                <div className="max-w-6xl mx-auto px-4 py-6">
                    <div className="flex items-center gap-6">
                        <img
                            src={userData.avatar}
                            alt={userData.displayName}
                            className="w-24 h-24 rounded-full border-2 border-foreground"
                        />
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-foreground/80">{userData.displayName}</h1>
                            <p className="text-foreground/40 mb-2">@{userData.username}</p>
                            <p className="text-foreground/40 mb-3">{userData.bio}</p>
                            <div className="flex items-center gap-4 text-sm text-foreground/60">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    Joined {userData.joinDate}
                                </span>
                                <span>{userData.location}</span>
                                <a href={userData.website} className="text-blue-700 hover:underline">
                                    {userData.website}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    <StatCard
                        icon={HelpCircle}
                        label="Questions"
                        value={userData.stats.totalQuestions}
                        color="bg-blue-500/30"
                    />
                    <StatCard
                        icon={MessageCircle}
                        label="Answers"
                        value={userData.stats.totalAnswers}
                        color="bg-green-500/30"
                    />
                    <StatCard
                        icon={ThumbsUp}
                        label="Upvotes"
                        value={userData.stats.upvotes}
                        color="bg-indigo-500/30"
                    />
                </div>

                {/* Navigation Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto">
                    <TabButton
                        id="questions"
                        label="Questions"
                        count={userData.stats.totalQuestions}
                        isActive={activeTab === 'questions'}
                        onClick={setActiveTab}
                    />
                    <TabButton
                        id="answers"
                        label="Answers"
                        count={userData.stats.totalAnswers}
                        isActive={activeTab === 'answers'}
                        onClick={setActiveTab}
                    />
                </div>

                {/* Content */}
                {activeTab === 'questions' && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-foreground mb-4">My Questions</h2>
                        {questions.map(question => (
                            <QuestionCard key={question.id} question={question} />
                        ))}
                    </div>
                )}

                {activeTab === 'answers' && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-foreground mb-4">My Answers</h2>
                        {answers.map(answer => (
                            <AnswerCard key={answer.id} answer={answer} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

