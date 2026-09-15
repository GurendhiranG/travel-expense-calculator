import { motion } from 'framer-motion';
import { Clock3, Map, Navigation, Route as RouteIcon } from 'lucide-react';

import { Eyebrow, RoutePin, SceneFrame, TinyLabel, ease } from './shared';

export function Scene4() {
  return (
    <SceneFrame className="bg-transparent">
      <div className="absolute left-[8vw] top-[14vh] z-10">
        <Eyebrow>03 / See the road</Eyebrow>
        <motion.h2 className="font-display mt-[2.4vh] text-[5.2vw] leading-[.94] tracking-[-.065em]" initial={{ opacity: 0, x: -35 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .8, ease }}>
          Distance becomes<br /><span className="text-[#ef9d5c]">a picture.</span>
        </motion.h2>
        <motion.p className="mt-[2.8vh] max-w-[22vw] text-[1.1vw] leading-[1.5] text-[#a7c3bc]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .55, duration: .55 }}>
          Trace the route, spot the distance, and keep the journey in view while the math catches up.
        </motion.p>
      </div>
      <motion.div className="absolute right-[7vw] top-[12vh] h-[66vh] w-[51vw] overflow-hidden rounded-[1.8vw] border border-[#80c9ac]/35 bg-[#1d4b4c] shadow-[0_1.8vw_4vw_rgba(0,0,0,.18)]" initial={{ opacity: 0, scale: .9, rotate: 2 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ delay: .2, duration: 1.05, ease }}>
        <div className="map-lines absolute inset-0 opacity-70" />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 600 500" fill="none" aria-hidden="true">
          <path d="M-20 102C70 126 94 40 198 96s96 10 163 90 162 59 263-43" stroke="#80c9ac" strokeOpacity=".26" strokeWidth="2" />
          <path d="M-30 382C69 345 111 399 184 335s115-42 172-104 139-51 272-8" stroke="#80c9ac" strokeOpacity=".22" strokeWidth="2" />
          <path d="M95 -20C113 82 172 100 211 180s-6 138 85 330M428 -20C389 88 424 130 378 211s-104 137-91 310" stroke="#a7c3bc" strokeOpacity=".2" strokeWidth="2" />
          <path d="M95 398C156 352 204 306 251 273s83-46 103-84 50-67 75-93" stroke="#f7f1e7" strokeWidth="11" strokeOpacity=".15" />
          <path d="M95 398C156 352 204 306 251 273s83-46 103-84 50-67 75-93" stroke="#ef9d5c" strokeWidth="4" strokeDasharray="10 10" className="route-dash" />
          <circle cx="95" cy="398" r="12" fill="#17383d" stroke="#f7f1e7" strokeWidth="5" />
          <circle cx="429" cy="96" r="12" fill="#ef9d5c" stroke="#f7f1e7" strokeWidth="5" />
        </svg>
        <RoutePin x="16%" y="79%" color="#80c9ac" label="Mumbai" />
        <RoutePin x="72%" y="19%" color="#ef9d5c" label="Pune" />
        <div className="absolute left-[1.4vw] top-[1.4vw] flex items-center gap-[.55vw] rounded-full bg-[#f7f1e7]/90 px-[.9vw] py-[.6vw] font-mono text-[.7vw] uppercase tracking-[.13em] text-[#17383d]"><Map size="1vw" /> Route preview</div>
        <div className="absolute right-[1.4vw] top-[1.4vw] rounded-full bg-[#17383d]/80 px-[.9vw] py-[.6vw] font-mono text-[.68vw] uppercase tracking-[.12em] text-[#a7c3bc]">OpenStreetMap ready</div>
        <div className="absolute bottom-[1.4vw] left-[1.4vw] rounded-[.8vw] bg-[#17383d]/90 p-[1vw]"><TinyLabel>Road distance</TinyLabel><div className="mt-[.35vw] font-mono text-[1.85vw] text-[#f7f1e7]">151 <span className="text-[.85vw] text-[#a7c3bc]">km</span></div></div>
        <div className="absolute bottom-[1.4vw] right-[1.4vw] flex items-center gap-[.55vw] rounded-[.8vw] bg-[#f7f1e7]/90 px-[1vw] py-[.9vw] font-mono text-[.78vw] uppercase tracking-[.11em] text-[#17383d]"><Clock3 size="1vw" className="text-[#e46e5c]" /> 2 hr 54 min</div>
      </motion.div>
      <motion.div className="absolute bottom-[9vh] left-[8vw] flex items-center gap-[.6vw] font-mono text-[.75vw] uppercase tracking-[.14em] text-[#80c9ac]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.05 }}><Navigation size="1vw" /> Built-in estimates + live routing fallback</motion.div>
      <motion.div className="absolute right-[7vw] bottom-[8vh] font-mono text-[.7vw] uppercase tracking-[.13em] text-[#6b8a84]"><RouteIcon size="1vw" className="mr-[.5vw] inline-block" /> One route. Many decisions.</motion.div>
    </SceneFrame>
  );
}