"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import { FadeInWhenVisible } from "../FadeInWhenVisible";
import { Title } from "../Title";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

const About = () => {
    return (
        <section
            id="about"
            className="min-h-screen py-8 md:py-16 lg:py-24 relative z-10 flex flex-col items-center justify-center"
        >
            <div className="absolute inset-0 pointer-events-none"></div>
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
                            slidesPerView={2}
                            breakpoints={{
                                640: { slidesPerView: 2 },
                                768: { slidesPerView: 2.5 },
                                1024: { slidesPerView: 3 },
                            }}
                            coverflowEffect={{
                                rotate: 20,
                                stretch: 0,
                                depth: 200,
                                modifier: 1,
                                slideShadows: true,
                            }}
                            pagination={{ clickable: true }}
                            navigation={true}
                            modules={[EffectCoverflow, Pagination, Navigation]}
                        >
                            {[
                                "intro-1.svg",
                                "intro-2.svg",
                                "intro-3.svg",
                                "intro-4.svg",
                            ].map((image, index) => (
                                <SwiperSlide key={index} className="mb-10">
                                    <div className="group relative overflow-hidden rounded-lg shadow-lg shadow-purple-800/30 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/30 h-96 lg:h-[32rem] xl:h-[36rem] mx-4">
                                        <div
                                            className="absolute inset-0 bg-cover bg-center transform transition-transform duration-700 ease-in-out"
                                            style={{
                                                backgroundImage: `url(${image})`,
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80" />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </FadeInWhenVisible>
                </div>
            </div>
        </section>
    );
};

export default About;
