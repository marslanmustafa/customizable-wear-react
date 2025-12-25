import React from 'react'
import steps_banner from '../assets/images/steps_banner.png'

const MarketingCard = () => {
    return (
        <>
           {/* <div>
                 <div className="bg-[#ED5F1E] text-white py-10 px-6 md:px-12 lg:px-20 text-center">
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-bold">
                        Clothing wear Dresses
                    </h2>
                    <p className="mt-2 text-sm md:text-base">
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Delectus saepe aliquam, cum fuga animi vel deleniti
                        <span className="font-bold">we've got you covered.</span>
                    </p>
                    <p className="mt-1 text-sm md:text-base">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate voluptatibus facere cu
                    </p>
                </div>

            </div> */}
            <div className='my-9 md:mx-4'>
                <img src={steps_banner} alt="" className='bg-contain md:h-100 xl-auto w-full' />
            </div>
        </>
    )
}

export default MarketingCard
