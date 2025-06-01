'use client';
import { motion } from 'framer-motion';
import { FaCar, FaChartLine, FaRoad, FaTachometerAlt, FaUser, FaHistory, FaShieldAlt, FaLeaf } from 'react-icons/fa';

export default function HowItWorks() {
  const features = [
    {
      icon: <FaCar className="w-8 h-8" />,
      title: "Sürüş Analizi",
      description: "Yapay zeka destekli sistemimiz, sürüş alışkanlıklarınızı detaylı bir şekilde analiz eder."
    },
    {
      icon: <FaChartLine className="w-8 h-8" />,
      title: "Performans Takibi",
      description: "Sürüş performansınızı zaman içinde takip edin ve gelişiminizi görün."
    },
    {
      icon: <FaRoad className="w-8 h-8" />,
      title: "Rota Analizi",
      description: "Sürüş rotalarınızı analiz ederek en verimli güzergahları belirleyin."
    },
    {
      icon: <FaTachometerAlt className="w-8 h-8" />,
      title: "Yakıt Verimliliği",
      description: "Sürüş alışkanlıklarınızı optimize ederek yakıt tasarrufu sağlayın."
    }
  ];

  const benefits = [
    {
      icon: <FaUser className="w-8 h-8" />,
      title: "Kişiselleştirilmiş Öneriler",
      description: "Sürüş alışkanlıklarınıza özel iyileştirme önerileri alın."
    },
    {
      icon: <FaHistory className="w-8 h-8" />,
      title: "Detaylı Geçmiş",
      description: "Tüm sürüş geçmişinizi detaylı raporlarla inceleyin."
    },
    {
      icon: <FaShieldAlt className="w-8 h-8" />,
      title: "Güvenli Sürüş",
      description: "Güvenli sürüş alışkanlıkları geliştirin ve riskleri azaltın."
    },
    {
      icon: <FaLeaf className="w-8 h-8" />,
      title: "Çevre Dostu",
      description: "Verimli sürüş ile çevreye olan etkinizi azaltın."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Araç Bilgilerinizi Girin",
      description: "Aracınızın marka, model ve diğer özelliklerini sisteme kaydedin."
    },
    {
      number: "02",
      title: "Sürüş Verilerinizi Yükleyin",
      description: "Sürüş sırasında toplanan verileri sisteme yükleyin."
    },
    {
      number: "03",
      title: "Analiz Sonuçlarını Görün",
      description: "Yapay zeka destekli sistemimiz sürüşünüzü analiz etsin."
    },
    {
      number: "04",
      title: "İyileştirmeleri Uygulayın",
      description: "Size özel önerileri uygulayarak sürüşünüzü geliştirin."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-red-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              DriveMetrics Nasıl Çalışır?
            </h1>
            <p className="text-xl md:text-2xl text-red-100 max-w-3xl mx-auto">
              Yapay zeka destekli sürüş analiz sistemimiz ile sürüş alışkanlıklarınızı optimize edin
            </p>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Özelliklerimiz</h2>
            <p className="text-xl text-gray-600">DriveMetrics'in size sunduğu özellikler</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="text-red-500 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Faydalar</h2>
            <p className="text-xl text-gray-600">DriveMetrics ile elde edeceğiniz avantajlar</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="text-red-500 mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Steps Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nasıl Başlarım?</h2>
            <p className="text-xl text-gray-600">DriveMetrics'i kullanmaya başlamak için adımlar</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow relative"
              >
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center text-xl font-bold">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 