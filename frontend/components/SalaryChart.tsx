"use client"

import { TrendingUp } from "lucide-react"
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"

export const description = "A radial chart with text"

const chartData = [
  { browser: "safari", visitors: 20, fill: "#af7eff" },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function SalaryChart() {
  return (
    <Card className="flex flex-col mt-20 mb-2 backdrop-blur-sm">
      <CardHeader className="items-start pb-0">
        <CardTitle className="text-white">Salary Received</CardTitle>
        <CardDescription>October 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center pb-0 h-full">
        <ChartContainer
          config={chartConfig}
          className="mx-auto"
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={250}
            innerRadius={140}
            outerRadius={190}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="fill-black-200"
              className="first:fill-black-200 last:fill-black"
              polarRadius={[150, 130]}
              fill="#af7eff"
            />
            <RadialBar dataKey="visitors" background cornerRadius={10} fill="#af7eff"/>
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false} fill="#9768e3">
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-white  text-4xl font-bold"
                          style={{ fontSize: '5rem', fontWeight: 'bold' }}
                        >
                          {chartData[0].visitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 42}
                          className="fill-muted-foreground"
                          style={{ fontSize: '1rem', fontWeight: 'light' }}
                        >
                          ETH
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
