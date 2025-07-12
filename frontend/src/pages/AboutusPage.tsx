"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Lightbulb, Target } from "lucide-react";

export default function AboutUs() {
    const teamMembers = [
        {
            name: "Hemang Baldha",
            role: "Backend Developer",
            image:
                "https://media.licdn.com/dms/image/v2/D4D03AQH2YaE62Nwolg/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1707046484289?e=2147483647&v=beta&t=8EL4I0j817bTLR62-ZsH1AIol2jllDyGLCkiTWnM9N0",
        },
        {
            name: "Grisa Desai",
            role: "Backend Developer",
            image:
                "https://media.licdn.com/dms/image/v2/D4D03AQGqYFLEAB01ag/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1723951126008?e=2147483647&v=beta&t=phdZMYBTj7Tj9OJVH2cAgIdLESydARVF30rtLPbU2RY",
        },
        {
            name: "Yagna Gajjar",
            role: "Frontend Developer",
            image:
                "https://media.licdn.com/dms/image/v2/D4D03AQFGxYzThJktqg/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1704125068794?e=2147483647&v=beta&t=PsQyt8BN86SNFPpcoJfGphR378rLrBQc3UewcaxYbg8",
        },
    ];

    const [pops, setPops] = useState<{ x: number; y: number; id: number }[]>([]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const { clientX, clientY } = e;
        const newPop = { x: clientX, y: clientY, id: Date.now() };
        setPops((prev) => [...prev, newPop].slice(-20)); // Keep only last 20 blobs
    };

    return (
        <div className="relative bg-background text-foreground overflow-hidden min-h-screen" onMouseMove={handleMouseMove}>
            <AnimatePresence>
                {pops.map((pop) => (
                    <motion.div
                        key={pop.id}
                        initial={{ opacity: 0.7, scale: 0 }}
                        animate={{ opacity: 0, scale: 2 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        style={{
                            position: "absolute",
                            top: pop.y,
                            left: pop.x,
                            width: "30px",
                            height: "30px",
                            backgroundColor: "#3b82f6",
                            filter: "blur(4px)",
                            borderRadius: "4px",
                            transform: "translate(-50%, -50%)",
                        }}
                    />
                ))}
            </AnimatePresence>
            {/* Hero Section */}
            <section className="relative flex flex-col items-center justify-center text-center px-4 pt-20">
                <motion.h1
                    className="text-4xl md:text-6xl font-extrabold mb-4"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    About <span className="text-blue">StackIt</span>
                </motion.h1>
                <motion.p
                    className="max-w-2xl text-lg md:text-xl text-foreground/70"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                >
                    Empowering developers around the world to ask, answer, and grow
                    together.
                </motion.p>
            </section>

            {/* Team Section */}
            <section className="relative px-4 py-16 max-w-6xl mx-auto text-center">
                <motion.h2
                    className="text-3xl md:text-5xl font-bold mb-12"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                >
                    Meet the Team
                </motion.h2>
                <div className="grid gap-8 md:grid-cols-3">
                    {teamMembers.map((member, index) => (
                        <motion.div
                            key={member.name}
                            className="flex flex-col items-center bg-background border border-foreground/10 rounded-lg p-6 shadow hover:shadow-2xl transition-all"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: index * 0.2 }}
                            whileHover={{ scale: 1.05 }}
                        >
                            <img
                                src={member.image}
                                alt={member.name}
                                className="w-28 h-28 rounded-full object-cover mb-4"
                            />
                            <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                            <p className="text-blue font-medium mb-2">{member.role}</p>
                            <p className="text-foreground/70 text-sm max-w-xs">
                                {member.role === "Backend Developer"
                                    ? "Building secure, scalable APIs and databases."
                                    : "Creating beautiful, user-friendly interfaces for everyone."}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Mission Section */}
            <section className="relative px-4 py-16 max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
                {[
                    {
                        icon: Users,
                        title: "Our Community",
                        description:
                            "We believe in the power of community. Millions of developers connect daily to share knowledge and solve problems.",
                    },
                    {
                        icon: Lightbulb,
                        title: "Our Vision",
                        description:
                            "To create a world where every developer has access to the answers and support they need to succeed.",
                    },
                    {
                        icon: Target,
                        title: "Our Mission",
                        description:
                            "To provide a safe, inclusive, and dynamic space for developers to learn, grow, and build their future.",
                    },
                ].map((card, i) => (
                    <motion.div
                        key={i}
                        className="p-6 rounded-lg bg-background border border-foreground/10 shadow-lg hover:shadow-2xl transition-shadow"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: i * 0.2 }}
                    >
                        <div className="mb-4">
                            <card.icon className="w-10 h-10 text-blue" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                        <p className="text-foreground/70">{card.description}</p>
                    </motion.div>
                ))}
            </section>

            {/* Call to Action */}
            <section className="relative px-4 py-24 text-center">
                <motion.h2
                    className="text-3xl md:text-5xl font-bold mb-6"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                >
                    Join us on our journey!
                </motion.h2>
                <motion.p
                    className="max-w-xl mx-auto text-lg text-foreground/70 mb-8"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                >
                    Whether you're a beginner or an expert, StackIt is your trusted space
                    to grow and help others grow.
                </motion.p>
                <motion.button
                    whileHover={{
                        scale: 1.05,
                        boxShadow: "0 0 20px rgba(59, 130, 246, 0.6)",
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="relative inline-flex items-center justify-center px-8 py-4 overflow-hidden font-semibold tracking-wide text-foreground border border-blue-800 transition-all duration-300 rounded-lg group"
                >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue to-blue/80 rounded-lg blur opacity-30 group-hover:opacity-70 transition duration-500"></span>
                    <span className="relative z-10">Get Started</span>
                    <motion.span
                        className="absolute -inset-1 rounded-lg border border-blue opacity-30 group-hover:opacity-80"
                        initial={{ scale: 1 }}
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                    <motion.span
                        className="absolute -inset-1 rounded-lg"
                        style={{
                            boxShadow: "0 0 40px rgba(59, 130, 246, 0.4)",
                        }}
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    />
                </motion.button>
            </section>
        </div>
    );
}
