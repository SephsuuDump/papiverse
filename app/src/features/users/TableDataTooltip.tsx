import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function TableDataTooltip({ content, className, element, action }: {
    content?: string;
    element?: React.ReactNode
    className?: string;
    action?: (...args: any[]) => any;
}) {
    return (
        <Tooltip>
            <TooltipTrigger 
                onClick={ action }
                className={ `td text-start ${className}` }
            >
                { element || content }
            </TooltipTrigger>
            <TooltipContent>{ content }</TooltipContent>
        </Tooltip>
    )
}