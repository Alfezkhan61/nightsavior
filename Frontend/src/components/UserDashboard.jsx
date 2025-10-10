import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Phone, Star, Search, Filter } from 'lucide-react';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchShops = async () => {
    try {
      setLoading(true);
      setError(''); // Clear previous errors
      const response = await fetch('http://localhost:5002/api/shops/open-now');
      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Successfully fetched shops:', data.data.shops);
        setShops(data.data.shops);
        setError(''); // Clear any previous errors
      } else {
        throw new Error(data.message || 'Failed to fetch shops');
      }
    } catch (error) {
      console.error('❌ Fetch shops error:', error);
      setError(`Connection error: ${error.message}. Using demo data.`);
      // Only use dummy data if there's a real connection error
      // Don't override real data with dummy data
      if (shops.length === 0) {
        setShops([
          {
            id: 'demo-1',
            name: "Demo Shop (Backend Offline)",
            category: "food",
            location: { address: "Demo Location" },
            distance: "N/A",
            rating: 0,
            isOpenNow: false,
            openTime: "N/A",
            closeTime: "N/A",
            phone: "N/A"
          }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  // Use real shops from API, don't fallback to dummy data unless there's an error
  const allShops = shops;

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'food', label: 'Food & Restaurant' },
    { value: 'medical', label: 'Medical & Pharmacy' },
    { value: 'other', label: 'Other' },
  ];

  const filteredShops = allShops.filter(shop => {
    const matchesSearch = shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (shop.location.address || shop.location).toLowerCase().includes(searchTerm.toLowerCase());
    // Fix category matching - backend returns 'food', 'medical', 'other'
    const matchesCategory = selectedCategory === 'all' || 
                          shop.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-midnight-400"}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-night-gradient relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }, (_, i) => (
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
              duration: 3,
              repeat: Infinity,
              delay: Math.random() * 2,
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
          <h1 className="text-2xl font-bold glow-text">Find Open Shops</h1>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="card mb-8"
        >
          {error && shops.length === 0 && (
            <div className="mb-4 bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
              ❌ {error}
            </div>
          )}
          
          {error && shops.length > 0 && (
            <div className="mb-4 bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg">
              ✅ Showing {shops.length} shops from database
            </div>
          )}
          
          {!error && shops.length > 0 && (
            <div className="mb-4 bg-green-500/20 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg">
              ✅ Found {shops.length} open shops nearby
            </div>
          )}
          
          {loading && (
            <div className="mb-4 bg-blue-500/20 border border-blue-500/30 text-blue-400 px-4 py-3 rounded-lg">
              🔄 Loading shops...
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-midnight-400" size={20} />
              <input
                type="text"
                placeholder="Search shops or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field w-full pl-10"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-midnight-400" size={20} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field w-full pl-10"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Map Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-1"
          >
            <div className="card h-96">
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MapPin className="w-16 h-16 mx-auto mb-4 text-purple-400" />
                  <h3 className="text-lg font-semibold mb-2">Interactive Map</h3>
                  <p className="text-midnight-300 text-sm">
                    Map view will be available here showing nearby shops
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Shop List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="space-y-4">
              {filteredShops.map((shop, index) => (
                <motion.div
                  key={shop.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className="card hover:shadow-2xl transition-all duration-300"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{shop.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          (shop.isOpenNow !== undefined ? shop.isOpenNow : shop.isOpen)
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {(shop.isOpenNow !== undefined ? shop.isOpenNow : shop.isOpen) ? 'Open' : 'Closed'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-midnight-300 mb-3">
                        <span className="flex items-center gap-1">
                          <MapPin size={16} />
                          {shop.location?.address || shop.location?.city || shop.location || 'Location not specified'}
                        </span>
                        {shop.distance && <span>{shop.distance}</span>}
                        <span className="flex items-center gap-1">
                          <Clock size={16} />
                          {shop.openTime && shop.closeTime ? 
                            `${shop.openTime} - ${shop.closeTime}` : 
                            'Hours not specified'
                          }
                        </span>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          {renderStars(shop.rating || 0)}
                          <span className="text-sm text-midnight-300 ml-1">
                            ({shop.rating || 'No rating'})
                          </span>
                        </div>
                        <span className="text-sm text-midnight-300 capitalize">
                          {shop.category || 'Uncategorized'}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <motion.button
                        className="btn-primary text-sm px-4 py-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        View Details
                      </motion.button>
                      <div className="flex items-center gap-1 text-sm text-midnight-300">
                        <Phone size={14} />
                        {shop.phone || 'No phone'}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredShops.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="card text-center py-12"
              >
                <Search className="w-16 h-16 mx-auto mb-4 text-midnight-400" />
                <h3 className="text-lg font-semibold mb-2">No shops found</h3>
                <p className="text-midnight-300">
                  Try adjusting your search criteria or location
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard; 