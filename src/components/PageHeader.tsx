import { useNavigate } from "react-router-dom";

interface PageHeaderProps {
  title?: string;
  showLogo?: boolean;
  mobileLogoOnly?: boolean;
  className?: string;
}

export const PageHeader = ({ title, showLogo = true, mobileLogoOnly = false, className = "" }: PageHeaderProps) => {
  const navigate = useNavigate();

  const shouldShowLogo = showLogo || mobileLogoOnly;
  const logoClassName = mobileLogoOnly
    ? "flex items-center gap-2 hover:opacity-80 transition-opacity md:hidden"
    : "flex items-center gap-2 hover:opacity-80 transition-opacity";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {shouldShowLogo && (
        <button
          onClick={() => navigate("/")}
          className={logoClassName}
        >
          <img
            src="/archepal.png"
            alt="ArchePal Logo"
            className="w-8 h-8 object-contain"
          />
          <span className="text-xl font-semibold text-foreground">ArchePal</span>
        </button>
      )}
      {title && !showLogo && !mobileLogoOnly && (
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
      )}
    </div>
  );
};
