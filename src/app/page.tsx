import AgentMilestone from '@/components/charts/agent-milestone'
import LinearTimeLogs from '@/components/charts/linear-time-logs';
import MonthlyHourlyLogs from '@/components/charts/monthly-hourly-logs'
import React from 'react'

export default function Home() {
  return (
    <main className='p-4 md:p-16 bg-slate-400'>
      <AgentMilestone classNames='p-4 border rounded-md bg-white  xlmd:aspect-auto xl:min-h-[378px]' />
      <br />
      <div className='xl:grid xl:grid-cols-3 gap-5'>
        <MonthlyHourlyLogs in_outs={Sample1} key={1} classNames='p-4 col-span-2 pb-8 border rounded-md bg-white aspect-video xl:aspect-auto xl:min-h-[378px]' />
        <br className='xl:hidden' />
        <LinearTimeLogs data={data2} key={2} classNames='p-4 col-span-1 pb-8 border rounded-md bg-white aspect-video xl:aspect-auto xl:min-h-[378px]' />
      </div>
    </main>
  )
}

const data = [
  { date: "2024-05-17T00:00:00.000Z", value: 65 },
  { date: "2024-05-18T00:00:00.000Z", value: 30 },
  { date: "2024-05-19T00:00:00.000Z", value: 45 },
  { date: "2024-05-20T00:00:00.000Z", value: 75 },
  { date: "2024-05-21T00:00:00.000Z", value: 50 },
  { date: "2024-05-22T00:00:00.000Z", value: 20 },
  { date: "2024-05-23T00:00:00.000Z", value: 60 }
];

const data2 = [
  { date: "2024-05-17T00:00:00.000Z", value: 20 },
  { date: "2024-05-18T00:00:00.000Z", value: 10 },
  { date: "2024-05-19T00:00:00.000Z", value: 40 },
  { date: "2024-05-20T00:00:00.000Z", value: 70 },
  { date: "2024-05-21T00:00:00.000Z", value: 35 },
  { date: "2024-05-22T00:00:00.000Z", value: 28 },
  { date: "2024-05-23T00:00:00.000Z", value: 48 }
];
const Sample2 = [
  {
    "in": "2024-01-01T08:00:00",
    "out": "2024-01-01T16:00:00"
  },
  {
    "in": "2024-01-02T07:45:00",
    "out": "2024-01-02T16:15:00"
  },
  {
    "in": "2024-01-03T08:30:00",
    "out": "2024-01-03T17:00:00"
  },
  {
    "in": "2024-01-04T08:15:00",
    "out": "2024-01-04T16:30:00"
  },
  {
    "in": "2024-01-05T08:10:00",
    "out": "2024-01-05T16:20:00"
  },
  {
    "in": "2024-01-06T08:05:00",
    "out": "2024-01-06T16:10:00"
  },
  {
    "in": "2024-01-07T08:20:00",
    "out": "2024-01-07T16:40:00"
  },
  {
    "in": "2024-01-08T08:40:00",
    "out": "2024-01-08T17:00:00"
  },
  {
    "in": "2024-01-09T08:00:00",
    "out": "2024-01-09T16:30:00"
  },
  {
    "in": "2024-01-10T08:30:00",
    "out": "2024-01-10T17:00:00"
  },
  {
    "in": "2024-01-11T08:20:00",
    "out": "2024-01-11T16:40:00"
  },
  {
    "in": "2024-01-12T08:10:00",
    "out": "2024-01-12T16:20:00"
  },
  {
    "in": "2024-01-13T08:25:00",
    "out": "2024-01-13T16:50:00"
  },
  {
    "in": "2024-01-14T08:35:00",
    "out": "2024-01-14T17:00:00"
  },
  {
    "in": "2024-01-15T08:15:00",
    "out": "2024-01-15T16:35:00"
  },
  {
    "in": "2024-01-16T08:30:00",
    "out": "2024-01-16T17:00:00"
  },
  {
    "in": "2024-01-17T08:25:00",
    "out": "2024-01-17T16:35:00"
  },
  {
    "in": "2024-01-18T08:05:00",
    "out": "2024-01-18T16:25:00"
  },
  {
    "in": "2024-01-19T08:40:00",
    "out": "2024-01-19T17:00:00"
  },
  {
    "in": "2024-01-20T08:20:00",
    "out": "2024-01-20T16:40:00"
  },
  {
    "in": "2024-01-21T08:30:00",
    "out": "2024-01-21T17:00:00"
  },
  {
    "in": "2024-01-22T08:15:00",
    "out": "2024-01-22T16:30:00"
  },
  {
    "in": "2024-01-23T08:35:00",
    "out": "2024-01-23T16:50:00"
  },
  {
    "in": "2024-01-24T08:10:00",
    "out": "2024-01-24T16:20:00"
  },
  {
    "in": "2024-01-25T08:05:00",
    "out": "2024-01-25T16:25:00"
  },
  {
    "in": "2024-01-26T08:25:00",
    "out": "2024-01-26T16:45:00"
  },
  {
    "in": "2024-01-27T08:20:00",
    "out": "2024-01-27T16:40:00"
  },
  {
    "in": "2024-01-28T08:15:00",
    "out": "2024-01-28T16:30:00"
  },
  {
    "in": "2024-01-29T08:35:00",
    "out": "2024-01-29T16:50:00"
  },
  {
    "in": "2024-01-30T08:10:00",
    "out": "2024-01-30T16:20:00"
  },
  {
    "in": "2024-01-31T08:00:00",
    "out": "2024-01-31T16:15:00"
  },
];


const Sample1 = [
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
