"use client";
import * as d3 from "d3";
import { Popover } from "antd";
import { motion } from "framer-motion";
import useMeasure from "react-use-measure";
import { ReactNode, useEffect, useState } from "react";
import withErrorBoundary from "@/hocs/with-error-boundry";
import { endOfDay, endOfHour, endOfMonth, format, getDaysInMonth, parseISO, startOfDay, startOfHour, startOfMonth } from "date-fns";

interface ProcessedSvg {
    xTicks: {
        axis: {
            x: number;
            y: number;
            label: string;
        };
    }[];
    yTicks: {
        tickLine: {
            x1: number;
            x2: number;
            y1: number;
            y2: number;
        };
        axis: {
            x: number;
            y: number;
            label: string;
        };
    }[];
    xStart: number;
    DIMENSIONS: {
        width: number;
        height: number;
    };
    logsDimensions: {
        xStart: number;
        xEnd: number;
        inTime: Date;
        outTime: Date;
        width: number;
        y: number;
        label: string;
    }[]
}

const MARGINS = {
    left: 10,
    right: 10,
    top: 30,
    bottom: 40,
    xaxis: 80
};

function MonthlyHourlyLogs({
    in_outs,
    children
}: {
    in_outs: { in: string, out: string }[];
    children?: ReactNode
}) {
    const [processedSvg, setProcessedSvg] = useState<ProcessedSvg | null>(null);
    const [ref, { height, width }] = useMeasure();
    useEffect(() => {
        initD3Data();
    }, [height, width]);


    function initD3Data() {
        const DIMENSIONS = {
            width: width ?? 0,
            height: height ?? 0,
        };
        if (!DIMENSIONS.height || !DIMENSIONS.width) return null;

        const todayMonth = new Date(2024, 0, 1)

        const xScale = d3.scaleTime()
            .domain([startOfDay(todayMonth), endOfDay(todayMonth)])
            .range([MARGINS.xaxis, DIMENSIONS.width - MARGINS.right])


        const yScale = d3.scaleTime()
            .domain([startOfMonth(todayMonth), endOfMonth(todayMonth)])
            .range([DIMENSIONS.height - MARGINS.top, MARGINS.bottom])

        const processedSvg = {
            xTicks: xScale.ticks(24).map((date) => {
                return {
                    axis: {
                        x: xScale(date),
                        y: DIMENSIONS.height,
                        label: format(date, "HH") + "h"
                    }
                }
            }),
            yTicks: yScale.ticks(getDaysInMonth(todayMonth)).map((date) => {
                return {
                    tickLine: {
                        x1: MARGINS.xaxis, x2: DIMENSIONS.width - MARGINS.right, y1: yScale(date), y2: yScale(date)
                    },
                    axis: {
                        x: MARGINS.left,
                        y: ((yScale(endOfHour(date)) + yScale(startOfHour(date))) / 2),
                        label: format(date, "dd MMM")
                    }
                }
            }),
            xStart: MARGINS.xaxis,
            DIMENSIONS,
            logsDimensions: in_outs.map((log) => {

                const inTime = parseISO(log.in)
                const outTime = parseISO(log.out)

                // Used to get the dynamic Px values based on different dates timezones
                const logXScale = d3.scaleTime()
                    .domain([startOfDay(inTime), endOfDay(outTime)])
                    .range([MARGINS.xaxis, DIMENSIONS.width - MARGINS.right]);

                const _xStart = logXScale(inTime);
                const xEnd = logXScale(outTime);

                return {
                    xStart: _xStart,
                    xEnd,
                    inTime,
                    outTime,
                    width: xEnd - _xStart,
                    y: yScale(inTime),
                    label: `${format(inTime, "dd-MMM HH:MM:ss a")}-${format(outTime, "dd-MMM HH:MM:ss a")}`
                }
            })
        };

        setProcessedSvg(processedSvg);
        console.log({ processedSvg })
    }
    return (
        <div className="min-w-screen overflow-auto" style={{ height: 820 }}>
            <svg ref={ref} width={"100%"} height={"100%"} className="min-w-[1024px]">
                {
                    processedSvg &&
                    <>
                        {processedSvg.xTicks.map(tick => {
                            return <g key={tick.axis.label}>
                                <motion.text
                                    x={tick.axis.x}
                                    y={tick.axis.y}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5, duration: 0.4 }}
                                >
                                    {tick.axis.label}
                                </motion.text>
                            </g>
                        })}
                        {processedSvg.yTicks.map(tick => {
                            return <g key={tick.axis.label}>
                                <motion.text
                                    x={tick.axis.x}
                                    y={tick.axis.y}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5, duration: 0.4 }}
                                >
                                    {tick.axis.label}
                                </motion.text>
                                <motion.line
                                    x1={tick.tickLine.x1}
                                    x2={tick.tickLine.x2}
                                    y1={tick.tickLine.y1}
                                    y2={tick.tickLine.y2}
                                    className="stroke-slate-400"
                                    style={{ strokeDasharray: "10 5" }}
                                />
                            </g>
                        })}
                        {processedSvg.logsDimensions.map(log => {
                            return <g key={log.label}>
                                <rect
                                    width={log.width}
                                    height={10}
                                    x={log.xStart}
                                    y={log.y}
                                    rx="20"
                                    ry="20"
                                    fill="#11b9ec"
                                />
                            </g>
                        })}
                        <motion.line
                            x1={processedSvg.xStart}
                            x2={processedSvg.xStart}
                            y1={processedSvg.DIMENSIONS.height - MARGINS.top}
                            y2={MARGINS.bottom}
                            className="stroke-slate-400"
                        />
                        <motion.line
                            x1={processedSvg.xStart}
                            x2={processedSvg.DIMENSIONS.width - MARGINS.right}
                            y1={processedSvg.DIMENSIONS.height - MARGINS.top}
                            y2={processedSvg.DIMENSIONS.height - MARGINS.top}
                            className="stroke-slate-400"
                        />
                    </>
                }
            </svg>
        </div>
    )
}


export default withErrorBoundary(MonthlyHourlyLogs)

