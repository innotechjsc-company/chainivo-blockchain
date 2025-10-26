export const Logo = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center animate-glow">
        <span className="text-2xl font-bold">₿</span>
      </div>
      <span className="text-xl font-bold gradient-text">CryptoHub</span>
    </div>
  );
};
