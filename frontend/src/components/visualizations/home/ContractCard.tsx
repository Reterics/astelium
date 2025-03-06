import {motion} from 'framer-motion';

export default function ContractCard() {
  return (
    <div className='absolute top-16 left-20'>
      <motion.div className='absolute w-[105px] h-[148px] bg-zinc-50 border border-zinc-300 shadow-md rounded-xs rotate-[-5deg]' />
      <motion.div className='absolute w-[105px] h-[148px] bg-zinc-50 border border-zinc-300 shadow-md rounded-xs rotate-[-2deg]' />

      <motion.div
        className='relative w-[105px] h-[148px] bg-zinc-50 border border-zinc-300 shadow-md rounded-xs p-2 text-zinc-900 rotate-[1deg]'
        animate={{translateY: [3, -3, 3]}}
        transition={{repeat: Infinity, duration: 4, ease: 'easeInOut'}}
      >
        <h3 className='text-[7px] font-semibold text-zinc-700 border-b border-zinc-300 pb-0.5'>
          Contract Agreement
        </h3>

        <div className='text-[6px] mt-1 leading-tight'>
          <p>
            <strong>Parties:</strong> Alice Corp & Bob Ltd.
          </p>
          <p>
            <strong>Effective Date:</strong> 2025-03-10
          </p>
          <p>
            <strong>Scope:</strong> Web Design Services
          </p>
        </div>

        <div className='text-[6px] mt-2 leading-tight italic text-zinc-600'>
          <p>
            Both parties must adhere to the project milestones and agreed
            payment terms.
          </p>
        </div>

        <div className='mt-5 pt-2 border-t border-zinc-300'>
          <p className='text-[6px] text-zinc-600'>Authorized Signature:</p>

          <motion.svg
            className='mt-1 w-[50px] h-[20px] text-zinc-700'
            initial={{opacity: 0, x: -10}}
            animate={{opacity: 1, x: 0}}
            transition={{duration: 0.8, ease: 'easeOut'}}
            viewBox='0 0 120 40'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M5 30 Q10 5, 20 25 T40 20 T60 30 T80 15 T100 25 T115 10' />
          </motion.svg>
        </div>
      </motion.div>
    </div>
  );
}
