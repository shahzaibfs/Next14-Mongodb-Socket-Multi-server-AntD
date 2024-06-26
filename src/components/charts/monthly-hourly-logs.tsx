"use client";
import * as d3 from "d3";
import { motion } from "framer-motion";
import useMeasure from "react-use-measure";
import { type ReactNode, useMemo, useState, useRef } from "react";
import withErrorBoundary from "@/hocs/with-error-boundry";
import { differenceInSeconds, endOfDay, endOfHour, format, formatDistance, formatDuration, startOfDay, startOfHour } from "date-fns";
import { Popover, Table } from "antd";
import { prettyPrintJson } from "pretty-print-json";


const MARGINS = {
    left: 80,
    right: 60,
    top: 40,
    bottom: 40,
};

function MonthlyHourlyLogs({
    in_outs,
    classNames
}: {
    in_outs: { in: Date, out: Date }[];
    children?: ReactNode;
    classNames?: string
}) {
    const [ref, { height, width, left, top }] = useMeasure();
    const [tooltipOptions, setToolTipOptions] = useState<null | { x: number, y: number }>(null)
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    const processedSvg = useMemo(() => {
        try {
            const DIMENSIONS = {
                width: width ?? 0,
                height: height ?? 0,
            };
            if (!DIMENSIONS.height || !DIMENSIONS.width) return null;

            const minInDate = d3.min(in_outs, function (d) { return d.in; });
            const maxOutDate = d3.max(in_outs, function (d) { return d.out; });

            if (!minInDate || !maxOutDate) return null

            // we just need 24 hour format here ......
            const xScale = d3.scaleTime()
                .domain([
                    startOfDay(minInDate),
                    endOfDay(minInDate)
                ])
                .range([MARGINS.left, DIMENSIONS.width - MARGINS.right]);


            const yScale = d3.scaleTime()
                .domain([startOfDay(minInDate), endOfDay(maxOutDate)])
                .range([DIMENSIONS.height - MARGINS.top, MARGINS.bottom])


            return {
                xTicks: xScale.ticks(DIMENSIONS.width / 100).map((date) => {
                    return {
                        axis: {
                            x: xScale(date),
                            y: DIMENSIONS.height - MARGINS.top * 0.2,
                            label: format(date, "H") + "h"
                        }
                    }
                }),
                yTicks: yScale.ticks(Math.min(DIMENSIONS.height / 40, 14)).map((date) => {
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
                logsDimensions: in_outs.map((log, idx) => {

                    const inTime = log.in
                    const outTime = log.out

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
                        idx,
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
        } catch (error) {
            console.log({ error })
            return null
        }
    }, [width, height, in_outs]);

    const handleMouseMove = (e: any) => {
        if (!wrapperRef.current) return
        const bounding = wrapperRef.current.getBoundingClientRect()

        const offsetX = e.clientX - bounding.left;
        const offsetY = e.clientY - bounding.top;

        setToolTipOptions({
            x: offsetX,
            y: offsetY
        })
    }

    const tooltipData = useMemo(() => {
        if (!tooltipOptions || !processedSvg) return null
        const { x, y } = tooltipOptions
        let closestDistance = Number.MAX_VALUE;
        let closestDataPoint = null;

        processedSvg.logsDimensions.forEach((dataPoint) => {
            // I am using eucludian distance here. 
            const distance = Math.sqrt(Math.pow((dataPoint.xStart + dataPoint.xEnd) / 2 - x, 2) + Math.pow(dataPoint.y - y, 2));
            if (distance < closestDistance) {
                closestDistance = distance;
                closestDataPoint = dataPoint;
            }
        });

        if (!closestDataPoint) return null
        const { xStart, xEnd, y: yStart, inTime, outTime, idx } = closestDataPoint
        return {
            idx,
            x: (Number(xStart) + Number(xEnd)) / 2,
            y: Number(yStart) + 4,
            data: {
                inTime: format(inTime, "MM-dd yyyy (hh:mm:ss a)"),
                outTime: format(outTime, "MM-dd yyyy (hh:mm:ss a)"),
                TotalSpent: formatDistance(outTime, inTime)
            }
        }
    }, [tooltipOptions, processedSvg])


    if (!in_outs) return null

    return (

        <div className={` ${classNames}`} >
            <div ref={r => {
                ref(r)
                wrapperRef.current = r;
            }} className="overflow-auto w-full h-full" onMouseLeave={() => setToolTipOptions(null)} onMouseMove={handleMouseMove}>
                <svg width={"100%"} height={"100%"} >
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
                                return <g key={`${log.label} ${idx}`}>
                                    <motion.rect
                                        height={10}
                                        x={log.xStart}
                                        y={log.y}
                                        rx="20"
                                        ry="20"
                                        fill="#3CB9BC"
                                        viewport={{ once: true }}
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{
                                            opacity: (tooltipData?.idx === idx || !tooltipData?.idx) ? 1 : 0.3, width: log.width
                                        }}
                                        exit={{
                                            opacity: 0, width: 0
                                        }}
                                        transition={{
                                            duration: 0.2
                                        }}
                                    />
                                </g>
                            })}
                            <motion.line
                                x1={processedSvg.xStart}
                                x2={processedSvg.xStart}
                                y1={processedSvg.DIMENSIONS.height - MARGINS.top}
                                y2={MARGINS.bottom}
                                className="stroke-slate-400 "
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
                    {
                        tooltipData && <>
                            <line x1={0} x2={width} y1={tooltipData.y} y2={tooltipData.y} stroke="#3CB9BC82" strokeWidth={2} strokeDasharray={"10 5"} />
                            <line x1={tooltipData.x} x2={tooltipData.x} y1={0} y2={height} stroke="#3CB9BC82" strokeWidth={2} strokeDasharray={"10 5"} />
                            <Popover
                                key={tooltipData.x + tooltipData.y}
                                open={!!tooltipData}
                                overlayClassName="max-w-sm rounded-md"
                                overlayInnerStyle={{
                                    borderRadius: "12px"
                                }}
                                content={tooltipData && <>
                                    <Table
                                        pagination={false}
                                        columns={[
                                            { title: "Time In", dataIndex: "in" },
                                            { title: "Time Out", dataIndex: "out" },
                                            { title: "total", dataIndex: "total", className: "whitespace-nowrap  " }
                                        ]}
                                        dataSource={[
                                            {
                                                in: tooltipData.data.inTime,
                                                out: tooltipData.data.outTime,
                                                total: tooltipData.data.TotalSpent
                                            }
                                        ]}
                                    />
                                </>}
                            >
                                <circle r={1} fill="#3CB9BC" cx={tooltipData.x} cy={tooltipData.y} />
                            </Popover>
                        </>
                    }
                </svg>
            </div>
        </div>
    )
}


export default withErrorBoundary(MonthlyHourlyLogs)

