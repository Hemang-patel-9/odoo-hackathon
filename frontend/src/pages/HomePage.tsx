"use client";

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, Bold, Italic, List, Link2, Image, AlignLeft, AlignCenter, AlignRight, Smile } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Question } from '@/types/question';

export default function HomePage() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSort, setSelectedSort] = useState('newest');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAskModalOpen, setIsAskModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState('');

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
        { value: 'gaming', label: 'Gaming', emoji: '🎮' },
        { value: 'javascript', label: 'JavaScript', emoji: '🟨' },
        { value: 'typescript', label: 'TypeScript', emoji: '🔷' },
        { value: 'react', label: 'React', emoji: '⚛️' },
        { value: 'nodejs', label: 'Node.js', emoji: '🟩' },
        { value: 'express', label: 'Express', emoji: '🚀' },
        { value: 'mongodb', label: 'MongoDB', emoji: '🍃' },
        { value: 'html', label: 'HTML', emoji: '📄' },
        { value: 'css', label: 'CSS', emoji: '🎨' },
        { value: 'python', label: 'Python', emoji: '🐍' },
        { value: 'mysql', label: 'MySQL', emoji: '🗃️' }
    ];

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

    const addTag = (inputTags) => {
        const newTags = inputTags
            .split(/\s+/)
            .map(tag => tag.trim().toLowerCase())
            .filter(tag => tag && !tags.includes(tag) && tags.length < 5);
        if (newTags.length > 0) {
            const availableSlots = 5 - tags.length;
            setTags([...tags, ...newTags.slice(0, availableSlots)]);
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleTagKeyPress = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            addTag(tagInput);
        }
    };

    const handlePost = async () => {
        if (!title.trim() || !description.trim() || tags.length === 0) return;
        try {
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/questions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description, tags, author: user.id })
            });
            if (res.ok) {
                setIsAskModalOpen(false);
                setTitle('');
                setDescription('');
                setTags([]);
                setTagInput('');
                setLoading(true);
            }
        } catch (err) {
            console.error('Error posting question:', err);
        }
    };

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/questions`);
                const json = await res.json();
                if (!res.ok) throw new Error(json.message);
                const data = json.data;

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
    }, [searchQuery, selectedSort, selectedCategories, loading]);

    return (
        <div className="container mx-auto px-4 py-8 space-y-8 bg-background text-foreground min-h-screen">
            {/* Search and Ask Question Section */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Input
                        type="text"
                        placeholder="Search questions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-md border border-input bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
                <Button
                    onClick={() => setIsAskModalOpen(true)}
                    className="px-4 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors duration-200 font-medium"
                >
                    Ask New Question
                </Button>
            </div>

            {/* Filters Section */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Sort by</label>
                    <Select value={selectedSort} onValueChange={setSelectedSort}>
                        <SelectTrigger className="w-full bg-background border border-input rounded-md text-foreground focus:ring-2 focus:ring-primary focus:border-transparent">
                            <SelectValue placeholder="Select sort option" />
                        </SelectTrigger>
                        <SelectContent className="bg-background border border-border text-foreground">
                            {sortOptions.map(option => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                    className="hover:bg-accent hover:text-accent-foreground"
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex-1 relative">
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Categories ({selectedCategories.length} selected)
                    </label>
                    <button
                        type="button"
                        onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                        className="w-full px-4 py-3 border border-input rounded-md bg-background text-foreground text-left flex items-center justify-between focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    >
                        <span className="text-sm">
                            {selectedCategories.length === 0 ? "Select categories..." : `${selectedCategories.length} selected`}
                        </span>
                        <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {showCategoryDropdown && (
                        <div className="absolute z-10 w-full mt-2 bg-background border border-border rounded-md shadow-lg max-h-80 overflow-y-auto">
                            <div className="p-3 space-y-1">
                                {categoryOptions.map(option => (
                                    <label
                                        key={option.value}
                                        className="flex items-center gap-2 p-2 hover:bg-accent hover:text-accent-foreground cursor-pointer rounded-md transition-colors duration-150"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.includes(option.value)}
                                            onChange={() => handleCategoryToggle(option.value)}
                                            className="h-4 w-4 text-primary border-input rounded focus:ring-primary"
                                        />
                                        <span className="text-sm flex items-center gap-1.5">
                                            {option.emoji} {option.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                            <div className="border-t border-border p-3">
                                <button
                                    onClick={() => setSelectedCategories([])}
                                    className="w-full text-sm text-destructive hover:text-destructive/80 transition-colors duration-150"
                                >
                                    Clear all categories
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Clear Filters Button */}
            {(searchQuery || selectedCategories.length > 0 || selectedSort !== 'newest') && (
                <button
                    onClick={clearFilters}
                    className="text-sm text-destructive hover:text-destructive/80 underline transition-colors duration-150"
                >
                    Clear all filters
                </button>
            )}

            {/* Questions List */}
            <div className="space-y-4">
                {loading ? (
                    <p className="text-center text-muted-foreground">Loading questions...</p>
                ) : questions.length === 0 ? (
                    <p className="text-center text-muted-foreground">No questions found.</p>
                ) : (
                    questions.map((question) => (
                        <Card
                            key={question._id}
                            className="bg-card border border-border rounded-md shadow-sm hover:shadow-md transition-shadow duration-200"
                        >
                            <CardContent className="p-6">
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center space-y-3 text-sm text-muted-foreground min-w-[80px]">
                                        <div className="text-center">
                                            <div className="font-semibold text-foreground">{question.votes.length}</div>
                                            <div>Votes</div>
                                        </div>
                                        <div className="text-center px-3 py-1.5 rounded bg-primary text-primary-foreground">
                                            <div className="font-semibold">0</div>
                                            <div className="text-xs">Answers</div>
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <h3
                                            className="text-lg font-semibold text-primary hover:text-primary/80 mb-3 cursor-pointer transition-colors duration-150"
                                            onClick={() => navigate(`/question/${question._id}`)}
                                        >
                                            {question.title}
                                        </h3>
                                        <p className="text-muted-foreground mb-4 line-clamp-2">{question.description}</p>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {question.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="bg-accent text-accent-foreground rounded-md px-3 py-1 text-sm hover:bg-accent/80 transition-colors duration-150"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between text-sm text-muted-foreground">
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
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Ask Question Modal */}
            <Dialog open={isAskModalOpen} onOpenChange={setIsAskModalOpen}>
                <DialogContent className="bg-background border border-border text-foreground max-w-2xl rounded-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-foreground">Ask a Question</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <Input
                            placeholder="Enter question title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="rounded-md border border-input bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
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
                            placeholder="Enter question description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="min-h-[150px] bg-background border border-border border-t-0 rounded-t-none text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                        />
                        <Input
                            placeholder="Enter tags (space-separated, max 5)"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagKeyPress}
                            className="rounded-md border border-input bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                                <Badge
                                    key={tag}
                                    onClick={() => removeTag(tag)}
                                    className="bg-accent text-accent-foreground hover:bg-accent/80 cursor-pointer px-3 py-1 rounded-md transition-colors duration-150"
                                >
                                    {tag} <X className="ml-1 h-3 w-3" />
                                </Badge>
                            ))}
                        </div>
                        <div className="flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setIsAskModalOpen(false)}
                                className="border-border text-foreground hover:bg-muted hover:text-foreground rounded-md"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handlePost}
                                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md"
                                disabled={!(title.trim() && description.trim() && tags.length > 0)}
                            >
                                Post
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}