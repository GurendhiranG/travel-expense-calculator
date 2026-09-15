import { motion } from 'framer-motion';
import { ArrowUpRight, Check, ShieldCheck } from 'lucide-react';

import { Eyebrow, SceneFrame, TinyLabel, ease } from './shared';

export function Scene6() {
  return (
    <SceneFrame className="bg-transparent">
      <div className="absolute left-[8vw] top-[17vh] w-[33vw]">
        <Eyebrow>05 / The clear answer</Eyebrow>
        <motion.h2 className="font-display mt-[2.5vh] text-[5.4vw] leading-[.9] tracking-[-.07em]" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .85, ease }}>
          Less guesswork.<br /><span className="text-[#ef9d5c]">More going.</span>
        </motion.h2>
        <motion.p className="mt-[3.2vh] max-w-[24vw] text-[1.12vw] leading-[1.5] text-[#a7c3bc]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .55, duration: .55 }}>
          Every number is visible. Every option is comparable. Your next trip is ready to leave the spreadsheet behind.
        </motion.p>
        <motion.div className="mt-[5.5vh] flex items-center gap-[.7vw] font-mono text-[.76vw] uppercase tracking-[.14em] text-[#80c9ac]" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.05, duration: .45 }}><ShieldCheck size="1.1vw" /> Transparent by design</motion.div>
      </div>
      <motion.div className="absolute right-[10vw] top-[14vh] w-[42vw] rounded-[1.6vw] border border-[#80c9ac]/40 bg-[#f7f1e7] p-[2vw] text-[#17383d] shadow-[0_1.8vw_4vw_rgba(0,0,0,.18)]" initial={{ opacity: 0, scale: .86, rotate: -2 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ delay: .25, duration: 1.1, ease }}>
        <div className="flex items-start justify-between"><div><TinyLabel>Car trip / Mumbai → Pune</TinyLabel><div className="mt-[.6vw] font-display text-[1.55vw]">Your estimate is ready.</div></div><div className="grid h-[3.1vw] w-[3.1vw] place-items-center rounded-full bg-[#e9f4eb] text-[#5b9f82]"><Check size="1.4vw" strokeWidth={2.6} /></div></div>
        <div className="my-[2vw] flex items-end justify-between border-y border-[#dce5db] py-[1.7vw]"><div><TinyLabel>Total trip cost</TinyLabel><motion.div className="mt-[.45vw] font-mono text-[4.25vw] leading-none tracking-[-.09em] text-[#17383d]" initial={{ opacity: 0, scale: .7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .85, type: 'spring', stiffness: 220, damping: 18 }}>₹1,388</motion.div></div><div className="pb-[.25vw] text-right"><TinyLabel>Per person</TinyLabel><div className="mt-[.45vw] font-mono text-[1.8vw] tracking-[-.06em] text-[#e46e5c]">₹694</div></div></div>
        <div className="space-y-[.8vw]">
          {[
            ['Fuel', '₹983', '61.4 litres × ₹104'],
            ['Tolls', '₹285', 'Highway charges'],
            ['Parking', '₹120', 'At destination'],
          ].map(([label, amount, detail], index) => (
            <motion.div key={label} className="flex items-center justify-between" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.04 + index * .12 }}>
              <div><div className="text-[.9vw] font-extrabold">{label}</div><div className="mt-[.2vw] font-mono text-[.66vw] uppercase tracking-[.1em] text-[#7b9693]">{detail}</div></div><div className="font-mono text-[.9vw]">{amount}</div>
            </motion.div>
          ))}
        </div>
        <motion.div className="mt-[1.7vw] flex items-center justify-between rounded-[.85vw] bg-[#17383d] px-[1.1vw] py-[.95vw]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.45 }}>
          <span className="font-mono text-[.7vw] uppercase tracking-[.12em] text-[#a7c3bc]">151 km · 2 hr 54 min</span><span className="flex items-center gap-[.35vw] font-mono text-[.7vw] uppercase tracking-[.12em] text-[#ef9d5c]">Estimate <ArrowUpRight size="1vw" /></span>
        </motion.div>
      </motion.div>
      <motion.div className="absolute bottom-[8vh] left-[8vw] font-display text-[1.6vw] tracking-[-.02em] text-[#f7f1e7]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3, duration: .7 }}>Plan the trip. Keep the story.</motion.div>
      <motion.div className="absolute bottom-[8vh] right-[10vw] font-mono text-[.72vw] uppercase tracking-[.15em] text-[#6b8a84]">Travel expense calculator <span className="ml-[1vw] text-[#80c9ac]">06 / 06</span></motion.div>
    </SceneFrame>
  );
}