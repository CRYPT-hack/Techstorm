import { LiveMap } from '@/components/live-map'
import { Navigation } from '@/components/navigation'
import { useLanguage } from '@/lib/language-context'

export default function DemoTrackingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Live Bus Tracking Demo</h1>
          <p className="text-xl text-muted-foreground">
            Experience our realistic bus tracking simulation with animated movements, real-time updates, and detailed bus information.
          </p>
        </div>
        
        <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h2 className="text-xl font-semibold mb-3 text-blue-900">🚌 Features Demonstrated:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Real-time bus movement simulation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Animated bus icons with status indicators</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Live passenger count updates</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>Fuel level monitoring</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>Delay and ETA calculations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              <span>Driver information and ratings</span>
            </div>
          </div>
        </div>
        
        <LiveMap />
        
        <div className="mt-12 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">🎯 How It Works:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
            <div>
              <h4 className="font-medium mb-2">Realistic Simulation:</h4>
              <ul className="space-y-1">
                <li>• Buses follow predefined routes with realistic coordinates</li>
                <li>• Movement is simulated with proper speed and timing</li>
                <li>• Status changes (on-time, delayed, early) occur naturally</li>
                <li>• Passenger counts fluctuate realistically</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Interactive Features:</h4>
              <ul className="space-y-1">
                <li>• Click on any bus to see detailed information</li>
                <li>• Pause/resume simulation to control updates</li>
                <li>• View real-time fuel levels and capacity</li>
                <li>• Track driver information and performance</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
