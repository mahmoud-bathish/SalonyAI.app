'use client';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      ></div>
      
      <div className="relative min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-2xl mx-auto">
          {/* Logo/Brand Section */}
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg overflow-hidden">
              <img 
                src="/SalonyAI-Icon.png" 
                alt="SalonyAI Logo" 
                className="w-12 h-12 object-contain"
              />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              SalonyAI
            </h1>
            <p className="text-xl text-gray-600 font-medium">
              AI-Powered Booking & E-commerce for Salons & Barbershops
            </p>
          </div>

          {/* Main CTA Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Ready to Transform Your Salon or Barbershop?
            </h2>
            <p className="text-gray-600 mb-6 text-lg">
              Create a mini website for bookings and product ordering, plus automate everything with AI. 
              Perfect for salon and barbershop owners who want to grow their business online.
            </p>
            
            <div className="space-y-4">
              <button 
                onClick={() => window.open('https://salonyai.com', '_blank')}
                className="w-full cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                🚀 Start Building Now
              </button>
              
              <p className="text-sm text-gray-500">
                Join salon and barbershop owners who are already growing their business with SalonyAI
              </p>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Smart Booking</h3>
              <p className="text-sm text-gray-600">AI-powered appointment scheduling that works 24/7</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Product Store</h3>
              <p className="text-sm text-gray-600">Sell your products online with integrated e-commerce</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">AI Automation</h3>
              <p className="text-sm text-gray-600">Automate bookings and customer interactions with AI</p>
            </div>
          </div>

          {/* Existing Users Section */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3">Already have a website?</h3>
            <p className="text-gray-600 mb-4">
              Visit your specific website by adding your slug to the URL
            </p>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-700 mb-2 font-medium">URL Format:</p>
              <code className="bg-gray-100 text-blue-600 px-3 py-2 rounded-lg text-sm font-mono block">
                {typeof window !== 'undefined' ? window.location.origin : 'https://app.salonyai.com'}/your-slug
              </code>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Replace "your-slug" with your website identifier
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
