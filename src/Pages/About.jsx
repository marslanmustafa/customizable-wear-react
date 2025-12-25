import React from 'react';
import { FaTshirt, FaMedal, FaShippingFast, FaUserTie } from 'react-icons/fa';
import { GiClothes } from 'react-icons/gi';
import { motion } from 'framer-motion';
import teamImage from '../assets/images/abt.png';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  const navigate = useNavigate();

  const features = [
    { icon: <FaMedal className="text-3xl" />, title: "Quality You Can Trust", desc: "Top-of-the-line materials and cutting-edge technology" },
    { icon: <FaUserTie className="text-3xl" />, title: "Tailored Solutions", desc: "Custom solutions that align with your brand identity" },
    { icon: <FaShippingFast className="text-3xl" />, title: "Fast Turnaround", desc: "Efficient service without compromising quality" }
  ];

  const services = [
    { icon: <FaTshirt className="text-3xl" />, title: "Custom Printing", desc: "Vibrant colors and crisp details" },
    { icon: <GiClothes className="text-3xl" />, title: "Professional Embroidery", desc: "Durable and elegant stitching" },
    { icon: <FaTshirt className="text-3xl" />, title: "Wide Product Range", desc: "Uniforms, safety gear, t-shirts, hoodies and more" }
  ];

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 mt-4">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#091638] to-[rgba(9,22,56,0.9)] text-white rounded-xl mb-8 h-64 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center px-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Your trusted partner in customised workwear solutions
          </p>
        </motion.div>
      </div>

      {/* Welcome Section */}
      <div className="w-full py-12 md:py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={staggerContainer}
            viewport={{ once: true }}
            className="flex flex-col lg:flex-row gap-8 md:gap-12 items-center"
          >
            <motion.div variants={fadeIn} className="lg:w-1/2 w-full">
              <img 
                src={teamImage} 
                alt="CustomizableWear Team" 
                className="rounded-xl shadow-2xl w-full h-auto object-cover"
              />
            </motion.div>
            
            <motion.div variants={fadeIn} className="lg:w-1/2 w-full">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Welcome to <span className="text-[#091638]">customizablewear.com</span>
              </h2>
              <p className="text-gray-700 mb-6 text-lg">
                We specialize in providing high-quality printing and embroidery services to help businesses and individuals create professional, personalized apparel that makes a lasting impression.
              </p>
              
              <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-[#091638]">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Who We Are</h3>
                <p className="text-gray-700">
                  At customizablewear.com, we believe that workwear is more than just clothing—it's a representation of your brand, your values, and your commitment to excellence. With years of experience in the industry, we have built a reputation for delivering exceptional craftsmanship, reliable service, and innovative designs tailored to meet your unique needs.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* What We Offer */}
      <div className="w-full py-12 md:py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What We Offer</h2>
            <div className="w-20 h-1 bg-[#091638] mx-auto"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-6 md:p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="text-[#091638] mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-700">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="w-full py-12 md:py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <div className="w-20 h-1 bg-[#091638] mx-auto"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 md:p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="text-[#091638] mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-700">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="w-full py-12 md:py-16 px-4 bg-[#091638] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg md:text-xl leading-relaxed">
              To empower businesses and individuals with workwear that not only looks great but also stands up to the demands of the job. By combining style, functionality, and personalization, we aim to help you make a statement that truly reflects who you are.
            </p>
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full py-12 md:py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Ready to Elevate Your Workwear?</h2>
            <p className="text-lg md:text-xl text-gray-700 mb-8">
              Contact us today to discuss your customisation needs and discover how customizablewear.com can bring your ideas to life.
            </p>
            <button className="bg-[#091638] hover:bg-black text-white font-bold py-3 px-8 rounded-lg text-lg transition-all transform hover:scale-105"
            onClick={() => navigate('/contact')}
            >
              Get in Touch
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;