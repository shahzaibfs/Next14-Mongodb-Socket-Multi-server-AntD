import { Spin } from "antd";
import React from "react";

function Spinner({ children, size = "large" }: { size?: "small" | "default" | "large", children?: React.ReactNode }) {
  return (
    <div className="absolute left-0 top-0 flex  gap-4 flex-col h-full w-full items-center justify-center bg-black bg-opacity-20">
      <Spin size={size} />
      {children}
    </div>
  );
}

export default Spinner;
