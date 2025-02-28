"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GoogleDriveIcon } from "@/components/file-picker/icons";
import { useState } from "react";
import { FilePicker } from "@/components/file-picker/FilePicker";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 h-screen flex flex-col items-center justify-center">
          <div className="w-full max-w-md">
            <Card className="p-8 backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 shadow-xl border-0 rounded-2xl">
              <div className="flex flex-col items-center space-y-8">
                {/* Logo and Title Section */}
                <div className="text-center space-y-4">
                  <div className="inline-block p-4 bg-blue-50 dark:bg-blue-900/30 rounded-full">
                    <GoogleDriveIcon className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight dark:text-white">
                      Welcome to FilePicker
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                      Connect your Google Drive to get started
                    </p>
                  </div>
                </div>

                {/* Features Section */}
                <div className="w-full grid grid-cols-2 gap-4 py-6">
                  {[
                    "Easy Access",
                    "Secure Login",
                    "Fast Sync",
                    "File Management",
                  ].map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center justify-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm text-gray-600 dark:text-gray-300"
                    >
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <Button
                  size="lg"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                  onClick={() => setIsLoggedIn(true)}
                >
                  Sign in with Google
                </Button>

                {/* Footer Text */}
                <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                  By continuing, you agree to our Terms of Service and Privacy
                  Policy
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <FilePicker />
      </div>
    </div>
  );
}
