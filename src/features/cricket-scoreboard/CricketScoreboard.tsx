import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import svgPaths from "./svg-paths";
import { useMatchState } from "../cricket-controller/useMatchState";

interface ScoreState {
  team1Name: string;
  team2Name: string;
  mainScore: number;
  mainWickets: number;
  batsman1Name: string;
  batsman1Runs: number;
  batsman1Balls: number;
  batsman2Name: string;
  batsman2Runs: number;
  batsman2Balls: number;
  bowlerName: string;
  bowlerRuns: number;
  bowlerBalls: number;
  bowlerOvers: number;
  isBinayakBatting: boolean;
  team1Logo: string;
  team2Logo: string;
  thisOver: string[];
  sponsorText: string;
}

function AnimatedNumber({
  value,
  format,
}: {
  value: number;
  format?: Intl.NumberFormatOptions;
}) {
  const formattedValue = format
    ? value.toLocaleString("en-US", format)
    : value.toString();

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={value}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="inline-block"
      >
        {formattedValue}
      </motion.span>
    </AnimatePresence>
  );
}

function Frame11({ runs, wickets, overs, balls }: { runs: number; wickets: number; overs: number; balls: number }) {
  return (
    <div className="content-stretch flex gap-[33px] items-center relative shrink-0">
      <div className="bg-clip-text bg-gradient-to-b font-['Alumni_Sans',sans-serif] font-bold   relative shrink-0 text-white">
        <AnimatedNumber value={runs} /> - <AnimatedNumber value={wickets} />
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.85, duration: 0.6 }}
        className="bg-clip-text bg-gradient-to-b font-['Alumni_Sans',sans-serif] font-normal  relative shrink-0 text-white"
      >
        {overs}.{balls}
      </motion.p>
    </div>
  );
}

function Frame12({
  runs,
  wickets,
  balls,
  overs,
  bowlerName,
}: {
  runs: number;
  wickets: number;
  balls: number;
  overs: number;
  bowlerName: string;
}) {
  return (
    <div className="absolute content-stretch flex items-center justify-between leading-[normal] left-[1085.78px] text-[64px] text-[transparent] top-[78.19px] tracking-[-1px] w-[506px] whitespace-nowrap">
      <motion.p
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6, duration: 0.7, ease: "easeOut" }}
        className="bg-clip-text bg-gradient-to-b font-['Alumni_Sans',sans-serif] font-normal text-white  relative shrink-0  to-[75.325%]"
      >
        {bowlerName.toUpperCase()}
      </motion.p>
      <Frame11 runs={runs} wickets={wickets} overs={overs} balls={balls} />
    </div>
  );
}

function Frame9({ runs, balls }: { runs: number; balls: number }) {
  return (
    <div className="absolute content-stretch flex h-[49px] items-center justify-between leading-[normal] left-[623.78px] text-[64px] text-white top-[92.19px] tracking-[-1px] w-[131px] whitespace-nowrap">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="bg-clip-text bg-gradient-to-b font-['Alumni_Sans',sans-serif] font-bold from-[19.272%]  text-[#white] relative shrink-0 "
      >
        <AnimatedNumber value={runs} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55, duration: 0.5 }}
        className="bg-clip-text bg-gradient-to-b font-['Alumni_Sans',sans-serif] font-normal from-[19.272%]  text-white relative shrink-0"
      >
        <AnimatedNumber value={balls} />
      </motion.div>
    </div>
  );
}

function Frame10({ runs, balls }: { runs: number; balls: number }) {
  return (
    <div className="absolute content-stretch flex items-center justify-between leading-[normal] left-[623.78px] text-[64px] text-[transparent] top-[154px] tracking-[-1px] w-[131px] whitespace-nowrap">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="bg-clip-text bg-gradient-to-b font-['Alumni_Sans',sans-serif] font-bold  text-white relative shrink-0 "
      >
        <AnimatedNumber value={runs} format={{ minimumIntegerDigits: 2 }} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.65, duration: 0.5 }}
        className="bg-clip-text bg-gradient-to-b font-['Alumni_Sans',sans-serif] font-normal  text-white relative shrink-0 "
      >
        <AnimatedNumber value={balls} />
      </motion.div>
    </div>
  );
}

function Frame8({ isBinayak }: { isBinayak: boolean }) {
  return (
    <motion.div
      animate={{
        top: isBinayak ? "159px" : "97.19px",
      }}
      transition={{
        duration: 0.4,
        type: "spring",
        stiffness: 200,
        damping: 20,
      }}
      className="absolute bg-white content-stretch flex items-center justify-center left-[269.6px] p-[10px] rounded-[7px]"
    >
      <div
        aria-hidden="true"
        className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[7px]"
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="font-['Inter_Display:Medium',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#2c37a8] text-[16px] font-bold whitespace-nowrap"
      >
        BATTING
      </motion.p>
    </motion.div>
  );
}

