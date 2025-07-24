import { IconType } from "react-icons";
import { VariantProps, cva } from "class-variance-authority";

import { cn, formatCurrency, formatPercentage } from "@/lib/utils";
import { CountUp } from "./count-up";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Skeleton } from "./ui/skeleton";

// Use softer color tones, making them lighter and whitish
const boxVariant = cva("shrink-0 rounded-md p-3", {
  variants: {
    variant: {
      default: "bg-blue-100", // Lighter blue background
      success: "bg-emerald-100", // Light green for success
      danger: "bg-red-100", // Light red for danger
      warning: "bg-yellow-100", // Light yellow for warning
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

// Icons are also made softer in color, to blend with the lighter theme
const iconVariant = cva("size-6", {
  variants: {
    variant: {
      default: "fill-blue-400", // Softer blue for icons
      success: "fill-emerald-400", // Softer green
      danger: "fill-red-400", // Softer red
      warning: "fill-yellow-400", // Softer yellow
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type boxVariant = VariantProps<typeof boxVariant>;
type iconVariant = VariantProps<typeof iconVariant>;

interface DataCardProps extends boxVariant, iconVariant {
  icon: IconType;
  title: string;
  value?: number;
  dateRange: string;
  percentageChange?: number;
}

export const DataCard = ({
  icon: Icon,
  title,
  value = 0,
  variant,
  dateRange,
  percentageChange = 0,
}: DataCardProps) => {
  return (
    <Card className="border-none shadow-md bg-white z-20">
      {" "}
      {/* Card background is whitish */}
      <CardHeader className="flex flex-row items-center justify-between gap-x-4">
        <div className="space-y-2">
          <CardTitle className="text-xl text-gray-800 line-clamp-1">
            {" "}
            {/* Softer text color */}
            {title}
          </CardTitle>
          <CardDescription className="text-sm text-gray-500 line-clamp-1">
            {dateRange}
          </CardDescription>
        </div>
        <div className={cn(boxVariant({ variant }))}>
          <Icon className={cn(iconVariant({ variant }))} />
        </div>
      </CardHeader>
      <CardContent>
        <h1 className="font-bold text-3xl text-gray-800 mb-2 line-clamp-1 break-all">
          <CountUp
            preserveValue
            start={value}
            end={value}
            decimals={2}
            decimalPlaces={2}
            formattingFn={formatCurrency}
          />
        </h1>
      </CardContent>
    </Card>
  );
};

// Loading state version with lighter color tones
export const DataCardLoading = () => {
  return (
    <Card className="border-none shadow-md bg-white h-[192px]">
      <CardHeader className="flex flex-row items-center justify-between gap-x-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-24 bg-gray-200" />{" "}
          {/* Lighter skeletons */}
          <Skeleton className="h-4 w-40 bg-gray-200" />
        </div>
        <Skeleton className="size-12 bg-gray-200" />
      </CardHeader>
      <CardContent>
        <Skeleton className="shrink-0 h-10 w-24 mb-2 bg-gray-200" />
        <Skeleton className="shrink-0 h-4 w-40 bg-gray-200" />
      </CardContent>
    </Card>
  );
};
