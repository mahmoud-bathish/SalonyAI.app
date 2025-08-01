export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center max-w-md mx-auto p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          SalonyAI
        </h1>
        <p className="text-gray-600 mb-8">
          Welcome to SalonyAI. Please visit your specific website by adding your slug to the URL.
        </p>
        <div className="bg-gray-100 p-4 rounded-lg">
          <p className="text-sm text-gray-700 mb-2">URL Format:</p>
          <code className="bg-white text-blue-600 px-3 py-1 rounded text-sm">
            {typeof window !== 'undefined' ? window.location.origin : 'https://app.salonyai.com'}/your-slug
          </code>
        </div>
        <p className="text-xs text-gray-500 mt-6">
          Replace "your-slug" with your website identifier
        </p>
      </div>
    </div>
  );
}
