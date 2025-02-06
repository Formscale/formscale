import { AuthProvider } from "@/providers/auth-provider";
import { UserProvider } from "@/providers/user-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <UserProvider>{children}</UserProvider>
    </AuthProvider>
  );
}
