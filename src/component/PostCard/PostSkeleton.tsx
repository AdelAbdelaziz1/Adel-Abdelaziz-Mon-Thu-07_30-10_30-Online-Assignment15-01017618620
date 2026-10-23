import { Skeleton } from "@heroui/react";
import React from "react";

export default function PostSkeleton() {
  return (
    <>
      {[0, 1, 2].map((index) => {
        return (
          <React.Fragment key={index}>
            <div className="shadow-panel w-[15.62rem] space-y-5 rounded-lg bg bg-transparent p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-36 rounded-lg" />
                  <Skeleton className="h-2 w-24 rounded-lg" />
                </div>
              </div>
              <Skeleton className="h-32 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-3/5 rounded-lg" />
                <Skeleton className="h-4 w-3/5 rounded-lg" />
                <Skeleton className="h-2 w-3/5 rounded-lg" />
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </>
  );
}
