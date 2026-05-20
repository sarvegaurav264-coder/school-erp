const LoadingSpinner = ({ size = 'md', text = '' }) => {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12', xl: 'w-16 h-16' };
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className="relative">
        <div className={`${sizes[size]} rounded-full border-2 border-dark-700 border-t-primary-500 animate-spin`} />
        <div className={`absolute inset-0 ${sizes[size]} rounded-full border-2 border-transparent border-b-violet-500 animate-spin`} style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
      </div>
      {text && <p className="text-sm text-dark-400 animate-pulse">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
