import React, { useState } from 'react';

const faqs = [
  {
    question: 'What types of customisation do you offer?',
    answer: `We offer high-quality embroidery and vinyl printing services for all our workwear products. Whether you're looking for a classic stitched logo or a vibrant printed design, we've got you covered.`,
  },
  {
    question: 'Can I upload my own logo or design?',
    answer: 'Yes, absolutely! You can upload your logo or artwork directly through our product customiser. We accept most common file formats including PNG, JPEG, SVG, and PDF.',
  },
  {
    question: 'Is there a minimum order quantity for customised items?',
    answer: "We have no minimum order requirement for most customised products. Whether you need one item or a bulk order, we're happy to help.",
  },
  {
    question: "What's the difference between embroidery and vinyl printing?",
    answer: `• Embroidery uses stitched threads to create a durable and professional look—perfect for logos on polos, jackets, and uniforms.
• Vinyl printing applies your design using heat transfer for a smooth, detailed finish—ideal for bold graphics or text.`,
  },
  {
    question: 'How long does it take to receive my customised order?',
    answer: "Custom orders typically take 5-10 working days to complete, depending on the size and complexity of the order. We'll always provide an estimated delivery date during checkout.",
  },
  {
    question: 'Can I see a mockup before production?',
    answer: 'Yes, we offer a digital proof/mockup for approval before we begin production, so you can make sure everything looks just right.',
  },
  {
    question: 'Do you accept returns on customised items?',
    answer: 'We do not accept returns or refunds on customised items, unless there is a fault on our part (e.g., incorrect sizing, spelling, or logo placement). Please double-check your design and sizing before placing the order.',
  },
  {
    question: 'Do you offer discounts for bulk orders?',
    answer: 'Yes, we offer bulk pricing and trade discounts. For large orders, please contact us at support@customisablewear.com for a custom quote.',
  },
  {
    question: 'What workwear items can I customise?',
    answer: `You can customise a wide range of products including:
• Polo shirts
• T-shirts
• Hoodies & sweatshirts
• Jackets & outerwear
• Hi-vis clothing
• Caps and more`,
  },
  {
    question: 'How should I care for customised clothing?',
    answer: `To ensure longevity:
• Wash inside out at 30°C
• Avoid tumble drying
• Do not iron directly over embroidery or print`,
  },
  {
    question: 'Do you charge VAT?',
    answer: `No VAT Charged on Your Purchases!
We want to let you know that we are not currently registered for VAT (Value Added Tax). 
This means that we do not charge VAT on any of your purchases, and the prices you see are the exact prices you pay.
We'll be sure to update our website if our VAT registration status changes in the future. If you have any questions, feel free to contact us!`,
  },
];

const FAQsPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="max-w-4xl mx-auto px-6 py-16 lg:py-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Find answers to common questions about our custom workwear services.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 ${openIndex === index ? 'shadow-md' : 'hover:shadow-sm'}`}
          >
            <button
              onClick={() => toggle(index)}
              className="w-full text-left px-6 py-5 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors duration-200"
              aria-expanded={openIndex === index}
              aria-controls={`faq-${index}`}
            >
              <span className="text-lg font-semibold text-gray-800">{faq.question}</span>
              <span className={`ml-4 text-2xl text-gray-600 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>
            <div
              id={`faq-${index}`}
              className={`px-6 transition-all duration-300 ease-in-out overflow-hidden ${openIndex === index ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
              <div className="prose prose-gray text-gray-600">
                {faq.answer.split('\n').map((paragraph, i) => (
                  <p key={i} className="mb-3 last:mb-0">{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-600 mb-4">Still have questions?</p>
        <a
          href="mailto:support@customisablewear.com"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
        >
          Contact Our Support Team
        </a>
      </div>
    </section>
  );
};

export default FAQsPage;