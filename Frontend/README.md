# NightMate - Late Night Shop Finder

A beautiful, responsive web application for finding open shops, restaurants, and essential services during late hours. Built with React, TypeScript, Tailwind CSS, and Framer Motion.

## 🌙 Features

### Landing Page
- **Animated Hero Section** with twinkling stars and floating moon
- **Modern Night Theme** with deep blues, purples, and glowing effects
- **Responsive Design** that works on all devices
- **Call-to-Action Buttons** for different user types

### Sign-In System
- **Three Login Options**: User, Poster (Shop Owner), and Admin
- **Animated Tab Transitions** with smooth UI animations
- **Consistent Night Theme** throughout the interface

### User Dashboard
- **Card-based Shop List** with dummy data for demonstration
- **Search and Filter** functionality
- **Map Placeholder** for future integration
- **Responsive Layout** with shop details and ratings

### Poster Dashboard
- **Animated Form** for shop owners to update information
- **Multiple Categories**: Food, Medical, Convenience, Others
- **Real-time Validation** and success feedback
- **Statistics Cards** showing platform metrics

### Admin Dashboard
- **Comprehensive Statistics** with animated cards
- **Recent Activities** feed
- **Quick Action Buttons** for platform management
- **System Status** indicators

## 🎨 Design Features

- **Night-themed Aesthetic** with deep blues and purples
- **Glowing Effects** and subtle animations
- **Twinkling Stars** background animation
- **Smooth Transitions** using Framer Motion
- **Modern Typography** with Inter font
- **Responsive Grid Layouts**
- **Hover Animations** and micro-interactions

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **Lucide React** for icons
- **PostCSS** and **Autoprefixer**

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Navigate to the Frontend directory:**
   ```bash
   cd Frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open your browser and visit:**
   ```
   http://localhost:3000
   ```

## 📱 Pages Overview

### `/` - Landing Page
- Animated hero section with stars and moon
- Feature highlights
- Call-to-action buttons
- Footer with social links

### `/signin` - Sign-In Page
- Three-tab login system
- Animated form transitions
- Email and password fields
- Responsive design

### `/user` - User Dashboard
- Search and filter functionality
- Shop cards with ratings
- Map placeholder
- Responsive grid layout

### `/poster` - Poster Dashboard
- Shop information form
- Category selection
- Opening/closing time inputs
- Success feedback animation

### `/admin` - Admin Dashboard
- Statistics cards
- Recent activities feed
- Quick action buttons
- System status indicators

## 🎯 Key Features

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimized
- Flexible grid systems
- Touch-friendly interactions

### Animations
- **Framer Motion** for smooth transitions
- **CSS Keyframes** for twinkling stars
- **Hover Effects** on buttons and cards
- **Loading States** and feedback animations

### Accessibility
- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly
- High contrast ratios

## 🎨 Customization

### Colors
The app uses a custom color palette defined in `tailwind.config.js`:
- `night-*` - Primary blues
- `purple-*` - Accent colors
- `midnight-*` - Dark theme colors

### Animations
Custom animations are defined in the Tailwind config:
- `twinkle` - Star animation
- `float` - Moon floating
- `glow` - Button glow effects
- `slide-up` - Content entrance

## 📦 Project Structure

```
Frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── LandingPage.tsx
│   │   ├── SignInPage.tsx
│   │   ├── UserDashboard.tsx
│   │   ├── PosterDashboard.tsx
│   │   ├── AdminDashboard.tsx
│   │   └── Footer.tsx
│   ├── App.tsx
│   ├── index.tsx
│   └── index.css
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## 🔧 Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## 🌟 Future Enhancements

- **Real-time Data Integration** with backend APIs
- **Interactive Maps** using Google Maps or Mapbox
- **Push Notifications** for shop updates
- **User Reviews and Ratings** system
- **Advanced Search Filters** and geolocation
- **Dark/Light Theme Toggle**
- **PWA Features** for mobile app-like experience

## 📄 License

This project is created for demonstration purposes. Feel free to use and modify as needed.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**NightMate** - Your trusted companion for finding open shops, even at midnight! 🌙✨ 