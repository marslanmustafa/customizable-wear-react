import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import Cw1 from '../assets/images/heroslides/beechfield.png';
import Cw2 from '../assets/images/heroslides/fruit of loom.png';
import Cw3 from '../assets/images/heroslides/gildan.png';
import Cw4 from '../assets/images/heroslides/hi-vis ppe.png';
import Cw5 from '../assets/images/heroslides/james harvest.png';
import Cw6 from '../assets/images/heroslides/jobman workwear.png';
import Cw7 from '../assets/images/heroslides/Kustom Kit.png';
import Cw8 from '../assets/images/heroslides/printer essentials.png';
import Cw9 from '../assets/images/heroslides/result.png';
import Cw10 from '../assets/images/heroslides/ucc .png';

const Hero = () => {
  const navigate = useNavigate();
  const [api, setApi] = React.useState();

  useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => api.scrollNext(), 3000);
    return () => clearInterval(interval);
  }, [api]);

  const slides = [
    { image: Cw1, type: 'brand', name: "BeechField" },
    { image: Cw2, type: 'brand', name: "Fruit of the Loom" },
    { image: Cw7, type: 'brand', name: "Kustom Kit" },
    { image: Cw3, type: 'brand', name: "Gildan" },
    { image: Cw4, type: 'brand', name: "HI-VIS & PPE" },
    { image: Cw5, type: 'brand', name: "James Harvest" },
    { image: Cw6, type: 'brand', name: "Jobman Workwear" },
    { image: Cw8, type: 'brand', name: "Printer Essentials" },
    { image: Cw9, type: 'brand', name: "Result" },
    { image: Cw10, type: 'brand', name: "UCC (Ultimate Clothing Collection)" },
  ];

  return (
    <div className='hero w-full relative'>
      {/* Outer wrapper with responsive spacing */}
      <div className=' rounded-xl overflow-hidden shadow-md'>
        <Carousel 
          className='w-full h-[120px] sm:h-[180px] md:h-[280px] lg:h-[380px] xl:h-[480px]' 
          setApi={setApi} 
          opts={{ loop: true }}
        >
          <CarouselContent className='h-full'>
            {slides.map((slide, index) => (
              <CarouselItem key={index} className='h-full'>
                <div
                  className='h-full w-full cursor-pointer relative group'
                  onClick={() => navigate(`/brands/${encodeURIComponent(slide.name)}`)}
                >
                  <img
                    src={slide.image}
                    className='w-full h-full object-cover'
                    alt={`${slide.name} brand`}
                    loading='lazy'
                  />
                  <div className='absolute bottom-0 left-0 right-0 text-center p-2'>
                    <p className='text-white font-bold text-sm sm:text-base md:text-lg lg:text-xl bg-black/70 inline-block px-2 py-1 rounded transition-all group-hover:bg-black/90'>
                      {slide.name}
                    </p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Responsive carousel controls */}
          <div className='absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-2 sm:px-4 md:px-6'>
            <CarouselPrevious className='hidden sm:flex h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full bg-white/90 hover:bg-white border border-gray-200 shadow-md items-center justify-center text-black' />
            <CarouselNext className='hidden sm:flex h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full bg-white/90 hover:bg-white border border-gray-200 shadow-md items-center justify-center text-black' />
          </div>
        </Carousel>
      </div>
    </div>
  );
};

export default Hero;