"use client";



import React, { useState, useEffect } from 'react';

import { User, Calendar, Award, MessageCircle, HelpCircle, ThumbsUp, MessageSquare, Clock, Star } from 'lucide-react';

import { useNavigate, useParams } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';

import { Card, CardContent } from '@/components/ui/card';

import { Button } from '@/components/ui/button';

import { useToast } from '@/hooks/use-toast';

import { motion } from 'framer-motion';

interface UserData {

    id: string;

    name: string;

    username: string;

    displayName: string;

    joinDate: string;

    bio: string;

    location: string;

    website: string;

    avatar?: string;

    stats: {

        totalQuestions: number;

        totalAnswers: number;

        upvotes: number;

    };

}



interface Question {

    id: string;

    title: string;

    content: string;

    tags: string[];

    votes: number;

    answers: number;

    timeAgo: string;

    status: 'answered' | 'unanswered';

}



interface Answer {

    id: string;

    questionTitle: string;

    content: string;

    votes: number;

    accepted: Boolean;

    timeAgo: string;

    questionId: string;

}



export default function ProfilePage() {

    const navigate = useNavigate();

    const { toast } = useToast();

    const { userId } = useParams();

    const [userData, setUserData] = useState<UserData | null>(null);

    const [questions, setQuestions] = useState<Question[]>([]);

    const [answers, setAnswers] = useState<Answer[]>([]);

    const [activeTab, setActiveTab] = useState<'questions' | 'answers'>('questions');

    const [isLoading, setIsLoading] = useState(true);

    const [error, setError] = useState<string | null>(null);



    const fetchProfileData = async () => {

        setIsLoading(true);

        setError(null);

        try {

            const res = await fetch(`${import.meta.env.VITE_APP_API_URL}/user/profile/${userId}`);

            const json = await res.json();

            console.log(json);



            if (!res.ok) throw new Error(json.message || 'Failed to fetch profile');



            const joinDate = new Date(json.user.joinDate).toLocaleString('default', {

                month: 'long',

                year: 'numeric',

            });



            const filePath = json.user.avatar

            const urlPath = filePath.replace(/\\/g, '/'); // => media/avatar-...

            console.log(urlPath);





            setUserData({

                ...json.user,

                username: json.user.name.toLowerCase().replace(/\s+/g, '_'),

                displayName: json.user.name,

                joinDate,

                bio: json.user.bio || 'No bio available.',

                location: json.user.location || '',

                website: json.user.website || '',

                stats: json.stats,

                avatar: `http://localhost:8000/${urlPath}`

            });



            setQuestions(

                json.questions.map((q: any) => ({

                    id: q._id,

                    title: q.title,

                    content: q.description,

                    tags: q.tags,

                    votes: q.votes.filter((v: any) => v.vote === 1).length,

                    answers: q.acceptedAnswer ? 1 : 0,

                    timeAgo: new Date(q.createdAt).toLocaleDateString(),

                    status: q.acceptedAnswer ? 'answered' : 'unanswered',

                }))

            );



            setAnswers(

                json.answers.map((a: any) => ({

                    id: a._id,

                    questionTitle: a.question.title,

                    content: a.content,

                    votes: a.votes.filter((v: any) => v.vote === 1).length,

                    accepted: a.acceptedAnswer,

                    timeAgo: new Date(a.createdAt).toLocaleDateString(),

                    questionId: a.question._id,

                }))

            );

        } catch (err: any) {

            setError(err.message || 'Failed to fetch profile data');

            toast({

                title: 'Error',

                description: err.message || 'Failed to fetch profile data',

                variant: 'destructive',

            });

        } finally {

            setIsLoading(false);

        }

    };



    useEffect(() => {

        if (userId) fetchProfileData();

    }, [userId]);



    const TabButton = ({ id, label, count, isActive, onClick }: {

        id: 'questions' | 'answers';

        label: string;

        count: number;

        isActive: Boolean;

        onClick: (id: 'questions' | 'answers') => void;

    }) => (

        <Button

            onClick={() => onClick(id)}

            className={`px-4 py-2 rounded-md font-medium transition-colors duration-150 ${isActive

                ? 'bg-primary text-primary-foreground shadow-md'

                : 'bg-background border border-border text-foreground hover:bg-accent hover:text-accent-foreground'

                }`}

        >

            {label} ({count})

        </Button>

    );



    const QuestionCard = ({ question }: { question: Question }) => (

        <Card className="bg-card border border-border rounded-md shadow-sm hover:shadow-md transition-shadow duration-200">

            <CardContent className="p-6">

                <div className="flex items-start justify-between">

                    <div className="flex-1">

                        <h3

                            onClick={() => navigate(`/question/${question.id}`)}

                            className="text-lg font-semibold text-primary hover:text-primary/80 mb-2 cursor-pointer transition-colors duration-150"

                        >

                            {question.title}

                        </h3>

                        <p className="text-muted-foreground mb-4 line-clamp-2">{question.content}</p>

                        <div className="flex flex-wrap gap-2 mb-4">

                            {question.tags.map((tag) => (

                                <Badge

                                    key={tag}

                                    className="bg-accent text-accent-foreground hover:bg-accent/80 rounded-md px-3 py-1 text-sm transition-colors duration-150"

                                >

                                    {tag}

                                </Badge>

                            ))}

                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">

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

                    <div

                        className={`px-3 py-1 rounded-full text-sm font-medium ${question.status === 'answered'

                            ? 'text-green-600 border border-green-600'

                            : 'text-yellow-600 border border-yellow-600'

                            }`}

                    >

                        {question.status}

                    </div>

                </div>

            </CardContent>

        </Card>

    );



    const AnswerCard = ({ answer }: { answer: Answer }) => (

        <Card className="bg-card border border-border rounded-md shadow-sm hover:shadow-md transition-shadow duration-200">

            <CardContent className="p-6">

                <div className="flex items-start justify-between mb-3">

                    <h3

                        onClick={() => navigate(`/question/${answer.questionId}`)}

                        className="text-lg font-semibold text-primary hover:text-primary/80 mb-2 cursor-pointer transition-colors duration-150"

                    >

                        {answer.questionTitle}

                    </h3>

                    {answer.accepted && (

                        <div className="flex items-center gap-1 text-green-600 border border-green-600 px-2 py-1 rounded-full text-sm">

                            <Star className="w-4 h-4 fill-current" />

                            Accepted

                        </div>

                    )}

                </div>

                <p className="text-muted-foreground mb-4 line-clamp-2">{answer.content}</p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">

                    <span className="flex items-center gap-1">

                        <ThumbsUp className="w-4 h-4" />

                        {answer.votes} votes

                    </span>

                    <span className="flex items-center gap-1">

                        <Clock className="w-4 h-4" />

                        {answer.timeAgo}

                    </span>

                </div>

            </CardContent>

        </Card>

    );



    const StatCard = ({ icon: Icon, label, value, color }: {

        icon: React.ComponentType<{ className: string }>;

        label: string;

        value: number;

        color: string;

    }) => (

        <Card className="bg-card border border-border rounded-md shadow-sm">

            <CardContent className="p-6">

                <div className="flex items-center justify-between">

                    <div>

                        <p className="text-sm font-medium text-muted-foreground">{label}</p>

                        <p className="text-2xl font-bold text-foreground">{value}</p>

                    </div>

                    <div className={`p - 3 rounded-full ${color}`}>

                        <Icon className="w-6 h-6 text-primary-foreground" />

                    </div>

                </div>

            </CardContent>

        </Card >

    );



    if (isLoading) {

        return (

            <div className="min-h-screen bg-background flex items-center justify-center p-4">

                <motion.div

                    animate={{ rotate: 360 }}

                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}

                    className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"

                />

            </div>

        );

    }



    if (error || !userData) {

        return (

            <div className="min-h-screen bg-background flex items-center justify-center p-4">

                <Card className="bg-card border border-border rounded-md shadow-sm max-w-md w-full">

                    <CardContent className="p-6 text-center">

                        <p className="text-muted-foreground mb-4">{error || 'Profile not found'}</p>

                        <Button

                            onClick={fetchProfileData}

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

            {/* Header */}

            <div className="bg-card shadow-sm border border-border">

                <div className="max-w-6xl mx-auto px-4 py-6">

                    <div className="flex flex-col sm:flex-row items-center gap-6">

                        <img

                            src={userData.avatar || '/placeholder.svg'}

                            alt={userData.displayName}

                            className="w-24 h-24 rounded-full border-2 border-border object-cover"

                        />

                        <div className="flex-1 text-center sm:text-left">

                            <h1 className="text-3xl font-bold text-foreground">{userData.displayName}</h1>

                            <p className="text-muted-foreground mb-2">@{userData.username}</p>

                            <p className="text-muted-foreground mb-3">{userData.bio}</p>

                            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4 text-sm text-muted-foreground">

                                <span className="flex items-center gap-1">

                                    <Calendar className="w-4 h-4" />

                                    Joined {userData.joinDate}

                                </span>

                                {userData.location && <span>{userData.location}</span>}

                                {userData.website && (

                                    <a href={userData.website} className="text-primary hover:text-primary/80 transition-colors">

                                        {userData.website}

                                    </a>

                                )}

                            </div>

                        </div>

                    </div>

                </div>

            </div>



            <div className="max-w-6xl mx-auto px-4 py-8">

                {/* Stats */}

                <motion.div

                    initial={{ opacity: 0, y: 20 }}

                    animate={{ opacity: 1, y: 0 }}

                    transition={{ duration: 0.5 }}

                    className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"

                >

                    <StatCard

                        icon={HelpCircle}

                        label="Questions"

                        value={userData.stats.totalQuestions}

                        color="bg-primary"

                    />

                    <StatCard

                        icon={MessageCircle}

                        label="Answers"

                        value={userData.stats.totalAnswers}

                        color="bg-primary"

                    />

                    <StatCard

                        icon={ThumbsUp}

                        label="Upvotes"

                        value={userData.stats.upvotes}

                        color="bg-primary"

                    />

                </motion.div>



                {/* Navigation Tabs */}

                <motion.div

                    initial={{ opacity: 0, y: 20 }}

                    animate={{ opacity: 1, y: 0 }}

                    transition={{ duration: 0.5, delay: 0.2 }}

                    className="flex gap-2 mb-6 overflow-x-auto"

                >

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

                </motion.div>



                {/* Content */}

                {activeTab === 'questions' && (

                    <motion.div

                        initial={{ opacity: 0, y: 20 }}

                        animate={{ opacity: 1, y: 0 }}

                        transition={{ duration: 0.5, delay: 0.3 }}

                        className="space-y-4"

                    >

                        <h2 className="text-2xl font-bold text-foreground">My Questions</h2>

                        {questions.length === 0 ? (

                            <p className="text-muted-foreground text-center">No questions found.</p>

                        ) : (

                            questions.map((question) => (

                                <QuestionCard key={question.id} question={question} />

                            ))

                        )}

                    </motion.div>

                )}



                {activeTab === 'answers' && (

                    <motion.div

                        initial={{ opacity: 0, y: 20 }}

                        animate={{ opacity: 1, y: 0 }}

                        transition={{ duration: 0.5, delay: 0.3 }}

                        className="space-y-4"

                    >

                        <h2 className="text-2xl font-bold text-foreground">My Answers</h2>

                        {answers.length === 0 ? (

                            <p className="text-muted-foreground text-center">No answers found.</p>

                        ) : (

                            answers.map((answer) => (

                                <AnswerCard key={answer.id} answer={answer} />

                            ))

                        )}

                    </motion.div>

                )}

            </div>

        </div>

    );

}