'use client';
import { motion } from 'framer-motion';
import { FaHistory, FaUser, FaQuestionCircle } from 'react-icons/fa';

export default function QuickActions() {
  const actions = [
    {
      icon: <FaHistory className="w-6 h-6" />,
      title: "Geçmiş Sürüşlerim",
      description: "Tüm sürüş geçmişinizi görüntüleyin",
      color: "from-red-500 to-red-600"
    },
    {
      icon: <FaUser className="w-6 h-6" />,
      title: "Profilim",
      description: "Profil bilgilerinizi yönetin",
      color: "from-red-500 to-red-600"
    },
    {
      icon: <FaQuestionCircle className="w-6 h-6" />,
      title: "Nasıl Çalışır?",
      description: "Sistem hakkında bilgi alın",
      color: "from-red-500 to-red-600"
    }
  ];

  return (
    <div className="bg-gradient-to-r from-red-500 to-red-600 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center text-white mb-12"
        >
          Hızlı Erişim
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {actions.map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg blur-xl"
                   style={{ backgroundImage: `linear-gradient(to right, ${action.color})` }} />
              <div className="relative bg-white/10 backdrop-blur-sm p-6 rounded-lg border border-red-400/50 group-hover:border-red-500 transition-all cursor-pointer">
                <motion.div
                  className="text-white mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  {action.icon}
                </motion.div>
                <h3 className="text-xl font-semibold text-white mb-2">{action.title}</h3>
                <p className="text-red-100">{action.description}</p>
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full"
                  style={{ backgroundImage: `linear-gradient(to right, ${action.color})` }}
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 