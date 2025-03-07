export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="flex flex-col items-start justify-center gap-1 w-full max-w-md px-5 sm:px-0">{children}</div>;
}
