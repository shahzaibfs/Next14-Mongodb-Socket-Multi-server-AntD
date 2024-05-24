import withErrorBoundary from "@/hocs/with-error-boundry";
import { ReactNode } from "react";

const GroupSvg = ({ tick, children }: { children: ReactNode, tick: { x: number, y: number } }) => {
    return (
        <g transform={`translate(${tick.x}, ${tick.y})`}>
            {children}
        </g>
    );
};


export default withErrorBoundary(GroupSvg)