import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { Link } from 'react-router-dom'; // 👈 Import Link

import kustomkit from '../assets/images/kustomkit.png';
import fruitOfTheLoom from '../assets/images/fruit_of_the_loom.png';
import gildan from '../assets/images/gildan.png';
import printerEssentials from '../assets/images/printer_essentials.png';
import result from '../assets/images/result.png';
import jobmanWorkwear from '../assets/images/jobman_workwear.png';
import jamesHarvest from '../assets/images/james_harvest.png';
import hiv from '../assets/images/hiv.jpg';
import beechfield from '../assets/images/beechfield.png';
import ucc from '../assets/images/ucc.png';

const BRANDS = [
  { name: "Kustom Kit", logo: kustomkit },
  { name: "Fruit of the Loom", logo: fruitOfTheLoom },
  { name: "Gildan", logo: gildan },
  { name: "Printer Essentials", logo: printerEssentials },
  { name: "Results", logo: result },
  { name: "Jobman Workwear", logo: jobmanWorkwear },
  { name: "James Harvest", logo: jamesHarvest },
  { name: "HI-VIS & PPE", logo: hiv },
  { name: "Beechfield", logo: beechfield },
  { name: "UCC (Ultimate Clothing Collection)", logo: ucc },
];

const BrandCarousel = () => {
  const duplicatedBrands = useMemo(() => [...BRANDS, ...BRANDS], []);

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Our <span className="text-blue-600">Trusted</span> Partners
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Collaborating with industry leaders to deliver exceptional quality
          </p>
        </div>

        <div className="relative">
          {/* Gradient fade effects */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />

          <div className="py-8 overflow-hidden">
            <motion.div
              className="flex"
              animate={{
                x: ["0%", "-100%"],
              }}
              transition={{
                repeat: Infinity,
                duration: 40,
                ease: "linear",
              }}
            >
              {duplicatedBrands.map((brand, index) => (
                <Link
                  to={`/brands/${encodeURIComponent(brand.name)}`} // 👈 Navigate to brand page
                  key={`${brand.name}-${index}`}
                  className="flex-shrink-0 px-6"
                >
                  <div className="w-48 h-32 flex items-center justify-center bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-blue-100">
                    <img
                      src={brand.logo}
                      alt={`${brand.name} logo`}
                      className="max-h-16 max-w-[120px] object-contain filter hover:grayscale-0 transition-all duration-300"
                      loading="lazy"
                    />
                  </div>
                </Link>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandCarousel;
