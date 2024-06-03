"use client"
import AgentMilestone, { data } from '@/components/charts/agent-milestone';
import LineChart from '@/components/charts/lineChart';
import LinearTimeLogs from '@/components/charts/linear-time-logs';
import MonthlyHourlyLogs from '@/components/charts/monthly-hourly-logs';
import ResponseTimeChart from '@/components/charts/response-time-chart';
import Sidebar from '@/components/dashboard/sidebar';
import { Button } from 'antd';
import classNames from 'classnames';
import { add, parseISO, startOfMonth, sub } from 'date-fns';
import { useState } from 'react';

const today = new Date()



const agentMilestone: data = {
  job: {
    startTime: sub(today, { months: 2 }),
    endTime: add(today, { months: 6 })
  },
  total: {
    escrowed: "$6,000",
    released: "$4,145",
  },
  released: [
    {
      month: sub(today, { months: 2 }),
      escrow_amount: "$1400.00",
      relased_amount: "$1400",
    },
    {
      month: sub(today, { months: 1 }),
      escrow_amount: "$1355.00",
      relased_amount: "$2745",
    }
  ],
  escrowed: [
    {
      month: today,
      escrow_amount: "$3000",
      working_hours_amount_current: "$1355"
    },
    {
      month: add(today, { months: 1 }),
      escrow_amount: "$3000",
      working_hours_amount_current: null
    }
  ]
}

export default function Home() {
  const [open, setOpen] = useState(false);
  // please refactor this create Good sidebar i just bin the things here hehehe
  return (
    <main className='p-5 md:flex gap-5'>

      <div className={
        classNames(
          open && "translate-x-0 min-w-[280px] transition-all",
          !open && " -translate-x-[150%] hidden",
          "overflow-hidden rounded-md bg-white"
        )
      }>
        <Sidebar />
      </div>

      <div className='flex-grow'>
        <Button className='mb-5 mt-1' onClick={() => setOpen(!open)}>{open ? "Close" : "Open"}</Button>

        <AgentMilestone data={agentMilestone} classNames='p-4   border rounded-md bg-white md:aspect-auto xl:min-h-[378px]' />
        <br />
        <div className='md:grid md:grid-cols-2 gap-5'>
          <MonthlyHourlyLogs in_outs={hourlyLogs.map(d => ({
            in: parseISO(d.in),
            out: parseISO(d.out)
          }))} key={1} classNames='pb-8 col-span-1  border rounded-md bg-white aspect-[1] sm:aspect-video xl:aspect-auto xl:min-h-[378px]' />
          <br className='md:hidden' />
          <LinearTimeLogs data={linearTimeLogs} key={2} classNames='pb-8 col-span-1   border rounded-md bg-white aspect-[1] sm:aspect-video xl:aspect-auto xl:min-h-[378px]' />
          <br className='md:hidden' />
          <ResponseTimeChart classNames='border  ' data={{ "Above 2min": 100, "10-2min": 50, "1-10s": 10 }} />
        </div>
      </div>

    </main>
  )
}

/**
 * <LineChart
            classNames='col-span-1 pb-2 border rounded-md bg-white aspect-[1] sm:aspect-video xl:aspect-auto xl:min-h-[378px]'
            data={chatLineChart}
            options={{
              ticks: 6,
              timeframe: [startOfMonth(sub(new Date(), { months: 5 })), startOfMonth(new Date())]
            }} />
 * 
 */

