"use client";

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Question } from '@/types/questions';

export default function HomePage() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSort, setSelectedSort] = useState('newest');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);

    const sortOptions = [
        { value: 'newest', label: 'Newest' },
        { value: 'oldest', label: 'Oldest' },
        { value: 'most_votes', label: 'Most Votes' },
        { value: 'most_answers', label: 'Most Answers' },
        { value: 'trending', label: 'Trending' }
    ];

    const categoryOptions = [
        { value: 'technology', label: 'Technology', emoji: '🔧' },
        { value: 'science', label: 'Science', emoji: '🔬' },
        { value: 'programming', label: 'Programming', emoji: '💻' },
        { value: 'general', label: 'General', emoji: '💬' },
        { value: 'career', label: 'Career', emoji: '💼' },
        { value: 'education', label: 'Education', emoji: '📚' },
        { value: 'health', label: 'Health', emoji: '🏥' },
        { value: 'finance', label: 'Finance', emoji: '💰' },
        { value: 'lifestyle', label: 'Lifestyle', emoji: '🌟' },
        { value: 'gaming', label: 'Gaming', emoji: '🎮' }
    ];

    const handleCategoryToggle = (categoryValue: string) => {
        setSelectedCategories(prev =>
            prev.includes(categoryValue)
                ? prev.filter(cat => cat !== categoryValue)
                : [...prev, categoryValue]
        );
    };

    const clearFilters = () => {
        setSelectedSort('newest');
        setSelectedCategories([]);
        setSearchQuery('');
    };

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/questions`);
                const json = await res.json();
                if (!res.ok) throw new Error(json.message);
                const data: Question[] = json.data;

                let filtered = [...data];

                if (searchQuery.trim()) {
                    const query = searchQuery.toLowerCase();
                    filtered = filtered.filter(
                        q =>
                            q.title.toLowerCase().includes(query) ||
                            q.description.toLowerCase().includes(query)
                    );
                }

                if (selectedCategories.length > 0) {
                    filtered = filtered.filter(q =>
                        selectedCategories.every(tag => q.tags.includes(tag))
                    );
                }

                switch (selectedSort) {
                    case 'oldest':
                        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                        break;
                    case 'most_votes':
                        filtered.sort((a, b) => b.votes.length - a.votes.length);
                        break;
                    case 'newest':
                    default:
                        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                }

                setQuestions(filtered);
            } catch (err) {
                console.error("Error fetching questions:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [searchQuery, selectedSort, selectedCategories]);

    return (
        <div className="space-y-6">
            <div className='md:flex gap-3'>
                <div className="w-full md:w-4/5">
                    <form onSubmit={(e) => e.preventDefault()} className="relative">
                        <input
                            type="text"
                            placeholder="Search questions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-background border border-foreground/10 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-1 focus:ring-foreground/40"
                        />
                        <button className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <Search className="h-5 w-5 text-foreground" />
                        </button>
                    </form>
                </div>
                <button
                    className='border border-1 bg-foreground/20 border-foreground/10 py-2 rounded-lg w-full md:w-1/5 hover:bg-foreground/30 transition-colors'
                    onClick={() => navigate('/ask')}
                >
                    Ask New Question
                </button>
            </div>

            <div className="flex items-start gap-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-foreground/60 mb-2">Sort by</label>
                    <Select value={selectedSort} onValueChange={setSelectedSort}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select sort option" />
                        </SelectTrigger>
                        <SelectContent>
                            {sortOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex-1 relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categories ({selectedCategories.length} selected)
                    </label>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                            className="w-full px-3 py-2 border border-foreground/10 rounded-lg focus:ring-1 focus:ring-foreground/40 bg-background text-left flex items-center justify-between"
                        >
                            <span className="text-sm text-gray-700">
                                {selectedCategories.length === 0 ? "Select categories..." : `${selectedCategories.length} selected`}
                            </span>
                            <ChevronDown className={`h-4 w-4 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                        </button>

                        {showCategoryDropdown && (
                            <div className="absolute z-10 w-full mt-1 bg-background border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                <div className="p-2">
                                    {categoryOptions.map(option => (
                                        <label key={option.value} className="flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer rounded">
                                            <Input
                                                type="checkbox"
                                                checked={selectedCategories.includes(option.value)}
                                                onChange={() => handleCategoryToggle(option.value)}
                                                className="w-4 h-4"
                                            />
                                            <span className="text-sm flex items-center gap-1">
                                                {option.emoji} {option.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                                <div className="border-t border-gray-200 p-2">
                                    <button
                                        onClick={() => setSelectedCategories([])}
                                        className="w-full text-xs text-red-600 hover:text-red-800"
                                    >
                                        Clear all categories
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <p>Loading questions...</p>
                ) : (
                    questions.map((question) => (
                        <Card key={question._id}>
                            <CardContent className="p-6">
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center space-y-2 text-sm text-gray-500 min-w-[60px]">
                                        <div className="text-center">
                                            <div className="font-semibold">{question.votes.length}</div>
                                            <div>votes</div>
                                        </div>
                                        <div className="text-center px-2 py-1 rounded bg-green-600 text-white">
                                            <div className="font-semibold">0</div>
                                            <div className="text-xs">answers</div>
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-blue-700 hover:text-blue-600 mb-2 cursor-pointer">
                                            {question.title}
                                        </h3>
                                        <p className="text-gray-600 mb-4 line-clamp-2">{question.description}</p>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {question.tags.map((tag) => (
                                                <div
                                                    key={tag}
                                                    className="bg-blue-300/20 rounded-md px-4 text-sm text-blue-600 hover:bg-blue-500/30"
                                                >
                                                    {tag}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between text-sm text-gray-400">
                                            <div className="flex items-center space-x-2">
                                                <Avatar className="h-6 w-6">
                                                    <AvatarImage src={"/placeholder.svg"} />
                                                    <AvatarFallback className='bg-blue-700 text-white'>
                                                        {question.author.name[0].toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span>{question.author.name}</span>
                                            </div>
                                            <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
