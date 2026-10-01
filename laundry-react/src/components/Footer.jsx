function Footer() {
  return (
    <footer className="bg-white shadow-inner mt-12 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Laundry Aggregator. All rights reserved.</p>
        <p className="mt-2 text-xs">Bringing the best laundry services to your doorstep.</p>
      </div>
    </footer>
  );
}

export default Footer;
