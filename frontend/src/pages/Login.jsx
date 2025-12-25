import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText } from "lucide-react";
import { toast } from "sonner";

function Login() {
    const navigate = useNavigate();
    const { login, register } = useAuth();
    const [activeTab, setActiveTab] = useState("login");
    const [loading, setLoading] = useState(false);

    // Login form state
    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    });
    // Register form state
    const [registerData, setRegisterData] = useState({
        name: "",
        lastname: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    // Handle Login
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login({
                email: loginData.email,
                password: loginData.password
            });
            toast.success("Login successful");
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.error || "Login failed. Please try again.");
        } finally {
            setLoading(false)
        }
    };

    // Handle Register
    const handleRegister = async (e) => {
        e.preventDefault();

        // Validation
        if (registerData.password !== registerData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            await register({
                name: registerData.name,
                lastname: registerData.lastname,
                email: registerData.email,
                password: registerData.password
            });

            // Auto-login after registration
            await login({
                email: registerData.email,
                password: registerData.password
            });

            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.error || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen min-w-screen flex justify-center items-center bg-gray-50 px-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-4">
                    <div className="flex justify-center">
                        <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center">
                            <FileText className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <div className="text-center space-y-2">
                        <CardTitle>Learn Easily</CardTitle>
                        <CardDescription>Take better notes with the Cornell Method</CardDescription>
                    </div>
                </CardHeader>

                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full h-[50px] grid-cols-2">
                            <TabsTrigger value="login" className="data-[state=active]:bg-white! data-[state=active]:text-gray-900! data-[state=inactive]:bg-black! data-[state=inactive]:text-white!">Login</TabsTrigger>
                            <TabsTrigger value="register" className="data-[state=active]:bg-white! data-[state=active]:text-gray-900! data-[state=inactive]:bg-black! data-[state=inactive]:text-white!">Register</TabsTrigger>
                        </TabsList>

                        {/* Login form */}
                        <TabsContent value="login">
                            <form onSubmit={handleLogin} className="space-y-4">
                                {/* Email input */}
                                <div className="space-y-2">
                                    <Label htmlFor="login-email">Email</Label>
                                    <Input
                                        id="login-email"
                                        type="email"
                                        placeholder="email@example.com"
                                        value={loginData.email}
                                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                        required
                                        disable={loading}
                                    />
                                </div>
                                {/* Password input */}
                                <div className="space-y-2">
                                    <Label htmlFor="login-password">Password</Label>
                                    <Input
                                        id="login-password"
                                        type="password"
                                        placeholder="********"
                                        value={loginData.password}
                                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                {/* Submit button */}
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? "Signing in..." : "Sign In"}
                                </Button>
                            </form>
                        </TabsContent>
                        {/* Register form */}
                        <TabsContent value="register">
                            <form onSubmit={handleRegister} className="space-y-4">
                                {/* Name input */}
                                <div className="grid grid-cols-2 gap 4">
                                    <div className="space-y-2">
                                        <Label htmlFor="register-name">Name</Label>
                                        <Input
                                            id="register-name"
                                            type="text"
                                            placeholder="Your name"
                                            value={registerData.name}
                                            onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="register-lastname">Last Name</Label>
                                        <Input
                                            id="register-lastname"
                                            type="text"
                                            placeholder="Your last name"
                                            value={registerData.lastname}
                                            onChange={(e) => setRegisterData({ ...registerData, lastname: e.target.value })}
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                                {/* Email input */}
                                <div className="space-y-2">
                                    <Label htmlFor="register-email">Email</Label>
                                    <Input
                                        id="register-email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={registerData.email}
                                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                {/* Password input */}
                                <div className="space-y-2">
                                    <Label htmlFor="register-password">Password</Label>
                                    <Input
                                        id="register-password"
                                        type="password"
                                        placeholder="********"
                                        value={registerData.password}
                                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                {/* Confirm password input */}
                                <div className="space-y-2">
                                    <Label htmlFor="register-confirm-password">Confirm Password</Label>
                                    <Input
                                        id="register-confirm-password"
                                        type="password"
                                        placeholder="********"
                                        value={registerData.confirmPassword}
                                        onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                {/* Submit button */}
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? "Creating account..." : "Create Account"}
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}

export default Login