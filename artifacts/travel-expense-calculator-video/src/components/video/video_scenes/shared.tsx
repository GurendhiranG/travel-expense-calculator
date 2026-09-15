import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export const ease = [0.16, 1, 0.3, 1] as const;

export function SceneFrame({ children, tone = 'dark', className = '' }: { children: ReactNode; tone?: 'dark' | 'light'; className?: string }) {
  return (
    <motion.section
      className={`absolute inset-0 overflow-hidden ${tone === 'light' ? 'text-[#17383d]' : 'text-[#f7f1e7]'} ${className}`}
      initial={{ opacity: 0, clipPath: 'polygon(8% 0, 100% 0, 100% 100%, 0 100%, 0 12%)' }}
      animate={{ opacity: 1, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 0)' }}
      exit={{ opacity: 0, clipPath: 'polygon(0 0, 92% 0, 100% 100%, 0 100%, 0 0)' }}
      transition={{ duration: 0.85, ease }}
    >
      {children}
    </motion.section>
  );
}

export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <div className={`font-mono text-[1.05vw] uppercase tracking-[.24em] ${light ? 'text-[#17383d]/55' : 'text-[#a7c3bc]'}`}>
      {children}
    </div>
  );
}

export function Kicker({ children }: { children: ReactNode }) {
  return <span className="rounded-full border border-[#80c9ac]/40 bg-[#80c9ac]/10 px-[1vw] py-[.55vw] font-mono text-[.9vw] uppercase tracking-[.15em] text-[#80c9ac]">{children}</span>;
}

export function TinyLabel({ children }: { children: ReactNode }) {
  return <span className="font-mono text-[.78vw] uppercase tracking-[.16em] text-[#6b8a84]">{children}</span>;
}

export function Metric({ value, label, accent = '#ef9d5c' }: { value: string; label: string; accent?: string }) {
  return (
    <div>
      <div className="font-mono text-[2vw] font-medium tracking-[-.06em]" style={{ color: accent }}>{value}</div>
      <div className="mt-[.25vw] font-mono text-[.72vw] uppercase tracking-[.15em] text-[#6b8a84]">{label}</div>
    </div>
  );
}

export function RoutePin({ x, y, color, label }: { x: string; y: string; color: string; label: string }) {
  return (
    <motion.div className="absolute z-10" style={{ left: x, top: y }} initial={{ opacity: 0, scale: .5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .65, duration: .6, ease }}>
      <span className="block h-[1.1vw] w-[1.1vw] -translate-x-1/2 -translate-y-1/2 rounded-full border-[.25vw] border-[#f7f1e7]" style={{ background: color, boxShadow: `0 0 0 .5vw ${color}26` }} />
      <span className="absolute left-[.9vw] top-[-.8vw] whitespace-nowrap font-mono text-[.82vw] uppercase tracking-[.12em]" style={{ color }}>{label}</span>
    </motion.div>
  );
}