"use client"
import React, { useEffect, useMemo } from 'react'
import useMeasure from 'react-use-measure';
import * as d3 from "d3"
import { format, parseISO } from 'date-fns';
import { motion } from "framer-motion"
import withErrorBoundary from '@/hocs/with-error-boundry';

function LineChart({
    data,
    options,
}: {
    data: {
        name: string,
        lines: {
            dateTime: string,
            value: number
        }[]
        color?: string,
    }[];
    options: {
        timeframe: Date[]
        ticks: number,
        margins?: {
            left: number,
            right: number,
            top: number,
            bottom: number,
        }
    };
    children?: React.ReactNode;
}) {
    const [ref, { height, width }] = useMeasure();


    const processedSvg = useMemo(() => {
        if (!options.ticks || options.timeframe?.length !== 2) throw Error("Provide Details.")
        const [timeStart, timeEnd] = options.timeframe;

        if (!(timeStart instanceof Date) || !(timeEnd instanceof Date)) {
            throw new Error("Provide valid timestart and timeend");
        }

        const margins = {
            left: options.margins?.left ?? 60,
            right: options.margins?.right ?? 40,
            top: options.margins?.top ?? 20,
            bottom: options.margins?.bottom ?? 20
        }

        // ============== scales
        const xScale = d3.scaleTime()
            .domain([timeStart, timeEnd])
            .range([margins.left, width - margins.right])

        const yScale = d3.scaleLinear()
            .domain([0, 300])
            .range([height - margins.bottom * 2, margins.top * 2])

        const areaGen = d3.area()
            .y0(([x, y]) => Math.max(height / 2, y))
            .curve(d3.curveCatmullRom.alpha(0.5));
        const lineGen = d3.line()
            .curve(d3.curveCatmullRom.alpha(0.5))

        return {
            xAxis: xScale.ticks(options.ticks).map(dateTime => {
                const x = xScale(dateTime);
                return {
                    x,
                    y: (height - margins.bottom) + 4,
                    label: format(dateTime, "MMM")
                }
            }),
            yAxis: yScale.ticks(options.ticks).map(value => {
                const y = yScale(value);
                return {
                    y,
                    x: (margins.left / 2) - 12,
                    label: Math.round(value)
                }
            }),
            margins,
            data: data.map(d => ({
                color: d.color,
                line: lineGen(d.lines.map(l => {
                    return [xScale(parseISO(l.dateTime)), yScale(l.value)]
                })) ?? "",
                area: areaGen(d.lines.map(l => {
                    return [xScale(parseISO(l.dateTime)), yScale(l.value)]
                })) ?? "",
                shapes: d.lines.map(({ dateTime, value }) => {
                    const x = xScale(parseISO(dateTime));
                    const y = yScale(value)
                    return {
                        x,
                        y,
                    }
                })
            })) ?? [],
        }

    }, [height, width, options, data])


    if (!processedSvg) return "loading...."

    return (
        <div>
            <svg ref={ref} width={"100%"} height={400} >
                {processedSvg.xAxis.map(tick => {
                    return <g key={tick.label}>
                        <motion.text
                            textAnchor={"middle"}
                            x={tick.x}
                            y={tick.y}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.4 }}
                        >
                            {tick.label}
                        </motion.text>
                    </g>
                })}
                {processedSvg.yAxis.map(tick => {
                    return <g key={tick.label}>
                        <motion.text
                            x={tick.x}
                            y={tick.y}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.4 }}
                        >
                            {tick.label}
                        </motion.text>
                    </g>
                })}
                <motion.line
                    x1={processedSvg.margins.left}
                    x2={width - processedSvg.margins.right}
                    y1={height - processedSvg.margins.bottom * 2}
                    y2={height - processedSvg.margins.bottom * 2}
                    stroke={"#B4B4B4"}
                />
                <motion.line
                    x2={processedSvg.margins.left}
                    x1={processedSvg.margins.left}
                    y1={processedSvg.margins.top}
                    y2={height - processedSvg.margins.bottom * 2}
                    stroke={"#B4B4B4"}
                />
                {
                    processedSvg.data.map((data, idx) => {
                        return <g key={idx}>
                            <defs>
                                <linearGradient id={`areaGradient${idx}`} x1="0%" y1="0%" x2="0%" y2="50%">
                                    <stop offset="0%" stopColor={data.color} />
                                    <stop offset="100%" stopColor="white" />
                                </linearGradient>
                            </defs>
                            <path d={data.line} fill='transparent' stroke={data.color} />
                            <path d={data.area} fill={`url(#areaGradient${idx}`} className='opacity-5' />
                            {
                                data.shapes.map((d, idx) => {
                                    return <g key={d.x}>
                                        {
                                            idx > 0 && <motion.line
                                                x2={d.x}
                                                x1={d.x}
                                                y1={d.y}
                                                y2={height - processedSvg.margins.bottom * 2}
                                                stroke={"#B4B4B4"}
                                                strokeDasharray={"10 5"}
                                            />
                                        }
                                        <circle
                                            r={9.81 / 2}
                                            cx={d.x}
                                            cy={d.y}
                                            stroke={data.color}
                                            strokeWidth={5}
                                            fill={"white"}
                                        />
                                        <circle
                                            r={9.81 / 2}
                                            cx={d.x}
                                            cy={d.y}
                                            stroke='white'
                                            strokeWidth={2}
                                            fill={data.color}
                                        />
                                    </g>
                                })
                            })
                        </g>
                    })
                }
            </svg>
        </div>
    )
}

export default withErrorBoundary(LineChart)