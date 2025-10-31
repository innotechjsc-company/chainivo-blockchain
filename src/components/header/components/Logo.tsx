export const Logo = () => {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-10 h-10  flex items-center justify-center overflow-hidden">
        <img
          src="/logo hinh.png"
          alt="Chainivo logo"
          className="w-8 h-8 object-contain block border-0 outline-none ring-0 shadow-none select-none"
        />
      </div>
      <span className="text-xl font-bold gradient-text">Chainivo</span>
    </div>
  );
};
