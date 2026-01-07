"use client"

import { AppHeader } from "@/components/shared/AppHeader";
import { Button } from "@/components/ui/button";
import { PapiverseLoading } from "@/components/ui/loader";
import { DateRangePicker } from "@/features/dashboard/components/DataRangePicker";
import { useFetchData } from "@/hooks/use-fetch-data";
import { formatToPeso } from "@/lib/formatter";
import { InventoryService } from "@/services/inventory.service";
import { SalesService } from "@/services/sales.service";
import { format } from "date-fns";
import { RefreshCcw } from "lucide-react";
import { useState } from "react";

const today = format(new Date(), "yyyy-MM-dd");

const columns = [
    { title: "ProductName", style: "" },
    { title: "Quantity", style: "" },
    { title: "Amount", style: "" },
]

export function ProductRankingPage() {
    const [reload, setReload] = useState(false);
    const [startDate, setStartDate] = useState<string>(today);
    const [endDate, setEndDate] = useState<string>(today);

    const { data: branches, loading } = useFetchData<{
        productName: string;
        quantity: number;
        amount: number;
    }>(
        SalesService.getProductRanking,
        [reload],
        [startDate, endDate]
    )
    console.log(branches);
    
    if (loading) return <PapiverseLoading />
    return (
        <section className="stack-md animate-fade-in-up">
            <AppHeader label="Product Sales Ranking" />
            <div className="flex-center-y gap-2">
                <DateRangePicker 
                    startDate={ startDate }
                    endDate={ endDate }
                    setStartDate={ setStartDate }
                    setEndDate={ setEndDate }
                />
                <Button
                    onClick={ () => setReload(prev => !prev) }
                    className="bg-darkorange"
                    size="sm"
                >
                    <RefreshCcw /> Refresh
                </Button>
            </div>
            <div className="table-wrapper">
                <div className="thead grid grid-cols-3">
                    {columns.map((item, index) => (
                        <div key={index} className={`th ${item.style}`}>{item.title}</div>
                    ))}                     
                </div>
                {branches.map((item) => (
                    <div className="tdata grid grid-cols-3">
                        <div className="td">{ item.productName }</div>
                        <div className="td">{ item.quantity }</div>
                        <div className="td font-semibold">{ formatToPeso(item.amount) }</div>
                    </div>
                ))}
            </div>

        </section>
    )
}