function Group({
  batsman1Name,
  batsman1Runs,
  batsman1Balls,
  batsman2Name,
  batsman2Runs,
  batsman2Balls,
  isBinayakBatting,
}: {
  batsman1Name: string;
  batsman1Runs: number;
  batsman1Balls: number;
  batsman2Name: string;
  batsman2Runs: number;
  batsman2Balls: number;
  isBinayakBatting: boolean;
}) {
  return (
    <div className="absolute contents left-[269.6px] top-[78.19px]">
      <motion.p
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
        className="absolute bg-clip-text bg-gradient-to-b font-['Alumni_Sans',sans-serif] font-normal   leading-[normal] left-[calc(50%-552.85px)] text-[64px] text-white  top-[78.19px] tracking-[-1px] whitespace-nowrap"
      >
        {batsman1Name.toUpperCase()}
      </motion.p>
      <Frame9 runs={batsman1Runs} balls={batsman1Balls} />
      <Frame10 runs={batsman2Runs} balls={batsman2Balls} />
      <motion.p
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.7, ease: "easeOut" }}
        className="absolute bg-clip-text bg-gradient-to-b font-['Alumni_Sans',sans-serif] font-normal leading-[normal] left-[calc(50%-552.85px)] text-[64px]  text-white top-[155.19px] tracking-[-1px] whitespace-nowrap"
      >
        {batsman2Name.toUpperCase()}
      </motion.p>
      <Frame8 isBinayak={isBinayakBatting} />
    </div>
  );
}

function BallIndicator({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay: number;
}) {
  return (
    <div className="bg-white content-stretch flex items-center justify-center px-[14px] py-[4px] relative rounded-[36px] shrink-0">
      <motion.p
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          delay,
          duration: 0.4,
          type: "spring",
          stiffness: 300,
          damping: 20,
        }}
        className="font-['Inter_Display:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[28px] text-black tracking-[-0.2px] whitespace-nowrap"
      >
        {children}
      </motion.p>
    </div>
  );
}

// Dynamic ball indicators based on thisOver array
function BallIndicators({ thisOver }: { thisOver: string[] }) {
  // Pad with empty balls to always show at least 6 indicators
  const displayBalls = [...thisOver];
  while (displayBalls.length < 6) {
    displayBalls.push('');
  }

  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0 top-2">
      {displayBalls.map((ball, index) => (
        <BallIndicator key={index} delay={0.9 + index * 0.1}>
          {ball || '•'}
        </BallIndicator>
      ))}
    </div>
  );
}

function Frame1({ thisOver }: { thisOver: string[] }) {
  return (
    <div className="absolute content-stretch flex items-center justify-between left-[1085.82px] top-[164.49px] w-[505.54px]">
      <BallIndicators thisOver={thisOver} />
    </div>
  );
}

function Frame13({ score, wickets }: { score: number; wickets: number }) {
  return (
    <div className="absolute bg-white h-[171px] left-[787.78px] overflow-clip top-[70px] w-[278px] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: 1,
          scale: 1,
          textShadow: [
            "0 0 10px rgba(44, 55, 168, 0)",
            "0 0 20px rgba(44, 55, 168, 0.3)",
            "0 0 10px rgba(44, 55, 168, 0)",
          ],
        }}
        transition={{
          opacity: { delay: 0.3, duration: 0.5 },
          scale: { delay: 0.3, duration: 0.5 },
          textShadow: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          },
        }}
        className="font-['Alumni_Sans',sans-serif] font-extrabold leading-[normal] text-[#060024] text-[128px] tracking-[1px] whitespace-nowrap"
      >
        <AnimatedNumber value={score} /> - <AnimatedNumber value={wickets} />
      </motion.div>
    </div>
  );
}

function ScrollingText({ text }: { text: string }) {
  return (
    <div className="absolute font-['Alumni_Sans',sans-serif] font-normal leading-[normal] left-[313.1px] text-[32px] text-white top-[18.18px] tracking-[-1px] overflow-hidden w-[1250px]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, x: [0, -2000] }}
        transition={{
          opacity: { delay: 0.5, duration: 0.6 },
          x: {
            duration: 40,
            repeat: Infinity,
            ease: "linear",
            repeatType: "loop",
          },
        }}
        className="inline-block whitespace-nowrap"
      >
        {text} &nbsp;&nbsp;&nbsp; {text} &nbsp;&nbsp;&nbsp; {text}
      </motion.div>
    </div>
  );
}

