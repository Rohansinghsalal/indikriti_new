import { useState } from 'react';

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      id: 1,
      question: 'How do I track my order?',
      answer: 'You can track your order by logging into your account and visiting the "Orders" section. Alternatively, you can use the tracking number provided in your shipping confirmation email.'
    },
    {
      id: 2,
      question: 'What is your return policy?',
      answer: 'We offer a 15-day return policy for all our products. Items must be unused and in their original packaging. Please visit our Returns page for more details on the process.'
    },
    {
      id: 3,
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to select international destinations. Shipping costs and delivery times vary by location. Please check our Shipping page for more information.'
    },
    {
      id: 4,
      question: 'How do I care for handcrafted products?',
      answer: 'Each product comes with specific care instructions. Generally, we recommend gentle hand washing for textiles and avoiding harsh chemicals for all our handcrafted items.'
    },
    {
      id: 5,
      question: 'Can I customize my order?',
      answer: 'Yes, we offer customization for select products. Please contact our customer service team with your requirements, and we will guide you through the process.'
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <div className="faq-container">
        <div className="section-header">
          <h2>Frequently Asked Questions</h2>
          <p>Find answers to common questions about our products and services</p>
        </div>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div 
              className={`faq-item ${activeIndex === index ? 'active' : ''}`} 
              key={faq.id}
            >
              <div className="faq-question" onClick={() => toggleFAQ(index)}>
                <h3>{faq.question}</h3>
                <span className="faq-icon">{activeIndex === index ? '−' : '+'}</span>
              </div>
              <div className="faq-answer" style={{ display: activeIndex === index ? 'block' : 'none' }}>
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;