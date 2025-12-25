import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useToast } from '@/components/ui/use-toast';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import { getApiBaseUrl } from '../utils/config';

// const apiUrl = import.meta.env.VITE_API_BASE_URL;

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    contactNumber: '',
    company: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.contactNumber || !formData.message) {
      toast({
        description: 'Full Name, Email, Contact Number, and Message are required!',
        variant: 'destructive',
        className: 'bg-red-500 text-white border-0',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${getApiBaseUrl()}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      setLoading(false);

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message');
      }

      Swal.fire({
        title: 'Success!',
        text: 'Your form has been submitted!',
        icon: 'success',
        confirmButtonColor: '#fc8019',
      });

      setFormData({ fullName: '', email: '', contactNumber: '', company: '', message: '' });

    } catch (error) {
      setLoading(false);
      toast({
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
        className: 'bg-red-500 text-white border-0',
      });
    }
  };

  return (
    <div className='bg-gray-100 py-16'>
      <div className='max-w-7xl mx-auto px-6 lg:px-8'>
        <h2 className='text-3xl font-bold text-gray-800 text-center mb-12'>Contact <span className='text-[#002DA1]'> Us </span></h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div className='bg-white p-8 shadow-lg rounded-lg'>
            <h3 className='text-2xl font-bold text-gray-800 mb-4'>Get in Touch</h3>
            <form className='space-y-4' onSubmit={handleSubmit}>
              <div>
                <label htmlFor='fullName' className='block text-gray-600'>Full Name</label>
                <input
                  type='text'
                  id='fullName'
                  name='fullName'
                  value={formData.fullName}
                  onChange={handleChange}
                  className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-[#fc8019]'
                  placeholder='Your Full Name'
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor='email' className='block text-gray-600'>Email Address</label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-[#fc8019]'
                  placeholder='Your Email Address'
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor='contactNumber' className='block text-gray-600'>Contact Number</label>
                <input
                  type='text'
                  id='contactNumber'
                  name='contactNumber'
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-[#fc8019]'
                  placeholder='Your Contact Number'
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor='company' className='block text-gray-600'>Company (optional)</label>
                <input
                  type='text'
                  id='company'
                  name='company'
                  value={formData.company}
                  onChange={handleChange}
                  className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-[#fc8019]'
                  placeholder='Your Company'
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor='message' className='block text-gray-600'>Message</label>
                <textarea
                  id='message'
                  name='message'
                  value={formData.message}
                  onChange={handleChange}
                  className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-[#fc8019]'
                  placeholder='Your Message'
                  rows={4}
                  disabled={loading}
                  required
                />
              </div>
              <button
                type='submit'
                className='w-full py-3 bg-black text-white rounded-lg hover:bg-white hover:text-black border-black  transition duration-300 flex items-center justify-center'
                disabled={loading}>
                {loading ? (
                  <span className='flex items-center'>
                    <svg
                      className='animate-spin h-5 w-5 mr-2 text-white'
                      viewBox='0 0 24 24'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'>
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'></circle>
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8v4l4-4-4-4v4a8 8 0 00-8 8H4z'></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>
          <div className='space-y-8'>
            <div className='bg-white p-8 shadow-lg rounded-lg'>
              <h3 className='text-2xl font-bold text-gray-800 mb-4'>Contact Information</h3>
              <ul className='text-gray-600'>
                <li className='mb-4'>
                  <strong>Address:</strong> Hilton Road, BD72ED, Bradford, UK
                </li>
                <li className='mb-4'>
                  <strong>Phone:</strong> <a href='tel:+44 7723233021' className='hover:text-gray-300 hover:underline'>
                    +44 7723233021
                  </a>
                </li>
                <li className='mb-4'>
                  <strong>Email:</strong> <a href='mailto:info@customizablewear.com' className='hover:text-gray-300 hover:underline'>
                    info@customizablewear.com
                  </a>
                </li>
              </ul>
            </div>
            <div className='bg-white p-8 shadow-lg rounded-lg'>
              <h3 className='text-2xl font-bold text-gray-800 mb-4'>Follow Us</h3>
              <div className='flex space-x-4'>
                <a
                  href='https://www.facebook.com/share/126MGAioFuH/?mibextid=wwXIfr'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='p-3 bg-gray-200 rounded-full hover:bg-gray-300 transition duration-300'>
                  <FaFacebookF />
                </a>

                <a
                  href='https://www.instagram.com/customizablewear?igsh=dG9kdTNrZGY1c25m'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='p-3 bg-gray-200 rounded-full hover:bg-gray-300 transition duration-300'>
                  <FaInstagram />
                </a>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;