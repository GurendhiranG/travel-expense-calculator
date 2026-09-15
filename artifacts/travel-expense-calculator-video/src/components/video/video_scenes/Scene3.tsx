import { motion } from 'framer-motion';
import { Gauge, IndianRupee, UsersRound } from 'lucide-react';

import { Eyebrow, SceneFrame, TinyLabel, ease } from './shared';

export function Scene3() {
  const fields = [
    ['Travellers', '2', 'people', UsersRound],
    ['Fuel price', '₹104', '/ litre', IndianRupee],
    ['Mileage', '16', 'km / l', Gauge],
  ] as const;
  return (
    <SceneFrame tone="light" className="bg-[#dcebe1]">
      <div className="absolute left-[8vw] top-[16vh]">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .5 }}><Eyebrow light>02 / Make it yours</Eyebrow></motion.div>
        <motion.h2 className="font-display mt-[2.4vh] text-[5.8vw] leading-[.92] tracking-[-.065em] text-[#17383d]" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .16, duration: .85, ease }}>
          Put your<br /><span className="text-[#e46e5c]">numbers</span> in.
        </motion.h2>
        <motion.p className="mt-[3vh] max-w-[23vw] text-[1.1vw] leading-[1.5] text-[#527371]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .65, duration: .55 }}>
          Personalize the estimate with the details that actually shape your trip.
        </motion.p>
      </div>
      <motion.div className="absolute right-[8vw] top-[14vh] w-[47vw] rounded-[1.6vw] border border-[#c6dbcf] bg-[#f7f1e7] p-[2.1vw] shadow-[0_1.8vw_4vw_rgba(23,56,61,.08)]" initial={{ opacity: 0, scale: .92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: .22, duration: .95, ease }}>
        <div className="flex items-end justify-between">
          <div><TinyLabel>Car costs</TinyLabel><div className="mt-[.4vw] font-display text-[1.65vw] text-[#17383d]">A trip that fits your reality.</div></div>
          <div className="font-mono text-[.7vw] uppercase tracking-[.13em] text-[#80a297]">INR / one way</div>
        </div>
        <div className="mt-[2vw] grid grid-cols-3 gap-[.85vw]">
          {fields.map(([label, value, suffix, Icon], index) => (
            <motion.div key={label} className="rounded-[.9vw] border border-[#d9e4df] bg-[#fbfcf8] p-[1.15vw]" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .62 + index * .13, duration: .45 }}>
              <div className="flex items-center justify-between"><TinyLabel>{label}</TinyLabel><Icon size="1vw" className="text-[#80a297]" /></div>
              <div className="mt-[1.4vw] font-mono text-[1.7vw] text-[#17383d]">{value}</div>
              <div className="mt-[.35vw] font-mono text-[.67vw] uppercase tracking-[.11em] text-[#80a297]">{suffix}</div>
            </motion.div>
          ))}
        </div>
        <div className="mt-[1.2vw] grid grid-cols-3 gap-[.85vw]">
          {['Tolls / ₹285', 'Parking / ₹120', 'Other / ₹0'].map((value, index) => (
            <motion.div key={value} className="flex h-[4vw] items-center rounded-[.8vw] border border-[#d9e4df] bg-[#fbfcf8] px-[1vw] font-mono text-[.78vw] uppercase tracking-[.08em] text-[#527371]" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .98 + index * .12, duration: .4 }}>{value}</motion.div>
          ))}
        </div>
        <motion.div className="mt-[1.4vw] flex items-center justify-between rounded-[.9vw] bg-[#17383d] px-[1.25vw] py-[1vw]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.35, duration: .45 }}>
          <span className="font-mono text-[.72vw] uppercase tracking-[.13em] text-[#a7c3bc]">Inputs stay in your hands</span>
          <span className="flex items-center gap-[.5vw] font-mono text-[.72vw] uppercase tracking-[.12em] text-[#ef9d5c]"><span className="h-[.55vw] w-[.55vw] rounded-full bg-[#80c9ac]" /> Live estimate</span>
        </motion.div>
      </motion.div>
      <motion.div className="absolute bottom-[9vh] left-[8vw] font-mono text-[.75vw] uppercase tracking-[.14em] text-[#527371]" animate={{ opacity: [.45, 1, .45] }} transition={{ repeat: Infinity, duration: 2.2 }}>Adjust once. Understand everything.</motion.div>
    </SceneFrame>
  );
}