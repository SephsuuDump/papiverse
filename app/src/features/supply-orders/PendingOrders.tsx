"use client"

import { SupplyOrder } from "@/types/supplyOrder"
import { Download, FileSpreadsheet, MessageSquare, MessageSquareMore, SquareMinus, TableOfContents } from "lucide-react";
import { TableDataTooltip } from "../users/TableDataTooltip";
import { formatDateTime, formatToPeso } from "@/lib/formatter";
import { OrderStatusBadge } from "@/components/ui/badge";
import { SectionLoading } from "@/components/ui/loader";
import { Dispatch, SetStateAction, useState } from "react";
import { AddRemarks } from "./AddRemarks";
import Link from "next/link";
import { Claim } from "@/types/claims";

const columns = [
    { title: 'Branch Name' , style: '' },
    { title: 'Date Requested' , style: '' },
    { title: 'Status' , style: 'text-center' },
    { title: 'Order ID' , style: '' },
    { title: 'Total Amount' , style: '' },
]

export function PendingOrders({ claims, paginated, setReload }: {
    claims: Claim;
    paginated: SupplyOrder[];
    setReload: Dispatch<SetStateAction<boolean>>;
}) {
    const [order, setOrder] = useState<SupplyOrder>();

    if (!paginated) return <SectionLoading />
    return (
        <section>
            <div className="flex-center-y thead">
                <div className="th"><SquareMinus className="w-4 h-4 mx-auto" strokeWidth={ 3 }/></div>
                <div className="th"><FileSpreadsheet className="w-4 h-4 mx-auto" strokeWidth={ 3 }/></div>
                <div className="th"><MessageSquareMore className="w-4 h-4 mx-auto" strokeWidth={ 3 }/></div>
                <div className="grid grid-cols-5 w-full">
                    {columns.map((item, _) => (
                        <div key={_} className={`th ${item.style}`}>{ item.title }</div>
                    ))}
                </div>
            </div>

            {paginated.map((item, i) => (
                <div className="flex-center-y tdata" key={i}>
                    <Link href={`/inventory/supply-orders/${item.orderId}`}>
                        <TableDataTooltip
                            element={<TableOfContents className="w-4 h-4 text-gray mx-auto" strokeWidth={3} />}
                            content="View Full Order"
                            className="mx-auto td"
                        />
                    </Link>
                    <TableDataTooltip
                        element={<Download className="w-4 h-4 text-gray mx-auto" strokeWidth={3} />}
                        content="Download PDF"
                        className="mx-auto td"
                    />
                    <TableDataTooltip
                        action={ () => setOrder(item) }
                        element={<MessageSquare className="w-4 h-4 text-gray mx-auto" strokeWidth={3} />}
                        content={ item.remarks || 'No remarks.'  }
                        className="mx-auto td"
                    />
                    <div className="grid grid-cols-5 w-full">
                        <div className="td">{ item.branchName }</div>
                        <div className="td-wrap">{ formatDateTime(item.orderDate) }</div>
                        <div className="td"><OrderStatusBadge className="mx-auto" status={ item.status } /></div>
                        <div className="td">
                            <div>{ item.meatCategory?.meatOrderId }</div>
                            <div>{ item.snowfrostCategory?.snowFrostOrderId }</div>
                        </div>
                        <div className="td">{ formatToPeso(item.completeOrderTotalAmount) }</div>
                    </div>
                </div>
            ))}

            {order && (
                <AddRemarks 
                    claims={ claims }
                    order={ order }
                    setOrder={ setOrder }
                    setReload={ setReload }
                />
            )}

        </section>
    )
}