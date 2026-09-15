import { motion } from 'framer-motion';
import { Bike, Bus, CarFront, Plane, TrainFront, TrendingDown } from 'lucide-react';

import { Eyebrow, SceneFrame, TinyLabel, ease } from './shared';

const modes = [
  { label: 'Car', cost: '₹694', note: 'flexible', icon: CarFront, color: '#ef9d5c' },
  { label: 'Bus', cost: '₹144', note: 'shared value', icon: Bus, color: '#80c9ac' },
  { label: 'Train', cost: '₹162', note: 'steady ride', icon: TrainFront, color: '#9fb6d1' },
  { label: 'Flight', cost: '₹2,570', note: 'fastest', icon: Plane, color: '#d3a1a0' },
  { label: 'Bike', cost: '₹218', note: 'solo', icon: Bike, color: '#efc26d' },
];

export function Scene5() {
  return (
    <SceneFrame tone="light" className="bg-[#f7f1e7]">
      <div className="absolute left-[8vw] top-[14vh]">
        <Eyebrow light>04 / Compare the journey</Eyebrow>
        <motion.h2 className="font-display mt-[2.4vh] text-[5.5vw] leading-[.92] tracking-[-.065em]" initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .85, ease }}>
          There’s more<br />than <span className="text-[#e46e5c]">one</span> way.
        </motion.h2>
        <motion.p className="mt-[2.8vh] max-w-[21vw] text-[1.08vw] leading-[1.5] text-[#6b8a84]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .55, duration: .55 }}>
          See the trade-offs at a glance: what costs less, what moves faster, and what feels right for this trip.
        </motion.p>
        <motion.div className="mt-[5vh] flex items-center gap-[.6vw] font-mono text-[.75vw] uppercase tracking-[.13em] text-[#5d8278]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .95 }}><TrendingDown size="1.1vw" className="text-[#80c9ac]" /> Lowest cost highlighted automatically</motion.div>
      </div>
      <motion.div className="absolute right-[7vw] top-[15vh] w-[48vw]" initial={{ opacity: 0, x: 48 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .2, duration: .9, ease }}>
        <div className="mb-[1.1vw] flex items-center justify-between"><div className="font-display text-[1.65vw] text-[#17383d]">One trip. Five ways to get there.</div><TinyLabel>per person / one way</TinyLabel></div>
        <div className="space-y-[.65vw]">
          {modes.map(({ label, cost, note, icon: Icon, color }, index) => (
            <motion.div key={label} className={`relative flex h-[7.2vw] items-center rounded-[1vw] border px-[1.2vw] ${label === 'Bus' ? 'border-[#80c9ac] bg-[#e9f4eb]' : 'border-[#d9e4df] bg-[#fffaf2]'}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .46 + index * .12, duration: .5, ease }}>
              {label === 'Bus' && <div className="absolute right-[1vw] top-[-.65vw] rounded-full bg-[#17383d] px-[.75vw] py-[.35vw] font-mono text-[.62vw] uppercase tracking-[.13em] text-[#80c9ac]">Best value</div>}
              <div className="grid h-[3.2vw] w-[3.2vw] place-items-center rounded-[.8vw]" style={{ color, background: `${color}1c` }}><Icon size="1.35vw" /></div>
              <div className="ml-[1vw] min-w-[8vw]"><div className="text-[1.03vw] font-extrabold text-[#17383d]">{label}</div><div className="mt-[.25vw] font-mono text-[.68vw] uppercase tracking-[.11em] text-[#7b9693]">{note}</div></div>
              <div className="ml-auto font-mono text-[1.55vw] tracking-[-.04em] text-[#17383d]">{cost}<span className="ml-[.45vw] font-mono text-[.68vw] uppercase tracking-[.08em] text-[#7b9693]">/ person</span></div>
              <div className="ml-[1.6vw] h-[2.8vw] w-[6.5vw] rounded-full bg-[#e9eee7] p-[.27vw]"><motion.div className="h-full rounded-full" style={{ background: color }} initial={{ width: 0 }} animate={{ width: `${label === 'Flight' ? 92 : label === 'Car' ? 58 : label === 'Train' ? 32 : label === 'Bike' ? 18 : 11}%` }} transition={{ delay: .9 + index * .12, duration: .7, ease }} /></div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      <div className="absolute bottom-[8vh] right-[7vw] font-mono text-[.7vw] uppercase tracking-[.13em] text-[#6b8a84]">The smartest route is the one you can explain.</div>
    </SceneFrame>
  );
}