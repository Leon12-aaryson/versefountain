import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-neutral-900 to-black text-white pt-16 pb-8 border-t border-amber-700/30">
      <div className="container mx-auto px-4 md:px-6">
        {/* Top pattern design */}
        <div className="h-2 w-full bg-gradient-to-r from-amber-800/30 via-amber-600/40 to-amber-800/30 mb-10 rounded"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="font-display text-2xl mb-4 bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-200 bg-clip-text text-transparent">VerseFountain</div>
            <p className="text-white/80 text-sm mb-6">
              Preserving and celebrating cultural poetry and literature from around the world.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/70 hover:text-amber-300 transition-colors bg-white/5 hover:bg-white/10 rounded-full p-2">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-white/70 hover:text-amber-300 transition-colors bg-white/5 hover:bg-white/10 rounded-full p-2">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-white/70 hover:text-amber-300 transition-colors bg-white/5 hover:bg-white/10 rounded-full p-2">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-white/70 hover:text-amber-300 transition-colors bg-white/5 hover:bg-white/10 rounded-full p-2">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display text-lg mb-4 text-amber-300">Explore</h4>
            <ul className="space-y-3 text-white/80">
              <li>
                <Link href="/poetry">
                  <div className="hover:text-amber-300 transition-colors flex items-center">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></span>
                    Poetry Collections
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/books">
                  <div className="hover:text-amber-300 transition-colors flex items-center">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></span>
                    Books Library
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/discussions">
                  <div className="hover:text-amber-300 transition-colors flex items-center">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></span>
                    Discussion Forums
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/events">
                  <div className="hover:text-amber-300 transition-colors flex items-center">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></span>
                    Events Calendar
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/academics">
                  <div className="hover:text-amber-300 transition-colors flex items-center">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></span>
                    Academic Resources
                  </div>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg mb-4 text-amber-300">Member Services</h4>
            <ul className="space-y-3 text-white/80">
              <li>
                <Link href="/account">
                  <div className="hover:text-amber-300 transition-colors">Account</div>
                </Link>
              </li>
              <li>
                <Link href="/reading-history">
                  <div className="hover:text-amber-300 transition-colors">Reading History</div>
                </Link>
              </li>
              <li>
                <Link href="/my-library">
                  <div className="hover:text-amber-300 transition-colors">My Library</div>
                </Link>
              </li>
              <li>
                <Link href="/saved-poems">
                  <div className="hover:text-amber-300 transition-colors">Saved Poems</div>
                </Link>
              </li>
              <li>
                <Link href="/event-tickets">
                  <div className="hover:text-amber-300 transition-colors">Event Tickets</div>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg mb-4 text-amber-300">About Us</h4>
            <ul className="space-y-3 text-white/80">
              <li>
                <Link href="/mission">
                  <div className="hover:text-amber-300 transition-colors">Our Mission</div>
                </Link>
              </li>
              <li>
                <Link href="/partners">
                  <div className="hover:text-amber-300 transition-colors">Cultural Partners</div>
                </Link>
              </li>
              <li>
                <Link href="/support">
                  <div className="hover:text-amber-300 transition-colors">Support Literature</div>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <div className="hover:text-amber-300 transition-colors">Contact Us</div>
                </Link>
              </li>
              <li>
                <Link href="/careers">
                  <div className="hover:text-amber-300 transition-colors">Career Opportunities</div>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Decorative border */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-700/30 to-transparent mb-8"></div>

        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="text-white/60 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} VerseFountain. All rights reserved.
          </div>
          <div className="flex space-x-6 text-white/60">
            <Link href="/privacy">
              <div className="hover:text-amber-300 transition-colors">Privacy Policy</div>
            </Link>
            <Link href="/terms">
              <div className="hover:text-amber-300 transition-colors">Terms of Service</div>
            </Link>
            <Link href="/cookies">
              <div className="hover:text-amber-300 transition-colors">Cookie Policy</div>
            </Link>
          </div>
        </div>
        
        {/* Bottom decorative pattern */}
        <div className="h-1 w-full bg-gradient-to-r from-amber-800/10 via-amber-600/20 to-amber-800/10 mt-8 rounded"></div>
      </div>
    </footer>
  );
}
