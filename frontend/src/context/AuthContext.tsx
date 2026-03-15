// import React, { createContext, useContext, useState, useEffect } from 'react';

// import type {ReactNode} from 'react'
// import type { User, UserInfo } from '../types/User';

// interface AuthContextType {
//   user: UserInfo | null;
//   isAuthenticated: boolean;
//   isAdmin: boolean;
//   loading: boolean;
//   login: (userInfo: UserInfo) => void;
//   logout: () => void;
//   updateUser: (name: string) => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<UserInfo | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const storedUser = localStorage.getItem('user-info');
//     if (storedUser) {
//       try {
//         const userInfo = JSON.parse(storedUser);
//         setUser(userInfo);
//       } catch (error) {
//         console.error('Error parsing stored user info:', error);
//         localStorage.removeItem('user-info');
//       }
//     }
//     setLoading(false);
//   }, []);

//   const login = (userInfo: UserInfo) => {
//     setUser(userInfo);
//     localStorage.setItem('user-info', JSON.stringify(userInfo));
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('user-info');
//   };

//   const updateUser = (name: string) => {
//     if (user) {
//       const updatedUser = { ...user, name };
//       setUser(updatedUser);
//       localStorage.setItem('user-info', JSON.stringify(updatedUser));
//     }
//   };

//   const value = {
//     user,
//     isAuthenticated: !!user,
//     isAdmin: user?.role === 'admin',
//     loading,
//     login,
//     logout,
//     updateUser,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };