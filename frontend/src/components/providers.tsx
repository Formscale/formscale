import { AuthProvider, ErrorProvider, UserProvider } from "@/providers";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorProvider>
      <AuthProvider>
        <UserProvider>{children}</UserProvider>
      </AuthProvider>
    </ErrorProvider>
  );
}
