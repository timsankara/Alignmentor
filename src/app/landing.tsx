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
            Understand AI Safety Through Secure, Ethical Learning Technology
          </motion.p>
          <motion.div
            className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {['Learn Safely', 'Explore Ethically', 'Shape the Future'].map((benefit, index) => (
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
            onClick={() => window.location.href = "/alignmentor"}
          >
            Start Your Safe AI Journey
          </motion.button>
        </motion.div>
        <motion.div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/path/to/abstract-ai-safety-image.jpg')",
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
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">Secure AI Safety Education</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* RAG Technology Section */}
      <RAGSection />

      {/* Paper Categories Section */}
      <PaperCategoriesSection />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <footer className="bg-gray-100 py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-8 md:mb-0">
            <h3 className="text-2xl font-bold">Alignmentor</h3>
            <p className="text-gray-600">Empowering Safe AI Education</p>
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
    title: "Secure Learning",
    description: "Our platform ensures your learning journey is safe and ethical, prioritizing responsible AI practices.",
    icon: "🔒",
  },
  {
    title: "Cutting-edge Content",
    description: "Stay updated with the latest developments in AI safety, curated by experts in the field.",
    icon: "📚",
  },
  {
    title: "Ethical Exploration",
    description: "Engage with AI concepts hands-on, using secure sandboxes and ethical testing environments.",
    icon: "🧪",
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
          Powered by Secure RAG Technology
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl mb-12"
        >
          Experience enhanced learning with our Retrieval-Augmented Generation system,
          delivering personalized AI safety education while maintaining the highest standards of data security and ethical AI use.
        </motion.p>
      </div>
    </section>
  );
};

const PaperCategoriesSection: React.FC = () => {
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

  const categories = [
    {
      title: "Reinforcement Learning from Human (or AI) Feedback",
      description: "Explore how AI systems learn from interaction, ensuring alignment with human values.",
    },
    {
      title: "Scalable Oversight",
      description: "Discover methods to maintain control and understanding as AI systems grow more complex.",
    },
    {
      title: "Robustness, Unlearning and Control",
      description: "Learn techniques to create reliable AI systems that can adapt safely to new situations.",
    },
    {
      title: "Mechanistic Interpretability",
      description: "Uncover the inner workings of AI models to ensure transparency and trustworthiness.",
    },
    {
      title: "Technical Governance Approaches",
      description: "Explore frameworks for responsible development and deployment of AI technologies.",
    },
    {
      title: "AI Alignment Theory",
      description: "Dive into fundamental principles for creating AI systems that robustly pursue intended goals.",
    },
    {
      title: "Value Learning and Specification",
      description: "Study methods for AI systems to understand and adhere to human values and preferences.",
    },
    {
      title: "AI Containment and Cybersecurity",
      description: "Investigate strategies to ensure AI systems remain secure and within intended operational bounds.",
    },
    {
      title: "Cooperative AI and Multi-Agent Systems",
      description: "Explore how multiple AI agents can work together safely and effectively.",
    }
  ];

  return (
    <section ref={ref} className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold text-center mb-16"
        >
          Explore Key AI Safety Topics
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-8"
        >
          {categories.map((category, index) => (
            <motion.div
              key={index}
              className="bg-gray-50 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              whileHover={{ y: -5 }}
            >
              <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500" />
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2 leading-tight">{category.title}</h3>
                <p className="text-sm text-gray-600">{category.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-16 text-lg text-gray-700"
        >
          We continuously update our content to reflect the latest advancements in AI safety research.
          Soon, you'll be able to replicate paper results and contribute your own research!
        </motion.p>
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
          Join the Safe AI Revolution
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl mb-12"
        >
          Embark on a secure journey to understand and shape the future of AI safety.
          Learn, explore, and contribute ethically.
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white text-black px-10 py-5 rounded-full text-xl font-medium hover:bg-gray-200 transition-colors duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.href = "/alignmentor"}
        >
          Start Your Ethical AI Journey
        </motion.button>
      </div>
    </section>
  );
};

export default LandingPage;