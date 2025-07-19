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
      title: "PAGE 1: The Awakening Begins",
      description: [
        "In the vast, star-strewn canvas of the universe, civilizations rise and fall, each leaving behind fragments of brilliance knowledge, innovation, and dreams.",
        "From the submerged kingdoms of oceanic giants to the crystalline towers of hyperintelligent machines, countless worlds have sought the answers hidden within the stars.",
        "Yet throughout time, a single prophecy echoes through the void. It speaks of a coming convergence a moment when the finest minds from across the cosmos must come together, not in war or conquest, but in pursuit of something far greater.",
        "A signal has been cast across galaxies. It calls not for the powerful, but for the perceptive. Not for rulers, but for seekers. They are to journey to a place few have heard of and fewer have reached the Celestial Nexus, a place beyond maps and matter, where the deepest truths of existence lie in wait.",
      ],
      imageLeft: true,
    },
    {
      ref: section2Ref,
      inView: section2InView,
      image: "/intro-2.svg",
      title: "PAGE 2: The Trials Await",
      description: [
        "At the heart of the prophecy is a force, ancient and eternal. It does not rule, nor does it interfere. It watches. It remembers. And now, it speaks.",
        `The Voice: “The time has come.
Only the worthy shall enter the Nexus.”`,
        "The path ahead is no simple pilgrimage. It is a crucible forged of cosmic intellect, designed to test the essence of civilization. Every trial is a mirror reflecting a mind’s creativity, a society’s innovation, a people’s purpose.",
        "Those who answer the call will not simply compete. They will face challenges that reshape their understanding of reality itself. Success is not guaranteed. Failure may be final.",
        `Still, the call echoes onward.
The journey, for those brave enough to begin, has already begun.`,
      ],
      imageLeft: false,
    },
    {
      ref: section3Ref,
      inView: section3InView,
      image: "/intro-3.svg",
      title: "PAGE 3: The Cosmic Call",
      description: [
        `The Voice: “You who seek the knowledge of the cosmos, hear me.”`,
        "The message resounds across dimensions, carried by particles, light, and dreams. It bypasses language, yet is understood by all. A voice that has remained silent for eons now reaches out to every thinking mind across the stars.",
        `“Long ago, others walked this path.
They uncovered truths that bent the laws of existence
truths that shaped galaxies and shattered illusions.”
`,
        "Civilizations tremble. Leaders look to the sky. Inventors and thinkers feel something stir deep within not fear, but a sense of being seen.",
        `“Now it is your turn.
The gates are opening.
Prove your worth, and earn what lies beyond.”`,
        "And with that, the silence returns but the fire it sparked will not fade.",
      ],
      imageLeft: true,
    },
    {
      ref: section4Ref,
      inView: section4InView,
      image: "/intro-4.svg",
      title: "PAGE 4: The Path Opens",
      description: [
        "The message has been sent. It ripples silently across the galaxies, weaving through the thoughts of dreamers and rulers alike, echoing in minds and machines far and wide.",
        "From blazing suns to frozen moons, from cities that float among the clouds to hidden vaults beneath ancient earth, every civilization whether old or newly born hears the call.",
        "There is no room for doubt. No chance to turn away.",
        "The test has begun.",
        "A challenge of intellect, creativity, and innovation now stands before them. Some prepare quietly, calculating every possibility. Others build, invent, and rehearse with fierce determination. And a few simply wait in the shadows, biding their time for the perfect moment to rise.",
        "Across the stars, they ready themselves to prove their worth to push beyond the boundaries of their worlds and reach toward something greater, something eternal.",
        `“Step forward if you dare.
The path to the ultimate truth has begun.”
`,
        "Then, as the stars shift and shimmer, a rift tears open a glowing gateway pulsing with ancient, untamed energy.",
        "The first trial awaits.",
        "This is the moment.",
      ],
      imageLeft: false,
    },
  ];

  return (
    <div ref={containerRef} className="bg-[#0d0d0d] pt-8">
      <section id="introduction" className="relative z-10 overflow-hidden">
        <div className="absolute top-40 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-60 right-0 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl"></div>

        <div className="z-10 px-4 md:px-8 lg:px-16 w-full max-w-7xl mx-auto">
          <FadeInWhenVisible>
            <div className="flex flex-col items-center text-center mb-16 md:mb-24">
              <Title subText="The Celestial Trials" />
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
                  <div className={`text-left`}>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                      {section.title}
                    </h2>
                    <div
                      className={`h-1 w-16 bg-gradient-to-r from-purple-500 to-pink-500 mb-6`}
                    ></div>
                    <p className="text-gray-300 text-sm md:text-base lg:text-lg">
                      {section.description.map((para, index) => (
                        <p className="mb-4" key={index}>
                          {para}
                        </p>
                      ))}
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
