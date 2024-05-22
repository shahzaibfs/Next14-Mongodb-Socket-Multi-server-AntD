"use client";
import * as d3 from "d3";
import { Popover } from "antd";
import { motion } from "framer-motion";
import useMeasure from "react-use-measure";
import { type ReactNode, useEffect, useState } from "react";
import withErrorBoundary from "@/hocs/with-error-boundry";
import { endOfMonth, format, startOfMonth } from "date-fns";

interface ProcessedSvg {
    releasedAmount: number[];
    escrowedAmount: number[];
    yScale: number;
    yMiddle: number;
    rectSize: number;
    XAxis: {
        lines:
        | {
            x1: number;
            x2: number;
            y1: number;
            y2: number;
        }[]
        | null;
        text: {
            x: number;
            y: number;
            label: string;
        };
        amount: {
            x: number;
            y: number;
            label: string;
        };
        milestone: {
            x: number;
            y: number;
            label: string;
        };
        releasedAmount: {
            x: number;
            y: number;
            label: string;
        }
    }[];
    DIMENSIONS: {
        width: number;
        height: number;
    };
}

function AgentMilestone({ classNames }: {
    children?: ReactNode,
    classNames?: string
}) {
    const [processedSvg, setProcessedSvg] = useState<ProcessedSvg | null>(null);
    const [ref, { height, width }] = useMeasure();
    console.log({ height, width })
    useEffect(() => {
        initD3Data();
    }, [height, width]);

    function initD3Data() {
        const NO_OF_TICKS = 4;
        const MARGINS = {
            left: 55,
            right: 60,
            top: 10,
            bottom: 10,
        };

        const DIMENSIONS = {
            width: width ?? 0,
            height: height ?? 0,
        };

        if (!DIMENSIONS.height || !DIMENSIONS.width) return null;

        DIMENSIONS.height += -MARGINS.top - MARGINS.bottom;

        const xScale = d3
            .scaleTime()
            .domain([
                startOfMonth(new Date(2024, 0, 1)),
                endOfMonth(new Date(2024, 3, 1)),
            ])
            .range([MARGINS.left, DIMENSIONS.width - MARGINS.right]);

        const sizeFromHeight = d3
            .scaleLinear()
            .domain([0, 1])
            .range([0, DIMENSIONS.height]);

        const rectSize = sizeFromHeight(0.2);
        const yScale = DIMENSIONS.height / 2;
        const yMiddle = yScale - rectSize / 2;

        const processedSvg = {
            releasedAmount: [
                xScale(startOfMonth(new Date(2024, 0, 1))),
                xScale(endOfMonth(new Date(2024, 1, 1))),
            ],
            escrowedAmount: [
                xScale(startOfMonth(new Date(2024, 2, 1))),
                xScale(endOfMonth(new Date(2024, 2, 1))),
            ],

            yScale,
            yMiddle,
            rectSize: rectSize,

            XAxis: xScale.ticks(NO_OF_TICKS).map((date, idx, _arr) => {
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
                        x:
                            (xScale(endOfMonth(date)) - xScale(startOfMonth(date))) / 2 +
                            xScale(date),
                        y: MARGINS.top + MARGINS.bottom * 2,
                        label: "$1000",
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
                        label: `$400`,
                    },
                };
            }),
            DIMENSIONS,
        };
        setProcessedSvg(processedSvg);
    }
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
                                                            className="stroke-slate-400"
                                                            style={{ strokeDasharray: "10 5" }}
                                                            initial={{ opacity: 0, strokeDasharray: "0" }}
                                                            animate={{ opacity: 1, strokeDasharray: "10 5" }}
                                                            transition={{ duration: 0.4 }}
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
                                            transition={{ delay: 0.5, duration: 0.4 }}
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
                                            transition={{ delay: 0.5, duration: 0.4 }}
                                        >
                                            {tick.text.label}
                                        </motion.text>
                                        <motion.text
                                            textAnchor="middle"
                                            x={tick.milestone.x}
                                            y={tick.milestone.y}
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5, duration: 0.4 }}
                                            fill={"#715d5d"}
                                        >
                                            {tick.milestone.label}
                                        </motion.text>
                                        <motion.text
                                            textAnchor="middle"
                                            x={tick.releasedAmount.x}
                                            y={tick.releasedAmount.y}
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5, duration: 0.4 }}
                                            color={"#111"}
                                        >
                                            Released: {tick.releasedAmount.label}
                                        </motion.text>
                                    </g>
                                );
                            })}
                            <motion.line
                                x1="0"
                                y1={processedSvg.yScale}
                                y2={processedSvg.yScale}
                                className="stroke-slate-400"
                                style={{ strokeDasharray: "10 5" }}
                                initial={{ opacity: 0, strokeDasharray: "0", x2: 0 }}
                                animate={{
                                    opacity: 1,
                                    strokeDasharray: "10 5",
                                    x2: processedSvg.DIMENSIONS.width,
                                }}
                                transition={{ duration: 0.4 }}
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
                                transition={{ duration: 0.4, delay: 0.4 }}
                            />
                            <Popover
                                overlayClassName="max-w-sm"
                                content={
                                    <p>
                                        Total Released:$2000 <br />
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui
                                        praesentium sapiente, cupiditate vel natus accusantium
                                        officia at soluta fuga et?
                                    </p>
                                }
                            >
                                <g>
                                    <motion.rect
                                        height={processedSvg.rectSize}
                                        x={processedSvg?.releasedAmount?.[0]}
                                        y={processedSvg.yMiddle}
                                        rx="10"
                                        ry="10"
                                        fill="#44ce44"
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{
                                            opacity: 1,
                                            width:
                                                Number(processedSvg.releasedAmount?.[1]) -
                                                Number(processedSvg?.releasedAmount[0]),
                                        }}
                                        transition={{ duration: 0.4, delay: 0.8 }}
                                    />
                                    <motion.text
                                        // TODO: Instead We can use Lerp here
                                        x={
                                            (Number(processedSvg.releasedAmount?.[1]) -
                                                Number(processedSvg?.releasedAmount[0])) /
                                            2 +
                                            Number(processedSvg?.releasedAmount[0])
                                        }
                                        y={processedSvg.yScale}
                                        fontFamily="Arial"
                                        fontSize="16"
                                        fill="black"
                                        textAnchor="middle"
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: 1.2 }}
                                    >
                                        Released: ($1000)
                                    </motion.text>
                                </g>
                            </Popover>
                            <g>
                                <motion.rect
                                    height={processedSvg.rectSize}
                                    x={processedSvg?.escrowedAmount?.[0]}
                                    y={processedSvg.yMiddle}
                                    rx="10"
                                    ry="10"
                                    fill="orange"
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{
                                        opacity: 1,
                                        width:
                                            Number(processedSvg.escrowedAmount?.[1]) -
                                            Number(processedSvg?.escrowedAmount[0]),
                                    }}
                                    transition={{ duration: 0.4, delay: 1.6 }}
                                />
                                <motion.text
                                    // TODO: Instead We can use Lerp here
                                    x={
                                        (Number(processedSvg.escrowedAmount?.[1]) -
                                            Number(processedSvg?.escrowedAmount[0])) /
                                        2 +
                                        Number(processedSvg?.escrowedAmount[0])
                                    }
                                    y={processedSvg.yScale}
                                    fontFamily="Arial"
                                    fontSize="16"
                                    fill="black"
                                    textAnchor="middle"
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 2 }}
                                >
                                    Escrowed: ($1000)
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
