import Footer from "@/components/footer";
import { Header } from "@/components/header";

// export const runtime = "edge";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-center min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
