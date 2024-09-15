/* eslint-disable react/no-unescaped-entities */
'use client'

import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import * as amplitude from "@amplitude/analytics-browser"
import Script from 'next/script'

const privacyPolicy = `
Privacy Policy for Alignmentor

Last updated: 29-Aug-2024

1. Introduction
   Alignmentor is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information when you use our website and services.

2. Information We Collect
   - Usage data: Clicks, page views, and your journey through the website.
   - Technical data: IP address, browser type, and device information.

3. How We Use Your Information
   We use the collected information solely to:
   - Improve our website's functionality and user experience.
   - Analyze user behavior to enhance our services.
   - Ensure the security and proper operation of our platform.

4. What We Don't Collect or Track
   - We do not track your activities outside our website.
   - We do not collect personal information beyond what's necessary for site functionality.
   - We do not use cookies for advertising purposes.

5. Data Security
   We implement industry-standard security measures to protect your information from unauthorized access, alteration, disclosure, or destruction.

6. Your Rights
   You have the right to:
   - Access the data we hold about you.
   - Request deletion of your data.
   - Opt-out of non-essential data collection.

7. Changes to This Policy
   We may update this policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.

8. Contact Us
   If you have any questions about this Privacy Policy, please contact us at tim@rookih.com.

By using Alignmentor, you agree to the collection and use of information in accordance with this policy.
  `;

const termsOfService = `
Terms of Service for Alignmentor

Last updated: 29-Aug-2024

1. Acceptance of Terms
   By accessing or using Alignmentor ("the Service"), you agree to comply with and be bound by these Terms of Service.

2. Use of the Service
   2.1 Permitted Use
   You may use Alignmentor to:
   - Access and learn from AI safety content.
   - Participate in secure, ethical learning experiences.
   - Engage in discussions related to AI safety.

   2.2 Prohibited Actions
   You agree not to:
   - Attempt to bypass or compromise the Service's security measures.
   - Use the Service for any illegal activities.
   - Share or distribute content from the Service without permission.
   - Interfere with or disrupt the integrity of the Service.
   - Impersonate other users or entities.

3. Intellectual Property
   All content provided on Alignmentor is the property of Alignmentor or its licensors and is protected by copyright and other intellectual property laws.

4. User Contributions
   You may have the opportunity to contribute content or participate in discussions. You retain ownership of your contributions, but grant Alignmentor a license to use, modify, and display such contributions.

5. Disclaimer of Warranties
   The Service is provided "as is" without any warranties, express or implied.

6. Limitation of Liability
   Alignmentor shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service.

7. Changes to Terms
   We reserve the right to modify these Terms at any time. Your continued use of the Service after such changes constitutes acceptance of the new Terms.

8. Governing Law
   These Terms shall be governed by and construed in accordance with the laws of The United States Of America.

9. Contact Information
   If you have any questions about these Terms, please contact us at tim@rookih.com.

By using Alignmentor, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
  `;

const acknowledgement = `
  We would like to express our deepest gratitude to all the authors who have contributed to the AI safety literature. Your tireless efforts, groundbreaking research, and invaluable insights have been instrumental in shaping our understanding of AI safety and its critical importance for humanity's future.

  We also extend our sincere appreciation to arXiv (arxiv.org) for providing an open-access platform that has facilitated the rapid dissemination of research papers in the field of AI safety. arXiv's role in making cutting-edge research freely available has been crucial in accelerating progress and fostering collaboration within the AI safety community.

  Some key contributors to the field include, but are not limited to:
  • Stuart Russell
  • Nick Bostrom
  • Eliezer Yudkowsky
  • Paul Christiano
  • Toby Ord
  • Dario Amodei
  • Chris Olah
  • OpenAI researchers
  • DeepMind's safety team
  • And many more brilliant minds working tirelessly on this crucial challenge

  We stand on the shoulders of giants, and it is through their work that we are able to continue advancing the field of AI safety. Thank you all for your dedication to ensuring a beneficial future with AI.
    `;


const LandingPage: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const [modalContent, setModalContent] = useState<string | null>(null);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [isMounted, setIsMounted] = useState(false);
  const hasTracked = useRef(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    const initAndTrack = async () => {
      if (hasTracked.current) return;

      try {
        await amplitude.init(process.env.NEXT_AMPLITUDE_API_KEY || '', undefined, {
          defaultTracking: true
        });

        await amplitude.track('Viewed: Landing Page');
        hasTracked.current = true;
      } catch (error) {
        console.error('Error initializing or tracking with Amplitude:', error);
      }
    };

    if (isMounted) {
      initAndTrack();
    }
  }, [isMounted]);

  const openModal = (content: string, title: string) => {
    setModalContent(content);
    setModalTitle(title);
  };

  const closeModal = () => {
    setModalContent(null);
  };

  interface Analytics {
    trackEvent: (name: string, data?: Record<string, any>) => void
  }

  useEffect(() => {
    amplitude.init("234cb5ac952c953af7b04808156d15f5", {
      defaultTracking: true
    })
    amplitude.track("Landing Page Visit")
  }, [])

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      {/* Hero Section */}
      <Script
        src="https://cdn.amplitude.com/script/234cb5ac952c953af7b04808156d15f5.js"
        strategy="afterInteractive"
      />
      <Script id="amplitude-init" strategy="afterInteractive">
        {`
          function initAmplitude() {
            if (window.amplitude) {
              window.amplitude.add(window.sessionReplay.plugin({sampleRate: 1}));
              window.amplitude.init('234cb5ac952c953af7b04808156d15f5', {"fetchRemoteConfig":true,"autocapture":true});
            } else {
              setTimeout(initAmplitude, 100);
            }
          }
          window.addEventListener('load', initAmplitude);
        `}
      </Script>
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
            <button
              onClick={() => openModal(termsOfService, 'Terms of Service')}
              className="text-gray-600 hover:text-black transition-colors duration-300"
            >
              Terms
            </button>
            <button
              onClick={() => openModal(privacyPolicy, 'Privacy Policy')}
              className="text-gray-600 hover:text-black transition-colors duration-300"
            >
              Privacy
            </button>
            <a href="#" className="text-gray-600 hover:text-black transition-colors duration-300"
              onClick={() => window.location.href = "mailto:tim@rookih.com?subject=Contact%20from%20Alignmentor"}
            >
              Contact
            </a>
            <button
              onClick={() => openModal(acknowledgement, "Acknowledgements")}
              className="text-gray-600 hover:text-black transition-colors duration-300"
            >
              Acknowledgements
            </button>
          </div>
        </div>
      </footer>

      {modalContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <pre className="whitespace-pre-wrap font-sans">{modalContent}</pre>
            <button
              className="mt-6 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors duration-300"
              onClick={closeModal}
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
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
      title: "AI Safety Foundations",
      description: "Explore the fundamental literature that explains the basics of AI safety and Machine Learning.",
    },
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