import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
                <span className="text-xs font-black text-primary-foreground">IQ</span>
              </div>
              IntentIQ
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Intelligent visitor tracking and proactive engagement for modern B2B teams.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
              <li><Link to="/docs" className="hover:text-foreground transition-colors">Documentation</Link></li>
              <li><Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/demo" className="hover:text-foreground transition-colors">Live Demo</Link></li>
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} IntentIQ. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
