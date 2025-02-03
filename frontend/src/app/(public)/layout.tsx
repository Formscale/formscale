import Header from "@/components/header";
import Footer from "@/components/footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-center h-screen">{children}</main>
      <Footer />
    </>
  );
}
