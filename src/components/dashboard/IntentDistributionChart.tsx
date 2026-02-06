import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts";
import { BarChart3 } from "lucide-react";

const data = [
  { name: "High (70-100)", count: 12, fill: "hsl(152 60% 48%)" },
  { name: "Medium (40-69)", count: 8, fill: "hsl(45 93% 58%)" },
  { name: "Low (0-39)", count: 5, fill: "hsl(0 84% 60%)" },
];

export function IntentDistributionChart() {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Intent Distribution</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 16, top: 4, bottom: 4 }}>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              width={110}
              tick={{ fontSize: 12, fill: "hsl(230 10% 55%)" }}
              axisLine={false}
              tickLine={false}
            />
            <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={24}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>25 total visitors tracked</span>
          <span>Last 24 hours</span>
        </div>
      </CardContent>
    </Card>
  );
}
