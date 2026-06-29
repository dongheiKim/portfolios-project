export function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="text-xl font-bold text-gray-800">쿠팡</div>
        <nav className="space-x-4">
          <a href="/" className="text-gray-600 hover:text-gray-800">
            Home
          </a>
          <a href="/about" className="text-gray-600 hover:text-gray-800">
            About
          </a>
          <a href="/contact" className="text-gray-600 hover:text-gray-800">
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
