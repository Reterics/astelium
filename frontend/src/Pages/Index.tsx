import {
  FiCheckCircle,
  FiCheckSquare,
  FiDatabase,
  FiFileText,
  FiUsers,
} from 'react-icons/fi';
import {motion} from 'framer-motion';
import HomeLineChart from '../components/visualizations/home/HomeLineChart.tsx';
import ModernTable from '../components/visualizations/home/ModernTable.tsx';
import ContractCard from '../components/visualizations/home/ContractCard.tsx';
import BusinessD3BarChart from '../components/visualizations/home/BusinessD3BarChart.tsx';

const LandingPage = () => {
  return (
    <div className='min-h-screen text-black relative overflow-hidden'>
      <div className='min-h-screen bg-gradient-to-t from-[#eaf6fe] to-white text-black relative overflow-hidden flex items-center justify-center'>
        <div
          style={{
            opacity: '0.3',
            backgroundPositionX: 'right',
            backgroundPositionY: 'center',
          }}
          className='absolute top-0 left-0 w-full h-full overflow-hidden'
        >
          <HomeLineChart />
        </div>
        <div className='absolute bottom-0 left-0 w-full'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 1672 480'
            className='w-full h-auto'
          >
            <path
              d='M0,160 C600,360 1072,-80 1672,100 L1672,480 L0,480 Z'
              fill='url(#gradient)'
            />
            <defs>
              <linearGradient id='gradient' x1='0%' y1='0%' x2='100%' y2='0%'>
                <stop offset='0%' stopColor='#e0f2ff' />
                <stop offset='100%' stopColor='#cfe8ff' />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className='absolute container mx-auto p-6 top-1/12 md:flex md:items-center'>
          <div className='md:w-1/2 text-center md:text-left'>
            <ContractCard />

            <ModernTable />
          </div>
        </div>

        <div className='absolute container bottom-1/12 md:flex text-left px-12'>
          <div className='w-1/6'>
            <BusinessD3BarChart />
          </div>
        </div>

        <div className='absolute container mx-auto px-6 md:flex md:items-center'>
          <div className='md:w-1/2 text-center md:text-left'>
            <motion.h1
              className='text-5xl font-extrabold tracking-tight sm:text-6xl'
              initial={{opacity: 0, y: -20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 1}}
            >
              Astelium
            </motion.h1>
            <motion.p
              className='mt-4 text-lg max-w-xl text-zinc-600'
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 1.2}}
            >
              The ultimate <b>Task & Project Management</b> and <b>CRM</b>{' '}
              system to boost productivity.
            </motion.p>
            <motion.div
              className='mt-6 flex justify-center md:justify-start space-x-4'
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{delay: 0.5}}
            >
              <button className='px-5 py-2 bg-[#cfe8ff] hover:bg-zinc-300 rounded text-black font-semibold cursor-pointer'>
                Book a Demo
              </button>
              <button className='px-5 py-2 bg-[#cfe8ff] hover:bg-zinc-300 rounded font-semibold cursor-pointer'>
                View Pricing
              </button>
            </motion.div>
          </div>

          <div className='md:w-1/2 flex justify-center relative mt-10 md:mt-0'>
            <motion.div className='relative flex flex-col items-center'>
              <img src='woman.png' alt=''></img>
            </motion.div>
          </div>
        </div>
      </div>

      <section className='py-20 pt-14 bg-white text-center relative z-10'>
        <h2 className='text-3xl font-bold'>Why Choose Astelium?</h2>
        <div className='mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto'>
          {[
            {
              title: 'Task Management',
              desc: 'Organize and track tasks efficiently.',
              img: '/images/task-management.jpg',
              icon: <FiCheckSquare className='text-4xl text-zinc-700' />,
            },
            {
              title: 'Invoices',
              desc: 'Generate and manage invoices seamlessly.',
              img: '/images/invoices.jpg',
              icon: <FiFileText className='text-4xl text-zinc-700' />,
            },
            {
              title: 'Storage Management',
              desc: 'Securely store and access your files.',
              img: '/images/storage-management.jpg',
              icon: <FiDatabase className='text-4xl text-zinc-700' />,
            },
            {
              title: 'CRM & Clients',
              desc: 'Manage customer relationships with ease.',
              img: '/images/crm-clients.jpg',
              icon: <FiUsers className='text-4xl text-zinc-700' />,
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className='p-6 bg-zinc-50 rounded flex flex-col items-center shadow border border-zinc-300'
              whileHover={{scale: 1.05}}
            >
              {feature.icon}
              <h3 className='mt-4 text-xl font-semibold'>{feature.title}</h3>
              <p className='mt-2 text-zinc-600'>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className='py-16 bg-[#e0f2ff] text-center'>
        <h2 className='text-3xl font-bold text-zinc-900'>
          Who Benefits from Astelium?
        </h2>
        <div className='mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto'>
          {[
            {
              icon: '📌',
              title: 'Freelancers',
              description:
                'Simplify project management and invoicing. Track clients, tasks, and finances in one place, so you can focus on delivering quality work.',
            },
            {
              icon: '🏢',
              title: 'Small Businesses',
              description:
                'A full-featured CRM with project, contract, and inventory management. Automate workflows and keep everything organized effortlessly.',
            },
            {
              icon: '📦',
              title: 'Warehouse Teams',
              description:
                'Manage inventory across multiple locations, streamline logistics, and track stock in real-time for efficient warehouse operations.',
            },
          ].map((useCase, index) => (
            <motion.div
              whileHover={{scale: 1.05}}
              key={index}
              className='p-6 bg-white rounded shadow border border-zinc-300 flex flex-col items-center'
            >
              <span className='text-4xl'>{useCase.icon}</span>
              <h3 className='text-xl font-semibold mt-4 text-zinc-900'>
                {useCase.title}
              </h3>
              <p className='mt-2 text-zinc-700'>{useCase.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className='py-16 bg-white text-center'>
        <h2 className='text-3xl font-bold text-zinc-900'>
          Frequently Asked Questions
        </h2>
        <div className='mt-8 max-w-4xl mx-auto text-left space-y-6'>
          {[
            {
              question: 'How does Astelium help manage projects?',
              answer:
                'Astelium provides a task-oriented workflow, Kanban board, and reporting tools to track project progress efficiently.',
            },
            {
              question: 'Can I customize features for my business needs?',
              answer:
                'Yes! Our Enterprise plan includes custom feature requests and integrations tailored to your specific requirements.',
            },
            {
              question: 'Does Astelium support invoicing and contracts?',
              answer:
                'Yes! The Pro plan includes invoice and contract management, helping businesses streamline financial operations.',
            },
            {
              question: 'Is my data secure?',
              answer:
                'Astelium uses industry-standard encryption and secure hosting to ensure your data remains safe at all times.',
            },
            {
              question: 'What integrations does Astelium support?',
              answer:
                'Astelium supports a range of external integrations including accounting software, cloud storage, and more.',
            },
            {
              question: 'Do you offer a free trial?',
              answer:
                'Yes, you can try Astelium for free with limited features before upgrading to a paid plan.',
            },
          ].map((faq, index) => (
            <motion.div
              whileHover={{scale: 1.05}}
              key={index}
              className='p-4 bg-zinc-50 rounded shadow border border-zinc-300'
            >
              <h3 className='text-lg font-semibold text-zinc-900'>
                {faq.question}
              </h3>
              <p className='mt-2 text-zinc-700'>{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className='py-20 pt-14 bg-[#e0f2ff] text-center relative z-10'>
        <h2 className='text-3xl font-bold'>Pricing Plans</h2>
        <div className='mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto'>
          {[
            {
              tier: 'Starter',
              price: '$3/mo',
              features: [
                'Manage Clients',
                'Manage Projects',
                'Manage Tasks',
                'Inventory Management',
                'Multiple Warehouse Support',
              ],
            },
            {
              tier: 'Pro',
              price: '$9/mo',
              features: [
                'All Starter Features',
                'User Management',
                'Invoice Management',
                'Contract Management',
                'External Integrations',
              ],
            },
            {
              tier: 'Enterprise',
              price: 'Custom',
              features: [
                'All Pro Features',
                'Dedicated IT Support',
                'Custom Feature Requests',
                'Custom Integrations',
                'Priority Support',
              ],
            },
          ].map((plan, index) => (
            <motion.div
              key={index}
              className='p-6 bg-zinc-50 rounded shadow-lg border border-zinc-300'
              whileHover={{scale: 1.05}}
            >
              <h3 className='text-xl font-semibold'>{plan.tier}</h3>
              <p className='mt-2 text-2xl font-bold'>{plan.price}</p>
              <ul className='mt-4 text-zinc-600 space-y-2 text-left'>
                {plan.features.map((feature, i) => (
                  <li key={i} className='flex items-center space-x-2'>
                    <FiCheckCircle className='text-green-500' />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className='mt-4 px-5 py-2 bg-zinc-200 hover:bg-zinc-300 rounded text-black font-semibold'>
                Choose Plan
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className='bg-white text-zinc-900 py-10'>
        <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left'>
          <div>
            <h3 className='text-xl font-semibold'>Astelium</h3>
            <p className='mt-2 text-zinc-600'>
              Your all-in-one solution for project management and CRM.
            </p>
          </div>
          <div>
            <h3 className='text-xl font-semibold'>Quick Links</h3>
            <ul className='mt-2 space-y-2 text-zinc-600'>
              <li>
                <a href='/pricing' className='hover:text-black'>
                  Pricing
                </a>
              </li>
              <li>
                <a href='/features' className='hover:text-black'>
                  Features
                </a>
              </li>
              <li>
                <a href='/faq' className='hover:text-black'>
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className='text-xl font-semibold'>Get in Touch</h3>
            <p className='mt-2 text-zinc-600'>support@astelium.com</p>
            <p className='mt-1 text-zinc-600'>Contact Us</p>
          </div>
        </div>
        <div className='mt-8 text-center text-zinc-600 text-sm'>
          &copy; {new Date().getFullYear()} Astelium. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
