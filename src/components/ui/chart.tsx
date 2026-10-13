
type ChartTooltipItem = {
  dataKey?: string | number;
  name?: string | number;
  value?: string | number;
  color?: string;
  payload?: Record<string, unknown> & { fill?: string };
};

type ChartTooltipContentProps = Omit<
  React.ComponentProps<"div">,
  "color"
> & {
  active?: boolean;
  payload?: ChartTooltipItem[];
  label?: unknown;
  indicator?: "line" | "dot" | "dashed";
  hideLabel?: boolean;
  hideIndicator?: boolean;
  labelFormatter?: (
    label: unknown,
    payload: ChartTooltipItem[]
  ) => React.ReactNode;
  labelClassName?: string;
  formatter?: (
    value: string | number | undefined,
    name: string | number | undefined,
    item: ChartTooltipItem,
    index: number,
    payload: unknown
  ) => React.ReactNode;
  color?: string;
  nameKey?: string;
  labelKey?: string;
};

type ChartLegendItem = {
  dataKey?: string | number;
  value?: string | number;
  color?: string;
};

type ChartLegendContentProps = Omit<
  React.ComponentProps<"div">,
  "color"
> & {
  payload?: ChartLegendItem[];
  verticalAlign?: "top" | "middle" | "bottom";
  hideIcon?: boolean;
  nameKey?: string;
};
