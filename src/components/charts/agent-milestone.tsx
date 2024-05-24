"use client";
import * as d3 from "d3";
import { Popover } from "antd";
import { motion } from "framer-motion";
import useMeasure from "react-use-measure";
import { type ReactNode, useEffect, useState, useMemo } from "react";
import withErrorBoundary from "@/hocs/with-error-boundry";
import { endOfMonth, format, isSameMonth, startOfMonth } from "date-fns";
import { FaInfoCircle } from "react-icons/fa";
import GroupSvg from "../group-svg";

const AnimationFrame = 0.2
export interface data {
    job: {
        startTime: Date;
        endTime: Date;
    };
    total: {
        released: string | number | undefined,
        escrowed: string | number | undefined,
    },
    released: {
        month: Date;
        escrowTime: string;
        relased_amount: string;
    }[];
    escrowed: {
        month: Date;
        escrow_amount: string;
        working_hours_amount_current: string | null;
    }[]
}

const NO_OF_TICKS = 8;
const MARGINS = {
    left: 55,
    right: 60,
    top: 10,
    bottom: 10,
};


function AgentMilestone({ classNames, data }: {
    children?: ReactNode,
    classNames?: string,
    data: data
}) {
    const [ref, { height, width }] = useMeasure();


    const processedSvg = useMemo(() => {
        if (!data) throw Error("Please Provide valid data. AGENT MILESTONE.")

        const DIMENSIONS = {
            width: width ?? 0,
            height: height ?? 0,
        };

        if (!DIMENSIONS.height || !DIMENSIONS.width) return null;

        DIMENSIONS.height += -MARGINS.top - MARGINS.bottom;

        const xScale = d3
            .scaleTime()
            .domain([
                startOfMonth(data.job.startTime),
                endOfMonth(data.job.endTime),
            ])
            .range([MARGINS.left, DIMENSIONS.width - MARGINS.right]);

        const sizeFromHeight = d3
            .scaleLinear()
            .domain([0, 1])
            .range([0, DIMENSIONS.height]);

        const rectSize = sizeFromHeight(0.2);
        const yScale = DIMENSIONS.height / 2;
        const yMiddle = yScale - rectSize / 2;

        let releasedAmount: number[] = [];
        let escrowedAmount: number[] = [];

        // extract released amount.
        data.released.forEach((d) => {
            const SOM = startOfMonth(d.month)
            const EOM = endOfMonth(d.month)

            const startPx = releasedAmount?.[0] ?? xScale(SOM)
            const endPx = releasedAmount?.[1] ?? xScale(EOM)

            releasedAmount[0] = Math.min(startPx, xScale(SOM))
            releasedAmount[1] = Math.max(endPx, xScale(EOM))
        })
        // extract escrowed amount.
        data.escrowed.forEach((d) => {
            const SOM = startOfMonth(d.month)
            const EOM = endOfMonth(d.month)

            const startPx = escrowedAmount?.[0] ?? xScale(SOM)
            const endPx = escrowedAmount?.[1] ?? xScale(EOM)

            escrowedAmount[0] = Math.min(startPx, xScale(SOM))
            escrowedAmount[1] = Math.max(endPx, xScale(EOM))
        })

        return {
            releasedAmount,
            escrowedAmount: escrowedAmount,
            totalAmounts: data.total,
            yScale,
            yMiddle,
            rectSize: rectSize,

            XAxis: xScale.ticks(NO_OF_TICKS).map((date, idx, _arr) => {
                // ==== Lines
                const lines = [
                    {
                        x1: xScale(startOfMonth(date)),
                        x2: xScale(startOfMonth(date)),
                        y1: Number(DIMENSIONS.height) - MARGINS.bottom,
                        y2: MARGINS.top,
                    },
                ];
                if (idx === _arr.length - 1) {
                    lines.push({
                        x1: xScale(endOfMonth(date)),
                        x2: xScale(endOfMonth(date)),
                        y1: Number(DIMENSIONS.height) - MARGINS.bottom,
                        y2: MARGINS.top,
                    });
                }
                // ===== Escrowed and Released Amount calcs here to prevent extra loop.
                const escrowedMonth = data.escrowed.find(d => {
                    return isSameMonth(d.month, date)
                })
                const releasedMonth = data.released.find(d => {
                    return isSameMonth(d.month, date)
                })

                return {
                    lines: lines,
                    text: {
                        raw: startOfMonth(date),
                        x:
                            (xScale(endOfMonth(date)) - xScale(startOfMonth(date))) / 2 +
                            xScale(date),
                        y: Number(DIMENSIONS.height),
                        label: format(date, "MMM (yyyy)"),
                    },
                    amount: {
                        releasedMonth,
                        escrowedMonth,
                        x:
                            (xScale(endOfMonth(date)) - xScale(startOfMonth(date))) / 2 +
                            xScale(date),
                        y: MARGINS.top + MARGINS.bottom * 2,
                        label: (releasedMonth ? releasedMonth.escrowTime : escrowedMonth?.escrow_amount) ?? "",
                    },
                    milestone: {
                        x:
                            (xScale(endOfMonth(date)) - xScale(startOfMonth(date))) / 2 +
                            xScale(date),
                        y: (yMiddle + rectSize) + 20,
                        label: `Milestone ${idx + 1}`,
                    },
                    releasedAmount: {
                        x:
                            (xScale(endOfMonth(date)) - xScale(startOfMonth(date))) / 2 +
                            xScale(date),
                        y: yMiddle - 10,
                        releasedMonth,
                        escrowedMonth,
                        label: releasedMonth?.relased_amount ?? "Nill",
                    },
                };
            }),
            DIMENSIONS,

        };

    }, [data, width, height])

    return (
        <div className={`grid ${classNames}`}>
            <div className="min-w-full overflow-auto w-full h-full" >
                <svg ref={ref} width={"100%"} height={"100%"} style={{ minHeight: 300, minWidth: 768 }}>
                    {processedSvg && (
                        <>
                            {processedSvg.XAxis.map((tick) => {
                                return (
                                    <g key={tick.text.label}>
                                        {tick.lines && (
                                            <>
                                                {tick.lines.map((line) => {
                                                    return (
                                                        <motion.line
                                                            key={line.x1}
                                                            x1={line.x1}
                                                            y1={line.y1}
                                                            x2={line.x2}
                                                            y2={line.y2}
                                                            stroke={"#3CB9BC82"}
                                                            style={{ strokeDasharray: "10 5" }}
                                                            initial={{ opacity: 0, strokeDasharray: "0" }}
                                                            animate={{ opacity: 1, strokeDasharray: "10 5" }}
                                                            transition={{ duration: AnimationFrame }}
                                                        />
                                                    );
                                                })}
                                            </>
                                        )}
                                        <motion.text
                                            textAnchor="middle"
                                            x={tick.amount.x}
                                            y={tick.amount.y}
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3, duration: AnimationFrame }}
                                            fill={"#715d5d"}

                                        >
                                            {tick.amount.label}
                                        </motion.text>
                                        <motion.text
                                            textAnchor="middle"
                                            x={tick.text.x}
                                            y={tick.text.y}
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3, duration: AnimationFrame }}
                                        >
                                            {tick.text.label}
                                        </motion.text>
                                        <motion.text
                                            textAnchor="middle"
                                            x={tick.milestone.x}
                                            y={tick.milestone.y}
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3, duration: AnimationFrame }}
                                            fill={"#715d5d"}
                                        >
                                            {tick.milestone.label}
                                        </motion.text>
                                        <GroupSvg tick={{
                                            x: tick.releasedAmount.x,
                                            y: tick.releasedAmount.y
                                        }}>
                                            <motion.text
                                                textAnchor="end"
                                                initial={{ opacity: 0, y: -20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.3, duration: AnimationFrame }}
                                                color={"#111"}
                                            >
                                                {tick.releasedAmount.label}
                                            </motion.text>
                                            {
                                                tick.releasedAmount.escrowedMonth?.working_hours_amount_current &&
                                                <Popover overlayClassName="max-w-xs" content={
                                                    <div>
                                                        <p><b>Amount Escrowed: </b>{tick.amount.label}</p>
                                                        <p><b className="text-[#1DBF73]">Amount by Working Hours: </b>{tick.releasedAmount.escrowedMonth?.working_hours_amount_current}</p>
                                                    </div>
                                                }>
                                                    <FaInfoCircle x={8} y={-12} className="cursor-pointer" />
                                                </Popover>
                                            }
                                        </GroupSvg>
                                    </g>
                                );
                            })}
                            <motion.line
                                x1="0"
                                y1={processedSvg.yScale}
                                y2={processedSvg.yScale}
                                stroke={"#3CB9BC82"}
                                style={{ strokeDasharray: "10 5" }}
                                initial={{ opacity: 0, strokeDasharray: "0", x2: 0 }}
                                animate={{
                                    opacity: 1,
                                    strokeDasharray: "10 5",
                                    x2: processedSvg.DIMENSIONS.width,
                                }}
                                transition={{ duration: AnimationFrame }}
                            />
                            <motion.rect
                                height={processedSvg.rectSize}
                                x="0"
                                y={processedSvg.yMiddle}
                                rx="20"
                                ry="20"
                                fill="#cdcdce21"
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: processedSvg.DIMENSIONS.width }}
                                transition={{ duration: 0.4, delay: AnimationFrame }}
                            />

                            {/* -------------->  Released Rect && text */}
                            <g>
                                <motion.rect
                                    height={processedSvg.rectSize}
                                    x={processedSvg?.releasedAmount?.[0]}
                                    y={processedSvg.yMiddle}
                                    rx="4"
                                    ry="4"
                                    fill="#1DBF73"
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{
                                        opacity: 1,
                                        width:
                                            Number(processedSvg.releasedAmount?.[1]) -
                                            Number(processedSvg?.releasedAmount[0]),
                                    }}
                                    transition={{ duration: AnimationFrame, delay: 0.8 }}
                                />
                                <motion.text
                                    // TODO: Instead We can use Lerp here
                                    x={
                                        (Number(processedSvg.releasedAmount?.[1]) -
                                            Number(processedSvg?.releasedAmount[0])) /
                                        2 +
                                        Number(processedSvg?.releasedAmount[0])
                                    }
                                    y={processedSvg.yScale + 4}
                                    fontFamily="Arial"
                                    fontSize="16"
                                    fill="white"
                                    textAnchor="middle"
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: AnimationFrame, delay: 1.2 }}
                                >
                                    Released: ({processedSvg?.totalAmounts?.released})
                                </motion.text>
                            </g>
                            {/* -------------->  Escrowed Rect && text */}
                            <g>
                                <motion.rect
                                    height={processedSvg.rectSize}
                                    x={processedSvg?.escrowedAmount?.[0]}
                                    y={processedSvg.yMiddle}
                                    rx="4"
                                    ry="4"
                                    fill="#FBBC05"
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{
                                        opacity: 1,
                                        width:
                                            Number(processedSvg.escrowedAmount?.[1]) -
                                            Number(processedSvg?.escrowedAmount[0]),
                                    }}
                                    transition={{ duration: AnimationFrame, delay: 1.6 }}
                                />
                                <motion.text
                                    // TODO: Instead We can use Lerp here
                                    x={
                                        (Number(processedSvg.escrowedAmount?.[1]) -
                                            Number(processedSvg?.escrowedAmount[0])) /
                                        2 +
                                        Number(processedSvg?.escrowedAmount[0])
                                    }
                                    y={processedSvg.yScale + 4}
                                    fontFamily="Arial"
                                    fontSize="16"
                                    fill="white"
                                    textAnchor="middle"
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: AnimationFrame, delay: 2 }}
                                >
                                    Escrowed: ({processedSvg?.totalAmounts?.escrowed})
                                </motion.text>
                            </g>
                        </>
                    )}
                </svg>
            </div>
        </div>
    );
}

export default withErrorBoundary(AgentMilestone);
