import React from 'react';
import { FaCookieBite, FaLock, FaShieldAlt, FaQuestionCircle, FaEnvelope, FaPhone } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import cookieImage from '../assets/images/cookie-policy.png';

const CookiePolicy = () => {
	return (
		<div className='max-w-full mx-auto px-4 sm:px-6 lg:px-8'>
			{/* Hero Section with Image */}
			<div
				className='relative mt-4 py-32 rounded-3xl overflow-hidden'
				style={{
					background: `linear-gradient(rgba(9, 22, 56, 0.7), rgba(5, 11, 29, 0.7)), url(${cookieImage})`,
					backgroundSize: 'cover', 
					backgroundPosition: 'center', 
					backgroundRepeat: 'no-repeat' ,
					width: '100%', 
					height: '100%', 
					minHeight: '400px', 
				}}>
				<div className='absolute inset-0 flex items-center justify-center text-center px-4'>
					<div>
						<h1 className='text-3xl md:text-4xl font-bold text-white mb-4'>Cookie Policy</h1>
						<p className='text-xl text-white max-w-2xl mx-auto'>How We Use Cookies to Enhance Your Experience</p>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className='bg-white shadow-xl rounded-lg overflow-hidden mt-2 mb-12'>
				<div className='p-6 md:p-8 lg:p-10'>
					<div className='mb-2'>
						<p className='text-lg text-gray-600 mb-8'>
							Effective Date: 15th May 2025. At Customisable Wear, we use cookies to provide you with the best possible
							shopping experience.
						</p>
					</div>

					<div className='mb-10'>
						{/* What Are Cookies Section */}
						<div className='flex items-start mb-8'>
							<div className='bg-blue-100 p-3 rounded-full mr-4 mt-1'>
								<FaCookieBite className='text-blue-600 text-xl' />
							</div>
							<div>
								<h3 className='text-xl font-bold mb-4 text-gray-800'>1. What Are Cookies?</h3>
								<div className='bg-gray-50 p-5 rounded-lg'>
									<p className='text-gray-600'>
										Cookies are small text files stored on your device (computer, tablet, or mobile) when you visit a
										website. They help the site remember your preferences, improve performance, and collect analytical
										data to enhance your shopping experience.
									</p>
								</div>
							</div>
						</div>

						{/* Types of Cookies Section */}
						<div className='flex items-start mb-8'>
							<div className='bg-purple-100 p-3 rounded-full mr-4 mt-1'>
								<FaCookieBite className='text-purple-600 text-xl' />
							</div>
							<div>
								<h3 className='text-xl font-bold mb-4 text-gray-800'>2. Types of Cookies We Use</h3>

								<div className='grid md:grid-cols-2 gap-4 mb-4'>
									<div className='bg-blue-50 p-4 rounded-lg'>
										<h4 className='font-semibold text-lg mb-2 flex items-center'>
											<FaLock className='mr-2 text-blue-500' />
											Essential Cookies
										</h4>
										<p className='text-gray-600 text-sm'>
											Necessary for website functionality including shopping cart, account login, and secure checkout.
										</p>
									</div>
									<div className='bg-green-50 p-4 rounded-lg'>
										<h4 className='font-semibold text-lg mb-2 flex items-center'>
											<FaShieldAlt className='mr-2 text-green-500' />
											Performance Cookies
										</h4>
										<p className='text-gray-600 text-sm'>
											Help us understand visitor interactions through tools like Google Analytics.
										</p>
									</div>
								</div>

								<div className='grid md:grid-cols-2 gap-4'>
									<div className='bg-yellow-50 p-4 rounded-lg'>
										<h4 className='font-semibold text-lg mb-2 flex items-center'>
											<FaCookieBite className='mr-2 text-yellow-500' />
											Functional Cookies
										</h4>
										<p className='text-gray-600 text-sm'>
											Remember your preferences (language, region) for enhanced features.
										</p>
									</div>
									<div className='bg-red-50 p-4 rounded-lg'>
										<h4 className='font-semibold text-lg mb-2 flex items-center'>
											<FaShieldAlt className='mr-2 text-red-500' />
											Advertising Cookies
										</h4>
										<p className='text-gray-600 text-sm'>
											Deliver relevant ads and track campaign performance across platforms.
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* How We Use Cookies Section */}
						<div className='flex items-start mb-8'>
							<div className='bg-green-100 p-3 rounded-full mr-4 mt-1'>
								<FaShieldAlt className='text-green-600 text-xl' />
							</div>
							<div>
								<h3 className='text-xl font-bold mb-4 text-gray-800'>3. How We Use Cookies</h3>
								<div className='bg-gray-50 p-5 rounded-lg'>
									<ul className='list-disc pl-5 space-y-2 text-gray-600'>
										<li>Keep you signed in to your account</li>
										<li>Maintain items in your shopping cart between visits</li>
										<li>Understand website usage to improve user experience</li>
										<li>Show personalized content and product recommendations</li>
										<li>Track marketing campaign effectiveness</li>
									</ul>
								</div>
							</div>
						</div>

						{/* Third-Party Cookies Section */}
						<div className='flex items-start mb-8'>
							<div className='bg-yellow-100 p-3 rounded-full mr-4 mt-1'>
								<FaShieldAlt className='text-yellow-600 text-xl' />
							</div>
							<div>
								<h3 className='text-xl font-bold mb-4 text-gray-800'>4. Third-Party Cookies</h3>
								<div className='bg-gray-50 p-5 rounded-lg'>
									<p className='text-gray-600'>
										Some cookies are placed by third-party services that appear on our pages, including:
									</p>
									<div className='flex flex-wrap gap-2 mt-3'>
										<span className='bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm'>Google Analytics</span>
										<span className='bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm'>Facebook Pixel</span>
										<span className='bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm'>AdWords</span>
										<span className='bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm'>Hotjar</span>
									</div>
								</div>
							</div>
						</div>

						{/* Cookie Choices Section */}
						<div className='flex items-start mb-8'>
							<div className='bg-red-100 p-3 rounded-full mr-4 mt-1'>
								<FaQuestionCircle className='text-red-600 text-xl' />
							</div>
							<div>
								<h3 className='text-xl font-bold mb-4 text-gray-800'>5. Your Cookie Choices</h3>
								<div className='bg-gray-50 p-5 rounded-lg'>
									<p className='text-gray-600 mb-3'>
										You can manage or disable cookies through your browser settings. Note that blocking essential
										cookies may impact website functionality.
									</p>
									<p className='text-gray-600'>
										Learn more about managing cookies at:{' '}
										<a
											href='https://www.allaboutcookies.org/'
											target='_blank'
											rel='noopener noreferrer'
											className='text-blue-600 hover:underline'>
											allaboutcookies.org
										</a>
									</p>
								</div>
							</div>
						</div>

						{/* Policy Changes Section */}
						<div className='flex items-start mb-8'>
							<div className='bg-purple-100 p-3 rounded-full mr-4 mt-1'>
								<FaShieldAlt className='text-purple-600 text-xl' />
							</div>
							<div>
								<h3 className='text-xl font-bold mb-4 text-gray-800'>6. Changes to This Policy</h3>
								<div className='bg-gray-50 p-5 rounded-lg'>
									<p className='text-gray-600'>
										We may update this Cookie Policy periodically. Changes will be posted here with an updated effective
										date. We recommend checking this page occasionally to stay informed.
									</p>
								</div>
							</div>
						</div>

						{/* Contact Section */}
						<div className='flex items-start'>
							<div className='bg-blue-100 p-3 rounded-full mr-4 mt-1'>
								<FaEnvelope className='text-blue-600 text-xl' />
							</div>
							<div>
								<h3 className='text-xl font-bold mb-4 text-gray-800'>7. Contact Us</h3>
								<div className='bg-gray-50 p-5 rounded-lg'>
									<p className='text-gray-600 mb-4'>For questions about our Cookie Policy or data practices:</p>
									<div className='flex flex-col sm:flex-row gap-4'>
										<a
											href='mailto:support@customisablewear.com'
											className='flex items-center text-blue-600 hover:text-blue-800 transition-colors'>
											<FaEnvelope className='mr-2' />
											support@customisablewear.com
										</a>
										<a
											href='tel:+447723233021'
											className='flex items-center text-blue-600 hover:text-blue-800 transition-colors'>
											<FaPhone className='mr-2' />
											+44 7723 233021
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className='mt-8 text-center'>
						<Link
							to='/'
							className='inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#091638] hover:bg-[#0a1b4d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#091638] transition-colors'>
							Back to Homepage
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CookiePolicy;
