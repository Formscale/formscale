// "use client";

// import { createContext, useContext, ReactNode, useState } from "react";
// import { Roles, SubscriptionTier } from "@formhook/types";

// interface User {
//   id: string;
//   email: string;
//   name: string;
//   role: Roles;
//   subscriptionTier: SubscriptionTier;
//   verified: boolean;
// }

// interface UserContext {
//   user: User | null;
//   setUser: (user: User | null) => void;
//   isLoading: boolean;
//   logout: () => void;
// }

// const UserContext = createContext<UserContext | undefined>(undefined);

// export function UserProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   const logout = () => {
//     setUser(null);
//   };

//   const value = {
//     user,
//     setUser,
//     isLoading,
//     logout,
//   };

//   return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
// }

// export const useUser = () => {
//   const context = useContext(UserContext);
//   if (!context) throw new Error("useUser must be used within UserProvider");
//   return context;
// };
