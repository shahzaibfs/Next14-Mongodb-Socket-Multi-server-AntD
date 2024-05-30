"use client";
import * as d3 from "d3";
import { motion } from "framer-motion";
import useMeasure from "react-use-measure";
import { ReactNode, useEffect, useMemo, useState } from "react";
import withErrorBoundary from "@/hocs/with-error-boundry";
import { format, parseISO, startOfDay, subDays } from "date-fns";
import { Popover } from "antd";
import { prettyPrintJson } from "pretty-print-json";


const MARGINS = {
    left: 60,
    right: 60,
    top: 40,
    bottom: 40,
};

function LinearTimeLogs({
    data,
    children,
    classNames,
}: {
    data: { date: Date; value: number }[];
    children?: ReactNode;
    classNames?: string;
}) {
    const [ref, { height, width, left, top }] = useMeasure();
    const [tooltipOptions, setToolTipOptions] = useState<null | { x: number, y: number }>(null)


    const processedSvg = useMemo(() => {
        const DIMENSIONS = {
            width: width ?? 0,
            height: height ?? 0,
        };
        if (!DIMENSIONS.height || !DIMENSIONS.width) return null;

        const dateExtent = d3.extent(data.map(d => d.date)) as [Date, Date]
        const dateEnd = startOfDay(dateExtent[0]);
        const dateStart = startOfDay(dateExtent[1]);

        const xScale = d3
            .scaleTime()
            .domain([dateStart, dateEnd])
            .range([MARGINS.left, DIMENSIONS.width - MARGINS.right]);

        const yScale = d3
            .scaleLinear()
            .domain([0, 80])
            .range([DIMENSIONS.height - MARGINS.top, MARGINS.bottom]);

        return {
            xTicks: xScale.ticks(7).map((date) => {
                return {
                    line: {
                        x1: xScale(date),
                        x2: xScale(date),
                        y1: DIMENSIONS.height - MARGINS.bottom,
                        y2: MARGINS.top,
                    },
                    axis: {
                        x: xScale(date),
                        y: DIMENSIONS.height,
                        label: format(date, DIMENSIONS.width > 768 ? "EEE" : "EEEEE"),
                    },
                };
            }),
            yTicks: yScale.ticks(Math.round(DIMENSIONS.height / 80)).map((n) => {
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
                        label: Math.round(n),
                    },
                };
            }),
            logs: data
                .map(({ date, value }, idx) => {
                    const y = yScale(value);
                    const height = DIMENSIONS.height - MARGINS.bottom - y;
                    const x = xScale(startOfDay(date));

                    if (x < MARGINS.left || x > DIMENSIONS.width - MARGINS.right) {
                        return null;
                    }

                    return {
                        width: 7,
                        x,
                        date,
                        y: y,
                        height: height,
                        value
                    };
                })
                .filter((d): d is NonNullable<typeof d> => d !== null),
        };
    }, [height, width, data]);

    const handleMouseMove = (e: any) => {
        setToolTipOptions({
            x: e.clientX as number - left,
            y: e.clientY as number - top
        })
    }
    const tooltipData = useMemo(() => {
        if (!tooltipOptions || !processedSvg) return null
        const { x, y } = tooltipOptions
        let closestDistance = Number.MAX_VALUE;
        let closestDataPoint = null;

        processedSvg.logs.forEach((dataPoint) => {
            const distance = Math.sqrt(
                Math.pow(dataPoint.x - x, 2) +
                Math.pow(dataPoint.y - y, 2)
            );
            if (distance < closestDistance) {
                closestDistance = distance;
                closestDataPoint = dataPoint;
            }
        });

        if (!closestDataPoint) return null
        const { x: xStart, y: yStart, date, value }: any = closestDataPoint
        return {
            // 7 is width of circle radius
            x: xStart + (7 / 2),
            y: yStart + (7 / 2),
            data: {
                date: format(date, "MM-dd-yyyy"),
                value
            }
        }
    }, [tooltipOptions, processedSvg])

    console.log({
        tooltipOptions
    })
    return (
        <div className={`grid ${classNames}`}>
            <div className="h-full w-full min-w-full overflow-auto">
                <svg ref={ref} width={"100%"} height={"100%"} onMouseLeave={() => setToolTipOptions(null)} onMouseMove={handleMouseMove}>
                    {processedSvg && (
                        <>
                            {processedSvg.xTicks.map((tick) => {
                                return (
                                    <g key={tick.axis.label}>
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
                                );
                            })}
                            {processedSvg.yTicks.map((tick, idx) => {
                                return (
                                    <g key={tick.axis.label}>
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
                                );
                            })}
                            {processedSvg.logs.map((log, idx) => {
                                return (
                                    <g key={idx}>
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
                                            cx={log.x + log.width / 2}
                                            fill="#0C6466"
                                            initial={{ opacity: 0, cy: 0 }}
                                            animate={{ opacity: 1, cy: log.y + log.width / 2 }}
                                            transition={{ delay: 0.3, duration: 0.4 }}
                                        />
                                    </g>
                                );
                            })}
                        </>
                    )}
                    {
                        tooltipData && <>
                            <line x1={0} x2={width} y1={tooltipData.y} y2={tooltipData.y} stroke="#3CB9BC82" strokeWidth={2} strokeDasharray={"10 5"} />
                            <line x1={tooltipData.x} x2={tooltipData.x} y1={0} y2={height} stroke="#3CB9BC82" strokeWidth={2} strokeDasharray={"10 5"} />
                            <Popover key={tooltipData.x} open={!!tooltipData} overlayClassName="max-w-sm" content={tooltipData && <>
                                <div dangerouslySetInnerHTML={{ __html: prettyPrintJson.toHtml(tooltipData.data, { indent: 10, linksNewTab: true, trailingCommas: true, lineNumbers: true }) }} />
                            </>}>
                                <circle r={15 / 2} strokeWidth={1.5} cx={tooltipData.x} cy={tooltipData.y} fill="orange" />
                            </Popover>
                        </>
                    }
                </svg>
            </div>
        </div>
    );
}

export default withErrorBoundary(LinearTimeLogs);
