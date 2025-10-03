import { ModalTitle } from "@/components/shared/ModalTitle";
import { AddButton } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { formatDateTime, formatToPeso } from "@/lib/formatter";
import { SalesService } from "@/services/sales.service";
import { Claim } from "@/types/claims";
import { PaidOrder } from "@/types/sales";
import Image from "next/image";
import { Dispatch, Fragment, SetStateAction, useState } from "react";
import { toast } from "sonner";

interface Props {
    claims: Claim;
    paidOrdersPreview: PaidOrder[];
    setPaidOrdersPreview: Dispatch<SetStateAction<PaidOrder[]>>;
    setReload: Dispatch<SetStateAction<boolean>>;
}

const columns = [
    { title: 'Order ID', style: 'sticky left-0 bg-slate-200 !z-50' },
    { title: 'Products', style: '' },
    { title: 'Total Paid', style: '' },
    { title: 'Type', style: '' },
    { title: 'Status', style: '' },
    { title: 'Payment Time', style: '' },

]

export function PaidOrdersPreview({ paidOrdersPreview, setPaidOrdersPreview, claims, setReload }: Props) {
    const [onProcess, setProcess] = useState(false);

    const grandTotal = paidOrdersPreview.reduce((acc, order) => acc + order.totalPaid, 0);

    async function handleSubmit() {
        try {
            setProcess(true);
            
            const blob = new Blob([JSON.stringify(paidOrdersPreview, null, 2)], {
                type: "application/json",
            });
            const file = new File([blob], "paid_orders.json", { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "paid_orders.json";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            const data = await SalesService.uploadPaidOrders(claims.branch.branchId, file);
            if (data) toast.success('Excel for paid orders inserted successfully.');
            setProcess(false);
            setReload(prev => !prev);
            setPaidOrdersPreview([]);
        } catch (error) { toast.error(`${error}`) }
    }
    return(
        <Dialog open onOpenChange={ (open) => { if (!open) setPaidOrdersPreview([]) }}>
            <DialogContent>
                <ModalTitle label="Confirm Insertion of Paid Orders?" />
             
                    <div className="w-full h-[60vh] overflow-auto">
                        <div className="thead grid grid-cols-6 min-w-[1000px] sticky top-0 z-10">
                            {columns.map((item, _) => (
                                <div key={_} className={`th ${item.style}`}>{ item.title }</div>
                            ))}
                        </div>
                        {paidOrdersPreview.map((item, index) => (
                            <div 
                                className="tdata min-w-[1000px] grid grid-cols-6 !border-dark"
                                key={ index }
                            >
                                <div className="flex-center !my-0 sticky left-0 shadow-md bg-slate-50">
                                    { item.orderId }
                                </div>
                                <div>
                                    {item.items!.map((subItem, _) => (
                                        <div 
                                            className={`p-2 text-sm ${_ % 2 == 0 ? "bg-[#F5F5F5]" : "bg-[#FCFCFC]"}`}
                                            key={_}
                                        >
                                            { `${subItem.productName} x ${subItem.quantity}` }
                                        </div>  
                                    ))}
                                </div>
                                <div className="td">{ formatToPeso(item.totalPaid) }</div>
                                <div className="td">{ item.orderType }</div>
                                <div className="td">{ item.orderStatus }</div>
                                
                                <div className="td">{ formatDateTime(item.paymentTime) }</div>
                            </div>
                        ))}
                    </div>
                    <form 
                        className="flex-center-y justify-between"
                        onSubmit={ e => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                    >
                        <div>
                            <div className="text-dark font-semibold text-sm"><span className="text-gray">Orders Count: </span> { paidOrdersPreview.length }</div>
                            <div className="text-dark font-semibold text-sm"><span className="text-gray">Grand Total: </span> { formatToPeso(grandTotal) }</div>
                        </div>
                        <div className="flex gap-4">
                            <DialogClose className="text-sm">Close</DialogClose>
                            <AddButton 
                                type="submit"
                                onProcess={ onProcess }
                                label="Create User"
                                loadingLabel="Creating User"
                            />
                        </div>
                    </form>
             
                
            </DialogContent>
        </Dialog>
    );
}