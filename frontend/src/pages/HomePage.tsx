"use client"

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

export default function HomePage() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSort, setSelectedSort] = useState('newest');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
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
                
            </div>
        </div >
    );
}