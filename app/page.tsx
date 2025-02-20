"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, MessageSquare, Globe, FileText } from 'lucide-react';

export default function Introduction() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  const features = [
    { icon: <FileText className="w-6 h-6" />, title: "Detection", description: "Detect languages provided" },
    { icon: <Globe className="w-6 h-6" />, title: "Translation", description: "Translate between 12 languages" },
    { icon: <MessageSquare className="w-6 h-6" />, title: "Smart Summaries", description: "Get concise summaries of any text" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 to-black text-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 py-12 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Main Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block"
            >
              <Sparkles className="inline-block w-8 h-8 text-purple-400 mb-4" />
            </motion.div>
            
            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              AI Text Processing
              <span className="block text-2xl md:text-3xl mt-2 text-white">Made Simple</span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl mb-8 text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Transform your text with AI-powered features. Summarize, translate, and detect with just a few clicks.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex justify-center lg:justify-start  items-center"
            >
              <Link href="/chat">
                <button className="px-8 py-4 bg-purple-600 rounded-full font-semibold text-white hover:bg-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/30">
                  Get Started
                </button>
              </Link>
              
            </motion.div>
          </motion.div>

          {/* Right Column - Features */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                onHoverStart={() => setHoveredFeature(index)}
                onHoverEnd={() => setHoveredFeature(null)}
                className="bg-gray-800/50 p-6 rounded-xl backdrop-blur-sm border border-gray-700 transform transition-all duration-300 hover:scale-105"
                style={{
                  boxShadow: hoveredFeature === index ? '0 0 20px rgba(168, 85, 247, 0.4)' : 'none'
                }}
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-500/20 p-3 rounded-lg">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}