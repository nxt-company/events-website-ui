
import { Link, useLocation } from "react-router-dom";
import { useEventContext } from "@/context/EventContext";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export function MainNavbar() {
  const { username, eventData, creatorCode, clearEventData } = useEventContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleLogout = () => {
    clearEventData();
    toast.success("Logged out successfully");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <nav className="border-b border-border fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-bold text-2xl bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              EventQ
            </span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {!username ? (
            <>
              <Link to="/" className="text-foreground/70 hover:text-foreground transition-colors">
                Home
              </Link>
            </>
          ) : eventData ? (
            <>
              {creatorCode ? (
                <Link to="/dashboard" className="text-foreground/70 hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              ) : (
                <Link to={`/event/${eventData.id}`} className="text-foreground/70 hover:text-foreground transition-colors">
                  Current Event
                </Link>
              )}
            </>
          ) : null}
          
          {username && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-foreground/70">
                Welcome, <span className="font-medium text-foreground">{username}</span>
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          )}
          
          <ThemeToggle />
        </div>
        
        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="container py-4 pb-6 md:hidden">
          <div className="flex flex-col space-y-4">
            {!username ? (
              <>
                <Link 
                  to="/" 
                  className="px-4 py-2 rounded-md hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
              </>
            ) : eventData ? (
              <>
                {creatorCode ? (
                  <Link 
                    to="/dashboard" 
                    className="px-4 py-2 rounded-md hover:bg-muted"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link 
                    to={`/event/${eventData.id}`} 
                    className="px-4 py-2 rounded-md hover:bg-muted"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Current Event
                  </Link>
                )}
              </>
            ) : null}
            
            {username && (
              <>
                <div className="px-4 py-2">
                  <span className="text-sm text-muted-foreground">
                    Logged in as <span className="font-medium text-foreground">{username}</span>
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2 justify-start px-4">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
