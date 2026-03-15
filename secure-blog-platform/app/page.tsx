import Link from 'next/link'

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Secure Blog Platform
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          A production-ready blogging platform with authentication, real-time interactions, 
          and scalable architecture built with Next.js and Prisma.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-medium text-blue-900 mb-2">🚀 Setup Required</h3>
        <p className="text-blue-700 mb-4">
          To use the blog features, you need to set up your PostgreSQL database with Prisma.
        </p>
        <ol className="list-decimal list-inside text-blue-700 space-y-2 mb-6">
          <li><strong>Create a PostgreSQL database</strong> (local or cloud)</li>
          <li><strong>Update DATABASE_URL</strong> in .env.local with your connection string</li>
          <li><strong>Run migrations:</strong> <code className="bg-blue-100 px-2 py-1 rounded">npx prisma migrate deploy</code></li>
          <li><strong>Restart</strong> the development server</li>
        </ol>
        <div className="flex flex-wrap gap-4">
          <Link href="/register" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            Get Started
          </Link>
          <a href="https://www.prisma.io/docs/getting-started/setup-prisma" target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium">
            Prisma Setup Guide
          </a>
          <a href="/PRISMA_SETUP.md" className="inline-block px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium">
            Local Setup Guide
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl mb-2">👤</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Authentication</h3>
          <p className="text-gray-600">Secure user registration and login with Supabase Auth</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl mb-2">📝</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Blog Management</h3>
          <p className="text-gray-600">Create, edit, and publish your blog posts easily</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl mb-2">❤️</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Social Features</h3>
          <p className="text-gray-600">Like and comment on blogs with real-time updates</p>
        </div>
      </div>

      <div className="mt-12 bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Tech Stack</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded p-4 text-center">
            <div className="font-bold text-gray-900">Next.js 16</div>
            <div className="text-sm text-gray-600">Frontend</div>
          </div>
          <div className="bg-white rounded p-4 text-center">
            <div className="font-bold text-gray-900">React 18</div>
            <div className="text-sm text-gray-600">UI Library</div>
          </div>
          <div className="bg-white rounded p-4 text-center">
            <div className="font-bold text-gray-900">TypeScript</div>
            <div className="text-sm text-gray-600">Type Safety</div>
          </div>
          <div className="bg-white rounded p-4 text-center">
            <div className="font-bold text-gray-900">Prisma</div>
            <div className="text-sm text-gray-600">Database ORM</div>
          </div>
          <div className="bg-white rounded p-4 text-center">
            <div className="font-bold text-gray-900">PostgreSQL</div>
            <div className="text-sm text-gray-600">Database</div>
          </div>
          <div className="bg-white rounded p-4 text-center">
            <div className="font-bold text-gray-900">TailwindCSS</div>
            <div className="text-sm text-gray-600">Styling</div>
          </div>
          <div className="bg-white rounded p-4 text-center">
            <div className="font-bold text-gray-900">Supabase</div>
            <div className="text-sm text-gray-600">Auth</div>
          </div>
          <div className="bg-white rounded p-4 text-center">
            <div className="font-bold text-gray-900">Vercel</div>
            <div className="text-sm text-gray-600">Deployment</div>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start?</h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Set up your database and start creating amazing blog posts. Join our community of bloggers today!
        </p>
        <Link href="/register" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-lg">
          Create Your Account
        </Link>
      </div>
    </div>
  )
}