const chatLineChart = [
  {
    "name": "Discount Storage Insurance",
    "color": "#FF6F61",
    "lines": [
      { "dateTime": "2023-12-01T00:00:00Z", "value": 100 },
      { "dateTime": "2024-01-01T00:00:00Z", "value": 150 },
      { "dateTime": "2024-02-01T00:00:00Z", "value": 200 },
      { "dateTime": "2024-03-01T00:00:00Z", "value": 250 },
      { "dateTime": "2024-04-01T00:00:00Z", "value": 50 },
      { "dateTime": "2024-05-01T00:00:00Z", "value": 10 }
    ]
  },
  {
    "name": "Second Dataset",
    "color": "#6699CC",
    "lines": [
      { "dateTime": "2023-12-01T00:00:00Z", "value": 50 },
      { "dateTime": "2024-01-01T00:00:00Z", "value": 100 },
      { "dateTime": "2024-02-01T00:00:00Z", "value": 150 },
      { "dateTime": "2024-03-01T00:00:00Z", "value": 200 },
      { "dateTime": "2024-04-01T00:00:00Z", "value": 250 },
      { "dateTime": "2024-05-01T00:00:00Z", "value": 200 }
    ]
  },
  {
    "name": "Third Dataset",
    "color": "#FFD700",
    "lines": [
      { "dateTime": "2023-12-01T00:00:00Z", "value": 200 },
      { "dateTime": "2024-01-01T00:00:00Z", "value": 250 },
      { "dateTime": "2024-02-01T00:00:00Z", "value": 150 },
      { "dateTime": "2024-03-01T00:00:00Z", "value": 100 },
      { "dateTime": "2024-04-01T00:00:00Z", "value": 50 },
      { "dateTime": "2024-05-01T00:00:00Z", "value": 20 }
    ]
  }
];
const linearTimeLogs = [
  { date: parseISO("2024-05-17T00:00:00.000Z"), value: 20 },
  { date: parseISO("2024-05-18T00:00:00.000Z"), value: 10 },
  { date: parseISO("2024-05-19T00:00:00.000Z"), value: 40 },
  { date: parseISO("2024-05-20T00:00:00.000Z"), value: 70 },
  { date: parseISO("2024-05-21T00:00:00.000Z"), value: 35 },
  { date: parseISO("2024-05-22T00:00:00.000Z"), value: 28 },
  { date: parseISO("2024-05-23T00:00:00.000Z"), value: 48 }
];
const hourlyLogs = [
  {
    "in": "2024-01-01T07:45:00",
    "out": "2024-01-01T08:15:00"
  },
  {
    "in": "2024-01-01T08:30:00",
    "out": "2024-01-01T08:45:00"
  },
  {
    "in": "2024-01-02T08:00:00",
    "out": "2024-01-02T08:20:00"
  },
  {
    "in": "2024-01-02T08:25:00",
    "out": "2024-01-02T08:40:00"
  },
  {
    "in": "2024-01-02T08:50:00",
    "out": "2024-01-02T09:10:00"
  },
  {
    "in": "2024-01-03T08:15:00",
    "out": "2024-01-03T08:35:00"
  },
  {
    "in": "2024-01-03T08:40:00",
    "out": "2024-01-03T08:55:00"
  },
  {
    "in": "2024-01-03T09:05:00",
    "out": "2024-01-03T09:15:00"
  },
  {
    "in": "2024-01-04T08:00:00",
    "out": "2024-01-04T08:10:00"
  },
  {
    "in": "2024-01-04T08:15:00",
    "out": "2024-01-04T08:30:00"
  },
  {
    "in": "2024-01-05T08:30:00",
    "out": "2024-01-05T09:00:00"
  },
  {
    "in": "2024-01-05T09:10:00",
    "out": "2024-01-05T09:30:00"
  },
  {
    "in": "2024-01-05T09:35:00",
    "out": "2024-01-05T09:55:00"
  },
  {
    "in": "2024-01-06T08:20:00",
    "out": "2024-01-06T08:30:00"
  },
  {
    "in": "2024-01-06T08:35:00",
    "out": "2024-01-06T08:40:00"
  },
  {
    "in": "2024-01-07T08:00:00",
    "out": "2024-01-07T08:10:00"
  },
  {
    "in": "2024-01-07T08:30:00",
    "out": "2024-01-07T08:45:00"
  },
  {
    "in": "2024-01-08T08:20:00",
    "out": "2024-01-08T08:25:00"
  },
  {
    "in": "2024-01-08T08:40:00",
    "out": "2024-01-08T08:50:00"
  },
  {
    "in": "2024-01-08T09:00:00",
    "out": "2024-01-08T09:15:00"
  },
  {
    "in": "2024-01-09T08:00:00",
    "out": "2024-01-09T08:05:00"
  },
  {
    "in": "2024-01-09T08:10:00",
    "out": "2024-01-09T08:20:00"
  },
  {
    "in": "2024-01-10T08:45:00",
    "out": "2024-01-10T09:00:00"
  },
  {
    "in": "2024-01-10T09:05:00",
    "out": "2024-01-10T09:15:00"
  },
  {
    "in": "2024-01-11T08:15:00",
    "out": "2024-01-11T08:25:00"
  },
  {
    "in": "2024-01-11T08:30:00",
    "out": "2024-01-11T08:40:00"
  },
  {
    "in": "2024-01-12T08:05:00",
    "out": "2024-01-12T08:10:00"
  },
  {
    "in": "2024-01-12T08:20:00",
    "out": "2024-01-12T08:30:00"
  },
  {
    "in": "2024-01-13T08:35:00",
    "out": "2024-01-13T08:40:00"
  },
  {
    "in": "2024-01-13T08:45:00",
    "out": "2024-01-13T08:55:00"
  },
  {
    "in": "2024-01-14T08:50:00",
    "out": "2024-01-14T09:00:00"
  },
  {
    "in": "2024-01-14T09:05:00",
    "out": "2024-01-14T09:15:00"
  },
  {
    "in": "2024-01-15T08:10:00",
    "out": "2024-01-15T08:20:00"
  },
  {
    "in": "2024-01-15T08:30:00",
    "out": "2024-01-15T08:35:00"
  },
  {
    "in": "2024-01-16T08:00:00",
    "out": "2024-01-16T08:05:00"
  },
  {
    "in": "2024-01-16T08:15:00",
    "out": "2024-01-16T08:25:00"
  },
  {
    "in": "2024-01-17T08:40:00",
    "out": "2024-01-17T08:50:00"
  },
  {
    "in": "2024-01-17T09:00:00",
    "out": "2024-01-17T09:10:00"
  },
  {
    "in": "2024-01-18T08:20:00",
    "out": "2024-01-18T08:25:00"
  },
  {
    "in": "2024-01-18T08:30:00",
    "out": "2024-01-18T08:35:00"
  },
  {
    "in": "2024-01-19T08:50:00",
    "out": "2024-01-19T09:00:00"
  },
  {
    "in": "2024-01-19T09:05:00",
    "out": "2024-01-19T09:10:00"
  },
  {
    "in": "2024-01-20T08:00:00",
    "out": "2024-01-20T08:05:00"
  },
  {
    "in": "2024-01-20T08:10:00",
    "out": "2024-01-20T08:20:00"
  },
  {
    "in": "2024-01-21T08:35:00",
    "out": "2024-01-21T08:40:00"
  },
  {
    "in": "2024-01-21T08:45:00",
    "out": "2024-01-21T08:55:00"
  },
  {
    "in": "2024-01-22T08:50:00",
    "out": "2024-01-22T09:00:00"
  },
  {
    "in": "2024-01-22T09:05:00",
    "out": "2024-01-22T09:15:00"
  },
  {
    "in": "2024-01-23T08:15:00",
    "out": "2024-01-23T08:20:00"
  },
  {
    "in": "2024-01-23T08:25:00",
    "out": "2024-01-23T08:30:00"
  },
  {
    "in": "2024-01-24T08:40:00",
    "out": "2024-01-24T08:50:00"
  },
  {
    "in": "2024-01-24T09:00:00",
    "out": "2024-01-24T09:10:00"
  },
  {
    "in": "2024-01-25T08:20:00",
    "out": "2024-01-25T08:25:00"
  },
  {
    "in": "2024-01-25T08:30:00",
    "out": "2024-01-25T08:40:00"
  },
  {
    "in": "2024-01-26T08:05:00",
    "out": "2024-01-26T08:10:00"
  },
  {
    "in": "2024-01-26T08:20:00",
    "out": "2024-01-26T08:25:00"
  },
  {
    "in": "2024-01-27T08:45:00",
    "out": "2024-01-27T09:00:00"
  },
  {
    "in": "2024-01-27T09:05:00",
    "out": "2024-01-27T09:10:00"
  },
  {
    "in": "2024-01-28T08:00:00",
    "out": "2024-01-28T08:05:00"
  },
  {
    "in": "2024-01-28T08:15:00",
    "out": "2024-01-28T08:20:00"
  },
  {
    "in": "2024-01-29T08:30:00",
    "out": "2024-01-29T08:35:00"
  },
  {
    "in": "2024-01-29T08:40:00",
    "out": "2024-01-29T08:50:00"
  },
  {
    "in": "2024-01-30T08:45:00",
    "out": "2024-01-30T09:00:00"
  },
  {
    "in": "2024-01-30T09:05:00",
    "out": "2024-01-30T09:15:00"
  },
  {
    "in": "2024-01-31T08:15:00",
    "out": "2024-01-31T08:25:00"
  },
  {
    "in": "2024-01-31T08:30:00",
    "out": "2024-01-31T08:40:00"
  }
];



