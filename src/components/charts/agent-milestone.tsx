"use client";
import * as d3 from "d3";
import { Popover, Table, Tag } from "antd";
import { motion } from "framer-motion";
import useMeasure from "react-use-measure";
import { type ReactNode, useMemo, useState, useRef } from "react";
import withErrorBoundary from "@/hocs/with-error-boundry";
import { differenceInMonths, endOfMonth, format, isSameMonth, startOfMonth } from "date-fns";
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
        escrow_amount: string;
        relased_amount: string;
    }[];
    escrowed: {
        month: Date;
        escrow_amount: string;
        working_hours_amount_current: string | null;
    }[]
}

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
    const [ref, { height, width, top, left }] = useMeasure();
    const [tooltipOptions, setToolTipOptions] = useState<null | { x: number, y: number }>(null)
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    const processedSvg = useMemo(() => {
        if (!data) throw Error("Please Provide valid data. AGENT MILESTONE.")

        const DIMENSIONS = {
            width: width ?? 0,
            height: height ?? 0,
        };

        if (!DIMENSIONS.height || !DIMENSIONS.width) return null;

        DIMENSIONS.height += -MARGINS.top - MARGINS.bottom;
        const NO_OF_TICKS = Math.min(DIMENSIONS.width / 180, 8);

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

        const releasedAmount: number[] = [];
        const escrowedAmount: number[] = [];

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
                    raw: {
                        releasedMonth,
                        escrowedMonth
                    },
                    escrowedMonth,
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
                        label: (releasedMonth ? releasedMonth.escrow_amount : escrowedMonth?.escrow_amount) ?? "",
                    },
                    milestone: {
                        x:
                            (xScale(endOfMonth(date)) - xScale(startOfMonth(date))) / 2 +
                            xScale(date),
                        y: (yMiddle + rectSize) + 20,
                        label: `Milestone ${differenceInMonths(date, data.job.startTime) + 1}`,
                    },
                    releasedAmount: {
                        x:
                            (xScale(endOfMonth(date)) - xScale(startOfMonth(date))) / 2 +
                            xScale(date),
                        y: yMiddle - 10,
                        label: releasedMonth?.relased_amount ?? "Nill",
                    },
                };
            }),
            DIMENSIONS,

        };

    }, [data, width, height])
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

        processedSvg?.XAxis.forEach((tick) => {
            const distance = Math.sqrt(Math.pow(x - tick.text.x, 2) + Math.pow(y - tick.text.y, 2));

            if (distance < closestDistance) {
                closestDistance = distance;
                closestDataPoint = tick;
            }
        });

        const { raw }: any = closestDataPoint;
        if (!raw?.escrowedMonth && !raw?.releasedMonth) return null
        return {
            x,
            y,
            escrowAmount: raw?.escrowedMonth,
            releasedAmount: raw?.releasedMonth
        };

    }, [tooltipOptions, processedSvg])

    return (
        <div className={`grid ${classNames}`} >
            <div ref={r => {
                ref(r)
                wrapperRef.current = r;
            }} className="min-w-full overflow-auto w-full h-full" onMouseLeave={() => setToolTipOptions(null)} onMouseMove={handleMouseMove} >
                <svg width={"100%"} height={"100%"} style={{ minHeight: 250, minWidth: 552 }}  >
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
                                            fontSize={width < 768 ? "12" : "14"}
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
                                            fontSize={width < 768 ? "12" : "14"}
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
                                            fontSize={width < 768 ? "12" : "14"}
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
                                                fontSize={width < 768 ? "12" : "14"}
                                                textAnchor="end"
                                                initial={{ opacity: 0, y: -20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.3, duration: AnimationFrame }}
                                                color={"#111"}
                                            >
                                                {tick.releasedAmount.label}
                                            </motion.text>
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
                                    fontSize={width < 768 ? "12" : "14"}
                                    fill="white"
                                    textAnchor="middle"
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: AnimationFrame, delay: 1.2 }}
                                >
                                    {width < 768 ? "R" : "Released"}: ({processedSvg?.totalAmounts?.released})
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
                                    fontSize={width < 768 ? "12" : "14"}
                                    fill="white"
                                    textAnchor="middle"
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: AnimationFrame, delay: 2 }}
                                >
                                    {width < 768 ? "E" : " Escrowed"}: ({processedSvg?.totalAmounts?.escrowed})
                                </motion.text>
                            </g>
                            {
                                tooltipOptions && <>
                                    <line x1={0} x2={width} y1={tooltipOptions.y} y2={tooltipOptions.y} stroke="#3CB9BC82" strokeWidth={2} strokeDasharray={"10 5"} />
                                    <line x1={tooltipOptions.x} x2={tooltipOptions.x} y1={0} y2={height} stroke="#3CB9BC82" strokeWidth={2} strokeDasharray={"10 5"} />
                                    <Popover
                                        key={`${tooltipData && (tooltipData?.x + tooltipData?.y)}`}
                                        open={!!tooltipData}
                                        overlayInnerStyle={{
                                            borderRadius: "12px",
                                        }}

                                        content={tooltipData && <>
                                            <Table
                                                bordered={true}
                                                pagination={false}
                                                columns={getColumns(tooltipData)}
                                                dataSource={getData(tooltipData)}
                                            />
                                        </>}
                                    >
                                        <circle r={3} cx={tooltipOptions.x} cy={tooltipOptions.y} />
                                    </Popover>
                                </>
                            }
                        </>
                    )}
                </svg>
            </div>
        </div>
    );
}

export default withErrorBoundary(AgentMilestone);


function getColumns(tData: any) {
    if (tData?.escrowAmount) {
        return [
            { title: "Month", dataIndex: "month" },
            { title: "Status", dataIndex: "status", render: (status: any) => <Tag color="orange">{status}</Tag> },
            { title: "Escrow ", dataIndex: "escrow_amount" },
            { title: "(By Working hrs)", dataIndex: "working_hours_amount_current", className: "whitespace-nowrap" },
        ]
    }
    if (tData?.releasedAmount) {
        return [
            { title: "Month", dataIndex: "month" },
            { title: "Status", dataIndex: "status", render: (status: any) => <Tag color="green">{status}</Tag> },
            { title: "Escrow ", dataIndex: "escrow_amount" },
            { title: "Released ", dataIndex: "relased_amount" },
        ]
    }
    return []
}
function getData(tData: any): any[] {
    const data = tData?.escrowAmount ?? tData?.releasedAmount
    if (tData?.escrowAmount) {
        return [
            {
                month: format(data?.month, "MMM-yyyy"),
                status: "ESCROWED",
                escrow_amount: data?.escrow_amount,
                working_hours_amount_current: data?.working_hours_amount_current
            },
        ]
    }
    if (tData?.releasedAmount) {
        return [
            {
                month: format(data?.month, "MMM-yyyy"),
                status: "RELEASED",
                escrow_amount: data?.escrow_amount,
                relased_amount: data?.relased_amount
            },
        ]
    }
    return []
}