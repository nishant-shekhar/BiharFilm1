// App.js
import React, { useState, useEffect } from 'react';
import DistrictAdminDashboard from './DistrictAdminDashboard';

function MainDash() {
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get user details from localStorage or API after login
        const getUserDetails = () => {
            try {
                // This would typically come from your authentication system
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    const user = JSON.parse(storedUser);
                    setUserDetails({
                        districtId: user.districtId,
                        districtName: user.districtName,
                        userName: user.name,
                        userRole: user.role,
                        userId: user.id,
                        userAvatar: user.avatar || "/api/placeholder/40/40"
                    });
                } else {
                    // Redirect to login if no user found
                    window.location.href = '/login';
                }
            } catch (error) {
                console.error('Error loading user details:', error);
                window.location.href = '/login';
            } finally {
                setLoading(false);
            }
        };

        getUserDetails();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (!userDetails) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600">Error loading user details</p>
                    <button 
                        onClick={() => window.location.href = '/login'}
                        className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return <DistrictAdminDashboard userDetails={userDetails} />;
}

export default MainDash;
