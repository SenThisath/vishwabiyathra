export const Title = ({
  mainText,
  subText,
  bgText = "VISHWABHIYATHRA",
}: {
  mainText: string;
  subText: string;
  bgText?: string;
}) => {
  return (
    <div className="relative w-full px-4 py-0">
      {/* Background Text */}
      <div className="absolute inset-0 flex items-start justify-start z-0 px-4">
        <span className="text-[8.5vw] md:text-[8vw] lg:text-[7vw] xl:text-[6vw] font-extrabold uppercase font-mono text-white opacity-20 leading-[1] whitespace-nowrap">
          {bgText}
        </span>
      </div>

      {/* Foreground Text */}
      <div className="relative z-10 text-left leading-none space-y-0">
        <h1 className="text-[5vw] md:text-[4vw] lg:text-[3.5vw] xl:text-[3vw] font-extrabold uppercase font-mono text-white m-0 p-0">
          {mainText}
        </h1>
        <h2
          className="
    text-[5vw] md:text-[4vw] lg:text-[3.5vw] xl:text-[3vw] 
    font-extrabold uppercase font-mono 
    bg-gradient-to-r from-pink-600 via-orange-400 to-yellow-400 
    bg-clip-text text-transparent 
    m-0 p-0
    ml-8
  "
        >
          {subText}
        </h2>
      </div>
    </div>
  );
};
