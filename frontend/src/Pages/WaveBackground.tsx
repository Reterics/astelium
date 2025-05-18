import {motion} from 'framer-motion';

export function WaveBackground() {
  return (
    <div className='fixed inset-0 overflow-hidden h-screen min-w-[100vh] mx-auto bg-[#e0f2ff] -z-10'>
      <svg
        viewBox='0 0 2048 1024'
        preserveAspectRatio='none'
        className='w-full h-full rotate-[184deg] scale-[1.6]'
        xmlns='http://www.w3.org/2000/svg'
      >
        <defs>
          <linearGradient id='waveGradientContact' x1='0' y1='0' x2='1' y2='0'>
            <stop offset='0%' stopColor='oklch(0.985 0 0)' />
            <stop offset='100%' stopColor='white' />
          </linearGradient>
        </defs>

        {[...Array(4)].map((_, index) => (
          <motion.path
            key={index}
            fill='url(#waveGradientContact)'
            opacity='0.35'
            initial={{x: 0}}
            animate={{x: [0, 60 + index * 10, 0], y: [0, 40, 0]}}
            transition={{
              duration: 12 + index * 1.5,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'easeInOut',
            }}
            d={[
              'M0,0 L0,',
              500 + index * 12,
              ' Q 300,',
              450 + index * 15,
              ' 600,',
              520 + index * 10,
              ' T 1200,',
              460 + index * 20,
              ' T 1800,',
              400 + index * 15,
              ' T 2048,',
              420 + index * 10,
              ' L2048,0 Z',
            ].join(' ')}
          />
        ))}
      </svg>
    </div>
  );
}