function Group1({
  team1Name,
  team2Name,
  team1Logo,
  team2Logo,
  mainScore,
  mainWickets,
  batsman1Name,
  batsman1Runs,
  batsman1Balls,
  batsman2Name,
  batsman2Runs,
  batsman2Balls,
  bowlerName,
  bowlerRuns,
  bowlerBalls,
  bowlerOvers,
  bowlerWickets,
  isBinayakBatting,
  thisOver,
  sponsorText,
}: any) {
  return (
    <div className="absolute contents left-0 top-0">
      <div className="absolute h-[70.202px] left-[15.3px] top-0 w-[226.391px]">
        <div className="absolute inset-[-19.94%_-9.41%_-54.13%_-9.41%]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 268.997 122.202"
          >
            <g filter="url(#filter0_dd_1_69)" id="Rectangle 1">
              <path
                d={svgPaths.p21225240}
                fill="var(--fill-0, #303BB6)"
                fillOpacity="0.8"
                shapeRendering="crispEdges"
              />
              <path
                d={svgPaths.p127b9500}
                shapeRendering="crispEdges"
                stroke="var(--stroke-0, white)"
                strokeWidth="2"
              />
            </g>
            <defs>
              <filter
                colorInterpolationFilters="sRGB"
                filterUnits="userSpaceOnUse"
                height="122.202"
                id="filter0_dd_1_69"
                width="268.997"
                x="-8.34465e-07"
                y="0"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  result="hardAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                />
                <feOffset dy="12" />
                <feGaussianBlur stdDeviation="11.5" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.45 0 0 0 0 0.45 0 0 0 0 0.45 0 0 0 0.1 0"
                />
                <feBlend
                  in2="BackgroundImageFix"
                  mode="normal"
                  result="effect1_dropShadow_1_69"
                />
                <feColorMatrix
                  in="SourceAlpha"
                  result="hardAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                />
                <feOffset />
                <feGaussianBlur stdDeviation="5.45" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.767319 0 0 0 0 0.205943 0 0 0 0 0.355643 0 0 0 0.25 0"
                />
                <feBlend
                  in2="effect1_dropShadow_1_69"
                  mode="normal"
                  result="effect2_dropShadow_1_69"
                />
                <feBlend
                  in="SourceGraphic"
                  in2="effect2_dropShadow_1_69"
                  mode="normal"
                  result="shape"
                />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <div className="absolute h-[70.202px] left-[1611.27px] top-0 w-[226.391px]">
        <div className="absolute inset-[-19.94%_-9.41%_-54.13%_-9.41%]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 268.997 122.202"
          >
            <g filter="url(#filter0_dd_1_69_2)" id="Rectangle 1">
              <path
                d={svgPaths.p21225240}
                fill="var(--fill-0, #303BB6)"
                fillOpacity="0.8"
                shapeRendering="crispEdges"
              />
              <path
                d={svgPaths.p127b9500}
                fill-opacity="0.9"
                stroke="var(--stroke-0, white)"
                strokeWidth="2"
              />
            </g>
            <defs>
              <filter
                colorInterpolationFilters="sRGB"
                filterUnits="userSpaceOnUse"
                height="122.202"
                id="filter0_dd_1_69_2"
                width="268.997"
                x="-8.34465e-07"
                y="0"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  result="hardAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                />
                <feOffset dy="12" />
                <feGaussianBlur stdDeviation="11.5" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.45 0 0 0 0 0.45 0 0 0 0 0.45 0 0 0 0.1 0"
                />
                <feBlend
                  in2="BackgroundImageFix"
                  mode="normal"
                  result="effect1_dropShadow_1_69_2"
                />
                <feColorMatrix
                  in="SourceAlpha"
                  result="hardAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                />
                <feOffset />
                <feGaussianBlur stdDeviation="5.45" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.767319 0 0 0 0 0.205943 0 0 0 0 0.355643 0 0 0 0.25 0"
                />
                <feBlend
                  in2="effect1_dropShadow_1_69_2"
                  mode="normal"
                  result="effect2_dropShadow_1_69_2"
                />
                <feBlend
                  in="SourceGraphic"
                  in2="effect2_dropShadow_1_69_2"
                  mode="normal"
                  result="shape"
                />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <motion.p
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
        className="absolute bg-clip-text bg-gradient-to-b font-['Alumni_Sans',sans-serif] font-bold from-[19.272%]  h-[51.429px] leading-[normal] left-[calc(50%+720.18px)] text-[36px]  text-white to-[75.325%] top-[5.18px] tracking-[-1px] w-[153px] whitespace-pre-wrap"
      >{team2Name.toUpperCase()}</motion.p>
      <div className="absolute h-[122.118px] left-[261.6px] top-[9.14px] w-[1329.761px]">
        <div className="absolute inset-[-11.46%_-1.96%_-31.12%_-1.96%]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 1381.76 174.118"
          >
            <g filter="url(#filter0_dd_1_67)" id="Vector 3">
              <path
                d={svgPaths.p3cedc540}
                fill="var(--fill-0, #303BB6)"
                fillOpacity="0.8"
                shapeRendering="crispEdges"
              />
              <path
                d={svgPaths.p5497500}
                fill-opacity="0.9"
                shapeRendering="crispEdges"
                stroke="var(--stroke-0, white)"
                strokeWidth="0.5"
              />
            </g>
            <defs>
              <filter
                colorInterpolationFilters="sRGB"
                filterUnits="userSpaceOnUse"
                height="174.118"
                id="filter0_dd_1_67"
                width="1381.76"
                x="0"
                y="0"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  result="hardAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                />
                <feOffset dy="12" />
                <feGaussianBlur stdDeviation="11.5" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.45 0 0 0 0 0.45 0 0 0 0 0.45 0 0 0 0.1 0"
                />
                <feBlend
                  in2="BackgroundImageFix"
                  mode="normal"
                  result="effect1_dropShadow_1_67"
                />
                <feColorMatrix
                  in="SourceAlpha"
                  result="hardAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                />
                <feOffset />
                <feGaussianBlur stdDeviation="5.45" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.767319 0 0 0 0 0.205943 0 0 0 0 0.355643 0 0 0 0.25 0"
                />
                <feBlend
                  in2="effect1_dropShadow_1_67"
                  mode="normal"
                  result="effect2_dropShadow_1_67"
                />
                <feBlend
                  in="SourceGraphic"
                  in2="effect2_dropShadow_1_67"
                  mode="normal"
                  result="shape"
                />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <div className="absolute h-[189.855px] left-0 top-[50.95px] w-[1855.561px]">
        <div className="absolute inset-[-7.37%_-1.4%_-20.02%_-1.4%]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 1907.53 241.855"
          >
            <g filter="url(#filter0_dd_1_65)" id="Vector 2">
              <path d={svgPaths.pec6c900} fill="url(#paint0_linear_1_65)" />
              <path
                d={svgPaths.p995ab80}
                fill-opacity="0.9"
                stroke="var(--stroke-0, white)"
                strokeWidth="0.5"
              />
            </g>
            <defs>
              <filter
                colorInterpolationFilters="sRGB"
                filterUnits="userSpaceOnUse"
                height="241.855"
                id="filter0_dd_1_65"
                width="1907.53"
                x="4.76837e-07"
                y="0"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  result="hardAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                />
                <feOffset dy="12" />
                <feGaussianBlur stdDeviation="11.5" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.45 0 0 0 0 0.45 0 0 0 0 0.45 0 0 0 0.1 0"
                />
                <feBlend
                  in2="BackgroundImageFix"
                  mode="normal"
                  result="effect1_dropShadow_1_65"
                />
                <feColorMatrix
                  in="SourceAlpha"
                  result="hardAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                />
                <feOffset />
                <feGaussianBlur stdDeviation="5.45" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0.767319 0 0 0 0 0.205943 0 0 0 0 0.355643 0 0 0 0.25 0"
                />
                <feBlend
                  in2="effect1_dropShadow_1_65"
                  mode="normal"
                  result="effect2_dropShadow_1_65"
                />
                <feBlend
                  in="SourceGraphic"
                  in2="effect2_dropShadow_1_65"
                  mode="normal"
                  result="shape"
                />
              </filter>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                id="paint0_linear_1_65"
                x1="953.749"
                x2="953.749"
                y1="203.855"
                y2="14"
              >
                <stop stopColor="#000324" />
                <stop offset="1" stopColor="#1F224B" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <div className="absolute left-[55.07px] size-[146.865px] top-[72.45px]">
        <svg
          className="absolute block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 146.865 146.865"
        >
          <defs>
            <clipPath id="team1LogoClip">
              <circle cx="73.4325" cy="73.4325" r="73.4325" />
            </clipPath>
          </defs>
          <circle
            cx="73.4325"
            cy="73.4325"
            fill="var(--fill-0, white)"
            id="Ellipse 1"
            r="73.4325"
          />
        </svg>
        {team1Logo && (
          <img
            src={team1Logo}
            alt={team1Name}
            className="absolute rounded-full"
            style={{
              left: '13px',
              top: '13px',
              width: '120px',
              height: '120px',
              objectFit: 'contain',
              clipPath: 'circle(60px at 60px 60px)'
            }}
          />
        )}
      </div>
      <div className="absolute left-[1647.96px] size-[146.865px] top-[72.45px]">
        <svg
          className="absolute block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 146.865 146.865"
        >
          <defs>
            <clipPath id="team2LogoClip">
              <circle cx="73.4325" cy="73.4325" r="73.4325" />
            </clipPath>
          </defs>
          <circle
            cx="73.4325"
            cy="73.4325"
            fill="var(--fill-0, white)"
            id="Ellipse 1"
            r="73.4325"
          />
        </svg>
        {team2Logo && (
          <img
            src={team2Logo}
            alt={team2Name}
            className="absolute rounded-full"
            style={{
              left: '13px',
              top: '13px',
              width: '120px',
              height: '120px',
              objectFit: 'contain',
              clipPath: 'circle(60px at 60px 60px)'
            }}
          />
        )}
      </div>
      <Frame12 runs={bowlerRuns} wickets={bowlerWickets} balls={bowlerBalls} overs={bowlerOvers} bowlerName={bowlerName} />
      <Group
        batsman1Name={batsman1Name}
        batsman1Runs={batsman1Runs}
        batsman1Balls={batsman1Balls}
        batsman2Name={batsman2Name}
        batsman2Runs={batsman2Runs}
        batsman2Balls={batsman2Balls}
        isBinayakBatting={isBinayakBatting}
      />
      <motion.p
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
        className="absolute bg-clip-text bg-gradient-to-b font-['Alumni_Sans',sans-serif] font-bold from-[19.272%] h-[51.429px] leading-[normal] left-[calc(50%-862.77px)] text-[36px] text-white  top-[5.18px] tracking-[-1px] w-[153px]"
      >
        {team1Name.toUpperCase()}
      </motion.p>
      <ScrollingText text={sponsorText} />
      <Frame1 thisOver={thisOver} />
      <Frame13 score={mainScore} wickets={mainWickets} />
    </div>
  );
}

