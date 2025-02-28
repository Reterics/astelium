import {
  FiCheckCircle
} from 'react-icons/fi';
import { motion } from 'framer-motion';

const LandingPage = () => {
  return (
    <div className="min-h-screen text-black relative overflow-hidden">
      <div

        className="min-h-screen bg-gradient-to-br from-white to-zinc-100 text-black relative overflow-hidden flex items-center justify-center">
        <div
          style={{
            background:'url(background.webp)',
            opacity: '0.3',
            backgroundPositionX: 'right',
            backgroundPositionY: 'center',

          }}
          className="absolute top-0 left-0 w-full h-full overflow-hidden">

        </div>
        <div className="absolute bottom-0 left-0 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1672 480" className="w-full h-auto">
            <path d="M0,160 C600,360 1072,-80 1672,100 L1672,480 L0,480 Z" fill="url(#gradient)" />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#e0f2ff" />
                <stop offset="100%" stopColor="#cfe8ff" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <motion.div
            className="absolute top-16 left-10 w-40 h-20 bg-blue-200 bg-opacity-50 rounded-lg shadow"
            animate={{ y: [-10, 10, -10] }}
            transition={{ repeat: Infinity, duration: 4 }}
          >
            {/* Line Chart */}
            <svg viewBox="0 0 100 50" className="w-full h-full">
              <path d="M5 45 L20 30 L40 35 L60 15 L80 25 L95 5" stroke="black" strokeWidth="2" fill="none" />
            </svg>
          </motion.div>

          <motion.div
            className="absolute top-24 right-10 w-32 h-24 bg-green-200 bg-opacity-50 rounded-lg shadow"
            animate={{ y: [10, -10, 10] }}
            transition={{ repeat: Infinity, duration: 4 }}
          >
            {/* Bar Chart */}
            <svg viewBox="0 0 100 50" className="w-full h-full">
              <rect x="10" y="20" width="15" height="30" fill="black" />
              <rect x="35" y="10" width="15" height="40" fill="black" />
              <rect x="60" y="25" width="15" height="25" fill="black" />
            </svg>
          </motion.div>

          <motion.div
            className="absolute bottom-20 left-10 w-36 h-20 bg-red-200 bg-opacity-50 rounded-lg shadow"
            animate={{ y: [-8, 8, -8] }}
            transition={{ repeat: Infinity, duration: 4 }}
          >
            {/* Area Chart */}
            <svg viewBox="0 0 100 50" className="w-full h-full">
              <polygon points="0,50 20,30 40,35 60,15 80,25 100,5 100,50" fill="black" stroke="black" strokeWidth="2" />
            </svg>
          </motion.div>

          <motion.div
            className="absolute bottom-16 right-16 w-24 h-24 bg-yellow-200 bg-opacity-50 rounded-full shadow"
            animate={{ y: [8, -8, 8] }}
            transition={{ repeat: Infinity, duration: 4 }}
          >
            {/* Pie Chart */}
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="45" stroke="black" strokeWidth="2" fill="none" />
              <path d="M50 50 L50 5 A45 45 0 0 1 90 50 Z" fill="black" stroke="black" strokeWidth="2" />
            </svg>
          </motion.div>

          <motion.div
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-28 h-28 bg-purple-200 bg-opacity-50 rounded-full shadow"
            animate={{ y: [-8, 8, -8] }}
            transition={{ repeat: Infinity, duration: 4 }}
          >
            {/* Globe (Earth) */}
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="45" stroke="black" strokeWidth="2" fill="none" />
              <path d="M20 50 Q40 20, 80 50 T80 90" stroke="black" strokeWidth="2" fill="none" />
            </svg>
          </motion.div>

          <motion.div
            className="absolute top-10 right-1/2 transform translate-x-1/2 w-36 h-20 bg-gray-200 bg-opacity-50 rounded-lg shadow"
            animate={{ y: [8, -8, 8] }}
            transition={{ repeat: Infinity, duration: 4 }}
          >
            {/* Table */}
            <svg viewBox="0 0 100 50" className="w-full h-full">
              <rect x="5" y="5" width="90" height="40" stroke="black" strokeWidth="2" fill="none" />
              <line x1="5" y1="20" x2="95" y2="20" stroke="black" strokeWidth="2" />
              <line x1="35" y1="5" x2="35" y2="45" stroke="black" strokeWidth="2" />
              <line x1="65" y1="5" x2="65" y2="45" stroke="black" strokeWidth="2" />
            </svg>
          </motion.div>
        </div>

        <div className="absolute container mx-auto px-6 md:flex md:items-center">
          <div className="md:w-1/2 text-center md:text-left">
            <motion.h1
              className="text-5xl font-extrabold tracking-tight sm:text-6xl"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              Astelium
            </motion.h1>
            <motion.p
              className="mt-4 text-lg max-w-xl text-zinc-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
            >
              The ultimate <b>Task & Project Management</b> and <b>CRM</b> system to boost productivity.
            </motion.p>
            <motion.div
              className="mt-6 flex justify-center md:justify-start space-x-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <button className="px-5 py-2 bg-zinc-200 hover:bg-zinc-300 rounded text-black font-semibold cursor-pointer">
                Try Demo
              </button>
              <button className="px-5 py-2 bg-zinc-300 hover:bg-zinc-400 rounded font-semibold cursor-pointer">
                View Pricing
              </button>
            </motion.div>
          </div>

          <div className="md:w-1/2 flex justify-center relative mt-10 md:mt-0">
            <motion.div className="relative flex flex-col items-center">
              <img src="woman.png" alt=""></img>
            </motion.div>
          </div>
        </div>

      </div>

      <section className="py-20 bg-white text-center relative z-10">
        <h2 className="text-3xl font-bold">Why Choose Astelium?</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[
            { title: 'Task Management', desc: 'Organize and track tasks efficiently.', img: '/images/task-management.jpg' },
            { title: 'Invoices', desc: 'Generate and manage invoices seamlessly.', img: '/images/invoices.jpg' },
            { title: 'Storage Management', desc: 'Securely store and access your files.', img: '/images/storage-management.jpg' },
            { title: 'CRM & Clients', desc: 'Manage customer relationships with ease.', img: '/images/crm-clients.jpg' },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="p-6 bg-zinc-100 rounded flex flex-col items-center shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={feature.img}
                alt={feature.title}
                className="w-full h-40 object-cover rounded"
              />
              <h3 className="mt-4 text-xl font-semibold">{feature.title}</h3>
              <p className="mt-2 text-zinc-600">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-zinc-100 text-center relative z-10">
        <h2 className="text-3xl font-bold">Pricing Plans</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { tier: 'Starter', price: '$9/mo', features: ['Basic CRM', 'Task Management'] },
            { tier: 'Pro', price: '$29/mo', features: ['Advanced CRM', 'Unlimited Tasks', 'Collaboration'] },
            { tier: 'Enterprise', price: 'Custom', features: ['Dedicated Support', 'Custom Integrations'] },
          ].map((plan, index) => (
            <motion.div
              key={index}
              className="p-6 bg-white rounded shadow-lg border border-zinc-300"
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-xl font-semibold">{plan.tier}</h3>
              <p className="mt-2 text-2xl font-bold">{plan.price}</p>
              <ul className="mt-4 text-zinc-600 space-y-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center justify-center space-x-2">
                    <FiCheckCircle className="text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="mt-4 px-5 py-2 bg-zinc-200 hover:bg-zinc-300 rounded text-black font-semibold">
                Choose Plan
              </button>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
