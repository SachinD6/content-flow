import Link from 'next/link'

export default function NotFound() {
  return (
    <html lang="en">
      <body className="bg-[#0b0c10] min-h-screen flex items-center justify-center">
        <div className="text-center px-4">
          <div className="mb-8">
            <span className="text-8xl">🔍</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Page Not Found
          </h1>
          <p className="text-zinc-400 text-lg mb-8 max-w-md mx-auto">
            Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-[#6154f0] text-white font-medium rounded-lg hover:bg-[#5841e8] transition-colors"
            >
              Go to Homepage
            </Link>
            <Link
              href="/hi"
              className="px-6 py-3 bg-[#121319] text-white font-medium rounded-lg border border-white/10 hover:bg-[#1a1a1a] transition-colors"
            >
              हिंदी में देखें
            </Link>
          </div>
        </div>
      </body>
    </html>
  )
}