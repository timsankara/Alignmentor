"use client";

import { useUser } from "@auth0/nextjs-auth0/client";

export default function ProfileClient() {
  const { user, error, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="animate-pulse space-y-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
          <p className="text-gray-800 text-center">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    user && (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full transform transition-all hover:scale-105">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-gray-200 rounded-full blur"></div>
            <img
              src={user.picture ?? "/api/placeholder/96/96"}
              alt={user.name ?? "Profile Picture"}
              className="relative w-24 h-24 mx-auto rounded-full object-cover border-4 border-white shadow-lg"
            />
          </div>

          <div className="text-center space-y-4">
            <h2 className="text-2xl font-medium text-gray-900 tracking-tight">
              {user.name ?? "User"}
            </h2>
            <p className="text-gray-600 font-light">
              {user.email ?? "No email provided"}
            </p>

            <div className="pt-6">
              <button className="bg-gradient-to-b from-gray-800 to-black text-white px-6 py-2 rounded-full text-sm font-medium transform transition-all hover:scale-105 hover:shadow-lg">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
