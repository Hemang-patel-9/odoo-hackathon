import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';

const HeroSection: React.FC = () => {
    const controls = useAnimation();
    const ref = useRef<HTMLDivElement | null>(null);
    const isInView = useInView(ref, { once: true });

    const floatingKeywords = [
        'JavaScript',
        'React',
        'Python',
        'AI',
        'Machine Learning',
        'DevOps',
        'UI/UX',
        'Cloud',
        'Data Science',
    ];

    useEffect(() => {
        if (isInView) {
            controls.start('visible');
        }
    }, [controls, isInView]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2, delayChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { y: 40, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100, damping: 20 },
        },
    };

    const backgroundOrbVariants = {
        animate: {
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
            transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
        },
    };

    const floatingVariants = {
        animate: {
            y: [0, -20, 0],
            rotate: [0, 180, 360],
            transition: { duration: 10, repeat: Infinity, ease: 'easeInOut' },
        },
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-blue-600/50 to-background  overflow-hidden">
            {/* Animated Orbs */}
            <motion.div
                className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"
                variants={backgroundOrbVariants}
                animate="animate"
            />
            <motion.div
                className="absolute bottom-20 right-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"
                variants={backgroundOrbVariants}
                animate="animate"
            />

            {/* Floating Keywords */}
            <div className="absolute inset-0 pointer-events-none">
                {floatingKeywords.map((keyword, i) => (
                    <motion.div
                        key={keyword}
                        className={`absolute text-sm text-foreground/20 font-semibold ${i % 3 === 0 ? 'top-1/4 left-1/4' : ''
                            } ${i % 3 === 1 ? 'top-1/3 right-1/4' : ''} ${i % 3 === 2 ? 'bottom-1/4 left-1/3' : ''
                            }`}
                        variants={floatingVariants}
                        animate="animate"
                        transition={{ delay: i * 0.5 }}
                    >
                        {keyword}
                    </motion.div>
                ))}
            </div>

            {/* Main Hero */}
            <motion.div
                ref={ref}
                className="relative z-10 flex flex-col items-center text-center px-4"
                variants={containerVariants}
                initial="hidden"
                animate={controls}
            >
                {/* Logo */}
                <motion.div variants={itemVariants} className="mb-6">
                    <motion.div
                        className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-600 shadow-lg"
                        whileHover={{ rotate: 360, scale: 1.1 }}
                        transition={{ duration: 1 }}
                    >
                        <Sparkles className="w-10 h-10 text-foreground" />
                    </motion.div>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    className="text-4xl md:text-6xl font-bold text-foreground mb-4"
                    variants={itemVariants}
                >
                    Ask & Answer.
                    <br />
                    Build Together.
                </motion.h1>
                <motion.p
                    className="text-lg md:text-xl text-foreground/70 mb-10 max-w-2xl"
                    variants={itemVariants}
                >
                    Your developer community for questions, answers, and growth.
                    Empower your knowledge, solve problems, and help others.
                </motion.p>

                {/* Search Bar */}
                <motion.div
                    className="relative flex items-center w-full max-w-xl bg-foreground/10 backdrop-blur-sm rounded-full px-4 py-3 border border-foreground/20"
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                >
                    <Search className="w-5 h-5 text-foreground/50 mr-3" />
                    <input
                        type="text"
                        placeholder="Search questions, topics..."
                        className="flex-1 bg-transparent text-foreground placeholder-foreground/50 outline-none"
                    />
                    <button className="ml-3 bg-blue-600 hover:bg-blue-700 text-foreground font-medium px-4 py-2 rounded-full transition">
                        Search
                    </button>
                </motion.div>

                {/* Call to Action */}
                <motion.button
                    className="mt-8 bg-blue-600 hover:bg-blue-700 text-foreground font-semibold px-8 py-4 rounded-full shadow-lg"
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Ask a Question
                </motion.button>
            </motion.div>
        </div>
    );
};

export default HeroSection;