function Frame14(props: any) {
  return (
    <div className="absolute h-[241.19px] left-[32.22px] top-[824px] w-[1855.561px]">
      <Group1 {...props} />
    </div>
  );
}

export default function Slide() {
  const { state } = useMatchState();

  // Determine which team is batting based on toss and innings
  const getBattingTeam = () => {
    if (!state.tossCompleted) return 1;
    if (state.tossDecision === 'bat') {
      return state.innings === 1 ? state.tossWinner : (state.tossWinner === 1 ? 2 : 1);
    } else {
      return state.innings === 1 ? (state.tossWinner === 1 ? 2 : 1) : state.tossWinner;
    }
  };

  const battingTeam = getBattingTeam();

  // Always show batting team on left, fielding team on right
  const leftTeam = battingTeam === 1 ? state.team1 : state.team2;
  const leftTeamLogo = battingTeam === 1 ? state.team1Logo : state.team2Logo;
  const rightTeam = battingTeam === 1 ? state.team2 : state.team1;
  const rightTeamLogo = battingTeam === 1 ? state.team2Logo : state.team1Logo;

  // Map socket state to the component's expected format
  const scores = {
    team1Name: leftTeam || 'Team 1',
    team2Name: rightTeam || 'Team 2',
    team1Logo: leftTeamLogo || '',
    team2Logo: rightTeamLogo || '',
    mainScore: state.score,
    mainWickets: state.wickets,
    batsman1Name: state.batsman1.name || 'Batsman 1',
    batsman1Runs: state.batsman1.runs,
    batsman1Balls: state.batsman1.balls,
    batsman2Name: state.batsman2.name || 'Batsman 2',
    batsman2Runs: state.batsman2.runs,
    batsman2Balls: state.batsman2.balls,
    bowlerName: state.bowler.name || 'Bowler',
    bowlerRuns: state.bowler.runs,
    bowlerBalls: state.bowler.balls,
    bowlerOvers: state.bowler.overs,
    bowlerWickets: state.bowler.wickets,
    isBinayakBatting: state.onStrike === 2,
    thisOver: state.thisOver || [],
    sponsorText: state.sponsorText || 'THIS IS A SPONSOR TEXT',
  };

  return (
    <div
      className="bg-transparent relative size-full"
      data-name="Slide 16:9 - 1"
    >
      <Frame14 {...scores} />
    </div>
  );
}
