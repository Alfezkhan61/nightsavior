import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Users, Store, AlertTriangle, Settings, BarChart3, Activity } from 'lucide-react';
import OwlThemeToggle from './OwlThemeToggle';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: 'Total Shops',
      value: '156',
      change: '+12%',
      icon: Store,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
    },
    {
      title: 'Active Users',
      value: '2,847',
      change: '+8%',
      icon: Users,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
    },
    {
      title: 'Reported Issues',
      value: '23',
      change: '-5%',
      icon: AlertTriangle,
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
    },
    {
      title: 'Platform Health',
      value: '98.5%',
      change: '+0.2%',
      icon: Activity,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      action: 'New shop registered',
      shop: 'Night Owl Diner',
      time: '2 minutes ago',
      type: 'success',
    },
    {
      id: 2,
      action: 'Issue reported',
      shop: '24/7 Pharmacy',
      time: '15 minutes ago',
      type: 'warning',
    },
    {
      id: 3,
      action: 'Shop updated hours',
      shop: 'Late Night Pizza',
      time: '1 hour ago',
      type: 'info',
    },
    {
      id: 4,
      action: 'User feedback received',
      shop: 'Midnight Convenience',
      time: '2 hours ago',
      type: 'success',
    },
  ];

  const getActivityColor = (type) => {
    switch (type) {
      case 'success':
        return 'text-green-400';
      case 'warning':
        return 'text-yellow-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-blue-400';
    }
  };

  return (
    <div className="min-h-screen bg-night-gradient relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {Array.from({ length: 15 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.6, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <motion.button
            onClick={() => navigate('/')}
            className="flex items-center dark:text-midnight-300 dark:hover:text-white light:text-gray-600 light:hover:text-gray-900 transition-colors"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Home
          </motion.button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-purple-400" />
              <h1 className="text-2xl font-bold glow-text">Admin Dashboard</h1>
            </div>
            <OwlThemeToggle />
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="card"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-midnight-300 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className={`text-xs ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="card"
          >
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-semibold">Recent Activities</h2>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg bg-midnight-800/50"
                >
                  <div className={`w-2 h-2 rounded-full ${getActivityColor(activity.type)}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-midnight-300">{activity.shop}</p>
                  </div>
                  <span className="text-xs text-midnight-400">{activity.time}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="card"
          >
            <div className="flex items-center gap-2 mb-6">
              <Settings className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-semibold">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                className="p-4 rounded-lg bg-midnight-800/50 border border-midnight-600 hover:border-purple-500 transition-all duration-300 text-left"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Store className="w-6 h-6 text-blue-400 mb-2" />
                <h3 className="font-medium mb-1">Manage Shops</h3>
                <p className="text-xs text-midnight-300">Review and approve shop listings</p>
              </motion.button>

              <motion.button
                className="p-4 rounded-lg bg-midnight-800/50 border border-midnight-600 hover:border-purple-500 transition-all duration-300 text-left"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Users className="w-6 h-6 text-green-400 mb-2" />
                <h3 className="font-medium mb-1">User Management</h3>
                <p className="text-xs text-midnight-300">Manage user accounts and permissions</p>
              </motion.button>

              <motion.button
                className="p-4 rounded-lg bg-midnight-800/50 border border-midnight-600 hover:border-purple-500 transition-all duration-300 text-left"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <AlertTriangle className="w-6 h-6 text-red-400 mb-2" />
                <h3 className="font-medium mb-1">Issue Reports</h3>
                <p className="text-xs text-midnight-300">Review reported issues and complaints</p>
              </motion.button>

              <motion.button
                className="p-4 rounded-lg bg-midnight-800/50 border border-midnight-600 hover:border-purple-500 transition-all duration-300 text-left"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <BarChart3 className="w-6 h-6 text-purple-400 mb-2" />
                <h3 className="font-medium mb-1">Analytics</h3>
                <p className="text-xs text-midnight-300">View platform analytics and insights</p>
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="card mt-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-green-400" />
            <h2 className="text-lg font-semibold">System Status</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              </div>
              <h3 className="font-medium mb-1">API Server</h3>
              <p className="text-sm text-green-400">Online</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              </div>
              <h3 className="font-medium mb-1">Database</h3>
              <p className="text-sm text-green-400">Online</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              </div>
              <h3 className="font-medium mb-1">CDN</h3>
              <p className="text-sm text-green-400">Online</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard; 