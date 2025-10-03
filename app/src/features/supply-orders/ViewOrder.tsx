import { AppHeader } from "@/components/shared/AppHeader";
import { ModalTitle } from "@/components/shared/ModalTitle";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { OrderStatusBadge, OrderStatusLabel } from "@/components/ui/badge";
import { Button, UpdateButton } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormLoader, PapiverseLoading, SectionLoading } from "@/components/ui/loader";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { useFetchData } from "@/hooks/use-fetch-data"
import { useFetchOne } from "@/hooks/use-fetch-one";
import { useSupplyOrderApproval } from "@/hooks/use-supply-order-approval";
import { formatDateToWords, formatToPeso } from "@/lib/formatter";
import { SupplyOrderService } from "@/services/supplyOrder.service"
import { SupplyOrder } from "@/types/supplyOrder"
import { Ham, MoveRight, Snowflake } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation"
import { Dispatch, SetStateAction, useEffect, useState } from "react";

const tabs = ['Meat Order', 'Snow Order']

const columns = [
    { title: 'No.', style: 'text-center' },
    { title: 'SKU ID', style: '' },
    { title: 'Supply Description', style: '' },
    { title: 'Qty', style: 'text-center' },
    { title: 'Unit Price', style: '' },
    { title: 'Total Amount', style: '' },
]

export function ViewOrderPage({ id }: { id: number }) {
    const [reload, setReload] = useState(false);
    const { claims, loading: authLoading } = useAuth();
    const { data, loading, error } = useFetchOne<SupplyOrder>(SupplyOrderService.getSupplyOrderById, [id], [id, reload]);
    const { onProcess, enableSave, handleSubmit } = useSupplyOrderApproval(data!, claims, setReload);
    
    const [tab, setTab] = useState('Meat Order');
    const [open, setOpen] = useState(false);
    const [meatApproved, setMeatApproved] = useState<boolean | undefined>(undefined);
    const [snowApproved, setSnowApproved] = useState<boolean | undefined>(undefined);

    useEffect(() => {
        if (data) {
            setMeatApproved(data.meatCategory?.isApproved ?? false);
            setSnowApproved(data.snowfrostCategory?.isApproved ?? false);
        }
    }, [data]);

    if (loading || authLoading) return <PapiverseLoading /> 
    return (
        <section className="flex flex-col gap-2">
            <AppHeader label={ `${data!.meatCategory?.meatOrderId} | ${data!.snowfrostCategory?.snowFrostOrderId}`  } />
            <div className="flex justify-between items-center">
                <div className="flex-center bg-slate-50 shadow-sm rounded-full">
                    {tabs.map((item, i) => (
                        <Button
                            key={i}
                            onClick={ () => setTab(item) }
                            className={`w-30 rounded-full !bg-slate-50 text-dark hover:opacity-50 ${tab === item && "!bg-darkbrown text-light hover:opacity-100"}`}
                        >
                            { item }
                        </Button>
                    ))}
                </div>
                <div className="flex gap-2 my-2">
                    {claims.roles[0] === 'FRANCHISOR' && (
                        <Button className="!bg-darkgreen hover:opacity-90" 
                            disabled={ enableSave(meatApproved!, snowApproved!) }
                            onClick={ () => setOpen(true) }
                        >
                            <FormLoader onProcess={ onProcess } label="Save Order" loadingLabel="Saving Order" />
                        </Button>
                    )}
                    <Link href='/inventory/supply-orders'>
                        <Button>Back to Orders</Button>
                    </Link>
                </div>
            </div>

            <div className="relative p-4 bg-white rounded-md shadow-sm">
                {claims.roles[0] === 'FRANCHISOR' && (
                    <div className="top-2 left-2 flex items-center gap-1">
                        <Checkbox id="meat" 
                            className="rounded-full border-gray data-[state=checked]:bg-darkgreen" 
                            checked={ tab === 'Snow Order' ? snowApproved : meatApproved }
                            onCheckedChange={(checked: boolean) => { tab === 'Snow Order' ? setSnowApproved(checked) : setMeatApproved(checked)}}
                        />
                        <label htmlFor="meat" className="text-sm font-semibold">
                            {tab === 'Snow Order' ? 
                                snowApproved ? 'Approved' : 'Not Approved'
                                : meatApproved ? 'Approved' : 'Not Approved'
                            }
                        </label>
                    </div>
                )}
                <Image src="/images/kp_logo.png" alt="KP Logo" width={60} height={60} className="top-2 right-2 absolute" />
                <div className="flex justify-center items-center gap-2">
                    { tab === 'Snow Order' ? <Snowflake /> : <Ham /> }
                    <div className="font-semibold">{ tab } Receipt</div>
                </div>
                {claims.roles[0] === 'FRANCHISOR' ? 
                    <div className="text-center text-sm text-gray">Showing only the order form receipt for this { tab.toLowerCase() }.</div> 
                    : <div className="text-center text-sm text-gray">Please review carefully your order form.</div>
                }
                <div className="grid grid-cols-2 gap-1 mt-2">
                    <div className="text-sm"><span className="font-bold">Order ID: </span>
                        { tab === 'Snow Order' ? 
                            data!.snowfrostCategory?.snowFrostOrderId 
                            : data!.meatCategory?.meatOrderId
                        }
                    </div>
                    <div className="text-sm ms-auto"><span className="font-bold">To: </span>{ "KP Comissary" }</div>
                    <div className="text-sm flex-center-y gap-2">
                        <span className="font-bold">Status: </span>
                        <OrderStatusBadge className="scale-110" status={ data!.status} />
                    </div>
                    <div className="text-sm ms-auto inline-block"><span className="font-bold">Date</span> { formatDateToWords(data!.orderDate) }</div>
                    <div className="text-sm"><span className="font-bold">Tel No: </span>{ "09475453783" }</div>
                    <div className="text-sm ms-auto"><span className="font-bold">Delivery within: </span>{ data!.branchName }</div>
                </div>

                <div className="mt-4">
                    <div className="thead grid grid-cols-[60px_1fr_1fr_60px_1fr_1fr]">
                        {columns.map((item, _) => (
                            <div key={_} className={`th ${item.style}`}>{ item.title }</div>
                        ))}
                    </div>
                    { tab === 'Snow Order' ? 
                        <Orders orders={ data!.meatCategory!.meatItems } /> 
                        : <Orders orders={ data!.snowfrostCategory!.snowFrostItems } /> 
                    }
                </div>
                <div className="text-gray text-sm text-end mx-4 mt-4">
                    Meat Order <span className="font-semibold text-dark">+ { formatToPeso(data!.meatCategory!.categoryTotal) }</span>
                </div>
                <div className="text-gray text-sm text-end mx-4">
                    Snow Order <span className="font-semibold text-dark">+ { formatToPeso(data!.snowfrostCategory!.categoryTotal) }</span>
                </div>
                <Separator className="my-4 bg-gray" />
                <div className="text-gray text-end mx-4">
                    Complete Order Total:  <span className="ml-2 font-semibold text-darkbrown inline-block scale-x-120">{ formatToPeso(data!.completeOrderTotalAmount) }</span>
                </div>
            </div>

            {open && <ConfirmSave 
                setOpen={ setOpen }
                order={ data! }
                meatApproved={ meatApproved! }
                snowApproved={ snowApproved! }
                onProcess={ onProcess }
                handleSubmit={ handleSubmit }
            />}
        </section>
    )
}

