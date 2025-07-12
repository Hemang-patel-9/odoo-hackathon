"use client"

import { useState } from "react"
import {
    ArrowLeft,
    ChevronUp,
    ChevronDown,
    Check,
    Share,
    Bookmark,
    Flag,
    Bold,
    Italic,
    List,
    Link2,
    ImageIcon,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Smile,
    Reply,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useNavigate } from "react-router-dom"

const questionData = {
    id: 1,
    title: "How to implement JWT authentication in React?",
    description: `I'm trying to implement JWT authentication in my React application but facing issues with token storage and validation. Here's what I've tried so far:

1. Storing the token in localStorage
2. Creating an auth context
3. Setting up protected routes

The problem is that the token seems to expire randomly and users get logged out unexpectedly. I'm also concerned about security implications of storing JWT in localStorage.

Here's my current auth context implementation:

\`\`\`javascript
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Login function
  const login = async (credentials) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    const data = await response.json();
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  return (
    <AuthContext.Provider value={{ user, token, login }}>
      {children}
    </AuthContext.Provider>
  );
};
\`\`\`

What am I doing wrong? Are there better approaches for handling JWT authentication in React?`,
    author: "john_dev",
    avatar: "/placeholder.svg?height=40&width=40",
    votes: 15,
    views: 127,
    tags: ["React", "JWT", "Authentication"],
    timeAgo: "2 hours ago",
    isAnswered: true,
}

const answers = [
    {
        id: 1,
        content: `Great question! There are several issues with your current implementation and better approaches you can take:

## Issues with your current approach:

1. **localStorage security concerns**: Storing JWT in localStorage makes it vulnerable to XSS attacks
2. **No token refresh logic**: You're not handling token expiration properly
3. **Missing token validation**: No checks for token validity on app initialization

## Better approach:

### 1. Use httpOnly cookies instead of localStorage

\`\`\`javascript
// Instead of localStorage, use httpOnly cookies
const login = async (credentials) => {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
    credentials: 'include' // Important for cookies
  });
  
  // Token is set as httpOnly cookie by server
  const data = await response.json();
  setUser(data.user);
};
\`\`\`

### 2. Implement token refresh logic

\`\`\`javascript
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/me', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { user, loading };
};
\`\`\`

### 3. Set up axios interceptors for automatic token refresh

This approach is much more secure and handles token expiration gracefully.`,
        author: "sarah_security",
        avatar: "/placeholder.svg?height=32&width=32",
        votes: 23,
        timeAgo: "1 hour ago",
        isAccepted: true,
    },
    {
        id: 2,
        content: `I'd also recommend looking into **React Query** or **SWR** for handling authentication state and API calls. They provide excellent caching and error handling capabilities.

Here's a simple example with React Query:

\`\`\`javascript
import { useQuery, useMutation, useQueryClient } from 'react-query';

const useAuth = () => {
  return useQuery('auth', async () => {
    const response = await fetch('/api/me', {
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error('Not authenticated');
    }
    
    return response.json();
  }, {
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation(async (credentials) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    return response.json();
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('auth');
    }
  });
};
\`\`\`

This approach gives you automatic retries, caching, and better error handling.`,
        author: "mike_react",
        avatar: "/placeholder.svg?height=32&width=32",
        votes: 8,
        timeAgo: "45 minutes ago",
        isAccepted: false,
    },
]

