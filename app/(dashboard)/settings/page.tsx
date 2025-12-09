import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getSocialAccounts } from "@/lib/db/social-accounts";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, ExternalLink, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SocialAccountActions } from "@/components/settings/social-account-actions";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch connected social accounts
  const socialAccounts = await getSocialAccounts(user.id);

  const tiktokAccount = socialAccounts.find((a) => a.platform === "tiktok");
  const linkedinAccount = socialAccounts.find((a) => a.platform === "linkedin");
  const twitterAccount = socialAccounts.find((a) => a.platform === "twitter");

  // Helper to check if token is expiring soon (within 30 minutes)
  const isTokenExpiringSoon = (expiresAt: string | null): boolean => {
    if (!expiresAt) return true;
    const expiryTime = new Date(expiresAt).getTime();
    const now = Date.now();
    const thirtyMinutes = 30 * 60 * 1000;
    return now >= expiryTime - thirtyMinutes;
  };

  // Helper to format token expiry
  const formatTokenExpiry = (expiresAt: string | null): string => {
    if (!expiresAt) return "Unknown";
    const expiry = new Date(expiresAt);
    const now = new Date();
    if (expiry <= now) return "Expired";

    const diffMs = expiry.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 60) return `${diffMins} min`;
    if (diffHours < 24) return `${diffHours} hours`;
    return `${Math.floor(diffHours / 24)} days`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your account and connected social media platforms
          </p>
        </div>

        {/* Profile Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>Your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <p className="text-gray-900 mt-1">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Full Name
              </label>
              <p className="text-gray-900 mt-1">
                {profile?.full_name || "Not set"}
              </p>
            </div>
            <Button variant="outline" size="sm">
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        {/* Connected Accounts */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Connected Social Media Accounts</CardTitle>
            <CardDescription>
              Connect your social media accounts to start scheduling posts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* TikTok */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  T
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">TikTok</h3>
                  {tiktokAccount ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            tiktokAccount.is_active ? "success" : "secondary"
                          }
                        >
                          {tiktokAccount.is_active ? (
                            <>
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Connected
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3 mr-1" />
                              Inactive
                            </>
                          )}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          @
                          {tiktokAccount.account_handle ||
                            tiktokAccount.account_name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        Token expires in:{" "}
                        {formatTokenExpiry(tiktokAccount?.token_expires_at || null)}
                        {isTokenExpiringSoon(
                          tiktokAccount?.token_expires_at || null
                        ) && (
                          <span className="text-orange-500 font-medium ml-1">
                            ⚠️ Refresh soon
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 mt-1">Not connected</p>
                  )}
                </div>
              </div>
              {tiktokAccount ? (
                <SocialAccountActions
                  accountId={tiktokAccount.id}
                  platform="TikTok"
                  accountHandle={
                    (tiktokAccount.account_handle || tiktokAccount.account_name || "TikTok User") as string
                  }
                />
              ) : (
                <Link href="/api/auth/tiktok">
                  <Button size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Connect TikTok
                  </Button>
                </Link>
              )}
            </div>

            {/* LinkedIn */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  in
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">LinkedIn</h3>
                  {linkedinAccount ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            linkedinAccount.is_active ? "success" : "secondary"
                          }
                        >
                          {linkedinAccount.is_active ? (
                            <>
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Connected
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3 mr-1" />
                              Inactive
                            </>
                          )}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          {linkedinAccount.account_name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        Token expires in:{" "}
                        {formatTokenExpiry(linkedinAccount?.token_expires_at || null)}
                        <span className="text-gray-400 ml-1">
                          (No refresh - reconnect when expired)
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 mt-1">Not connected</p>
                  )}
                </div>
              </div>
              {linkedinAccount ? (
                <SocialAccountActions
                  accountId={linkedinAccount.id}
                  platform="LinkedIn"
                  accountHandle={(linkedinAccount.account_name || "LinkedIn User") as string}
                />
              ) : (
                <Link href="/api/auth/linkedin">
                  <Button size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Connect LinkedIn
                  </Button>
                </Link>
              )}
            </div>

            {/* Twitter/X */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-sky-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  𝕏
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Twitter / X</h3>
                  {twitterAccount ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            twitterAccount.is_active ? "success" : "secondary"
                          }
                        >
                          {twitterAccount.is_active ? (
                            <>
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Connected
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3 mr-1" />
                              Inactive
                            </>
                          )}
                        </Badge>
                        <span className="text-sm text-gray-600">
                          @
                          {twitterAccount.account_handle ||
                            twitterAccount.account_name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        Token expires in:{" "}
                        {formatTokenExpiry(twitterAccount?.token_expires_at || null)}
                        {isTokenExpiringSoon(
                          twitterAccount?.token_expires_at || null
                        ) && (
                          <span className="text-orange-500 font-medium ml-1">
                            ⚠️ Refresh soon
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 mt-1">Not connected</p>
                  )}
                </div>
              </div>
              {twitterAccount ? (
                <SocialAccountActions
                  accountId={twitterAccount.id}
                  platform="Twitter"
                  accountHandle={
                    (twitterAccount.account_handle || twitterAccount.account_name || "Twitter User") as string
                  }
                />
              ) : (
                <Link href="/api/auth/twitter">
                  <Button size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Connect Twitter
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>

        {/* API Usage */}
        <Card>
          <CardHeader>
            <CardTitle>API Usage</CardTitle>
            <CardDescription>
              Monitor your AI content generation usage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  AI Generations this month
                </span>
                <span className="font-semibold">0 / Unlimited</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tokens used</span>
                <span className="font-semibold">0</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="mt-6 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
            <CardDescription>Irreversible actions</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" size="sm">
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
