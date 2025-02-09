import { AuthProvider } from "@/providers/auth";
import { UserProvider } from "@/providers/user";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <UserProvider>{children}</UserProvider>
    </AuthProvider>
  );
}
