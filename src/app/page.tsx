"use client"
import { useModlCTX } from "@/ctx/modals.ctx";
import useMounted from "@/hooks/useMounted";
import { Button, Spin, Table, Tag } from "antd";
import Link from "next/link";
import { useEffect } from "react";

export default function HomePage() {
  const isMounted = useMounted()
  if (!isMounted) return "loading..."
  return (
    <main className="">
      <Header />
      <RenderWidgets />
      <HandleServer />
    </main>
  );
}

function Header() {
  return (
    <header className="flex items-center justify-between border px-4 py-2 shadow-sm">
      <div className="flex items-center gap-2 hover:text-blue-600">
        <Link href={"/"}>
          <img
            alt="Server Info"
            width={60}
            src="https://i.pinimg.com/564x/3a/e0/82/3ae0821f588d0c20d5db206d739ff2de.jpg"
          />
        </Link>
        <div>
          <p>Server Info</p>
          <p className="text-sm">
            Report Bug <b>{"<shahzaibalam231@yopmail.com>"}</b>
          </p>
        </div>
      </div>

      <ServerInfo />
    </header>
  );
}

function ServerInfo() {
  return (
    <div className="flex items-center gap-4">
      <div>
        <p>
          <span className="text-sm">Server Url:</span>{" "}
          <b>{"<https://admin.socket.io/#/>"}</b>
        </p>
        <div className="flex gap-2">
          <span className="text-sm">Status:</span>
          <Tag color="red">Disconnected</Tag>
        </div>
      </div>
      <Button type="primary">Update</Button>
    </div>
  );
}

function RenderWidgets() {
  return (
    <div className="grid grid-cols-4">
      <ServerInfoWidget />
    </div>
  );
}

function ServerInfoWidget() {
  const dataSource = [
    {
      key: "1",
      title: "Server Name",
      description: "Shahzaib Server",
    },
    {
      key: "2",
      title: "Total Memory",
      description: "Shahzaib Server",
    },
    {
      key: "3",
      title: "Free Memory",
      description: "Shahzaib Server",
    },
    {
      key: "4",
      title: "Server Name",
      description: "Shahzaib Server",
      last_updated: "07-07-2001 (09:10 PM)",
    },
    {
      key: "5",
      title: "Server Name",
      description: "Shahzaib Server",
      last_updated: "07-07-2001 (09:10 PM)",
    },
  ];

  const columns = [
    {
      title: "title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "last_updated",
      dataIndex: "last_updated",
      key: "last_updated",
    },
  ];
  return (
    <div className="h-full w-full">
      <Table
        dataSource={dataSource}
        showHeader={false}
        bordered
        size="small"
        columns={columns}
        pagination={false}
      />
      ;
    </div>
  );
}

function HandleServer() {
  const { closeModal, openModal } = useModlCTX()
  useEffect(() => {
    openModal("CREATE-SERVER", {
      name: "Create Server 1", data: {
        name: "shahzaib"
      }
    });
    openModal("CREATE-SERVER-v2", { name: "Create Server 2" });
  }, [])
  return <></>
}