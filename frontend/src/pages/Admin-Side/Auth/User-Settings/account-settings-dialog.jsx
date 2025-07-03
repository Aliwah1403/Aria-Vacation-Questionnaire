import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { User, Shield, Eye, EyeOff, X } from "lucide-react";
import { useSession, updateUser, changePassword } from "@/lib/auth-client";

const AccountSettingsDialog = ({ open, onOpenChange }) => {
  const [activeSection, setActiveSection] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordFormOpen, setIsPasswordFormOpen] = useState(false);

  const { data: session } = useSession();

  const user = session?.user;

  const initials = user?.name
    .split(" ")
    .map((part) => part[0].toUpperCase())
    .join("");

  const firstName = user?.name.split(" ")[0];
  const lastName = user?.name.split(" ")[1];

  const email = user?.email;

  const [formName, setFormName] = useState({
    firstName: firstName || "",
    lastName: lastName || "",
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordErrors, setPasswordErrors] = useState([]);

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) {
      errors.push("Your password must contain 8 or more characters.");
    }
    return errors;
  };

  const handlePasswordChange = (password) => {
    setPasswordForm({ ...passwordForm, newPassword: password });
    setPasswordErrors(validatePassword(password));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const fullName =
        `${formName.firstName.trim()} ${formName.lastName.trim()}`.trim();

      await updateUser({
        name: fullName,
      });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Profile update error:", error);

      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    if (passwordErrors.length > 0) {
      toast.error("Please fix password errors");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    setIsLoading(true);

    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        revokeOtherSessions: true,
      });
      toast.success("Password updated successfully");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordErrors([]);
      setIsPasswordFormOpen(false); // Close the form after successful update
    } catch (error) {
      console.error("Password update error:", error);
      toast.error("Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-4xl h-[600px] p-0"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-6">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-lg font-semibold">
                Account
              </DialogTitle>
              <p className="text-sm text-gray-600">Manage your account info.</p>
            </DialogHeader>

            <nav className="space-y-2">
              <button
                onClick={() => setActiveSection("profile")}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                  activeSection === "profile"
                    ? "bg-white shadow-sm border border-gray-200"
                    : "hover:bg-gray-100"
                }`}
              >
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Profile</span>
              </button>

              <button
                onClick={() => setActiveSection("security")}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                  activeSection === "security"
                    ? "bg-white shadow-sm border border-gray-200"
                    : "hover:bg-gray-100"
                }`}
              >
                <Shield className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Security</span>
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeSection === "profile" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Profile</h2>
                    <p className="text-gray-600 text-sm">
                      Update your personal information.
                    </p>
                  </div>

                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    {/* Avatar Section */}
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16">
                        {/* <AvatarImage
                          src={currentUser.avatar || "/placeholder.svg"}
                        /> */}
                        <AvatarFallback className="bg-fountain-blue-500 text-white text-lg">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      {/* <div>
                        <Button variant="outline" size="sm" type="button">
                          Change photo
                        </Button>
                        <p className="text-xs text-gray-500 mt-1">
                          JPG, GIF or PNG. 1MB max.
                        </p>
                      </div> */}
                    </div>

                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First name</Label>
                        <Input
                          id="firstName"
                          value={formName.firstName}
                          onChange={(e) =>
                            setFormName({
                              ...formName,
                              firstName: e.target.value,
                            })
                          }
                          placeholder="Enter your first name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last name</Label>
                        <Input
                          id="lastName"
                          value={formName.lastName}
                          onChange={(e) =>
                            setFormName({
                              ...formName,
                              lastName: e.target.value,
                            })
                          }
                          placeholder="Enter your last name"
                        />
                      </div>
                    </div>

                    {/* Email Field (Read-only) */}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        disabled
                        className="bg-gray-50"
                      />
                      <p className="text-xs text-gray-500">
                        Email cannot be changed. Contact admin.
                      </p>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="bg-fountain-blue-400 hover:bg-fountain-blue-400/80"
                      >
                        {isLoading ? "Saving..." : "Save changes"}
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {activeSection === "security" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Security</h2>
                    <p className="text-gray-600 text-sm">
                      Manage your account security settings.
                    </p>
                  </div>

                  {/* Password Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Password</h3>

                    {!isPasswordFormOpen ? (
                      // Simple Password Row
                      <div className="flex items-center justify-between py-4 border-b border-gray-200">
                        <div className="flex items-center space-x-4">
                          <span className="text-sm font-medium">Password</span>
                          <span className="text-lg tracking-wider">
                            ••••••••
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => setIsPasswordFormOpen(true)}
                          className="text-sm"
                        >
                          Update password
                        </Button>
                      </div>
                    ) : (
                      <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <h4 className="font-medium mb-4">Set password</h4>

                        <form
                          onSubmit={handlePasswordUpdate}
                          className="space-y-4"
                        >
                          {/* Current Password */}
                          <div className="space-y-2">
                            <Label htmlFor="currentPassword">
                              Current password
                            </Label>
                            <div className="relative">
                              <Input
                                id="currentPassword"
                                type={showCurrentPassword ? "text" : "password"}
                                value={passwordForm.currentPassword}
                                onChange={(e) =>
                                  setPasswordForm({
                                    ...passwordForm,
                                    currentPassword: e.target.value,
                                  })
                                }
                                placeholder="Enter current password"
                                required
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                                onClick={() =>
                                  setShowCurrentPassword(!showCurrentPassword)
                                }
                              >
                                {showCurrentPassword ? (
                                  <EyeOff className="h-4 w-4 text-gray-400" />
                                ) : (
                                  <Eye className="h-4 w-4 text-gray-400" />
                                )}
                              </Button>
                            </div>
                          </div>

                          {/* New Password */}
                          <div className="space-y-2">
                            <Label htmlFor="newPassword">New password</Label>
                            <div className="relative">
                              <Input
                                id="newPassword"
                                type={showNewPassword ? "text" : "password"}
                                value={passwordForm.newPassword}
                                onChange={(e) =>
                                  handlePasswordChange(e.target.value)
                                }
                                placeholder="Enter new password"
                                className={
                                  passwordErrors.length > 0
                                    ? "border-red-300"
                                    : ""
                                }
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                                onClick={() =>
                                  setShowNewPassword(!showNewPassword)
                                }
                              >
                                {showNewPassword ? (
                                  <EyeOff className="h-4 w-4 text-gray-400" />
                                ) : (
                                  <Eye className="h-4 w-4 text-gray-400" />
                                )}
                              </Button>
                            </div>
                            {passwordErrors.map((error, index) => (
                              <p
                                key={index}
                                className="text-sm text-red-600 flex items-center"
                              >
                                <span className="w-4 h-4 rounded-full bg-red-100 text-red-600 text-xs flex items-center justify-center mr-2">
                                  !
                                </span>
                                {error}
                              </p>
                            ))}
                          </div>

                          {/* Confirm Password */}
                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">
                              Confirm password
                            </Label>
                            <div className="relative">
                              <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                value={passwordForm.confirmPassword}
                                onChange={(e) =>
                                  setPasswordForm({
                                    ...passwordForm,
                                    confirmPassword: e.target.value,
                                  })
                                }
                                placeholder="Confirm new password"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-4 w-4 text-gray-400" />
                                ) : (
                                  <Eye className="h-4 w-4 text-gray-400" />
                                )}
                              </Button>
                            </div>
                          </div>

                          {/* Sign out other devices */}
                          <div className="flex items-start space-x-3">
                            <div className="space-y-1">
                              <p className="text-xs text-gray-500">
                                You will be signed out of all other devices
                                which may have used your old password.
                              </p>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex justify-end space-x-3 pt-4">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setIsPasswordFormOpen(false);
                                setPasswordForm({
                                  newPassword: "",
                                  confirmPassword: "",
                                  signOutOtherDevices: true,
                                });
                                setPasswordErrors([]);
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              type="submit"
                              disabled={
                                isLoading ||
                                passwordErrors.length > 0 ||
                                passwordForm.newPassword === "" ||
                                passwordForm.confirmPassword === ""
                              }
                              className="bg-fountain-blue-400 hover:bg-fountain-blue-400/80 "
                            >
                              {isLoading ? "Saving..." : "Save"}
                            </Button>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AccountSettingsDialog;
