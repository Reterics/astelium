import { motion } from "framer-motion";
import { FiCircle } from "react-icons/fi";
import {memo} from "react";




const ModernTable = memo(() => {
  const tasks = [
    { name: "Contract", priority: "high", deadline: "2025-03-10" },
    { name: "Warehouse", priority: "medium", deadline: "2025-03-15" },
    { name: "Web Design", priority: "low", deadline: "2025-03-20" },
  ];

  const priorityColors = {
    high: "text-red-500",
    medium: "text-yellow-500",
    low: "text-green-500",
  };
  return (
    <motion.div
      className='absolute top-10 right-1/2 transform translate-x-1/2 w-64 bg-zinc-200 border border-zinc-300 shadow-md rounded-xs'
      animate={{translateY: [3, -3, 3]}}
      transition={{repeat: Infinity, duration: 4, ease: 'easeInOut'}}
    >
      <div className='w-full flex flex-col'>
        <div className='w-full flex bg-zinc-200 text-zinc-900 text-xs font-semibold rounded-xs overflow-hidden'>
          <div className='flex-1 px-1 py-1 text-center border-r border-zinc-300'>
            Task
          </div>
          <div className='w-6 px-1 py-1 text-center border-r border-zinc-300'>
            🔥
          </div>
          <div className='flex-1 px-1 py-1 text-center'>Deadline</div>
        </div>

        <div className='w-full text-zinc-900 text-xs bg-zinc-50'>
          {tasks.map((task, index) => (
            <motion.div
              key={index}
              className='w-full flex border-b border-zinc-300 hover:bg-zinc-100 transition'
              whileHover={{scale: 1.01}}
            >
              <div className='flex-1 px-1 py-1 text-center'>{task.name}</div>
              <div className='w-6 flex justify-center items-center'>
                <FiCircle
                  className={`w-3 h-3 ${priorityColors[task.priority as 'high'|'medium'|'low']}`}
                />
              </div>
              <div className='flex-1 px-1 py-1 text-center'>
                {task.deadline}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
});
export default ModernTable
