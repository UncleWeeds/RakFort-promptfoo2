import React from 'react';
import Footer from './Footer';
import FAQSection from './FAQ';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen overflow-y-auto bg-gray-50 dark:bg-[#1a102b] transition-colors duration-300">
      {/* Header */}
      <header className="bg-purple-100 dark:bg-[#271243] py-14 relative overflow-hidden">
        <div className="container mx-auto text-center relative z-10">
          <div className="flex justify-center mb-4">
            <span className="inline-block h-2 w-24 rounded-full bg-gradient-to-r from-purple-400 via-indigo-500 to-indigo-600 opacity-70"></span>
          </div>
          <h1
            className="text-4xl md:text-6xl font-extrabold tracking-tight text-indigo-800 dark:text-white leading-tight mb-4"
            style={{
              textShadow: '0 4px 24px rgba(80,0,120,0.15), 0 1px 0 #fff',
            }}
          >
            Elevating AI Security:{' '}
            <span className="relative px-2 py-1 rounded text-purple-700 dark:text-indigo-200">
              A Unified Platform
            </span>
          </h1>
          <p className="mt-4 text-xl md:text-2xl font-light text-indigo-700 dark:text-indigo-200 max-w-2xl mx-auto">
            Proactive Defense for the Future of Artificial Intelligence
          </p>
          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="flex justify-center gap-4">
              <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full text-base shadow-lg transition">
                Get Started
              </button>
              <button className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-8 rounded-full text-base shadow-lg transition">
                Request Demo
              </button>
            </div>
            <div className="mt-8 flex flex-col items-center">
              <h4 className="text-lg font-semibold text-indigo-800 dark:text-white mb-2">
                Stay in the Know Without the FOMO.
              </h4>
              <button className="bg-yellow-500 hover:bg-pink-600 dark:bg-yellow-600 dark:hover:bg-pink-700 text-white font-bold py-3 px-8 rounded-full text-sm transition shadow-lg">
                Join the Community
              </button>
            </div>
          </div>
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[180px] bg-purple-300 dark:bg-indigo-900 opacity-10 blur-3xl rounded-full z-0"></div>
      </header>

      <main className="flex-grow">
        {/* Red Teaming Section */}
        <section className="bg-purple-100 dark:bg-[#271243] py-16 transition-colors duration-300">
          <div className="container mx-auto px-6 md:px-20">
            <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white text-center mb-12 uppercase">
              Uncover Vulnerabilities with Red Teaming
            </h2>
            <div className="bg-white dark:bg-[#1a102b] rounded-xl shadow-lg overflow-hidden md:grid md:grid-cols-2 gap-10 items-center transition-colors duration-300">
              <div className="p-8">
                <h3 className="text-xl md:text-2xl font-bold text-purple-700 dark:text-purple-300 mb-4">
                  Simulating Attacks for Robust AI
                </h3>
                <p className="mb-6 text-sm md:text-base leading-relaxed text-gray-700 dark:text-gray-200 font-medium">
                  Red Teaming provides a crucial layer of security for AI systems. By emulating adversarial tactics, we proactively identify weaknesses such as{' '}
                  <strong>prompt injection</strong>, <strong>data leakage</strong>, <strong>bias</strong>, and <strong>unsafe outputs</strong>. Our expert red teams rigorously probe AI models to ensure resilience before real-world deployment.
                </p>
                <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-3">Key Objectives:</h4>
                <ul className="list-disc list-inside space-y-2 text-sm md:text-base text-gray-600 dark:text-gray-300 font-medium">
                  <li><span className="text-purple-600 dark:text-purple-400 mr-2">•</span>Identify and resolve vulnerabilities and potential failure points.</li>
                  <li><span className="text-purple-600 dark:text-purple-400 mr-2">•</span>Strengthen models against malicious attacks and unintended misuse.</li>
                  <li><span className="text-purple-600 dark:text-purple-400 mr-2">•</span>Enhance trust in AI systems by validating their security and reliability.</li>
                </ul>
              </div>
              <div className="p-8 flex justify-center items-center bg-purple-50 dark:bg-[#271243] transition-colors duration-300">
                <div className="w-full h-64 md:h-80 bg-purple-200 dark:bg-[#271243] border border-purple-300 dark:border-purple-700 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400 text-sm italic">
                    [ Red Teaming Illustration ]
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Evals Section */}
        <section className="bg-indigo-100 dark:bg-[#1a102b] py-16 transition-colors duration-300">
          <div className="container mx-auto px-6 md:px-20">
            <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white text-center mb-12 uppercase">
              Comprehensive AI Evaluations
            </h2>
            <div className="bg-white dark:bg-[#271243] rounded-xl shadow-lg overflow-hidden md:grid md:grid-cols-2 gap-10 items-center transition-colors duration-300">
              <div className="p-8 flex justify-center items-center bg-indigo-50 dark:bg-[#271243] transition-colors duration-300">
                <div className="w-full h-64 md:h-80 bg-indigo-200 dark:bg-[#271243] border border-indigo-300 dark:border-indigo-700 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400 text-sm italic">
                    [ AI Evaluation Metrics ]
                  </span>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-xl md:text-2xl font-bold text-indigo-700 dark:text-indigo-300 mb-4">
                  Measuring Performance, Safety, and Alignment
                </h3>
                <p className="mb-6 text-sm md:text-base leading-relaxed text-gray-700 dark:text-gray-200 font-medium">
                  Our rigorous <strong>Evals</strong> framework goes beyond standard benchmarks to provide in-depth assessments of AI models. We focus on application-specific tasks and real-world scenarios to uncover subtle behaviors and edge cases, ensuring your AI operates reliably and ethically.
                </p>
                <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-3">Key Objectives:</h4>
                <ul className="list-disc list-inside space-y-2 text-sm md:text-base text-gray-600 dark:text-gray-300 font-medium">
                  <li><span className="text-indigo-600 dark:text-indigo-400 mr-2">•</span>Quantify model performance, safety metrics, and alignment with intended use.</li>
                  <li><span className="text-indigo-600 dark:text-indigo-400 mr-2">•</span>Identify potential failure modes, unexpected emergent behaviors, and limitations in generalization.</li>
                  <li><span className="text-indigo-600 dark:text-indigo-400 mr-2">•</span>Validate model readiness for deployment, including adherence to fairness and robustness standards.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <FAQSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
