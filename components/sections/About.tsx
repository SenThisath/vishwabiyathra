"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import { FadeInWhenVisible } from "../FadeInWhenVisible";
import { Title } from "../Title";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

const natureImages = [
    "https://swiperjs.com/demos/images/nature-1.jpg",
    "https://swiperjs.com/demos/images/nature-2.jpg",
    "https://swiperjs.com/demos/images/nature-3.jpg",
    "https://swiperjs.com/demos/images/nature-4.jpg",
    "https://swiperjs.com/demos/images/nature-5.jpg",
    "https://swiperjs.com/demos/images/nature-6.jpg",
    "https://swiperjs.com/demos/images/nature-7.jpg",
    "https://swiperjs.com/demos/images/nature-8.jpg",
    "https://swiperjs.com/demos/images/nature-9.jpg"
];

const About = () => {
    return (
        <section
            id="about"
            className="min-h-screen py-8 md:py-16 lg:py-24 relative z-10 flex flex-col items-center justify-center"
        >
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 to-black pointer-events-none"></div>
            <div className="z-10 px-4 md:px-8 lg:px-16 w-full max-w-7xl mx-auto text-center">
                <FadeInWhenVisible>
                    <div className="flex flex-col items-center">
                        <Title
                            mainText="THE FUTURE OF"
                            subText="TABLETOP IS HERE"
                        />
                    </div>
                </FadeInWhenVisible>
                
                <div className="mt-8 md:mt-12 lg:mt-16">
                    <FadeInWhenVisible delay={0.2}>
                        
                        
                        <Swiper
                            effect={"coverflow"}
                            grabCursor={true}
                            centeredSlides={true}
                            slidesPerView={"auto"}
                            spaceBetween={20}
                            loop={true}
                            coverflowEffect={{
                                rotate: 30,
                                stretch: 0,
                                depth: 100,
                                modifier: 1.5,
                                slideShadows: true,
                            }}
                            pagination={{
                                clickable: true,
                                dynamicBullets: true,
                            }}
                            navigation={true}
                            modules={[EffectCoverflow, Pagination, Navigation]}
                            className="mySwiper mt-6 md:mt-8"
                        >
                            {natureImages.map((image, index) => (
                                <SwiperSlide 
                                    key={index}
                                    className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 rounded-lg overflow-hidden mx-auto"
                                >
                                    <div className="relative pb-[100%] sm:pb-[75%] lg:pb-[56.25%] h-0">
                                        <img 
                                            src={image} 
                                            alt={`Gaming experience ${index + 1}`}
                                            className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
                                        />
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                                        <h3 className="text-lg md:text-xl font-bold">Feature {index + 1}</h3>
                                        <p className="text-sm md:text-base mt-1 hidden sm:block">Experience the future of tabletop gaming</p>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </FadeInWhenVisible>
                </div>
            </div>

            <style jsx global>{`
                .mySwiper {
                    padding: 0 5% !important;
                    width: 100%;
                }
                .swiper-wrapper {
                    align-items: center;
                }
                .swiper-pagination-bullet {
                    background: white;
                    opacity: 0.5;
                }
                .swiper-pagination-bullet-active {
                    opacity: 1;
                    background: #8b5cf6;
                }
                .swiper-button-next,
                .swiper-button-prev {
                    color: white;
                    background: rgba(0, 0, 0, 0.3);
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .swiper-button-next:after,
                .swiper-button-prev:after {
                    font-size: 18px;
                }
                @media (max-width: 640px) {
                    .swiper-button-next,
                    .swiper-button-prev {
                        display: none;
                    }
                }
            `}</style>
        </section>
    );
};

// Sample image data - replace with your actual images


export default About;