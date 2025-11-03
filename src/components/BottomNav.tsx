import { Home, Compass, Plus, FileText, UserCircle, Heart, Newspaper, Package, Cloud, Cpu, MessageSquare, Users, Mail, PlusSquare } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

const primaryNavItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Compass, label: "Sites", path: "/explore" },
  { icon: Package, label: "Artifacts", path: "/artifacts" },
  { icon: Newspaper, label: "Articles", path: "/articles" },
  { icon: Heart, label: "Donate", path: "/donations" },
  { icon: UserCircle, label: "Account", path: "/account" },
];

const additionalNavItems = [
  { icon: PlusSquare, label: "NewFind", path: "/new-find" },
  { icon: Cloud, label: "Weather", path: "/weather" },
  { icon: Cpu, label: "Technology", path: "/technology" },
  { icon: MessageSquare, label: "Chat", path: "/chat" },
  { icon: Users, label: "Experts", path: "/experts" },
  { icon: Mail, label: "Contact", path: "/contact" },
];

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  const displayedItems = isExpanded
    ? [...primaryNavItems, ...additionalNavItems]
    : primaryNavItems;

  const handleMoreClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleBackdropClick = () => {
    setIsExpanded(false);
  };

  if (isExpanded) {
    return (
      <>
        <div
          className="fixed inset-0 z-40"
          onClick={handleBackdropClick}
        />
        <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-3 shadow-lg transition-all duration-300 z-50">
          <div className="flex items-center justify-around max-w-md mx-auto transition-all duration-300 flex-wrap gap-2">
            {displayedItems.map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-1 transition-all duration-300 min-w-[60px] ${
                  location.pathname === item.path
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </>
    );
  }

  const leftItems = primaryNavItems.slice(0, 3);
  const rightItems = primaryNavItems.slice(3);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-3 shadow-lg transition-all duration-300 z-50">
      <div className="flex items-center justify-around max-w-md mx-auto transition-all duration-300">
        {leftItems.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${
              location.pathname === item.path
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}

        <button
          onClick={handleMoreClick}
          className="bg-primary text-primary-foreground p-3 rounded-full -mt-6 shadow-lg hover:bg-primary/90 transition-all duration-300"
        >
          <Plus className="w-6 h-6" />
        </button>

        {rightItems.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${
              location.pathname === item.path
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};
