import React, { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "What is Rakfort?",
    answer:
      "Rakfort is a unified platform focused on elevating AI security through proactive defense mechanisms, including red teaming and comprehensive model evaluations.",
  },
  {
    question: "What is LLM red teaming, and how does Rakfort support it?",
    answer:
      "LLM red teaming is the process of simulating attacks on large language models to uncover vulnerabilities. Rakfort supports this with specialized tools and expert teams to ensure your AI models are robust before deployment.",
  },
  {
    question: "How do I configure and run evals and red team tests?",
    answer:
      "Use the Rakfort dashboard or CLI to configure your evaluation and red teaming parameters, select models, and initiate tests. Detailed documentation is available within the platform.",
  },
  {
    question: "What types of assertions and tests are supported?",
    answer:
      "Rakfort supports a variety of assertions and tests, including prompt injection, data leakage, bias detection, fairness, robustness, and custom evaluation metrics.",
  },
  {
    question: "Can I test multiple LLM providers and models?",
    answer:
      "Yes, Rakfort allows you to test and compare multiple LLM providers and models within a unified interface.",
  },
];

const FAQSection: React.FC = () => {
  const [openIndexes, setOpenIndexes] = useState<boolean[]>(
    Array(faqData.length).fill(false)
  );

  const toggle = (idx: number) => {
    setOpenIndexes((prev) =>
      prev.map((open, i) => (i === idx ? !open : open))
    );
  };

  return (
    <section className="bg-gray-100 dark:bg-[#1a102b] py-16 transition-colors duration-300">
      <div className="container mx-auto px-6 md:px-20">
        <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white text-center mb-12 uppercase">
          Frequently Asked Questions
        </h2>
        <div className="bg-white dark:bg-[#271243] rounded-xl shadow-lg p-8 transition-colors duration-300">
          {faqData.map((item, idx) => (
            <div
              key={idx}
              className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4"
            >
              <button
                className="w-full flex items-center justify-between text-left focus:outline-none group"
                onClick={() => toggle(idx)}
                aria-expanded={openIndexes[idx]}
                aria-controls={`faq-answer-${idx}`}
                type="button"
              >
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-purple-600 dark:text-purple-300 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-100">
                    {item.question}
                  </h3>
                </div>
                <svg
                  className={`w-5 h-5 text-purple-600 dark:text-purple-300 transform transition-transform duration-300 ${
                    openIndexes[idx] ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                id={`faq-answer-${idx}`}
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openIndexes[idx] ? "max-h-40 mt-3" : "max-h-0"
                }`}
              >
                <p className="text-gray-600 dark:text-gray-200 text-sm md:text-base">
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
