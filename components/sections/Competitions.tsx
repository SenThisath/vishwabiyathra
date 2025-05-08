"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import { Title } from "../Title";
import { FadeInWhenVisible } from "../FadeInWhenVisible";
import { useEffect, useState } from "react";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

const Competitions = () => {
    const [slidesPerView, setSlidesPerView] = useState(1);

    // Update slides per view based on screen size
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setSlidesPerView(1);
            } else if (window.innerWidth < 1024) {
                setSlidesPerView(2);
            } else {
                setSlidesPerView(3);
            }
        };

        // Initial call
        handleResize();

        // Add event listener
        window.addEventListener("resize", handleResize);

        // Cleanup
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <section
            id="competitions"
            className="min-h-screen py-8 md:py-16 lg:py-24 relative z-0 flex flex-col items-center justify-center"
        >
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
                            slidesPerView={slidesPerView}
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
                            {[1, 2, 3, 4, 5].map((_, index) => (
                                <SwiperSlide key={index}>
                                    <div className="bg-gradient-to-b from-purple-900/50 to-black rounded-2xl overflow-hidden shadow-xl transform transition-all duration-300 hover:scale-105">
                                        <div className="relative">
                                            <img
                                                src="https://swiperjs.com/demos/images/nature-1.jpg"
                                                alt={`Competition ${index + 1}`}
                                                className="w-full h-48 md:h-64 object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/40"></div>
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                                                Competition Title
                                            </h3>
                                            <p className="text-gray-300 text-sm md:text-base mb-4">
                                                Join our exciting tournament and
                                                compete with the best players
                                            </p>
                                            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-300">
                                                Register Now
                                            </button>
                                        </div>
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

export default Competitions;
