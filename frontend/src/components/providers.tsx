import { AuthProvider, ErrorProvider, UserProvider } from "@/providers";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorProvider>
      <UserProvider>
        <AuthProvider>{children}</AuthProvider>
      </UserProvider>
    </ErrorProvider>
  );
}
