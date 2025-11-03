/**
 * Sign In Page Component
 * 
 * This component handles user authentication with the following features:
 * - Username/email login support
 * - Password validation
 * - Remember me option (stored in localStorage)
 * - Automatic navigation after successful login
 * 
 * Routes: /authentication/sign-in
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { signIn } from "@/lib/auth";
import { useAuth } from "@/hooks/use-auth";

const SignIn = () => {
    // React Router hook for navigation
    const navigate = useNavigate();
    // Toast notification hook for user feedback
    const { toast } = useToast();
    // Auth context hook to refresh user state after login
    const { refreshUser } = useAuth();
    // Loading state to prevent duplicate submissions
    const [isLoading, setIsLoading] = useState(false);
    
    // Form state management - stores login credentials
    const [formData, setFormData] = useState({
        usernameOrEmail: "",
        password: "",
        rememberMe: false,
    });

    /**
     * Handle input field changes
     * Updates form state when user types in any input field
     * @param e - Change event from input element
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value  // Handle both text inputs and checkboxes
        }));
    };

    /**
     * Handle form submission
     * Validates credentials and authenticates user
     * @param e - Form submit event
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();  // Prevent default form submission
        setIsLoading(true);  // Set loading state

        try {
            // Authenticate user with username/email and password
            // In a real app, we'd verify password hash
            // For demo, we'll check if user exists and password matches
            const user = signIn(formData.usernameOrEmail, formData.password);
            
            // Refresh auth context to update app-wide user state
            refreshUser();

            toast({
                title: "Welcome back!",
                description: `Signed in as ${user.username}`,
            });

            navigate("/");
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Invalid username/email or password",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background pb-24">
            <div className="max-w-md mx-auto">
                <header className="bg-card p-4 border-b border-border">
                    <h1 className="text-xl font-semibold text-foreground">Sign In</h1>
                </header>

                <div className="p-4">
                    <Card className="p-6 border-border">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="usernameOrEmail">Username or Email *</Label>
                                <Input
                                    id="usernameOrEmail"
                                    name="usernameOrEmail"
                                    type="text"
                                    placeholder="Enter username or email"
                                    value={formData.usernameOrEmail}
                                    onChange={handleChange}
                                    required
                                    className="border-border"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password *</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Enter password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    className="border-border"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="rememberMe"
                                        name="rememberMe"
                                        checked={formData.rememberMe}
                                        onCheckedChange={(checked) =>
                                            setFormData(prev => ({ ...prev, rememberMe: checked as boolean }))
                                        }
                                    />
                                    <Label
                                        htmlFor="rememberMe"
                                        className="text-sm text-foreground cursor-pointer"
                                    >
                                        Remember me
                                    </Label>
                                </div>
                                <Link
                                    to="/authentication/forgot-password"
                                    className="text-sm text-primary hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? "Signing in..." : "Sign In"}
                            </Button>
                        </form>

                        <div className="mt-6 text-center space-y-2">
                            <p className="text-sm text-muted-foreground">
                                Don't have an account?{" "}
                                <Link
                                    to="/authentication/sign-up"
                                    className="text-primary hover:underline"
                                >
                                    Sign Up
                                </Link>
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
