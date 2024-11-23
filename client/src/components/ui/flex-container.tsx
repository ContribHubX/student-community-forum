import { cn } from "@/lib/utils";

interface FlexContainerProp {
    direction?: "row" | "col"
    className?: string;
    children: React.ReactNode;
}

export const FlexContainer = ({ direction, className, children }: FlexContainerProp) => {
    
    return (
        <div className={cn(`flex items-center flex-${!direction ? "row" : direction }  gap-3`, className)}>
            {children}
        </div>
    )
}  
