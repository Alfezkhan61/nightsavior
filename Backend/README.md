# NightMate Backend API

A complete backend API for NightMate - a late-night shop and food availability finder platform.

## 🚀 Features

- **User Authentication**: JWT-based authentication with role-based access
- **Shop Management**: CRUD operations for shops with approval system
- **Real-time Filtering**: Get currently open shops based on server time
- **Admin Dashboard**: Complete admin panel for managing users, shops, and reports
- **Reporting System**: Users can report invalid or inappropriate shop listings
- **Input Validation**: Comprehensive validation using express-validator
- **Error Handling**: Centralized error handling with proper HTTP status codes

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **morgan** - HTTP request logger

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd NightMate/Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `config.env` and update with your values:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/nightmate
   JWT_SECRET=your_super_secure_jwt_secret_here
   JWT_EXPIRE=7d
   ```

4. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 📚 API Documentation

### Authentication Endpoints

#### `POST /api/auth/signup`
Register a new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user" // optional: user, poster, admin
}
```

#### `POST /api/auth/login`
Login user
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### `GET /api/auth/me`
Get current user profile (requires authentication)

#### `PUT /api/auth/profile`
Update user profile (requires authentication)

### Shop Endpoints

#### `GET /api/shops/open-now`
Get currently open shops
```
Query Parameters:
- category: food, medical, other
- city: city name
- limit: number of results (default: 50)
- page: page number (default: 1)
```

#### `GET /api/shops/:id`
Get shop by ID

#### `POST /api/shops`
Create new shop (requires poster role)
```json
{
  "name": "Late Night Pizza",
  "category": "food",
  "location": {
    "address": "123 Main St",
    "city": "New York",
    "coordinates": {
      "lat": 40.7128,
      "lng": -74.0060
    }
  },
  "openTime": "18:00",
  "closeTime": "02:00",
  "description": "Best pizza in town",
  "phone": "+1234567890"
}
```

#### `PUT /api/shops/:id`
Update shop (requires ownership or admin role)

#### `GET /api/shops/my-shops`
Get user's shops (requires authentication)

### Admin Endpoints

#### `GET /api/admin/dashboard`
Get admin dashboard statistics

#### `GET /api/admin/shops`
Get all shops with filtering
```
Query Parameters:
- status: approved, pending, active, inactive
- category: food, medical, other
- page: page number
- limit: results per page
```

#### `PUT /api/admin/shops/:id/approve`
Approve/reject shop
```json
{
  "isApproved": true
}
```

#### `DELETE /api/admin/shops/:id`
Delete shop

#### `GET /api/admin/users`
Get all users with filtering
```
Query Parameters:
- role: user, poster, admin
- status: active, inactive
- page: page number
- limit: results per page
```

#### `PUT /api/admin/users/:id/toggle-status`
Toggle user active status

### Report Endpoints

#### `POST /api/reports`
Create a report
```json
{
  "shopId": "shop_id_here",
  "reason": "inaccurate_hours",
  "description": "Shop is not open at stated hours"
}
```

#### `GET /api/reports/my-reports`
Get user's reports (requires authentication)

#### `GET /api/reports`
Get all reports (admin only)
```
Query Parameters:
- status: pending, reviewed, resolved, dismissed
- reason: inaccurate_hours, shop_closed, etc.
- page: page number
- limit: results per page
```

#### `PUT /api/reports/:id/status`
Update report status (admin only)
```json
{
  "status": "resolved",
  "adminNotes": "Issue has been resolved"
}
```

## 🔐 Authentication

All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## 👥 User Roles

- **user**: Can view shops, create reports
- **poster**: Can create and manage their own shops
- **admin**: Full access to all features including user and shop management

## 📊 Data Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user, poster, admin),
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date
}
```

### Shop
```javascript
{
  name: String,
  category: String (food, medical, other),
  ownerId: ObjectId (ref: User),
  location: {
    address: String,
    city: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  openTime: String (HH:MM),
  closeTime: String (HH:MM),
  isApproved: Boolean,
  isActive: Boolean,
  description: String,
  phone: String,
  rating: Number,
  reviewCount: Number
}
```

### Report
```javascript
{
  shopId: ObjectId (ref: Shop),
  reporterId: ObjectId (ref: User),
  reason: String,
  description: String,
  status: String (pending, reviewed, resolved, dismissed),
  adminNotes: String,
  reviewedBy: ObjectId (ref: User),
  reviewedAt: Date
}
```

## 🧪 Testing

The API includes comprehensive error handling and validation. Test the endpoints using tools like Postman or curl.

## 🔧 Development

### Project Structure
```
Backend/
├── controllers/     # Business logic
├── middleware/      # Authentication & validation
├── models/         # Database models
├── routes/         # API routes
├── server.js       # Main application file
├── config.env      # Environment variables
└── package.json    # Dependencies
```

### Adding New Features

1. Create model in `models/`
2. Add controller in `controllers/`
3. Create routes in `routes/`
4. Add validation in `middleware/validate.js`
5. Update server.js if needed

## 📝 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support, email support@nightmate.com or create an issue in the repository. 