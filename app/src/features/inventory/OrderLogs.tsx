import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { flattenGroupedLogsWithOrders, formatDateToWords, getWeekday } from "@/lib/formatter";
import { InventoryLog } from "@/types/inventory-log";
import dayjs from "dayjs"
import { Fragment } from "react";

interface Props {
    logs: InventoryLog[];
}

export function OrderLogs({ logs }: Props) {
    const groupedByDateAndOrder = logs.reduce<Record<string, Record<string, InventoryLog[]>>>((acc, log) => {
        if (!log.dateTime) {
            return acc; 
        }
        const dateOnly = log.dateTime.slice(0, 10);
        if (!acc[dateOnly]) {
            acc[dateOnly] = {};
        }
        const orderKey = String(log.orderId);
        if (!acc[dateOnly][orderKey]) {
            acc[dateOnly][orderKey] = [];
        }
        acc[dateOnly][orderKey].push(log);
        return acc;
    }, {});

    return(
        <section>
            {flattenGroupedLogsWithOrders(groupedByDateAndOrder).map((item, index) => (
                <div className="my-1" key={ item.date }>
                    <Accordion type="multiple">
                        <div className="flex gap-2 items-center w-fit font-semibold py-2 px-4 border-1 border-gray-300 shadow-xs bg-light rounded-t-xl z-50">
                            <div>{formatDateToWords(item.date)}</div> 
                            <div className="bg-dark h-fit rounded-sm text-light px-2 font-semibold text-[10px]">{getWeekday(item.date)}</div>
                        </div>
                        {item.orders.map((subItem, index) => (
                            <AccordionItem value={ String(subItem.orderId) } key={ index }>
                                <AccordionTrigger className="rounded-none bg-light px-4 shadow-xs">
                                    <div className="w-full grid grid-cols-4">
                                        <div>Order ID: <span className="font-semibold">{ subItem.orderId || "None" }</span></div>
                                        <div>Source: <span className="font-semibold">{ subItem.logs[0].source }</span></div>
                                        <div>Type: <span className="font-semibold">{ subItem.logs[0].type === "IN" ? "INGOING" : "OUTGOING" }</span></div>
                                        <div className="font-semibold">{ subItem.logs[0].branchName }</div>
                                    </div>
                                </AccordionTrigger> 
                                <AccordionContent className="px-4 bg-light border-b-darkred border-1">
                                    
                                        {subItem.logs.map((subSubItem, index) => (
                                            <Fragment key={ index }>
                                                <div className="grid grid-cols-4 py-2">
                                                    <div>{ subSubItem.rawMaterialCode }</div>
                                                    <div>Qty: { subSubItem.quantityChanged }</div>
                                                    <div>{ subSubItem.rawMaterialName }</div>
                                                    <div>
                                                        {dayjs(subSubItem.dateTime).format("dddd, MMMM D, YYYY h:mm A")}
                                                    </div>
                                                </div>
                                                <Separator />
                                            </Fragment>
                                        ))}
                                    
                                </AccordionContent>
                            </AccordionItem>
        
                        ))}
                    </Accordion>
                </div>
            ))}
        </section>
    );
}