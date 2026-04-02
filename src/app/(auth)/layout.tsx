export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-eth-blue text-white font-bold text-xl">
            V
          </div>
          <h1 className="mt-4 text-2xl font-bold">Vault</h1>
          <p className="text-sm text-muted-foreground">
            Ethereum &amp; Solana Wallet
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
