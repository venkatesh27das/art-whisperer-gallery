import { Palette } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/30 py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                <Palette className="h-5 w-5 text-primary" />
              </div>
              <span className="font-display text-xl font-semibold text-foreground">
                Artistry
              </span>
            </Link>
            <p className="font-body text-sm text-muted-foreground max-w-xs">
              Discover extraordinary original paintings from talented artists.
              Each piece tells a unique story.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-display text-lg font-semibold text-foreground">
              Quick Links
            </h3>
            <nav className="flex flex-col gap-2">
              <Link
                to="/"
                className="font-body text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Gallery
              </Link>
              <Link
                to="/admin"
                className="font-body text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Admin
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-display text-lg font-semibold text-foreground">
              Get in Touch
            </h3>
            <p className="font-body text-sm text-muted-foreground">
              Interested in a painting? Reach out to us on WhatsApp for inquiries
              and purchases.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="font-body text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} Artistry. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
