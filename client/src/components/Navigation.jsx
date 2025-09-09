import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useIsMobile } from "@/hooks/use-mobile";
import { CheckCircle, Menu, X } from "lucide-react";

const Navigation = () => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const navItems = [
    { path: "/settings", label: "Settings", id: "settings" },
    { path: "/ingest", label: "Ingest", id: "ingest" },
    { path: "/ask", label: "Ask", id: "ask" },
    { path: "/eligibility", label: "Eligibility", id: "eligibility" },
  ];

  const isActive = (path) => {
    if (path === "/settings" && (location === "/" || location === "/settings")) {
      return true;
    }
    return location === path;
  };

  const NavLink = ({ path, label, id, mobile = false }) => (
    <Link
      href={path}
      className={`${
        mobile
          ? "block w-full text-left px-3 py-2 rounded-lg text-base font-medium transition-colors"
          : "px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
      } ${
        isActive(path)
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      }`}
      onClick={() => mobile && setMobileMenuOpen(false)}
      data-testid={`nav-${id}`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo/Brand */}
            <div className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center mr-3 animate-bounce-subtle">
                <CheckCircle className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold text-foreground">Loan Support RAG</h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:ml-8 md:flex md:space-x-1">
              {navItems.map((item) => (
                <NavLink key={item.id} {...item} />
              ))}
            </nav>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              data-testid="mobile-menu-toggle"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* API Status Indicator */}
          <div className="hidden sm:flex items-center">
            <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>API Connected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-card border-t border-border">
            {navItems.map((item) => (
              <NavLink key={`mobile-${item.id}`} {...item} mobile />
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
