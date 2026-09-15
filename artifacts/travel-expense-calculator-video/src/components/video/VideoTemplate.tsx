import { AnimatePresence, motion } from 'framer-motion';

import { useVideoPlayer } from '@/lib/video';

import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';
import { Scene4 } from './video_scenes/Scene4';
import { Scene5 } from './video_scenes/Scene5';
import { Scene6 } from './video_scenes/Scene6';

const SCENE_DURATIONS = {
  opening: 4400,
  route: 4300,
  inputs: 4500,
  map: 4700,
  compare: 4800,
  answer: 4900,
};

const sceneBackgrounds = ['#102f35', '#f7f1e7', '#dcebe1', '#102f35', '#f7f1e7', '#102f35'];

function PersistentWorld({ currentScene }: { currentScene: number }) {
  const isLight = currentScene === 1 || currentScene === 2 || currentScene === 4;
  return (
    <>
      <motion.div className="absolute inset-0" animate={{ backgroundColor: sceneBackgrounds[currentScene] }} transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }} />
      <motion.div className="absolute -right-[12vw] -top-[21vh] h-[62vw] w-[62vw] rounded-full opacity-30 blur-[2px]" animate={{ background: currentScene === 2 || currentScene === 4 ? 'radial-gradient(circle, rgba(128,201,172,.3), transparent 62%)' : 'radial-gradient(circle, rgba(228,110,92,.21), transparent 62%)', scale: currentScene === 3 ? 1.18 : 1 }} transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }} />
      <motion.div className={`absolute inset-0 map-lines ${isLight ? 'opacity-[.18]' : 'opacity-[.12]'}`} animate={{ x: currentScene % 2 === 0 ? 0 : '-2vw', y: currentScene % 3 === 0 ? 0 : '1vw' }} transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }} />
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-70" viewBox="0 0 1440 810" fill="none" aria-hidden="true">
        <motion.path d="M-30 738C158 646 206 695 356 587s210-20 327-144S897 370 1054 258 1267 154 1512 60" stroke={isLight ? '#e46e5c' : '#ef9d5c'} strokeWidth="2" strokeDasharray="7 12" className="route-dash" animate={{ pathLength: [0.58, .82, .58], opacity: [.28, .62, .28] }} transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.path d="M-40 158C109 188 184 115 308 156s202 42 298 12 226-4 317 79 212 28 362-22 172-30 233-6" stroke={isLight ? '#17383d' : '#80c9ac'} strokeOpacity=".17" strokeWidth="1" animate={{ x: currentScene * 5 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} />
      </svg>
      <div className="grain absolute inset-0" />
    </>
  );
}

export default function VideoTemplate() {
  const { currentScene } = useVideoPlayer({ durations: SCENE_DURATIONS, loop: true });
  const Scenes = [Scene1, Scene2, Scene3, Scene4, Scene5, Scene6];
  const ActiveScene = Scenes[currentScene] ?? Scene1;
  const isLight = currentScene === 1 || currentScene === 2 || currentScene === 4;
  return (
    <main className="video-shell" style={{ aspectRatio: '16 / 9' }}>
      <PersistentWorld currentScene={currentScene} />
      <motion.div className={`absolute left-[5vw] top-[4.5vh] z-10 flex items-center gap-[.7vw] ${isLight ? 'text-[#17383d]' : 'text-[#f7f1e7]'}`} animate={{ opacity: 1 }} initial={{ opacity: 0 }} transition={{ duration: .5 }}>
        <span className="grid h-[2.4vw] w-[2.4vw] place-items-center rounded-[.65vw] bg-[#ef9d5c] font-display text-[1.15vw] font-bold text-[#17383d]">T</span>
        <span className="font-mono text-[.75vw] font-medium uppercase tracking-[.18em]">Trip / Ledger</span>
      </motion.div>
      <motion.div className={`absolute right-[5vw] top-[4.8vh] z-10 font-mono text-[.68vw] uppercase tracking-[.15em] ${isLight ? 'text-[#6b8a84]' : 'text-[#6b8a84]'}`}>
        <span className="mr-[1.3vw]">Travel expense &amp; distance</span>
        <span className="inline-flex gap-[.25vw]">{Scenes.map((_, index) => <i key={index} className="block h-[.25vw] w-[1.1vw] rounded-full" style={{ background: index <= currentScene ? '#ef9d5c' : isLight ? '#c7d7cc' : '#355b5b' }} />)}</span>
      </motion.div>
      <AnimatePresence mode="sync" initial={false}>
        <ActiveScene key={`scene-${currentScene}`} />
      </AnimatePresence>
    </main>
  );
}