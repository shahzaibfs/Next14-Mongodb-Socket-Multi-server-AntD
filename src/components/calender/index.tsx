"use client"
import withErrorBoundary from '@/hocs/with-error-boundry';
import classNames from 'classnames';
import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isEqual, isSameMonth, parse, startOfMonth, startOfToday, startOfWeek, subMonths } from 'date-fns';
import React, { type ReactNode, useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import DirectionAware from '../animations/direction-aware';

// helpers....
function ArrangeDaysAccordingToWeek(days: Date[]) {
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7));
    }
    return weeks
}
function Calender({
    defaultDate,
    onChange
}: {
    defaultDate?: Date,
    onChange?: (date: Date) => void;
    children?: ReactNode
}) {
    const today = defaultDate ?? startOfToday()

    const [selectedDate, setSelectedDate] = useState(today);
    const [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
    const [direction, setDirection] = useState<"left" | "right">("left");

    const firstDayOfCurrentMonth = startOfMonth(parse(currentMonth, "MMM-yyyy", new Date()))
    const lastDayOfCurrentMonth = endOfMonth(firstDayOfCurrentMonth)

    const weekDays = ArrangeDaysAccordingToWeek(eachDayOfInterval({
        start: startOfWeek(firstDayOfCurrentMonth),
        end: endOfWeek(lastDayOfCurrentMonth),
    }))

    function goPrevMonth() {
        setDirection("left")
        setCurrentMonth(format(subMonths(firstDayOfCurrentMonth, 1), "MMM-yyyy"))
    }
    function goNextmonth() {
        setDirection("right")
        setCurrentMonth(format(addMonths(firstDayOfCurrentMonth, 1), "MMM-yyyy"))
    }
    function changeDate(day: Date) {
        setSelectedDate(day)
        if (onChange) {
            onChange(day)
        }
    }
    return (
        <>
            <div className="w-full">
                <div className="">
                    <div className="px-2 flex items-center justify-between">
                        <DirectionAware id={currentMonth} direction={direction} >
                            <span className="focus:outline-none whitespace-nowrap  text-base font-bold dark:text-gray-100 text-gray-800 underline">{currentMonth}</span>
                        </DirectionAware>
                        <div className="flex items-center">
                            <button onClick={goPrevMonth} aria-label="calendar backward" className="focus:text-gray-400 hover:text-gray-400 text-gray-800 dark:text-gray-100">
                                <FaChevronLeft />
                            </button>
                            <button onClick={goNextmonth} aria-label="calendar forward" className="focus:text-gray-400 hover:text-gray-400 ml-3 text-gray-800 dark:text-gray-100">
                                <FaChevronRight />
                            </button>

                        </div>
                    </div>
                    <DirectionAware id={currentMonth} direction={direction}  >
                        <div className="flex items-center justify-between pt-8 ">
                            <table className="w-full">
                                <thead className=''>
                                    <tr className=''>
                                        <th>
                                            <div className="w-full flex justify-center">
                                                <p className="text-base font-medium text-center text-gray-800 dark:text-gray-100">Su</p>
                                            </div>
                                        </th>
                                        <th>
                                            <div className="w-full flex justify-center">
                                                <p className="text-base font-medium text-center text-gray-800 dark:text-gray-100">Mo</p>
                                            </div>
                                        </th>
                                        <th>
                                            <div className="w-full flex justify-center">
                                                <p className="text-base font-medium text-center text-gray-800 dark:text-gray-100">Tu</p>
                                            </div>
                                        </th>
                                        <th>
                                            <div className="w-full flex justify-center">
                                                <p className="text-base font-medium text-center text-gray-800 dark:text-gray-100">We</p>
                                            </div>
                                        </th>
                                        <th>
                                            <div className="w-full flex justify-center">
                                                <p className="text-base font-medium text-center text-gray-800 dark:text-gray-100">Th</p>
                                            </div>
                                        </th>
                                        <th>
                                            <div className="w-full flex justify-center">
                                                <p className="text-base font-medium text-center text-gray-800 dark:text-gray-100">Fr</p>
                                            </div>
                                        </th>
                                        <th>
                                            <div className="w-full flex justify-center">
                                                <p className="text-base font-medium text-center text-gray-800 dark:text-gray-100">Sa</p>
                                            </div>
                                        </th>

                                    </tr>
                                </thead>
                                <tbody className=''>
                                    {weekDays.map((week, idx) => {
                                        return <tr key={"week" + idx}>
                                            {week.map((day) => {
                                                return <td key={format(day, "d")}>
                                                    <button onClick={() => changeDate(day)} className={
                                                        classNames(
                                                            "px-2 py-2 cursor-pointer flex w-full justify-center text-black",
                                                            !isSameMonth(day, firstDayOfCurrentMonth) && "text-opacity-30",
                                                            isEqual(day, selectedDate) && "bg-blue-500 text-white rounded-md"

                                                        )
                                                    }>
                                                        {format(day, "d")}
                                                    </button>
                                                </td>
                                            })}
                                        </tr>
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </DirectionAware>
                </div>
            </div>
        </>
    )
}


export default withErrorBoundary(Calender)