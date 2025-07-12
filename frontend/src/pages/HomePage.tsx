"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Search, ChevronDown, Bold, Underline, Strikethrough, Italic, AlignLeft, AlignCenter, AlignRight, Type, Heading1, Heading3, Pilcrow, Link, Unlink } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { debounce } from 'lodash';
import { useNavigate } from 'react-router-dom';

// Mock question data (since API is not provided)
const mockQuestions = [
    {
        _id: '1',
        title: 'How to optimize React performance?',
        description: 'Looking for tips on optimizing React apps for better performance.',
        tags: ['react', 'javascript', 'performance'],
        votes: ['user1', 'user2'],
        createdAt: '2025-07-10T12:00:00Z',
        author: { name: 'John Doe', id: 'user1' },
    },
    {
        _id: '2',
        title: 'Best practices for CSS in large projects?',
        description: 'What are the best ways to organize CSS in large-scale applications?',
        tags: ['css', 'webdev'],
        votes: ['user3'],
        createdAt: '2025-07-11T09:00:00Z',
        author: { name: 'Jane Smith', id: 'user2' },
    },
];

export default function HomePage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSort, setSelectedSort] = useState('newest');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [questions, setQuestions] = useState(mockQuestions);
    const [loading, setLoading] = useState(true);
    const [isAskModalOpen, setIsAskModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const navigate = useNavigate()

    const editorRef = useRef<HTMLDivElement>(null);

    const sortOptions = [
        { value: 'newest', label: 'Newest' },
        { value: 'oldest', label: 'Oldest' },
        { value: 'most_votes', label: 'Most Votes' },
        { value: 'most_answers', label: 'Most Answers' },
        { value: 'trending', label: 'Trending' },
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
        { value: 'mysql', label: 'MySQL', emoji: '🗃️' },
    ];

    const execCmd = (command: string, value: string | null = null, mode: string = 'toggle', options: { target?: string } = {}) => {
        if (!editorRef.current) return;
        const selection = window.getSelection();
        if (!selection?.rangeCount) return;

        const range = selection.getRangeAt(0);
        const parent = range.commonAncestorContainer.nodeType === 3
            ? range.commonAncestorContainer.parentElement
            : range.commonAncestorContainer;

        if (options.target === 'block') {
            const block = parent?.closest('p, div, h1, h2, h3, h4, h5, h6') || parent;
            if (mode === 'extend' && block) {
                (block as HTMLElement).style[command] = value || '';
            }
        } else {
            if (mode === 'toggle') {
                const currentValue = parent ? window.getComputedStyle(parent)[command] : '';
                document.execCommand('styleWithCSS', false, true);
                document.execCommand(command, false, currentValue === value ? 'normal' : value);
            } else if (mode === 'extend') {
                document.execCommand('styleWithCSS', false, true);
                document.execCommand(command, false, value);
            }
        }
        editorRef.current.focus();
        setDescription(editorRef.current.innerHTML);
    };

    const formatBlock = (tagName: string) => {
        document.execCommand('formatBlock', false, tagName);
        if (editorRef.current) {
            editorRef.current.focus();
            setDescription(editorRef.current.innerHTML);
        }
    };

    const link = ({ href, protocol = 'https' }: { href: string; protocol?: string }) => {
        const url = href.startsWith('http') ? href : `${protocol}://${href}`;
        document.execCommand('createLink', false, url);
        if (editorRef.current) {
            editorRef.current.focus();
            setDescription(editorRef.current.innerHTML);
        }
    };

    const unLink = () => {
        document.execCommand('unlink', false, null);
        if (editorRef.current) {
            editorRef.current.focus();
            setDescription(editorRef.current.innerHTML);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.ctrlKey) {
            let isDetect = true;
            switch (event.code) {
                case 'KeyB':
                    execCmd('fontWeight', 'bold', 'toggle');
                    break;
                case 'KeyS':
                    execCmd('textDecoration', 'line-through', 'toggle');
                    break;
                case 'KeyU':
                    execCmd('textDecoration', 'underline', 'toggle');
                    break;
                case 'KeyI':
                    execCmd('fontStyle', 'italic', 'toggle');
                    break;
                case 'KeyZ':
                case 'KeyY':
                    break;
                default:
                    isDetect = false;
                    break;
            }
            if (isDetect) {
                event.preventDefault();
            }
        }
    };

    const commands = [
        { icon: <Bold className="h-4 w-4" />, onClick: () => execCmd('fontWeight', 'bold', 'toggle') },
        { icon: <Underline className="h-4 w-4" />, onClick: () => execCmd('textDecoration', 'underline', 'toggle') },
        { icon: <Strikethrough className="h-4 w-4" />, onClick: () => execCmd('textDecoration', 'line-through', 'toggle') },
        { icon: <Italic className="h-4 w-4" />, onClick: () => execCmd('fontStyle', 'italic', 'toggle') },
        { icon: <AlignLeft className="h-4 w-4" />, onClick: () => execCmd('textAlign', 'left', 'extend', { target: 'block' }) },
        { icon: <AlignCenter className="h-4 w-4" />, onClick: () => execCmd('textAlign', 'center', 'extend', { target: 'block' }) },
        { icon: <AlignRight className="h-4 w-4" />, onClick: () => execCmd('textAlign', 'right', 'extend', { target: 'block' }) },
        { icon: <span className="text-sm">18px</span>, onClick: () => execCmd('fontSize', '20px', 'extend') },
        { icon: <span className="text-sm">24px</span>, onClick: () => execCmd('fontSize', '24px', 'extend') },
        { icon: <span className="text-sm">32px</span>, onClick: () => execCmd('fontSize', '32px', 'extend') },
        { icon: <Type className="h-4 w-4" style={{ textShadow: '1px 1px 2px red, 0 0 1em blue, 0 0 0.2em orange' }} />, onClick: () => execCmd('textShadow', '1px 1px 2px red, 0 0 1em blue, 0 0 0.2em orange', 'extend') },
        { icon: <Type className="h-4 w-4" style={{ textShadow: '1px 1px 2px red, 0 0 1em blue, 0 0 0.2em blue' }} />, onClick: () => execCmd('textShadow', '1px 1px 1px #000, 3px 3px 5px blue', 'extend') },
        { icon: <Type className="h-4 w-4" style={{ color: 'red' }} />, onClick: () => execCmd('color', 'red', 'extend') },
        { icon: <Type className="h-4 w-4" style={{ color: 'blue' }} />, onClick: () => execCmd('color', 'blue', 'extend') },
        { icon: <Heading1 className="h-4 w-4" />, onClick: () => formatBlock('h1') },
        { icon: <Heading3 className="h-4 w-4" />, onClick: () => formatBlock('h3') },
        { icon: <Pilcrow className="h-4 w-4" />, onClick: () => formatBlock('p') },
        { icon: <Link className="h-4 w-4" />, onClick: () => link({ href: 'https://style-it.github.io/home/' }) },
        { icon: <Unlink className="h-4 w-4" />, onClick: () => unLink() },
    ];

    const handleCategoryToggle = (categoryValue: string) => {
        setSelectedCategories((prev) =>
            prev.includes(categoryValue)
                ? prev.filter((cat) => cat !== categoryValue)
                : [...prev, categoryValue]
        );
    };

    const clearFilters = () => {
        setSelectedSort('newest');
        setSelectedCategories([]);
        setSearchQuery('');
    };

    const addTag = (inputTags: string) => {
        const newTags = inputTags
            .split(/\s+/)
            .map((tag) => tag.trim().toLowerCase())
            .filter((tag) => tag && !tags.includes(tag) && tags.length < 5);
        if (newTags.length > 0) {
            const availableSlots = 5 - tags.length;
            setTags([...tags, ...newTags.slice(0, availableSlots)]);
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            addTag(tagInput);
        }
    };

    const handlePost = async () => {
        if (!title.trim() || !description.trim() || tags.length === 0) return;
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            // Simulate API call
            console.log('Posting question:', { title, description, tags, author: user.id });
            setIsAskModalOpen(false);
            setTitle('');
            setDescription('');
            setTags([]);
            setTagInput('');
            setLoading(true);
        } catch (err) {
            console.error('Error posting question:', err);
        }
    };

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                // Simulate API fetch with mock data
                let filtered = [...mockQuestions];

                if (searchQuery.trim()) {
                    const query = searchQuery.toLowerCase();
                    filtered = filtered.filter(
                        (q) =>
                            q.title.toLowerCase().includes(query) ||
                            q.description.toLowerCase().includes(query)
                    );
                }

                if (selectedCategories.length > 0) {
                    filtered = filtered.filter((q) =>
                        selectedCategories.every((tag) => q.tags.includes(tag))
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
                console.error('Error fetching questions:', err);
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
                            {sortOptions.map((option) => (
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
                            {selectedCategories.length === 0 ? 'Select categories...' : `${selectedCategories.length} selected`}
                        </span>
                        <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {showCategoryDropdown && (
                        <div className="absolute z-10 w-full mt-2 bg-background border border-border rounded-md shadow-lg max-h-80 overflow-y-auto">
                            <div className="p-3 space-y-1">
                                {categoryOptions.map((option) => (
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
                            className="w-full"
                        />
                        <div className="border border-border rounded-t-md bg-muted p-2 flex flex-wrap gap-1">
                            {commands.map((cmd, index) => (
                                <Button
                                    key={index}
                                    variant="ghost"
                                    size="sm"
                                    onClick={cmd.onClick}
                                    className="text-foreground hover:bg-accent"
                                >
                                    {cmd.icon}
                                </Button>
                            ))}
                        </div>
                        <div
                            ref={editorRef}
                            contentEditable
                            spellCheck={false}
                            className="min-h-[150px] resize-none border border-border border-t-0 rounded-b-md p-2 bg-background text-foreground focus:outline-none direction-ltr"
                            onKeyDown={handleKeyDown}
                            onInput={() => setDescription(editorRef.current?.innerHTML || '')}
                            dangerouslySetInnerHTML={{
                                __html: description || '<p>Enter question description</p>',
                            }}
                        />
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                                    {tag}
                                    <button
                                        onClick={() => removeTag(tag)}
                                        className="ml-1 text-destructive hover:text-destructive/80"
                                    >
                                        ×
                                    </button>
                                </Badge>
                            ))}
                        </div>
                        <Input
                            placeholder="Add tags (max 5, press Enter or space)"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagKeyPress}
                            className="w-full"
                        />
                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setIsAskModalOpen(false)}
                                className="text-foreground border-input"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handlePost}
                                disabled={!title.trim() || !description.trim() || tags.length === 0}
                                className="bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                                Post Question
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}