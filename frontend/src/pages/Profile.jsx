import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import Layout from '../components/layout/Layout';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, User, Mail, Lock, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import ConfirmDialog from '@/components/ui/confirmDialog';

function Profile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    // Profile state
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        lastname: user?.lastname || ''
    });

    // Email state
    const [emailData, setEmailData] = useState({
        email: user?.email || ''
    });

    // Password state
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // UI state
    const [loading, setLoading] = useState({
        profile: false,
        email: false,
        password: false,
        delete: false
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Update name and lastname
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!profileData.name.trim() || !profileData.lastname.trim()) {
            setError("Name and lastname are required");
            return;
        }

        setLoading(prev => ({ ...prev, profile: true }));

        try {
            await api.put(`/users/profile/${user.id}`, {
                name: profileData.name,
                lastname: profileData.lastname
            });

            // Update user in local storage
            const updateUser = { ...user, name: profileData.name, lastname: profileData.lastname };
            localStorage.setItem("user", JSON.stringify(updateUser));
            toast.success("Profile updated successfully!");
            // Reload page to update header
            setTimeout(() => window.location.reload(), 1500);
        } catch (err) {
            toast.error(err.response?.data?.error || "Failed to update profile");
        } finally {
            setLoading(prev => ({ ...prev, profile: false }));
        }
    };

    // Update email
    const handleUpdateEmail = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!emailData.email.trim()) {
            setError("Email is required");
            return;
        }

        if (emailData.email === user.email) {
            setError("New email is the same as current email");
            return;
        }

        setLoading(prev => ({ ...prev, email: true }));

        try {
            await api.put(`/users/profile/email/${user.id}`, {
                email: emailData.email
            });

            // Update user in local storage
            const updateUser = { ...user, email: emailData.email };
            localStorage.setItem("user", JSON.stringify(updateUser));
            toast.success("Email updated successfully!");
            // Reload page
            setTimeout(() => window.location.reload(), 1500);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to update email");
        } finally {
            setLoading(prev => ({ ...prev, email: false }));
        }
    };

    // Update password
    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            setError("All password fileds are required");
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError("New passwords do not match");
            return;
        }

        if (passwordData.oldPassword === passwordData.newPassword) {
            setError("New password must be different from old password");
            return;
        }

        setLoading(prev => ({ ...prev, password: true }));

        try {
            await api.put(`/users/profile/password/${user.id}`, {
                oldPassword: passwordData.oldPassword,
                newPassword: passwordData.newPassword
            });
            toast.success("Password updated successfully!");

            setPasswordData({
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (err) {
            setError(err.response?.data?.error || "Failed to update password");
        } finally {
            setLoading(prev => ({ ...prev, password: false }));
        }
    };

    // Delete account
    const handleDeleteAccount = async () => {
        setShowDeleteDialog(true);
    };

    const confirmDelete = async () => {
        setLoading(prev => ({ ...prev, delete: true }));

        try {
            await api.delete(`/users/profile/delete/${user.id}`);
            toast.success("Account deleted successfully!");

            // Logout and redirect to login
            await logout();
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || "Failed to delete account");
            setLoading(prev => ({ ...prev, delete: false }));
        }
        setShowDeleteDialog(false);
    };

    return (
        <>
            <Layout>
                <div className="max-w-4xl mx-auto space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
                        <p className="text-muted-foreground">
                            Manage your profile settings here.
                        </p>
                    </div>

                    {/* Messages */}
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {success && (
                        <Alert className="border-green-500 text-green-700">
                            <AlertDescription>{success}</AlertDescription>
                        </Alert>
                    )}

                    {/* Profile */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Profile Information
                            </CardTitle>
                            <CardDescription>
                                Update your name and last name
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={profileData.name}
                                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                            disabled={loading.profile}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastname">Last Name</Label>
                                        <Input
                                            id="lastname"
                                            type="text"
                                            value={profileData.lastname}
                                            onChange={(e) => setProfileData({ ...profileData, lastname: e.target.value })}
                                            disabled={loading.profile}
                                            required
                                        />
                                    </div>
                                </div>
                                <Button type="submit" disabled={loading.profile}>
                                    {loading.profile ? (
                                        <>
                                            <Loader2 className="mr-2 h-2 w-2 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        "Update Profile"
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mail className="h-5 w-5" />
                                Email Address
                            </CardTitle>
                            <CardDescription>
                                Change you email here
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleUpdateEmail} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={emailData.email}
                                        onChange={(e) => setEmailData({ email: e.target.value })}
                                        disabled={loading.email}
                                        required
                                    />
                                </div>
                                <Button type="submit" disabled={loading.email}>
                                    {loading.email ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        "Update Email"
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Lock className="h-5 w-5" />
                                Change Password
                            </CardTitle>
                            <CardDescription>
                                Change your password here to keep your account secure
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleUpdatePassword} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="old-password">Current Password</Label>
                                    <Input
                                        id="old-password"
                                        type="password"
                                        value={passwordData.oldPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                        disabled={loading.password}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="new-password">New Password</Label>
                                    <Input
                                        id="new-password"
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        disabled={loading.password}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirm-password">Confirm Password</Label>
                                    <Input
                                        id="confirm-password"
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        disabled={loading.password}
                                        required
                                    />
                                </div>
                                <Button type="submit" disabled={loading.password}>
                                    {loading.password ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        "Update Password"
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className="border-red-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-red-600">
                                <Trash2 className="h-5 w-5" />
                                Delete Account
                            </CardTitle>
                            <CardDescription>
                                Permanently delete your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    Once you delete your account, there is no going back. Please be careful.
                                </p>
                                <Button
                                    variant="destructive"
                                    onClick={handleDeleteAccount}
                                    disabled={loading.delete}
                                >
                                    {loading.delete ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Deleting...
                                        </>
                                    ) : (
                                        "Delete Account"
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </Layout>

            <ConfirmDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
                onConfirm={confirmDelete}
                title="Delete Account"
                description="Are you sure you want to delete your account? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                variant="destructive"
            />
        </>
    );
}

export default Profile;