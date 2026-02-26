const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-6 py-10">
        
        {/* Top Section */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
          
          {/* Brand */}
          <div>
            <h2 className="text-white text-xl font-semibold">
              YourApp
            </h2>
            <p className="mt-2 text-sm">
              Track films. Save favorites. Tell your friends what’s good.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-6 text-sm">
            <a href="/" className="hover:text-white transition">Home</a>
            <a href="/movies" className="hover:text-white transition">Movies</a>
            <a href="/watchlist" className="hover:text-white transition">Watchlist</a>
            <a href="/profile" className="hover:text-white transition">Profile</a>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-6 border-t border-gray-800 text-xs text-gray-500 flex flex-col md:flex-row justify-between gap-4">
          <p>© {new Date().getFullYear()} YourApp. All rights reserved.</p>
          <p>Built for movie lovers.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;