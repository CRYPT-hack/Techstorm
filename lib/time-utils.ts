// Utility functions for time formatting and calculations

export function getCurrentTime(): Date {
  return new Date()
}

export function addMinutesToCurrentTime(minutes: number): string {
  const now = new Date()
  const futureTime = new Date(now.getTime() + minutes * 60000)
  return formatTime(futureTime)
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  })
}

export function formatTimeWithoutAMPM(date: Date): string {
  return date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  })
}

// Convert minutes from now to actual time
export function minutesToActualTime(minutes: number): string {
  return addMinutesToCurrentTime(minutes)
}

// Generate realistic bus arrival times
export function generateBusArrivalTimes(baseMinutes: number[]): string[] {
  return baseMinutes.map(minutes => addMinutesToCurrentTime(minutes))
}

// Get time difference in minutes between two times
export function getTimeDifferenceInMinutes(time1: string, time2: string): number {
  const [hours1, minutes1] = time1.split(':').map(Number)
  const [hours2, minutes2] = time2.split(':').map(Number)
  
  const totalMinutes1 = hours1 * 60 + minutes1
  const totalMinutes2 = hours2 * 60 + minutes2
  
  return Math.abs(totalMinutes2 - totalMinutes1)
}
