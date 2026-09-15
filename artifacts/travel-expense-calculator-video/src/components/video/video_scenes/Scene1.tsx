import { motion } from 'framer-motion';
import { ArrowDownRight, MapPin } from 'lucide-react';

import { Eyebrow, Kicker, SceneFrame, ease } from './shared';

export function Scene1() {
  return (
    <SceneFrame className="bg-transparent">
      <div className="absolute left-[8vw] top-[20vh] w-[54vw]">
        <motion.div initial={{ opacity: 0, x: -35 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .8, ease }}>
          <Kicker>TRIP PLANNING, WITHOUT THE GUESSWORK</Kicker>
        </motion.div>
        <motion.h1 className="font-display mt-[2.8vh] max-w-[54vw] text-[7.8vw] leading-[.92] tracking-[-.065em]" initial={{ opacity: 0, y: 45, rotate: 1 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ delay: .2, duration: 1.1, ease }}>
          Make every<br /><span className="text-[#ef9d5c]">kilometer</span> count.
        </motion.h1>
        <motion.p className="mt-[3.6vh] max-w-[29vw] text-[1.35vw] leading-[1.45] text-[#a7c3bc]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .8, duration: .65 }}>
          A clearer way to plan the road ahead — route, distance, cost, and the best way to get there.
        </motion.p>
      </div>

      <motion.div className="absolute bottom-[11vh] left-[8vw] flex items-center gap-[1vw] font-mono text-[.82vw] uppercase tracking-[.17em] text-[#ef9d5c]" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: .55, ease }}>
        <ArrowDownRight size="1.2vw" strokeWidth={1.6} /> Mumbai <span className="text-[#6b8a84]">→</span> Pune <span className="text-[#6b8a84]">/ 151 KM</span>
      </motion.div>

      <motion.div className="absolute right-[7vw] top-[20vh] h-[45vh] w-[30vw] rotate-[-8deg]" initial={{ opacity: 0, scale: .8, rotate: -16 }} animate={{ opacity: 1, scale: 1, rotate: -8 }} transition={{ delay: .45, duration: 1.2, ease }}>
        <div className="absolute inset-0 rounded-[48%_52%_45%_55%] border border-[#80c9ac]/30 bg-[#163d40]/70" />
        <svg className="absolute inset-[8%] h-[84%] w-[84%]" viewBox="0 0 300 300" fill="none" aria-hidden="true">
          <path d="M34 244C59 206 54 168 96 152S125 80 165 58s62 15 91-22" stroke="#80c9ac" strokeOpacity=".27" strokeWidth="1" />
          <path d="M34 244C79 219 80 173 124 148S146 98 165 58" stroke="#ef9d5c" strokeWidth="2" strokeDasharray="4 5" className="route-dash" />
          <path d="M23 109C65 119 75 91 107 109s42 4 76 34 48 20 76 6" stroke="#80c9ac" strokeOpacity=".23" strokeWidth="1" />
          <path d="M76 44L117 271M194 26L155 275" stroke="#80c9ac" strokeOpacity=".12" strokeWidth="1" />
          <circle cx="34" cy="244" r="5" fill="#17383d" stroke="#ef9d5c" strokeWidth="3" />
          <circle cx="165" cy="58" r="5" fill="#ef9d5c" stroke="#f7f1e7" strokeWidth="3" />
        </svg>
        <div className="absolute bottom-[17%] left-[5%] flex items-center gap-[.5vw] font-mono text-[.72vw] uppercase tracking-[.12em] text-[#ef9d5c]"><MapPin size="1vw" /> Your route</div>
        <div className="absolute right-[5%] top-[17%] font-mono text-[.68vw] uppercase tracking-[.12em] text-[#80c9ac]">01 / 06</div>
      </motion.div>

      <motion.div className="absolute right-[8vw] bottom-[11vh] font-mono text-[.78vw] uppercase tracking-[.14em] text-[#6b8a84]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
        Travel expense calculator <span className="ml-[1.5vw] text-[#80c9ac]">Live overview</span>
      </motion.div>
    </SceneFrame>
  );
}