import React, { ReactNode, useMemo, useRef, useState } from 'react'
import * as d3 from "d3";
import useMeasure from 'react-use-measure';
import withErrorBoundary from '@/hocs/with-error-boundry';
import useMounted from '@/hooks/useMounted';
import { IoMdHappy } from 'react-icons/io';
import { ImSad } from 'react-icons/im';
import { TbMoodEmpty } from 'react-icons/tb';
import { Popover } from 'antd';


interface props {
    classNames?: string,
    data: {
        "1-10s": number,
        "10-2min": number,
        "Above 2min": number
    };
    children?: ReactNode

}
const DATA_PROPS: any = {
    "1-10s": {
        color: "#0C6466",
        icon: IoMdHappy,
        label: "Fastest"
    },
    "10-2min": {
        color: "#FBBC05",
        icon: TbMoodEmpty,
        label: "Moderate"
    },
    "Above 2min": {
        color: "#EA5455",
        icon: ImSad,
        label: "Slowest"
    }
}

const MARGINS = {
    left: 20,
    top: 20,
    bottom: 20,
    right: 20
}
const PADDING = 10
const boxHeight = 0.5

function ResponseTimeChart(props: props) {
    const { data, classNames } = props;
    const [ref, { height, width, left, top }] = useMeasure();
    const [tooltipOptions, setToolTipOptions] = useState<null | { x: number, y: number }>(null)
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    const processedSvg = useMemo(() => {
        const xScale = d3.scaleLinear()
            .domain([0, 1])
            .range([0, width - MARGINS.right - MARGINS.left - PADDING * Object.keys(data).length - 1]);

        const yScale = d3.scaleLinear()
            .domain([0, 1])
            .range([height - MARGINS.bottom, MARGINS.top]);

        const total = Object.values(data).reduce((a, b) => a + b, 0)
        let xStart = MARGINS.left
        const xAxis = Object.entries(data).map((([k, v], idx, _arr) => {

            const isLastIdx = idx === _arr.length - 1
            const perc = xScale(v / total) + (isLastIdx ? PADDING : 0);
            const rData = { perc, x: xStart, label: k, value: v }

            xStart += perc + (!isLastIdx ? PADDING : 0)
            return rData;
        }))

        return {
            xAxis,
            total,
            yBox: (height - yScale(boxHeight)) / 2,
            y: height / 2,
            boxHeight: yScale(boxHeight),
            width: xScale(1),
            t: xScale(0.3125),
            tt: 571 * 0.3125

        }
    }, [props, width, height])

    console.log({ responseTime: processedSvg })

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

    return (
        <div className={`${classNames} pb-6`} >
            <div ref={r => {
                ref(r)
                wrapperRef.current = r;
            }} className="overflow-auto w-full" onMouseLeave={() => setToolTipOptions(null)} onMouseMove={handleMouseMove}>
                <svg width={"100%"} height={"100%"}  >
                    {processedSvg.xAxis.map((tick, idx, _arr) => {
                        return <Popover content={<p>{tick.label}: <b style={{ color: DATA_PROPS?.[tick.label]?.color }}>{tick.value}</b> Chats Picked</p>}>
                            <rect x={tick.x} y={processedSvg.yBox} height={processedSvg.boxHeight} width={tick.perc} fill={DATA_PROPS?.[tick.label]?.color}
                                rx="8"
                            />
                        </Popover>
                    })}
                </svg>
            </div>
            <div className='flex items-center justify-between px-[20px]'>
                {Object.entries(DATA_PROPS).reverse().map(([k, val]) => {
                    const { icon: Icon, color, label }: any = val
                    return <div key={k}>
                        <p className='text-center text-[14px] md:text-[16px] text-[#615E83]'>{label}</p>
                        <div className='flex gap-2 items-center text-[12px] md:text-[14px]'>
                            {<Icon size={20} color={color} className="flex-shrink-0" />}
                            {k}
                        </div>
                    </div>
                })}
            </div>
        </div>

    )
}

export default withErrorBoundary(ResponseTimeChart)