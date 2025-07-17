"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FadeInWhenVisible } from "../FadeInWhenVisible";
import { Title } from "../Title";

const About = () => {
  const containerRef = useRef(null);
  const section1Ref = useRef(null);
  const section2Ref = useRef(null);
  const section3Ref = useRef(null);
  const section4Ref = useRef(null);

  const section1InView = useInView(section1Ref, { once: false, amount: 0.5 });
  const section2InView = useInView(section2Ref, { once: false, amount: 0.5 });
  const section3InView = useInView(section3Ref, { once: false, amount: 0.5 });
  const section4InView = useInView(section4Ref, { once: false, amount: 0.5 });

  const sections = [
    {
      ref: section1Ref,
      inView: section1InView,
      image: "/intro-1.svg",
      title: "REVOLUTIONARY SCIENCE",
      description:
        "Experience the future of scientific discovery with BCSS. Our innovative approaches and cutting-edge technologies are transforming how we understand and interact with the world around us.",
      imageLeft: true,
    },
    {
      ref: section2Ref,
      inView: section2InView,
      image: "/intro-2.svg",
      title: "COLLABORATIVE LEARNING",
      description:
        "Join a community of bright minds working together to solve complex problems. Our collaborative environment fosters creativity, critical thinking, and breakthrough innovations.",
      imageLeft: false,
    },
    {
      ref: section3Ref,
      inView: section3InView,
      image: "/intro-3.svg",
      title: "HANDS-ON EXPLORATION",
      description:
        "Don't just read about science—experience it firsthand. Our hands-on approach allows students to experiment, fail, learn, and ultimately succeed through practical application of scientific principles.",
      imageLeft: true,
    },
    {
      ref: section4Ref,
      inView: section4InView,
      image: "/intro-4.svg",
      title: "FUTURE-READY SKILLS",
      description:
        "Develop the skills that will define the future. From data analysis to critical thinking, we prepare students not just for exams, but for the challenges and opportunities of tomorrow's world.",
      imageLeft: false,
    },
  ];

  return (
    <div ref={containerRef} className="bg-black">
      <section
        id="introduction"
        className="py-16 md:py-24 lg:py-32 relative z-10 overflow-hidden"
      >
        <div className="absolute top-40 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-60 right-0 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl"></div>

        <div className="z-10 px-4 md:px-8 lg:px-16 w-full max-w-7xl mx-auto">
          <FadeInWhenVisible>
            <div className="flex flex-col items-center text-center mb-16 md:mb-24">
              <Title mainText="THE FUTURE OF" subText="SCIENCE IS HERE" />
            </div>
          </FadeInWhenVisible>

          {sections.map((section, index) => (
            <div
              key={index}
              ref={section.ref}
              className={`mb-32 md:mb-40 lg:mb-48 ${index === sections.length - 1 ? "mb-16" : ""}`}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{
                  opacity: section.inView ? 1 : 0.3,
                }}
                transition={{ duration: 0.8 }}
                className={`flex flex-col ${section.imageLeft ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-8 md:gap-12 lg:gap-16`}
              >
                <motion.div
                  className="w-full md:w-1/2"
                  initial={{ x: section.imageLeft ? -100 : 100, opacity: 0 }}
                  animate={{
                    x: section.inView ? 0 : section.imageLeft ? -30 : 30,
                    opacity: section.inView ? 1 : 0.7,
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <div
                    className="relative overflow-hidden rounded-lg shadow-lg shadow-purple-800/30 transition-all duration-500 hover:shadow-xl hover:shadow-purple-500/40
    h-[32rem] sm:h-[40rem] md:h-[36rem] lg:h-[44rem] xl:h-[52rem] w-full"
                  >
                    <div
                      className="absolute inset-0 bg-contain bg-center bg-no-repeat transform transition-transform duration-700 ease-in-out hover:scale-105"
                      style={{
                        backgroundImage: `url(${section.image})`,
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-80" />
                  </div>
                </motion.div>

                <motion.div
                  className="w-full md:w-1/2"
                  initial={{ x: section.imageLeft ? 100 : -100, opacity: 0 }}
                  animate={{
                    x: section.inView ? 0 : section.imageLeft ? 30 : -30,
                    opacity: section.inView ? 1 : 0.7,
                  }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                >
                  <div
                    className={`text-left ${!section.imageLeft ? "md:text-right" : ""}`}
                  >
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                      {section.title}
                    </h2>
                    <div
                      className={`h-1 w-16 bg-gradient-to-r from-purple-500 to-pink-500 mb-6 ${!section.imageLeft ? "md:ml-auto" : ""}`}
                    ></div>
                    <p className="text-gray-300 text-sm md:text-base lg:text-lg">
                      {section.description}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
