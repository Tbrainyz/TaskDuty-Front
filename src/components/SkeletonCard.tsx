const SkeletonCard = () => {
  return (
    <div className="animate-pulse bg-white rounded border border-gray-100 shadow-[0_4px_4px_rgba(0,0,0,0.1)] px-[35px] pt-[24px] pb-[50px] flex flex-col gap-[35px]">
      {/* Top */}
      <div className="flex flex-col gap-3">
        <div className="w-20 h-4 bg-gray-200 rounded" />
        <div className="w-48 h-5 bg-gray-200 rounded" />
        <div className="w-full h-4 bg-gray-200 rounded" />
        <div className="w-3/4 h-4 bg-gray-200 rounded" />
      </div>
      {/* Bottom */}
      <div className="flex items-center justify-between">
        <div className="w-[200px] h-8 bg-gray-200 rounded" />
        <div className="flex gap-3">
          <div className="w-24 h-10 bg-gray-200 rounded-lg" />
          <div className="w-24 h-10 bg-gray-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
