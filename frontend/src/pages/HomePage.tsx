"use client"

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
import axios from 'axios'
export default function HomePage() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSort, setSelectedSort] = useState('newest');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

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

    const handleSearch = (e) => {
        e.preventDefault();
        // Handle search logic here
        console.log('Search:', searchQuery, 'Sort:', selectedSort, 'Categories:', selectedCategories);
    };

    const handleCategoryToggle = (categoryValue) => {
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



    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        // Define async function inside useEffect
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.VITE_APP_API_URL}/`);
                setQuestions(response.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        fetchData();
        console.log(questions);
    }, []);

    // const questions = [
    //     {
    //         id: 1,
    //         title: "How to implement JWT authentication in React?",
    //         description:
    //             "I'm trying to implement JWT authentication in my React application but facing issues with token storage and validation...",
    //         author: "john_dev",
    //         avatar: "/placeholder.svg?height=32&width=32",
    //         votes: 15,
    //         answers: 3,
    //         tags: ["React", "JWT", "Authentication"],
    //         timeAgo: "2 hours ago",
    //     },
    //     {
    //         id: 2,
    //         title: "Best practices for state management in large React apps?",
    //         description:
    //             "What are the recommended patterns for managing complex state in large-scale React applications? Should I use Redux, Zustand, or Context API?",
    //         author: "sarah_codes",
    //         avatar: "/placeholder.svg?height=32&width=32",
    //         votes: 23,
    //         answers: 7,
    //         tags: ["React", "State Management", "Redux", "Zustand"],
    //         timeAgo: "2 hours ago",
    //     },
    //     {
    //         id: 3,
    //         title: "How to optimize database queries in Node.js?",
    //         description:
    //             "My Node.js application is experiencing slow database queries. What are some optimization techniques I can implement?",
    //         author: "mike_backend",
    //         avatar: "/placeholder.svg?height=32&width=32",
    //         votes: 8,
    //         answers: 2,
    //         tags: ["Node.js", "Database", "Performance"],
    //         timeAgo: "2 hours ago",
    //     },
    // ]
    return (
        <div className="space-y-4">
            {/* Search Bar and Ask Question Button */}
            <div className='md:flex gap-3'>
                <div className="w-full md:w-4/5">
                    <form onSubmit={handleSearch} className="relative">
                        <input
                            type="text"
                            placeholder="Search questions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-background border border-foreground/10 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-1 focus:ring-foreground/40"
                        />
                        <button
                            className="absolute outline-none inset-y-0 right-0 flex items-center pr-3"
                        >
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

            {/* Filter Section */}
            <div className="flex items-start gap-4">
                {/* Sort Filter */}
                <div className="flex-1">
                    <label className="block text-sm font-medium text-foreground/60 mb-2">
                        Sort by
                    </label>
                    <Select value={selectedSort} onValueChange={setSelectedSort} >
                        <SelectTrigger className="w-full focus:right-1 focus:ring-foreground/40">
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

                {/* Category Filter - Multi-select Dropdown */}
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
                                {selectedCategories.length === 0
                                    ? "Select categories..."
                                    : `${selectedCategories.length} categories selected`
                                }
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
                                                className="w-4 h-4 rounded focus:right-1 focus:right-foreground/40"
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
                                        className="w-full text-xs text-red-600 hover:text-red-800 py-1"
                                    >
                                        Clear all categories
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Active Filters Indicator */}
            {
                (selectedSort !== 'newest' || selectedCategories.length > 0) && (
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-gray-600">Active filters:</span>
                        {selectedSort !== 'newest' && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                {sortOptions.find(opt => opt.value === selectedSort)?.label}
                            </span>
                        )}
                        {selectedCategories.map(categoryValue => {
                            const category = categoryOptions.find(opt => opt.value === categoryValue);
                            return (
                                <span key={categoryValue} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs flex items-center gap-1">
                                    {category?.emoji} {category?.label}
                                    <button
                                        onClick={() => handleCategoryToggle(categoryValue)}
                                        className="ml-1 text-green-600 hover:text-green-800"
                                    >
                                        ×
                                    </button>
                                </span>
                            );
                        })}
                        <button
                            onClick={clearFilters}
                            className="text-xs text-red-600 hover:text-red-800 underline"
                        >
                            Clear all
                        </button>
                    </div>
                )
            }
            <div>
                {/* Questions List */}
                <div className="space-y-4">
                    {questions.map((question) => (
                        <Card key={question.id} className="bg-foreground/5 border-foreground/10 hover:border-gray-700 transition-colors">
                            <CardContent className="p-6">
                                <div className="flex gap-4">
                                    {/* Vote and Stats */}
                                    <div className="flex flex-col items-center space-y-2 text-sm text-foreground/50 min-w-[60px]">
                                        <div className="text-center">
                                            <div className="font-semibold text-foreground">{question.votes}</div>
                                            <div>votes</div>
                                        </div>
                                        <div
                                            className={`text-center px-2 py-1 rounded bg-green-600 text-background`}
                                        >
                                            <div className="font-semibold">{question.answers}</div>
                                            <div className="text-xs">answers</div>
                                        </div>
                                    </div>

                                    {/* Question Content */}
                                    <div className="flex-1">
                                        <h3 onClick={() => { }} className="text-lg font-semibold text-blue-700 hover:text-blue-600 mb-2 cursor-pointer">
                                            {question.title}
                                        </h3>

                                        <p className="text-foreground/50 mb-4 line-clamp-2">{question.description}</p>

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
                                                    <AvatarImage src={question.avatar || "/placeholder.svg"} />
                                                    <AvatarFallback className='bg-blue-700 text-background'>{question.author[0].toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <span>{question.author}</span>
                                            </div>
                                            <span>{question.timeAgo}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div >
    );
}