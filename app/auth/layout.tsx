export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center gradient-primary p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 animate-slide-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-xl mb-4">
            <span className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">C</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">ClientMS</h1>
          <p className="text-blue-100">Client Management System</p>
        </div>
        
        {/* Auth Content */}
        <div className="animate-scale-in">
          {children}
        </div>
      </div>
    </div>
  )
}
