import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, MapPin, Shield, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import OwlThemeToggle from './OwlThemeToggle';
import { apiRequest, setAuthToken, setUserData } from '../utils/auth';

const SignInPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('user');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSignUp = async () => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields before signing up');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Make API call to create account
      const response = await fetch('http://localhost:5002/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.email.split('@')[0], // Use email prefix as default name
          email: formData.email,
          password: formData.password,
          role: activeTab === 'admin' ? 'admin' : activeTab, // Set role based on active tab
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store auth token and user data
        setAuthToken(data.data.token);
        setUserData(data.data.user);

        // Navigate based on active tab
        switch (activeTab) {
          case 'poster':
            navigate('/poster');
            break;
          case 'admin':
            navigate('/admin');
            break;
          case 'user':
          default:
            navigate('/user');
            break;
        }
      } else {
        setError(data.message || 'Sign up failed');
      }
    } catch (error) {
      console.error('Sign up error:', error);
      setError('Failed to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Make API call to backend
      const response = await fetch('http://localhost:5002/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store auth token and user data
        setAuthToken(data.data.token);
        setUserData(data.data.user);

        // Navigate based on user role and activeTab
        const userRole = data.data.user.role;
        
        // Validate if user has the right role for the selected tab
        if (activeTab === 'admin' && userRole !== 'admin') {
          setError('You do not have admin privileges');
          setLoading(false);
          return;
        }
        
        if (activeTab === 'poster' && userRole !== 'poster' && userRole !== 'admin') {
          setError('You do not have poster privileges');
          setLoading(false);
          return;
        }

        // Navigate based on active tab or user role
        switch (activeTab) {
          case 'poster':
            navigate('/poster');
            break;
          case 'admin':
            navigate('/admin');
            break;
          case 'user':
          default:
            navigate('/user');
            break;
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'user', label: 'User', icon: User, description: 'Find shops near you' },
    { id: 'poster', label: 'Poster', icon: MapPin, description: 'Manage your shop' },
    { id: 'admin', label: 'Admin', icon: Shield, description: 'Platform management' },
  ];

  return (
    <div className="min-h-screen bg-night-gradient relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header with Back Button and Theme Toggle */}
        <div className="flex justify-between items-center mb-8">
          <motion.button
            onClick={() => navigate('/')}
            className="flex items-center dark:text-midnight-300 dark:hover:text-white light:text-gray-600 light:hover:text-gray-900 transition-colors"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Home
          </motion.button>
          
          <OwlThemeToggle />
        </div>

        <div className="max-w-md mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold glow-text mb-2">Welcome Back</h1>
            <p className="text-midnight-300">Sign in to your NightMate account</p>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-midnight-900/50 backdrop-blur-sm rounded-lg p-1 mb-8"
          >
            <div className="flex">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex flex-col items-center py-3 px-4 rounded-md transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-purple-600 to-night-600 text-white shadow-lg'
                        : 'text-midnight-300 hover:text-white'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon size={20} className="mb-1" />
                    <span className="text-sm font-medium">{tab.label}</span>
                    <span className="text-xs opacity-75">{tab.description}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Login Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="card"
          >
            <AnimatePresence mode="wait">
              <motion.form
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-midnight-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-midnight-400" size={20} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input-field w-full pl-10"
                      placeholder="Enter your email"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-midnight-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-midnight-400" size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="input-field w-full pl-10 pr-10"
                      placeholder="Enter your password"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-midnight-400 hover:text-white"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-300 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  className={`btn-primary w-full ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  disabled={loading}
                >
                  {loading ? 'Signing In...' : `Sign In as ${tabs.find(tab => tab.id === activeTab)?.label}`}
                </motion.button>
              </motion.form>
            </AnimatePresence>

            <div className="mt-6 text-center">
              <p className="text-sm text-midnight-400">
                Don't have an account?{' '}
                <button 
                  onClick={() => handleSignUp()}
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                  disabled={loading}
                >
                  Sign up here
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage; 