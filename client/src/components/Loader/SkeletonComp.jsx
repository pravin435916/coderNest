import React from 'react'
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
const SkeletonComp = () => (
    <div className="w-full flex flex-col bg-gray-100 rounded-md mb-4 p-4 abel-regular">
      <div className="flex items-center gap-2">
        <Skeleton circle={true} height={32} width={32} />
        <div className="flex flex-col gap-1">
          <Skeleton width={100} />
          <Skeleton width={60} />
        </div>
      </div>
      <div className="mt-2">
        <Skeleton count={3} />
      </div>
      <div className="w-full sm:w-[80%] h-48 mt-4 rounded-sm">
        <Skeleton height="100%" />
      </div>
      <div className="flex justify-between sm:justify-start gap-4 mt-4">
        <Skeleton width={50} />
        <Skeleton width={50} />
        <Skeleton width={50} />
      </div>
    </div>
  );
export default SkeletonComp  
