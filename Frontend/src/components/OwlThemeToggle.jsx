import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

const OwlThemeToggle = () => {
  const { theme, toggleTheme, loading, isDark } = useTheme();

  // Owl animation variants
  const owlVariants = {
    sleeping: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    awake: {
      scale: [1, 1.1, 1],
      rotate: [0, -5, 5, 0],
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    }
  };

  // Eye animation variants
  const eyeVariants = {
    closed: {
      scaleY: 0.1,
      opacity: 0.8,
      transition: { duration: 0.2 }
    },
    open: {
      scaleY: 1,
      opacity: 1,
      transition: { duration: 0.2 }
    },
    blink: {
      scaleY: [1, 0.1, 1],
      transition: {
        duration: 0.3,
        times: [0, 0.5, 1]
      }
    }
  };

  // Hover animations
  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1
      }
    }
  };

  return (
    <motion.button
      className={`
        /* Inline button styles for navigation placement */
        ns-theme-toggle relative
        w-10 h-10 rounded-full
        flex items-center justify-center
        shadow-md border-2
        transition-colors duration-300
        ${isDark 
          ? 'bg-gray-800 border-gray-600 hover:bg-gray-700 shadow-lg' 
          : 'bg-white border-gray-400 hover:bg-gray-50 shadow-md'
        }
      `}
      variants={buttonVariants}
      whileHover="hover"
      whileTap="tap"
      onClick={toggleTheme}
      disabled={loading}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {loading ? (
        /* Loading Spinner */
        <motion.div
          className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      ) : (
        /* Owl Container */
        <motion.div
          className="relative w-8 h-8"
          variants={owlVariants}
          animate={isDark ? "awake" : "sleeping"}
        >
        {/* Owl Body */}
        <div className={`
          w-8 h-8 rounded-full relative
          ${isDark ? 'bg-amber-400' : 'bg-amber-300'}
          transition-colors duration-300
        `}>
          
          {/* Owl Ears */}
          <div className="absolute -top-1 left-1 w-0 h-0 border-l-2 border-r-2 border-b-3 border-transparent border-b-current opacity-60" 
               style={{ color: isDark ? '#f59e0b' : '#d97706' }} />
          <div className="absolute -top-1 right-1 w-0 h-0 border-l-2 border-r-2 border-b-3 border-transparent border-b-current opacity-60"
               style={{ color: isDark ? '#f59e0b' : '#d97706' }} />
          
          {/* Owl Eyes */}
          <div className="absolute top-2 left-1.5 flex space-x-2">
            {/* Left Eye */}
            <motion.div
              className={`
                w-2 h-2 rounded-full
                ${isDark ? 'bg-gray-800' : 'bg-gray-200'}
                transition-colors duration-300
              `}
              variants={eyeVariants}
              animate={isDark ? "open" : "closed"}
            >
              {/* Eye pupil - only visible when awake */}
              {isDark && (
                <motion.div
                  className="w-1 h-1 bg-white rounded-full absolute top-0.5 left-0.5"
                  animate={{
                    x: [0, 1, -1, 0],
                    transition: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                />
              )}
            </motion.div>
            
            {/* Right Eye */}
            <motion.div
              className={`
                w-2 h-2 rounded-full
                ${isDark ? 'bg-gray-800' : 'bg-gray-200'}
                transition-colors duration-300
              `}
              variants={eyeVariants}
              animate={isDark ? "open" : "closed"}
            >
              {/* Eye pupil - only visible when awake */}
              {isDark && (
                <motion.div
                  className="w-1 h-1 bg-white rounded-full absolute top-0.5 left-0.5"
                  animate={{
                    x: [0, -1, 1, 0],
                    transition: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.1
                    }
                  }}
                />
              )}
            </motion.div>
          </div>
          
          {/* Owl Beak */}
          <div className={`
            absolute top-3.5 left-3 w-0 h-0
            border-l-1 border-r-1 border-t-2
            border-transparent
            ${isDark ? 'border-t-orange-600' : 'border-t-orange-500'}
            transition-colors duration-300
          `} />
          
          {/* Sleeping indicator (zzz) - only in light mode */}
          {!isDark && (
            <motion.div
              className="absolute -top-2 -right-1 text-xs opacity-60"
              initial={{ opacity: 0, y: 5 }}
              animate={{ 
                opacity: [0, 0.6, 0],
                y: [5, -2, -8],
                transition: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            >
              <span className="text-gray-400">z</span>
            </motion.div>
          )}
        </div>
      </motion.div>
      )}
    </motion.button>
  );
};

export default OwlThemeToggle;
