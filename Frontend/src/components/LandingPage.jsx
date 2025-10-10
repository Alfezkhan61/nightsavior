import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Users, Store } from 'lucide-react';
import OwlThemeToggle from './OwlThemeToggle';
import Footer from './Footer';

const LandingPage = () => {
  const navigate = useNavigate();

  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2,
  }));

  return (
    <div className="min-h-screen relative overflow-hidden dark:bg-night-gradient light:bg-gradient-to-br light:from-blue-50 light:to-indigo-100 transition-all duration-500">
      {/* Animated Background */}
      <div className="absolute inset-0 dark:bg-night-gradient light:bg-gradient-to-br light:from-blue-50 light:to-indigo-100">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="star"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: star.delay,
            }}
          />
        ))}
        
        {/* Moon */}
        <motion.div
          className="moon"
          style={{ top: '10%', right: '10%' }}
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Navigation */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center mb-16"
        >
          <motion.div
            className="text-2xl font-bold glow-text dark:text-white light:text-gray-900"
            whileHover={{ scale: 1.05 }}
          >
            NightMate
          </motion.div>
          
          {/* Right side navigation with theme toggle and get started button */}
          <div className="flex items-center gap-4">
            <OwlThemeToggle />
            <motion.button
              onClick={() => navigate('/signin')}
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </div>
        </motion.nav>

        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6 glow-text dark:text-white light:text-gray-900"
          >
            Find Open Shops Near You,
            <br />
            <span className="dark:text-purple-400 light:text-indigo-600">Even at Midnight!</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl dark:text-midnight-300 light:text-gray-600 mb-12 max-w-3xl mx-auto transition-colors duration-300"
          >
            Never worry about finding food, medicine, or essentials late at night. 
            Connect with local shops that stay open when you need them most.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <motion.button
              onClick={() => navigate('/signin')}
              className="btn-primary text-lg px-8 py-4"
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(168, 85, 247, 0.5)" }}
              whileTap={{ scale: 0.95 }}
            >
              <Users className="inline-block mr-2" size={20} />
              Sign in as User
            </motion.button>
            
            <motion.button
              onClick={() => navigate('/signin')}
              className="btn-secondary text-lg px-8 py-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MapPin className="inline-block mr-2" size={20} />
              Sign in as Poster
            </motion.button>
            
            <motion.button
              onClick={() => navigate('/signin')}
              className="btn-secondary text-lg px-8 py-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Clock className="inline-block mr-2" size={20} />
              Admin Login
            </motion.button>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid md:grid-cols-3 gap-8 mt-20"
          >
            <motion.div
              className="card text-center"
              whileHover={{ y: -10 }}
            >
              <MapPin className="w-12 h-12 mx-auto mb-4 text-purple-400" />
              <h3 className="text-xl font-semibold mb-2">Find Nearby Shops</h3>
              <p className="text-midnight-300">
                Discover shops, restaurants, and pharmacies open in your area
              </p>
            </motion.div>

            <motion.div
              className="card text-center"
              whileHover={{ y: -10 }}
            >
              <Clock className="w-12 h-12 mx-auto mb-4 text-purple-400" />
              <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
              <p className="text-midnight-300">
                Get live information about opening hours and availability
              </p>
            </motion.div>

            <motion.div
              className="card text-center"
              whileHover={{ y: -10 }}
            >
              <Users className="w-12 h-12 mx-auto mb-4 text-purple-400" />
              <h3 className="text-xl font-semibold mb-2">Community Driven</h3>
              <p className="text-midnight-300">
                Shop owners update their status, keeping information current
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* How NightMate Works Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="py-20"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 glow-text">
              How NightMate Works
            </h2>
            <p className="text-xl text-midnight-300 max-w-3xl mx-auto">
              Discover how our platform connects night owls with essential services in just a few simple steps
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* For Posters (Shop Owners) */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="card"
            >
              <div className="text-center mb-8">
                <motion.div
                  className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Store className="w-10 h-10 text-purple-400" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-2 glow-text">For Shop Owners</h3>
                <p className="text-midnight-300">Get your business discovered by night-time customers</p>
              </div>

              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-400 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Sign up as a Poster</h4>
                    <p className="text-midnight-300 text-sm">Create your shop owner account in minutes</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-400 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Submit shop details</h4>
                    <p className="text-midnight-300 text-sm">Add your location, category, and operating hours</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-400 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Get discovered!</h4>
                    <p className="text-midnight-300 text-sm">Start receiving customers looking for your services</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* For Users (Bachelors/Students) */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="card"
            >
              <div className="text-center mb-8">
                <motion.div
                  className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Users className="w-10 h-10 text-blue-400" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-2 glow-text">For Night Owls</h3>
                <p className="text-midnight-300">Find essential services when you need them most</p>
              </div>

              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-400 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Sign up or continue as guest</h4>
                    <p className="text-midnight-300 text-sm">Quick access with or without an account</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-400 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Browse real-time listings</h4>
                    <p className="text-midnight-300 text-sm">See all open shops near your location</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-400 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Navigate easily</h4>
                    <p className="text-midnight-300 text-sm">Get directions and find what you need</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-center mt-12"
          >
            <motion.button
              onClick={() => navigate('/signin')}
              className="btn-primary text-lg px-8 py-4"
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(168, 85, 247, 0.5)" }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Now
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
};

export default LandingPage; 