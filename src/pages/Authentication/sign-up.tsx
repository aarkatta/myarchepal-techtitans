/**
 * Sign Up Page Component
 * 
 * This component handles user registration with the following features:
 * - Form validation (password confirmation, minimum length, required fields)
 * - User registration with localStorage persistence
 * - Automatic sign-in after successful registration
 * - Terms and conditions agreement
 * 
 * Routes: /authentication/sign-up
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { signUp } from "@/lib/auth";

const SignUp = () => {
    // React Router hook for navigation
    const navigate = useNavigate();
    // Toast notification hook for user feedback
    const { toast } = useToast();
    // Loading state to prevent duplicate submissions
    const [isLoading, setIsLoading] = useState(false);
    
    // Form state management - stores all user input values
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        country: "",
        label: "",
        agreeToTerms: false,
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
     * Validates form data, creates user account, and signs in automatically
     * @param e - Form submit event
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();  // Prevent default form submission
        setIsLoading(true);  // Set loading state

        // Form validation checks
        
        // Check if password and confirm password match
        if (formData.password !== formData.confirmPassword) {
            toast({
                title: "Error",
                description: "Passwords do not match",
                variant: "destructive",
            });
            setIsLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            toast({
                title: "Error",
                description: "Password must be at least 6 characters",
                variant: "destructive",
            });
            setIsLoading(false);
            return;
        }

        // Check if user agreed to terms and conditions
        if (!formData.agreeToTerms) {
            toast({
                title: "Error",
                description: "You must agree to the terms and conditions",
                variant: "destructive",
            });
            setIsLoading(false);
            return;
        }

        try {
            // Create new user account using auth utility
            // This will validate uniqueness and save to localStorage
            const newUser = signUp({
                username: formData.username,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                country: formData.country,
                label: formData.label || "I'm an archaeologist",  // Default profession label
                // Store password (NOT RECOMMENDED FOR PRODUCTION - use proper hashing)
                password: formData.password,
            } as any);

            // Automatically sign in the user after successful registration
            // Dynamic import to avoid circular dependency issues
            const { signIn } = await import("@/lib/auth");
            signIn(formData.username, formData.password);

            toast({
                title: "Success!",
                description: "Account created successfully. Welcome!",
            });

            navigate("/");
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to create account",
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
                    <h1 className="text-xl font-semibold text-foreground">Sign Up</h1>
                </header>

                <div className="p-4">
                    <Card className="p-6 border-border">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Username *</Label>
                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    placeholder="Enter username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    className="border-border"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Enter email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="border-border"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="Enter phone number"
                                    value={formData.phone}
                                    onChange={handleChange}
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
                                    minLength={6}
                                    className="border-border"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="Confirm password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    className="border-border"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="label">I'm a...</Label>
                                <Input
                                    id="label"
                                    name="label"
                                    type="text"
                                    placeholder="I'm an archaeologist"
                                    value={formData.label}
                                    onChange={handleChange}
                                    className="border-border"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    name="address"
                                    type="text"
                                    placeholder="Enter address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="border-border"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        name="city"
                                        type="text"
                                        placeholder="City"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="border-border"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="state">State</Label>
                                    <Input
                                        id="state"
                                        name="state"
                                        type="text"
                                        placeholder="State"
                                        value={formData.state}
                                        onChange={handleChange}
                                        className="border-border"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="country">Country</Label>
                                <Input
                                    id="country"
                                    name="country"
                                    type="text"
                                    placeholder="Enter country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="border-border"
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="agreeToTerms"
                                    name="agreeToTerms"
                                    checked={formData.agreeToTerms}
                                    onCheckedChange={(checked) =>
                                        setFormData(prev => ({ ...prev, agreeToTerms: checked as boolean }))
                                    }
                                />
                                <Label
                                    htmlFor="agreeToTerms"
                                    className="text-sm text-foreground cursor-pointer"
                                >
                                    I agree to the terms and conditions
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? "Creating Account..." : "Sign Up"}
                            </Button>
                        </form>

                        <div className="mt-6 text-center space-y-2">
                            <p className="text-sm text-muted-foreground">
                                Already have an account?{" "}
                                <Link
                                    to="/authentication/sign-in"
                                    className="text-primary hover:underline"
                                >
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
