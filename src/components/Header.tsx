import { Link, useLocation, useNavigate } from "react-router-dom";
import { Palette, Menu, X, LogIn, LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for mobile or when docked
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { path: "/", label: "Gallery" },
    ...(isAdmin ? [{ path: "/admin", label: "Admin" }] : []),
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 md:top-6 transition-all duration-300">
      <div
        className={`mx-auto max-w-7xl transition-all duration-300 
          ${mobileMenuOpen ? "bg-background" : "bg-background/70 backdrop-blur-xl"}
          border-b md:border border-white/20 shadow-sm md:shadow-2xl 
          md:rounded-full supports-[backdrop-filter]:bg-background/60
        `}
      >
        <div className="flex h-16 md:h-20 items-center justify-between px-4 md:px-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-primary/10 transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary/20">
              <Palette className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
            <span className="font-display text-xl md:text-2xl font-bold text-foreground tracking-tight">
              The Rainbow Palette
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 font-body text-sm font-medium transition-colors duration-200 group
                    ${location.pathname === link.path
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  {link.label}
                  <span className={`absolute inset-x-0 -bottom-1 h-0.5 bg-primary transform origin-left transition-transform duration-300
                    ${location.pathname === link.path ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}
                  `} />
                </Link>
              ))}
            </nav>

            <div className="w-px h-8 bg-border/50" />

            {/* Auth Button */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2 rounded-full hover:bg-primary/10 px-4">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <span className="max-w-[120px] truncate font-medium">{user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl p-2">
                  {isAdmin && (
                    <>
                      <DropdownMenuItem asChild className="rounded-lg">
                        <Link to="/admin" className="cursor-pointer">
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive rounded-lg">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={() => navigate("/auth")}
                className="gap-2 rounded-full px-6 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl p-4 animate-fade-in rounded-b-2xl">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl font-body text-sm font-medium transition-all duration-200 ${location.pathname === link.path
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Auth */}
              <div className="pt-2 border-t border-border mt-2">
                {user ? (
                  <>
                    <p className="px-4 py-2 font-body text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 rounded-xl font-body text-sm font-medium text-left text-destructive hover:bg-destructive/10 transition-all duration-200 flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-xl font-body text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 flex items-center gap-2"
                  >
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
