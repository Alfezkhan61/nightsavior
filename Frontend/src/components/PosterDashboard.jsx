import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Store, MapPin, Clock, Tag, CheckCircle } from 'lucide-react';
import { getAuthToken, getUserData } from '../utils/auth';

const PosterDashboard = () => {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    shopName: '',
    address: '',
    city: '',
    category: 'food',
    openingTime: '',
    closingTime: '',
    description: '',
    phone: '',
    latitude: '',
    longitude: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Please login first');
      }

      const userData = getUserData();
      if (!userData || userData.role !== 'poster') {
        throw new Error('Only poster accounts can create shops');
      }

      // Prepare data according to backend model
      const shopData = {
        name: formData.shopName,
        category: formData.category,
        location: {
          address: formData.address,
          city: formData.city,
          coordinates: {
            lat: parseFloat(formData.latitude) || 40.7128,
            lng: parseFloat(formData.longitude) || -74.0060
          }
        },
        openTime: formData.openingTime,
        closeTime: formData.closingTime,
        description: formData.description,
        phone: formData.phone
      };

      const response = await fetch('http://localhost:5002/api/shops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(shopData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create shop');
      }

      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          shopName: '',
          address: '',
          city: '',
          category: 'food',
          openingTime: '',
          closingTime: '',
          description: '',
          phone: '',
          latitude: '',
          longitude: ''
        });
      }, 3000);

    } catch (error) {
      console.error('Shop creation error:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    { value: 'food', label: 'Food & Restaurant' },
    { value: 'medical', label: 'Medical & Pharmacy' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className="min-h-screen bg-night-gradient relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {Array.from({ length: 15 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
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
            className="flex items-center text-midnight-300 hover:text-white transition-colors"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Home
          </motion.button>
          <h1 className="text-2xl font-bold glow-text">Shop Owner Dashboard</h1>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card"
          >
            <div className="text-center mb-8">
              <Store className="w-16 h-16 mx-auto mb-4 text-purple-400" />
              <h2 className="text-2xl font-bold mb-2">Update Your Shop Information</h2>
              <p className="text-midnight-300">
                Keep your customers informed about your availability
              </p>
            </div>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-400" />
                <h3 className="text-xl font-semibold mb-2">Shop Published Successfully!</h3>
                <p className="text-midnight-300">
                  Your shop is now live and visible to all users immediately.
                </p>
              </motion.div>
            ) : (
              <motion.form
                onSubmit={handleSubmit}
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {error && (
                  <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-midnight-300 mb-2">
                      Shop Name *
                    </label>
                    <div className="relative">
                      <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-midnight-400" size={20} />
                      <input
                        type="text"
                        name="shopName"
                        value={formData.shopName}
                        onChange={handleInputChange}
                        className="input-field w-full pl-10"
                        placeholder="Enter shop name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-midnight-300 mb-2">
                      Category *
                    </label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-midnight-400" size={20} />
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="input-field w-full pl-10"
                        required
                      >
                        {categories.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-midnight-300 mb-2">
                    Shop Address *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-midnight-400" size={20} />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="input-field w-full pl-10"
                      placeholder="Enter shop address"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-midnight-300 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="input-field w-full"
                      placeholder="Enter city"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-midnight-300 mb-2">
                      Latitude (optional)
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleInputChange}
                      className="input-field w-full"
                      placeholder="40.7128"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-midnight-300 mb-2">
                      Longitude (optional)
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleInputChange}
                      className="input-field w-full"
                      placeholder="-74.0060"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-midnight-300 mb-2">
                      Opening Time *
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-midnight-400" size={20} />
                      <input
                        type="time"
                        name="openingTime"
                        value={formData.openingTime}
                        onChange={handleInputChange}
                        className="input-field w-full pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-midnight-300 mb-2">
                      Closing Time *
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-midnight-400" size={20} />
                      <input
                        type="time"
                        name="closingTime"
                        value={formData.closingTime}
                        onChange={handleInputChange}
                        className="input-field w-full pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-midnight-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input-field w-full"
                    placeholder="+1234567890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-midnight-300 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="input-field w-full h-24 resize-none"
                    placeholder="Describe your shop, special services, or any important information..."
                    rows={4}
                  />
                </div>

                <motion.button
                  type="submit"
                  className="btn-primary w-full"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                >
                  {isLoading ? 'Publishing...' : 'Publish Shop'}
                </motion.button>
              </motion.form>
            )}
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid md:grid-cols-3 gap-6 mt-8"
          >
            <motion.div
              className="card text-center"
              whileHover={{ y: -5 }}
            >
              <div className="text-2xl font-bold text-purple-400 mb-2">24/7</div>
              <div className="text-sm text-midnight-300">Always Available</div>
            </motion.div>

            <motion.div
              className="card text-center"
              whileHover={{ y: -5 }}
            >
              <div className="text-2xl font-bold text-purple-400 mb-2">150+</div>
              <div className="text-sm text-midnight-300">Active Users</div>
            </motion.div>

            <motion.div
              className="card text-center"
              whileHover={{ y: -5 }}
            >
              <div className="text-2xl font-bold text-purple-400 mb-2">50+</div>
              <div className="text-sm text-midnight-300">Shops Listed</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PosterDashboard; 