import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-neutral-charcoal text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="font-display text-2xl mb-4">VerseFountain</div>
            <p className="text-white text-opacity-70 text-sm mb-6">
              Preserving and celebrating cultural poetry and literature from around the world.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white text-opacity-70 hover:text-opacity-100 transition-opacity">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-white text-opacity-70 hover:text-opacity-100 transition-opacity">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-white text-opacity-70 hover:text-opacity-100 transition-opacity">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-white text-opacity-70 hover:text-opacity-100 transition-opacity">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display text-lg mb-4">Explore</h4>
            <ul className="space-y-2 text-white text-opacity-70">
              <li>
                <Link href="/poetry">
                  <a className="hover:text-opacity-100 transition-opacity">Poetry Collections</a>
                </Link>
              </li>
              <li>
                <Link href="/books">
                  <a className="hover:text-opacity-100 transition-opacity">Books Library</a>
                </Link>
              </li>
              <li>
                <Link href="/discussions">
                  <a className="hover:text-opacity-100 transition-opacity">Discussion Forums</a>
                </Link>
              </li>
              <li>
                <Link href="/events">
                  <a className="hover:text-opacity-100 transition-opacity">Events Calendar</a>
                </Link>
              </li>
              <li>
                <Link href="/academics">
                  <a className="hover:text-opacity-100 transition-opacity">Academic Resources</a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg mb-4">Member Services</h4>
            <ul className="space-y-2 text-white text-opacity-70">
              <li>
                <Link href="/account">
                  <a className="hover:text-opacity-100 transition-opacity">Account</a>
                </Link>
              </li>
              <li>
                <Link href="/reading-history">
                  <a className="hover:text-opacity-100 transition-opacity">Reading History</a>
                </Link>
              </li>
              <li>
                <Link href="/my-library">
                  <a className="hover:text-opacity-100 transition-opacity">My Library</a>
                </Link>
              </li>
              <li>
                <Link href="/saved-poems">
                  <a className="hover:text-opacity-100 transition-opacity">Saved Poems</a>
                </Link>
              </li>
              <li>
                <Link href="/event-tickets">
                  <a className="hover:text-opacity-100 transition-opacity">Event Tickets</a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg mb-4">About Us</h4>
            <ul className="space-y-2 text-white text-opacity-70">
              <li>
                <Link href="/mission">
                  <a className="hover:text-opacity-100 transition-opacity">Our Mission</a>
                </Link>
              </li>
              <li>
                <Link href="/partners">
                  <a className="hover:text-opacity-100 transition-opacity">Cultural Partners</a>
                </Link>
              </li>
              <li>
                <Link href="/support">
                  <a className="hover:text-opacity-100 transition-opacity">Support Literature</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="hover:text-opacity-100 transition-opacity">Contact Us</a>
                </Link>
              </li>
              <li>
                <Link href="/careers">
                  <a className="hover:text-opacity-100 transition-opacity">Career Opportunities</a>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="cultural-border mb-8"></div>

        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="text-white text-opacity-60 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} VerseFountain. All rights reserved.
          </div>
          <div className="flex space-x-4 text-white text-opacity-60">
            <Link href="/privacy">
              <a className="hover:text-opacity-100 transition-opacity">Privacy Policy</a>
            </Link>
            <Link href="/terms">
              <a className="hover:text-opacity-100 transition-opacity">Terms of Service</a>
            </Link>
            <Link href="/cookies">
              <a className="hover:text-opacity-100 transition-opacity">Cookie Policy</a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
