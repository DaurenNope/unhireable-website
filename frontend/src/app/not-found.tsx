export default function NotFound() {
  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-black text-6xl mb-4">404</h1>
        <p className="font-mono text-xl mb-8">Page Not Found</p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-black text-white font-black border-4 border-cyan-400 hover:bg-cyan-400 hover:text-black transition-colors"
        >
          GO HOME
        </a>
      </div>
    </div>
  );
}

