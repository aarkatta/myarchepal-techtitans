import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export const AccountButton = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <button
      className="p-2 hover:bg-muted rounded-full transition-colors"
      onClick={() => navigate("/account")}
      aria-label="Account"
    >
      <User className="w-5 h-5 text-muted-foreground" />
    </button>
  );
};
