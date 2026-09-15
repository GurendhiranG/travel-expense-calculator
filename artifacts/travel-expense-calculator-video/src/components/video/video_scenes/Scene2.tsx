import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Search } from 'lucide-react';

import { Eyebrow, Metric, SceneFrame, TinyLabel, ease } from './shared';

export function Scene2() {
  return (
    <SceneFrame tone="light" className="bg-[#f7f1e7]">
      <div className="absolute left-[8vw] top-[15vh] w-[31vw]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, ease }}>
          <Eyebrow light>01 / Begin with a route</Eyebrow>
          <h2 className="font-display mt-[2.3vh] text-[4.7vw] leading-[.94] tracking-[-.06em]">Tell it where<br /><em className="text-[#e46e5c] not-italic">you’re going.</em></h2>
          <p className="mt-[2.6vh] max-w-[22vw] text-[1.12vw] leading-[1.5] text-[#6b8a84]">Choose two places and the calculator traces the distance between them.</p>
        </motion.div>
        <motion.div className="mt-[7vh] flex gap-[2.4vw]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .65 }}>
          <Metric value="10+" label="Indian cities ready" accent="#17383d" />
          <Metric value="151 km" label="Mumbai to Pune" accent="#e46e5c" />
        </motion.div>
      </div>

      <motion.div className="absolute right-[8vw] top-[15vh] w-[43vw] rounded-[1.6vw] border border-[#d6ddd3] bg-[#fffaf2] p-[2.1vw] shadow-[0_1.8vw_4vw_rgba(23,56,61,.08)]" initial={{ opacity: 0, x: 50, rotate: 2 }} animate={{ opacity: 1, x: 0, rotate: 0 }} transition={{ delay: .25, duration: 1, ease }}>
        <div className="flex items-center justify-between border-b border-[#e7e4d9] pb-[1.2vw]">
          <div className="font-display text-[1.6vw] text-[#17383d]">Map your trip</div>
          <div className="font-mono text-[.72vw] uppercase tracking-[.15em] text-[#6b8a84]">Quick estimate</div>
        </div>
        <div className="relative mt-[2vw] space-y-[1.1vw]">
          <div className="absolute left-[1.2vw] top-[2.7vw] h-[3.5vw] border-l border-dashed border-[#b8cec5]" />
          <motion.div className="flex h-[5.2vw] items-center gap-[1.2vw] rounded-[.8vw] border border-[#d9e4df] bg-[#fbfcf8] px-[1.2vw]" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .72, duration: .45 }}>
            <MapPin className="text-[#17383d]" size="1.45vw" />
            <div><TinyLabel>From</TinyLabel><div className="mt-[.35vw] text-[1.2vw] font-extrabold text-[#17383d]">Mumbai</div></div>
            <div className="ml-auto rounded-full bg-[#edf4ef] px-[.8vw] py-[.35vw] font-mono text-[.68vw] uppercase tracking-[.12em] text-[#6b8a84]">City</div>
          </motion.div>
          <motion.div className="flex h-[5.2vw] items-center gap-[1.2vw] rounded-[.8vw] border border-[#d9e4df] bg-[#fbfcf8] px-[1.2vw]" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .88, duration: .45 }}>
            <MapPin className="text-[#e46e5c]" size="1.45vw" />
            <div><TinyLabel>To</TinyLabel><div className="mt-[.35vw] text-[1.2vw] font-extrabold text-[#17383d]">Pune</div></div>
            <div className="ml-auto rounded-full bg-[#f9e9df] px-[.8vw] py-[.35vw] font-mono text-[.68vw] uppercase tracking-[.12em] text-[#e46e5c]">City</div>
          </motion.div>
        </div>
        <motion.div className="mt-[1.4vw] flex h-[4.5vw] items-center justify-center gap-[.7vw] rounded-[.8vw] bg-[#17383d] font-extrabold text-[1.05vw] text-[#f7f1e7]" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: .5, ease }}>
          <Search size="1.15vw" /> Find my route <ArrowRight size="1.05vw" className="text-[#ef9d5c]" />
        </motion.div>
        <div className="mt-[1.3vw] flex items-center justify-between font-mono text-[.7vw] uppercase tracking-[.11em] text-[#6b8a84]"><span>Built-in city lookup</span><span className="text-[#80c9ac]">Ready</span></div>
      </motion.div>
      <motion.div className="absolute bottom-[9vh] right-[8vw] font-mono text-[.75vw] uppercase tracking-[.14em] text-[#6b8a84]" animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2.5 }}><span className="text-[#e46e5c]">↳</span> No map tab required</motion.div>
    </SceneFrame>
  );
}