export default function OneQuestion() {
    const [questionVotes, setQuestionVotes] = useState(questionData.votes)
    const [answerVotes, setAnswerVotes] = useState(answers.map((a) => a.votes))
    const [newAnswer, setNewAnswer] = useState("")
    const navigate = useNavigate();
    const handleQuestionVote = (direction: "up" | "down") => {
        setQuestionVotes((prev) => (direction === "up" ? prev + 1 : prev - 1))
    }

    const handleAnswerVote = (index: number, direction: "up" | "down") => {
        setAnswerVotes((prev) =>
            prev.map((votes, i) => (i === index ? (direction === "up" ? votes + 1 : votes - 1) : votes)),
        )
    }

    return (
        <div className="min-h-screen bg-background text-white">
            {/* Header */}
            <header className="border-b border-gray-800 bg-foreground/10 backdrop-blur-sm">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center space-x-4 text-foreground/60">
                        <Button onClick={() => {
                            navigate('/')
                        }} variant="ghost" size="icon" className=" hover:bg-foreground/10">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div className="flex-1">
                            <h1 className="text-xl font-semibold text-foreground/80">{questionData.title}</h1>
                            <div className="flex items-center space-x-4 text-sm text-foreground/50 mt-1">
                                <span>Asked {questionData.timeAgo}</span>
                                <span>Viewed {questionData.views} times</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="grid gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {/* Question */}
                        <Card className="bg-background border-foreground/10">
                            <CardContent className="p-6">
                                <div className="flex gap-6">
                                    {/* Vote Section */}
                                    <div className="flex flex-col items-center space-y-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleQuestionVote("up")}
                                            className="text-foreground/40 hover:text-green-400"
                                        >
                                            <ChevronUp className="h-6 w-6" />
                                        </Button>
                                        <span className="text-xl font-semibold">{questionVotes}</span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleQuestionVote("down")}
                                            className="text-foreground/40 hover:text-red-400"
                                        >
                                            <ChevronDown className="h-6 w-6" />
                                        </Button>
                                    </div>

                                    {/* Question Content */}
                                    <div className="flex-1">
                                        <div className="prose prose-invert max-w-none mb-6">
                                            <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                                                {questionData.description}
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {questionData.tags.map((tag) => (
                                                <Badge key={tag} variant="secondary" className="bg-blue-600/20 text-blue-300">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                                                    <Share className="h-4 w-4 mr-2" />
                                                    Share
                                                </Button>
                                                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                                                    <Reply className="h-4 w-4 mr-2" />
                                                    Reply
                                                </Button>
                                            </div>

                                            <div className="flex items-center space-x-2 text-sm">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={questionData.avatar || "/placeholder.svg"} />
                                                    <AvatarFallback>{questionData.author[0].toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="text-blue-400">{questionData.author}</div>
                                                    <div className="text-gray-400">{questionData.timeAgo}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Answers */}
                        <div>
                            <h2 className="text-2xl font-semibold mb-6">{answers.length} Answers</h2>
                            <div className="space-y-6">
                                {answers.map((answer, index) => (
                                    <Card key={answer.id} className="bg-foreground/10 border-foreground/20">
                                        <CardContent className="p-6">
                                            <div className="flex gap-6">
                                                {/* Vote Section */}
                                                <div className="flex flex-col items-center space-y-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleAnswerVote(index, "up")}
                                                        className="text-foreground/40 hover:text-green-400"
                                                    >
                                                        <ChevronUp className="h-6 w-6" />
                                                    </Button>
                                                    <span className="text-xl font-semibold">{answerVotes[index]}</span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleAnswerVote(index, "down")}
                                                        className="text-foreground/40 hover:text-red-400"
                                                    >
                                                        <ChevronDown className="h-6 w-6" />
                                                    </Button>
                                                    {answer.isAccepted && (
                                                        <div className="bg-green-600 rounded-full p-1">
                                                            <Check className="h-4 w-4 text-background" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Answer Content */}
                                                <div className="flex-1">
                                                    <div className="prose prose-invert max-w-none mb-6">
                                                        <div className="whitespace-pre-wrap text-foreground leading-relaxed">{answer.content}</div>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-4">
                                                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                                                                <Share className="h-4 w-4 mr-2" />
                                                                Share
                                                            </Button>
                                                        </div>

                                                        <div className="flex items-center space-x-2 text-sm">
                                                            <Avatar className="h-8 w-8">
                                                                <AvatarImage src={answer.avatar || "/placeholder.svg"} />
                                                                <AvatarFallback className="bg-blue-700 text-background">{answer.author[0].toUpperCase()}</AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <div className="text-blue-400">{answer.author}</div>
                                                                <div className="text-gray-400">{answer.timeAgo}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Answer Form */}
                        <Card className="bg-gray-900 border-gray-800">
                            <CardContent className="p-6">
                                <h3 className="text-xl font-semibold mb-4">Your Answer</h3>

                                {/* Rich Text Editor Toolbar */}
                                <div className="border border-gray-700 rounded-t-md bg-gray-800 p-2 mb-0">
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
                                    placeholder="Write your answer here..."
                                    value={newAnswer}
                                    onChange={(e) => setNewAnswer(e.target.value)}
                                    className="min-h-[200px] bg-gray-800 border-gray-700 border-t-0 rounded-t-none text-white placeholder-gray-400 resize-none"
                                />

                                <div className="flex justify-end mt-4">
                                    <Button className="bg-blue-600 hover:bg-blue-700">Post Your Answer</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
