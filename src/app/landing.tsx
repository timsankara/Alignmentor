/* eslint-disable react/no-unescaped-entities */
'use client'

import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const LandingPage: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 z-0" />
        <motion.div
          className="text-center z-10 max-w-4xl px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.h1
            className="text-6xl md:text-8xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Alignmentor
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Master AI Safety 10x Faster with RAG Technology
          </motion.p>
          <motion.div
            className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {['Learn Faster', 'Contribute Globally', 'Shape the Future'].map((benefit, index) => (
              <motion.div
                key={benefit}
                className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-full px-6 py-2 shadow-lg"
                whileHover={{ scale: 1.05, backgroundColor: '#000', color: '#fff' }}
                transition={{ type: 'spring', stiffness: 300, damping: 10 }}
              >
                {benefit}
              </motion.div>
            ))}
          </motion.div>
          <motion.button
            className="bg-black text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-900 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Your Journey
          </motion.button>
        </motion.div>
        <motion.div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/path/to/abstract-ai-image.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.1,
          }}
          animate={{
            scale: 1 + scrollY * 0.0005,
            opacity: 0.1 - scrollY * 0.0001,
          }}
        />
      </section>

      {/* Feature Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">Revolutionizing AI Safety Education</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* RAG Technology Section */}
      <RAGSection />

      {/* Testimonial Section */}
      <TestimonialSection />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <footer className="bg-gray-100 py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-8 md:mb-0">
            <h3 className="text-2xl font-bold">Alignmentor</h3>
            <p className="text-gray-600">Empowering AI Safety Education</p>
          </div>
          <div className="flex space-x-6">
            {['Terms', 'Privacy', 'Contact'].map((item) => (
              <a key={item} href="#" className="text-gray-600 hover:text-black transition-colors duration-300">
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

const features = [
  {
    title: "Adaptive Learning",
    description: "Our AI-powered platform tailors the curriculum to your pace and style, optimizing your learning journey.",
    icon: "🧠",
  },
  {
    title: "Real-world Impact",
    description: "Apply your knowledge to current AI safety challenges, contributing to global initiatives.",
    icon: "🌍",
  },
  {
    title: "Expert Network",
    description: "Connect with leading AI researchers and peers, fostering collaboration and growth.",
    icon: "👥",
  },
];

const FeatureCard: React.FC<{ title: string; description: string; icon: string }> = ({ title, description, icon }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0 });
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      transition={{ duration: 0.5 }}
      className="bg-white p-8 rounded-3xl shadow-lg text-center"
      whileHover={{ y: -5 }}
    >
      <span className="text-4xl mb-4 block">{icon}</span>
      <h3 className="text-2xl font-semibold mb-4">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

const RAGSection: React.FC = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0 });
    }
  }, [controls, inView]);

  return (
    <section ref={ref} className="bg-gray-100 py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold mb-8"
        >
          Powered by RAG Technology
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl mb-12"
        >
          Experience 10x faster learning with our Retrieval-Augmented Generation system,
          delivering hyper-personalized AI safety education.
        </motion.p>
        <motion.img
          src="/path/to/rag-illustration.png"
          alt="RAG Technology Illustration"
          className="w-full max-w-2xl mx-auto rounded-lg shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          transition={{ duration: 0.8, delay: 0.4 }}
        />
      </div>
    </section>
  );
};

const TestimonialSection: React.FC = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0 });
    }
  }, [controls, inView]);

  return (
    <section ref={ref} className="py-20 px-4 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold mb-12"
        >
          What Our Users Say
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gray-100 p-8 rounded-3xl shadow-lg"
        >
          <p className="text-xl italic mb-4">
            "Alignmentor has revolutionized my understanding of AI safety. The personalized learning experience is unmatched."
          </p>
          <p className="font-semibold">- Dr. Jane Smith, AI Researcher</p>
        </motion.div>
      </div>
    </section>
  );
};

const CTASection: React.FC = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0 });
    }
  }, [controls, inView]);

  return (
    <section ref={ref} className="py-20 px-4 bg-black text-white">
      <div className="max-w-3xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold mb-8"
        >
          Ready to Shape the Future of AI?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl mb-12"
        >
          Join Alignmentor today and be at the forefront of AI safety innovation.
          Start learning 10x faster and make a global impact.
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white text-black px-10 py-5 rounded-full text-xl font-medium hover:bg-gray-200 transition-colors duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Begin Your Journey
        </motion.button>
      </div>
    </section>
  );
};

export default LandingPage;