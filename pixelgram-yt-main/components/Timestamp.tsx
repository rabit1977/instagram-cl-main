"use client";

import ReactTimeago from "react-timeago";
import { cn } from "@/lib/utils";

type Props = {
  createdAt: Date;
  className?: string;
};

const formatTimeUnit = (value: number, unit: string): string => {
  // Example: if it's 7 min, return "7m"; if it's 7 hours, return "7h" like that
  return `${value}${unit[0]}`;
};

function Timestamp({ createdAt, className }: Props) {
  return (
    <ReactTimeago
      className={cn(
        "font-medium text-neutral-500 dark:text-neutral-400 text-xs",
        className
      )}
      date={createdAt}
      formatter={(value, unit, suffix, epochMilliseconds, nextFormatter) => {
        if (["second", "minute", "hour", "day", "week", "month", "year"].includes(unit)) {
          return formatTimeUnit(value, unit);
        } else {
          return nextFormatter?.(value, unit, suffix, epochMilliseconds);
        }
      }}
    />
  );
}

export default Timestamp;
