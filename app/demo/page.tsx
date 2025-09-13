import { LanguageDemo } from '@/components/language-demo'
import { Navigation } from '@/components/navigation'

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Language Toggle Demo</h1>
          <p className="text-xl text-muted-foreground">
            Experience the seamless language switching functionality
          </p>
        </div>
        
        <LanguageDemo />
      </div>
    </div>
  )
}
