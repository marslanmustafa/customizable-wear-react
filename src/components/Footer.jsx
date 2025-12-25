import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaPhone, FaEnvelope } from 'react-icons/fa';
import logo from '../assets/images/log.png';
import paymentMethod from '../assets/icons/payments-method.png';
import footerBg from '../assets/images/footer-back.jpg';
const Footer = () => {
	const categories = {
		tops: [
			{ name: 'BodyWarmers', slug: 'bodywarmer' },
			{ name: 'Jackets', slug: 'jacket' },
			{ name: 'Hoodies', slug: 'hoodie' },
			{ name: `Polo's`, slug: 'polo' },
			{ name: 'Shirts & Blouses', slug: 'Shirt-blouse' },
			{ name: 'Sweatshirts', slug: 'sweatshirt' },
			{ name: 'T-Shirts', slug: 't-Shirt' },
		],
		bottoms: [
			{ name: 'Cargo Pants', slug: 'cargo-pants' },
			{ name: 'Shorts', slug: 'shorts' },
			{ name: 'Trousers', slug: 'trousers' },
			{ name: 'Work Pants', slug: 'work-pants' },
		],
		accessories: [
			{ name: 'BackPack', slug: 'backpack' },
			{ name: 'HeadWear', slug: 'headwear' },
			{ name: 'HI-VIS', slug: 'hi-vis' },

			{ name: 'Work Bag', slug: 'work-bag' },

		],
		brands: [
			{ name: 'Beechfield', slug: 'Beechfield' },
			{ name: 'Fruit of the Loom', slug: 'Fruit Of The Loom' },
			{ name: 'Gildan', slug: 'Gildan' },
			{ name: 'Hi-Vis & PPE', slug: 'HI-VIS & PPE' },
			{ name: 'James Harvest', slug: 'James Harvest' },
			{ name: 'Jobman Workwear', slug: 'Jobman Workwear' },
			{ name: 'Kustom Kit', slug: 'Kustom Kit' },
			{ name: 'Printer Essentials', slug: 'Printer Essentials' },
			{ name: 'Results', slug: 'Result' },
			{ name: 'UCC', slug: 'UCC (Ultimate Clothing Collection)' },
		],
	};

	const policies = [
		'Disclaimer',
		'Cookie Policy',
		'Payment Info',
		'Return Policy',
		'Shipping Policy',
		'VAT Information'
	];

	return (
		<footer className='bg-[#0f2252] text-white py-12 relative'>
			<div className='absolute inset-0 z-0'>
                <img 
                    src={footerBg} 
                    alt="Footer background" 
                    className='w-full h-full object-cover'
                />
                <div className='absolute inset-0 bg-[#0f2252] opacity-90'></div>
            </div>
			<div className='relative z-10'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10'>
					<div className='flex flex-col items-center md:items-start'>
						<Link to='/' className='mb-4'>
							<img className='h-20' src={logo} alt='logo' />
						</Link>
						<p className=' text-center md:text-left'>
							Hilton Road, BD72ED,
							<br />
							Bradford, UK
						</p>
					</div>

					<div className='flex flex-col items-center md:items-start'>
						<h2 className='text-lg font-bold mb-4 text-white'>Quick Links</h2>
						<ul className='space-y-2  text-center md:text-left'>
							{['Home', 'About', 'Contact', 'FAQs', 'Price Guide'].map((item) => (
								<li key={item}>
									<Link to={`/${item.toLowerCase().replace(' ', '-')}`} className='hover:text-white hover:underline transition-colors'>
										{item}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div className='flex flex-col items-center md:items-start'>
						<h2 className='text-lg font-bold mb-4 text-white'>Policies</h2>
						<ul className='space-y-2  text-center md:text-left'>
							{policies.map((item) => (
								<li key={item}>
									<Link
										to={`/${item.toLowerCase().replace(' ', '-')}`}
										className='hover:text-white hover:underline transition-colors'>
										{item}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div className='flex flex-col items-center md:items-start'>
						<h2 className='text-lg font-bold mb-4 text-white'>Contact Us</h2>
						<ul className='space-y-3  text-center md:text-left'>
							<li className='flex items-center justify-center md:justify-start'>
								<FaPhone className='mr-2' />
								<a href='tel:+44 7723233021' className='hover:text-white hover:underline'>
									+44 7723233021
								</a>
							</li>
							<li className='flex items-center justify-center md:justify-start'>
								<FaEnvelope className='mr-2' />
								<a href='mailto:info@customizablewear.com' className='hover:text-white hover:underline'>
									info@customizablewear.com
								</a>
							</li>

							<li className='pt-2'>
								<div className='flex justify-center md:justify-start space-x-4'>
									{[
										{ icon: <FaFacebookF />, href: 'https://www.facebook.com/share/126MGAioFuH/?mibextid=wwXIfr' },
										{ icon: <FaInstagram />, href: 'https://www.instagram.com/customizablewear?igsh=dG9kdTNrZGY1c25m' },

									].map((social, index) => (
										<a
											key={index}
											href={social.href}
											target='_blank'
											rel='noopener noreferrer'
											className='p-2 bg-gray-800 text-white rounded-full hover:bg-white hover:text-black transition-colors'>
											{social.icon}
										</a>
									))}
								</div>
							</li>
						</ul>
					</div>
				</div>

				<div className='mt-12'>
					<h2 className='text-xl font-bold mb-6 text-white text-center uppercase tracking-wider'>Shop Categories</h2>
					<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
						<div className='space-y-2'>
							<h3 className='text-sm font-semibold text-white uppercase border-b border-gray-700 pb-2'>Tops</h3>
							<ul className='space-y-2 '>
								{categories.tops.map((item) => (
									<li key={item.slug}>
										<Link to={`/products/${item.slug}`} className='hover:text-white hover:underline text-sm'>
											{item.name}
										</Link>
									</li>
								))}
							</ul>
						</div>

						<div className='space-y-2'>
							<h3 className='text-sm font-semibold text-white uppercase border-b border-gray-700 pb-2'>Bottoms</h3>
							<ul className='space-y-2 '>
								{categories.bottoms.map((item) => (
									<li key={item.slug}>
										<Link to={`/products/${item.slug}`} className='hover:text-white hover:underline text-sm'>
											{item.name}
										</Link>
									</li>
								))}
							</ul>
						</div>

						<div className='space-y-2'>
							<h3 className='text-sm font-semibold text-white uppercase border-b border-gray-700 pb-2'>Accessories</h3>
							<ul className='space-y-2 '>
								{categories.accessories.map((item) => (
									<li key={item.slug}>
										<Link to={`/products/${item.slug}`} className='hover:text-white hover:underline text-sm'>
											{item.name}
										</Link>
									</li>
								))}
							</ul>
						</div>

						<div className='space-y-2'>
							<h3 className='text-sm font-semibold text-white uppercase border-b border-gray-700 pb-2'>Brands</h3>
							<ul className='space-y-2 '>
								{categories.brands.map((item) => (
									<li key={item.slug}>
										<Link to={`/brands/${item.slug}`} className='hover:text-white hover:underline text-sm'>
											{item.name}
										</Link>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>

				<div className='mt-12 border-t border-white pt-6 '>
					<div className='flex flex-col md:flex-row justify-between items-center gap-4'>
						<img src={paymentMethod} alt='Payment Methods' className='h-8' />
						<p className=' text-center md:text-right'>
							&copy; {new Date().getFullYear()} Customizablewear || All Rights Reserved || Powered By{' '} <a href="https://www.codefyze.com" target="_blank" rel="noopener noreferrer">
								Codefyze
							</a>
						</p>
					</div>
				</div>
			</div>
			</div>
		</footer>
	);
};

export default Footer;
