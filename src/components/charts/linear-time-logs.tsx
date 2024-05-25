"use client";
import * as d3 from "d3";
import { motion } from "framer-motion";
import useMeasure from "react-use-measure";
import { ReactNode, useEffect, useState } from "react";
import withErrorBoundary from "@/hocs/with-error-boundry";
import { format, parseISO, startOfDay, subDays } from "date-fns";

interface ProcessedSvg {
    xTicks: {
        line: {
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
    yTicks: {
        line: {
            x1: number;
            x2: number;
            y1: number;
            y2: number;
        };
        axis: {
            x: number;
            y: number;
            label: number;
        };
    }[];
    logs: {
        width: number;
        x: number;
        y: number;
        height: number;
    }[]
}
const MARGINS = {
    left: 60,
    right: 60,
    top: 40,
    bottom: 40,
};

function LinearTimeLogs({
    data,
    children,
    classNames
}: {
    data: { date: string, value: number }[];
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

        const dateEnd = startOfDay(new Date())
        const dateStart = startOfDay(subDays(dateEnd, 6));


        const xScale = d3.scaleTime()
            .domain([dateStart, dateEnd])
            .range([MARGINS.left, DIMENSIONS.width - MARGINS.right])


        const yScale = d3.scaleLinear()
            .domain([0, 80])
            .range([DIMENSIONS.height - MARGINS.top, MARGINS.bottom])


        const processedSvg = {
            xTicks: xScale.ticks(7).map((date) => {
                return {
                    line: {
                        x1: xScale(date),
                        x2: xScale(date),
                        y1: DIMENSIONS.height - MARGINS.bottom,
                        y2: MARGINS.top
                    },
                    axis: {
                        x: xScale(date),
                        y: DIMENSIONS.height,
                        label: format(date, DIMENSIONS.width > 768 ? "EEE" : "EEEEE")
                    }
                }
            }),
            yTicks: yScale.ticks(3).map((n) => {
                return {
                    line: {
                        x1: MARGINS.left,
                        x2: DIMENSIONS.width - MARGINS.right,
                        y1: yScale(n),
                        y2: yScale(n),
                    },
                    axis: {
                        x: MARGINS.left - MARGINS.bottom,
                        y: yScale(n),
                        label: Math.round(n)
                    }
                }
            }),
            logs: data.map(({ date, value }, idx) => {
                const y = yScale(value);
                const height = DIMENSIONS.height - MARGINS.bottom - y;
                const x = xScale(startOfDay(parseISO(date)));

                if (x < MARGINS.left || x > (DIMENSIONS.width - MARGINS.right)) {
                    return null
                }

                return {
                    width: 7,
                    x,
                    date: parseISO(date),
                    y: y,
                    height: height,
                }
            }).filter((d): d is NonNullable<typeof d> => d !== null)
        };

        setProcessedSvg(processedSvg);
    }
    return (
        <div className={`grid ${classNames}`}>
            <div className="min-w-full overflow-auto w-full h-full" >
                <svg ref={ref} width={"100%"} height={"100%"} className="">
                    {
                        processedSvg &&
                        <>
                            {processedSvg.xTicks.map(tick => {
                                return <g key={tick.axis.label}>
                                    <motion.text
                                        textAnchor={"middle"}
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
                            {processedSvg.yTicks.map((tick, idx) => {
                                return <g key={tick.axis.label}>
                                    <motion.text
                                        x={tick.axis.x}
                                        y={tick.axis.y}
                                        dy={5}
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        fill={"#1D2A30"}
                                    >
                                        {tick.axis.label}
                                    </motion.text>
                                    <line
                                        x1={tick.line.x1}
                                        x2={tick.line.x2}
                                        y1={tick.line.y1}
                                        y2={tick.line.y2}
                                        stroke={"#3CB9BC40"}
                                        strokeDasharray={idx === 0 ? "" : "10 5"}
                                    />
                                </g>
                            })}
                            {processedSvg.logs.map(((log, idx) => {
                                return <g key={idx}>
                                    <motion.rect
                                        width={log.width}
                                        x={log.x}
                                        y={log.y}
                                        rx="5"
                                        ry="5"
                                        fill="#3CB9BC"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: log.height }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                    />
                                    <motion.circle
                                        r={15 / 2}
                                        strokeWidth={1.5}
                                        stroke="white"
                                        cx={log.x + (log.width / 2)}
                                        fill="#0C6466"
                                        initial={{ opacity: 0, cy: 0 }}
                                        animate={{ opacity: 1, cy: log.y + (log.width / 2) }}
                                        transition={{ delay: 0.3, duration: 0.4 }}
                                    />
                                </g>
                            }))}
                        </>
                    }
                </svg>
            </div>
        </div>
    )
}


export default withErrorBoundary(LinearTimeLogs)

