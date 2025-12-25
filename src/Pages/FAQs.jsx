import React, { useState } from 'react';

const faqs = [
	{
		question: 'What types of customisation do you offer?',
		answer: `We offer high-quality embroidery and vinyl printing services for all our workwear products. Whether you're looking for a classic stitched logo or a vibrant printed design, we've got you covered.`,
	},
	{
		question: 'Can I upload my own logo or design?',
		answer:
			'Yes, absolutely! You can upload your logo or artwork directly through our product customiser. We accept most common file formats including PNG, JPEG, SVG, and PDF.',
	},
	{
		question: 'Is there a minimum order quantity for customised items?',
		answer:
			"We have no minimum order requirement for most customised products. Whether you need one item or a bulk order, we're happy to help.",
	},
	{
		question: "What's the difference between embroidery and vinyl printing?",
		answer: `• Embroidery uses stitched threads to create a durable and professional look—perfect for logos on polos, jackets, and uniforms.
• Vinyl printing applies your design using heat transfer for a smooth, detailed finish—ideal for bold graphics or text.`,
	},
	{
		question: 'How long does it take to receive my customised order?',
		answer:
			"Custom orders typically take 5-10 working days to complete, depending on the size and complexity of the order. We'll always provide an estimated delivery date during checkout.",
	},
	{
		question: 'Can I see a mockup before production?',
		answer:
			'Yes, we offer a digital proof/mockup for approval before we begin production, so you can make sure everything looks just right.',
	},
	{
		question: 'Do you accept returns on customised items?',
		answer:
			'We do not accept returns or refunds on customised items, unless there is a fault on our part (e.g., incorrect sizing, spelling, or logo placement). Please double-check your design and sizing before placing the order.',
	},
	{
		question: 'Do you offer discounts for bulk orders?',
		answer:
			'Yes, we offer bulk pricing and trade discounts. For large orders, please contact us at support@customisablewear.com for a custom quote.',
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

const FAQs = () => {
	const [openIndex, setOpenIndex] = useState(null);

	const toggle = (index) => {
		setOpenIndex(openIndex === index ? null : index);
	};

	return (
		<section className='max-w-3xl mx-auto px-4 py-12 lg-h-[80vh]'>
			<h2 className='text-3xl font-bold text-center mb-8'>Frequently Asked Questions</h2>
			<div className='space-y-4'>
				{faqs.map((faq, index) => (
					<div key={index} className='border bg-white rounded-lg overflow-hidden transition-all duration-300'>
						<button
							onClick={() => toggle(index)}
							className='w-full text-left px-6 py-4 font-medium flex justify-between items-center'>
							<span className='text-black'>{faq.question}</span>
							<span className='text-xl text-black'>{openIndex === index ? '−' : '+'}</span>
						</button>
						<div
							className={`px-6 transition-all duration-300 ease-in-out overflow-hidden ${
								openIndex === index ? 'max-h-40 py-4 opacity-100' : 'max-h-0 opacity-0'
							}`}>
							<p className='text-black '>{faq.answer}</p>
						</div>
					</div>
				))}
			</div>
		</section>
	);
};

export default FAQs;
