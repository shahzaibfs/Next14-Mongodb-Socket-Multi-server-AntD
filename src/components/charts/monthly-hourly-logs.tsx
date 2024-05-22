"use client";
import * as d3 from "d3";
import { motion } from "framer-motion";
import useMeasure from "react-use-measure";
import { ReactNode, useEffect, useState } from "react";
import withErrorBoundary from "@/hocs/with-error-boundry";
import { endOfDay, endOfHour, endOfWeek, format, parseISO, startOfDay, startOfHour, startOfWeek } from "date-fns";

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
    left: 80,
    right: 60,
    top: 40,
    bottom: 40,
};

function MonthlyHourlyLogs({
    in_outs,
    children,
    classNames
}: {
    in_outs: { in: string, out: string }[];
    children?: ReactNode;
    classNames?: string
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

        const todayMonth = new Date(2024, 0, 16)

        const xScale = d3.scaleTime()
            .domain([startOfDay(todayMonth), endOfDay(todayMonth)])
            .range([MARGINS.left, DIMENSIONS.width - MARGINS.right])


        const yScale = d3.scaleTime()
            .domain([startOfWeek(todayMonth), endOfWeek(todayMonth)])
            .range([DIMENSIONS.height - MARGINS.top, MARGINS.bottom])

        const processedSvg = {
            xTicks: xScale.ticks(DIMENSIONS.width <= 768 ? 6 : 14).map((date) => {
                return {
                    axis: {
                        x: xScale(date),
                        y: DIMENSIONS.height - MARGINS.top * 0.2,
                        label: format(date, "H") + "h"
                    }
                }
            }),
            yTicks: yScale.ticks(6).map((date) => {
                return {
                    tickLine: {
                        x1: MARGINS.left, x2: DIMENSIONS.width - MARGINS.right, y1: yScale(date), y2: yScale(date)
                    },
                    axis: {
                        x: MARGINS.left - MARGINS.bottom,
                        y: ((yScale(endOfHour(date)) + yScale(startOfHour(date))) / 2),
                        label: format(date, "dd MMM")
                    }
                }
            }),
            xStart: MARGINS.left,
            DIMENSIONS,
            logsDimensions: in_outs.map((log) => {

                const inTime = parseISO(log.in)
                const outTime = parseISO(log.out)

                // Used to get the dynamic Px values based on different dates timezones
                const logXScale = d3.scaleTime()
                    .domain([startOfDay(inTime), endOfDay(outTime)])
                    .range([MARGINS.left, DIMENSIONS.width - MARGINS.right]);

                const _xStart = logXScale(inTime);
                const xEnd = logXScale(outTime);
                const y = yScale(inTime);

                if (y < MARGINS.bottom || y > DIMENSIONS.height - MARGINS.top) {
                    return null;
                }

                return {
                    xStart: _xStart,
                    xEnd,
                    inTime,
                    outTime,
                    width: xEnd - _xStart,
                    y: y,
                    label: `${format(inTime, "dd-MMM HH:MM:ss a")}-${format(outTime, "dd-MMM HH:MM:ss a")}`
                }
            }).filter((d): d is NonNullable<typeof d> => d !== null)
        };

        setProcessedSvg(processedSvg);
    }
    return (

        <div className={` ${classNames}`}>
            <div className="overflow-auto w-full h-full" >
                <svg ref={ref} width={"100%"} height={"100%"}>
                    {
                        processedSvg &&
                        <>
                            {processedSvg.xTicks.map(tick => {
                                return <g key={tick.axis.label}>
                                    <motion.text
                                        x={tick.axis.x}
                                        y={tick.axis.y}
                                        rotate={30}
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                    >
                                        {tick.axis.label}
                                    </motion.text>
                                </g>
                            })}
                            {processedSvg.yTicks.map((tick, idx) => {
                                return <g key={tick.axis.label}>
                                    <motion.text
                                        textAnchor={"middle"}
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
                                        y1={tick.tickLine.y1}
                                        y2={tick.tickLine.y2}
                                        stroke={"#B4B4B4"}
                                        style={{ strokeDasharray: "10 5" }}
                                        initial={{ opacity: 0, x2: 0 }}
                                        animate={{ opacity: 1, x2: tick.tickLine.x2 }}
                                        transition={{ delay: 0.2 * idx, duration: 0.4 }}
                                    />
                                </g>
                            })}
                            {processedSvg.logsDimensions.map((log, idx) => {
                                return <g key={log.label}>
                                    <motion.rect
                                        height={10}
                                        x={log.xStart}
                                        y={log.y}
                                        rx="20"
                                        ry="20"
                                        fill="#3CB9BC"
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: log.width }}
                                        transition={{ delay: 0.1 * idx, duration: 0.2 }}
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
        </div>
    )
}


export default withErrorBoundary(MonthlyHourlyLogs)