function Orders({ orders }: {
    orders: any[];
})  {
    return (
        <>
            {orders.map((item, i) => (
                <div className="tdata grid grid-cols-[60px_1fr_1fr_60px_1fr_1fr]" key={i}>
                    <div className="td text-center">{ i + 1 }</div>
                    <div className="td">{ item.rawMaterialCode }</div>
                    <div className="td">{ item.rawMaterialName }</div>
                    <div className="td text-center">{ item.quantity }</div>
                    <div className="td">{ formatToPeso(item.price) }</div>
                    <div className="td">{ formatToPeso(item.price * item.quantity) }</div>
                </div>
            ))}
        </>     
    )
}

function ConfirmSave({ setOpen, order, meatApproved, snowApproved, onProcess, handleSubmit }: {
    setOpen: Dispatch<SetStateAction<boolean>>;
    order: SupplyOrder,
    meatApproved: boolean, 
    snowApproved: boolean,
    onProcess: boolean,
    handleSubmit: (i: boolean, j: boolean) => void;
}) {
    return (
        <AlertDialog open>
            <AlertDialogContent>
                <ModalTitle
                    label="Confirm Order Approval?"
                    isAlertDialog={true}
                />
                <form
                    className="flex flex-col gap-4"
                    onSubmit={ e => {
                        e.preventDefault();
                        handleSubmit(meatApproved, snowApproved);
                        setOpen(prev => !prev);
                    }}
                >
                    <div className="flex-center flex-col gap-2">
                        <div className="text-center">Meat Order Approval</div>
                        {order.meatCategory?.isApproved === meatApproved ?
                            <div className={`text-center font-bold ${meatApproved ? "text-darkgreen" : "text-darkred"}`}>
                                { meatApproved ? 'Approved' : 'Not Approved' }
                            </div> 
                            :
                            <div className="flex-center gap-2" >
                                <div className={`text-center font-bold ${order.meatCategory?.isApproved ? "text-darkgreen" : "text-darkred"}`}>
                                    { order.meatCategory?.isApproved ? 'Approved' : 'Not Approved' }
                                </div>
                                <MoveRight className="w-6 h-6" />
                                <div className={`text-center font-bold ${meatApproved ? "text-darkgreen" : "text-darkred"}`}>
                                    { meatApproved ? 'Approved' : 'Not Approved' }
                                </div>
                            </div>
                        }
                    </div>
                    <Separator className="h-2 bg-gray" />
                    <div className="flex-center flex-col gap-2">
                        <div className="text-center">Snow Order Approval</div>
                        {order.snowfrostCategory?.isApproved === snowApproved ?
                            <div className={`text-center font-bold ${snowApproved ? "text-darkgreen" : "text-darkred"}`}>
                                { snowApproved ? 'Approved' : 'Not Approved' }
                            </div> 
                            :
                            <div className="flex-center gap-2" >
                                <div className={`text-center font-bold ${order.snowfrostCategory?.isApproved ? "text-darkgreen" : "text-darkred"}`}>
                                    { order.snowfrostCategory?.isApproved ? 'Approved' : 'Not Approved' }
                                </div>
                                <MoveRight className="w-6 h-6" />
                                <div className={`text-center font-bold ${snowApproved ? "text-darkgreen" : "text-darkred"}`}>
                                    { snowApproved ? 'Approved' : 'Not Approved' }
                                </div>
                            </div>
                        }
                    </div>
                    <div className="flex-center-y justify-end">
                        <AlertDialogCancel onClick={ () => setOpen(prev => !prev) }>Cancel</AlertDialogCancel>
                        <UpdateButton
                            type="submit"
                            onProcess={ onProcess }
                            label="Save Approval"
                            loadingLabel="Saving Approval"
                        />
                    </div>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    )
}