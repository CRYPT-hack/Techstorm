# 🚌 Live Bus Tracking Simulation

A comprehensive frontend-only bus tracking system with realistic movement simulation, animated UI, and detailed bus information.

## ✨ Features

### 🎯 Core Functionality
- **Real-time Bus Movement**: Buses move along predefined routes with realistic coordinates
- **Animated UI**: Smooth animations and transitions for bus movements
- **Interactive Map**: Click on buses to view detailed information
- **Live Updates**: Real-time updates every 3 seconds with realistic data changes
- **Pause/Resume**: Control the simulation with pause/resume functionality

### 🚌 Bus Information
- **Driver Details**: Name, experience, rating, and contact information
- **Vehicle Status**: Fuel level, passenger count, capacity utilization
- **Route Information**: Current route, next stop, ETA calculations
- **Performance Metrics**: Speed, delay status, on-time performance

### 🎨 Visual Features
- **Custom Bus Icons**: Color-coded buses with route identification
- **Status Indicators**: Visual status badges (on-time, delayed, early)
- **Progress Bars**: Fuel level and passenger capacity visualization
- **Route Lines**: Animated route paths on the map
- **Responsive Design**: Works on all screen sizes

## 🏗️ Architecture

### File Structure
```
lib/
├── bus-simulation.ts     # Core simulation logic and data
├── bus-data.ts          # Comprehensive bus and route data
└── language-context.tsx # Language management

components/
├── live-map.tsx         # Main live tracking component
└── language-toggle.tsx  # Language switching

app/
├── tracking/
│   └── page.tsx         # Main tracking page
└── demo-tracking/
    └── page.tsx         # Demo showcase page
```

### Data Models
```typescript
interface Bus {
  id: string
  number: string
  routeId: string
  driver: string
  currentPosition: { lat: number; lng: number }
  currentStopIndex: number
  status: 'on-time' | 'delayed' | 'early'
  delay: number
  passengers: number
  capacity: number
  fuel: number
  speed: number
  nextStop: BusStop
  eta: number
  isMoving: boolean
  color: string
}
```

## 🚀 Implementation Details

### Bus Movement Simulation
- **Route Following**: Buses follow predefined routes with realistic GPS coordinates
- **Speed Simulation**: Variable speeds (15-55 km/h) based on traffic conditions
- **Stop Management**: Automatic stop detection and next stop calculation
- **Status Changes**: Dynamic status updates (on-time, delayed, early)

### Realistic Data Updates
- **Passenger Counts**: Fluctuate realistically as passengers board/alight
- **Fuel Consumption**: Gradual fuel level decrease during operation
- **Delay Simulation**: Random delays and early arrivals
- **ETA Calculation**: Dynamic ETA updates based on current position

### Animation System
- **CSS Animations**: Smooth bounce and slide animations for moving buses
- **Transition Effects**: Smooth transitions for status changes
- **Visual Feedback**: Hover effects and selection indicators

## 🎮 Usage

### Basic Usage
```tsx
import { LiveMap } from '@/components/live-map'

function TrackingPage() {
  return (
    <div>
      <LiveMap />
    </div>
  )
}
```

### Customization
```tsx
// Modify simulation speed
const interval = setInterval(() => {
  setBuses(prevBuses => updateAllBuses(prevBuses))
}, 5000) // Update every 5 seconds instead of 3

// Add custom bus data
const customBuses = [
  {
    id: 'bus-custom',
    number: 'DL-01-B-9999',
    routeId: 'route-1',
    // ... other properties
  }
]
```

## 🛠️ Configuration

### Route Configuration
Routes are defined in `lib/bus-simulation.ts`:
```typescript
export const routes: BusRoute[] = [
  {
    id: 'route-1',
    name: 'City Center - University',
    color: '#2832C2',
    stops: [
      { id: 'stop-1', name: 'City Center', lat: 28.6139, lng: 77.2090 },
      // ... more stops
    ]
  }
]
```

### Bus Configuration
Initial bus data is configured in the same file:
```typescript
export const initialBuses: Bus[] = [
  {
    id: 'bus-1',
    number: 'DL-01-B-1001',
    routeId: 'route-1',
    driver: 'Rajesh Kumar',
    // ... other properties
  }
]
```

## 🎨 Styling

### CSS Animations
Custom animations are defined in `app/globals.css`:
```css
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0) translateX(-50%) translateY(-50%);
  }
  40% {
    transform: translateY(-10px) translateX(-50%) translateY(-50%);
  }
  60% {
    transform: translateY(-5px) translateX(-50%) translateY(-50%);
  }
}
```

### Color Scheme
- **Route 1**: Lapis Blue (#2832C2)
- **Route 2**: Emerald Green (#10B981)
- **Route 3**: Amber Orange (#F59E0B)

## 🌐 Internationalization

The system supports multiple languages through the language context:
- **English**: Default language
- **Hindi**: Full translation support
- **Extensible**: Easy to add more languages

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Responsive grid layouts
- **Desktop**: Full-featured desktop experience
- **Touch Friendly**: Large touch targets for mobile

## 🔧 Development

### Adding New Routes
1. Add route definition to `routes` array
2. Add corresponding bus stops
3. Create initial bus data for the route
4. Update color scheme if needed

### Adding New Buses
1. Add bus to `initialBuses` array
2. Assign to existing route or create new route
3. Configure driver information
4. Set initial position and status

### Customizing Simulation
1. Modify `simulateBusMovement` function
2. Adjust update intervals
3. Change movement patterns
4. Update status calculation logic

## 🚀 Performance

- **Optimized Updates**: Efficient state management
- **Smooth Animations**: CSS-based animations for performance
- **Memory Efficient**: Minimal memory footprint
- **Fast Rendering**: Optimized React components

## 🎯 Future Enhancements

- **Real GPS Integration**: Connect to actual GPS devices
- **Push Notifications**: Real-time alerts for bus arrivals
- **Offline Support**: Cache route data for offline viewing
- **Advanced Analytics**: Detailed performance metrics
- **Multi-language Support**: Additional language options
- **Accessibility**: Enhanced accessibility features

## 📄 License

This project is part of the SmartTransit system and follows the same licensing terms.

---

**Built with ❤️ for smart cities and efficient public transportation.**
