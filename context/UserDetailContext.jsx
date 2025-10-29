import React, { createContext, useContext, useState } from "react";

// Create a context to manage user details
export const UserDetailContext = createContext();

/**
 * UserDetailProvider component that wraps the application to provide user authentication status
 * and user profile information throughout the component tree
 */
export const UserDetailProvider = ({ children }) => {
    const [userDetail, setUserDetail] = useState(null);
    const [isLoading] = useState(false);

    // In UI-only mode, there is no backend. Consumers can set userDetail
    // directly via setUserDetail if needed.
    const getUserDetail = async () => {
        return userDetail;
    };

    return (
        <UserDetailContext.Provider
            value={{
                userDetail,
                setUserDetail,
                getUserDetail,
                isLoading
            }}
        >
            {children}
        </UserDetailContext.Provider>
    );
};

// Custom hook for using the user detail context
export const useUserDetail = () => {
    const context = useContext(UserDetailContext);
    if (context === undefined) {
        throw new Error("useUserDetail must be used within a UserDetailProvider");
    }
    return context;
};