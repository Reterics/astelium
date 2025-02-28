import { FiCheckCircle } from 'react-icons/fi';
import { motion } from 'framer-motion';

const LandingPage = () => {
  return (
    <div className="min-h-screen text-black relative overflow-hidden">
      <div className="min-h-screen bg-gradient-to-br from-white to-zinc-100 text-black relative overflow-hidden flex items-center justify-center">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-black bg-opacity-10 rounded-full"
              style={{
                width: `${100 + i * 50}px`,
                height: `${60 + i * 30}px`,
                top: `${i * 15}%`,
                left: `${i * 30}%`,
              }}
              animate={{ x: [0, 50, 0], opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 10 + i * 3 }}
            />
          ))}
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
              <motion.div
                className="absolute top-0 left-10 w-40 h-20 bg-blue-200 bg-opacity-50 rounded-lg"
                animate={{ y: [-10, 10, -10] }}
                transition={{ repeat: Infinity, duration: 4 }}
              >
                <svg viewBox="0 0 100 50" className="w-full h-full">
                  <path
                    d="M0 40 L20 20 L40 30 L60 10 L80 25 L100 5"
                    stroke="black"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </motion.div>
              <motion.div
                className="absolute top-10 right-10 w-32 h-24 bg-green-200 bg-opacity-50 rounded-lg"
                animate={{ y: [10, -10, 10] }}
                transition={{ repeat: Infinity, duration: 4 }}
              >
                <svg viewBox="0 0 100 50" className="w-full h-full">
                  <rect x="10" y="20" width="15" height="30" fill="black" />
                  <rect x="35" y="10" width="15" height="40" fill="black" />
                  <rect x="60" y="25" width="15" height="25" fill="black" />
                </svg>
              </motion.div>
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
