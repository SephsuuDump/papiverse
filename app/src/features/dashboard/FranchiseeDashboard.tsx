import { AppHeader } from "@/components/shared/AppHeader";
import { Button } from "@/components/ui/button";
import { formatDateToWords, formatToPeso } from "@/lib/formatter";
import { Info } from "lucide-react";
import { useState } from "react";

const tabs = ['Sales', 'Employees', 'Expenses'];

export function FranchiseeDashboard() {
    const [tab, setTab] = useState('Sales');

    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    return (
        <section className="stack-md">
            <AppHeader label="Welcome Back, User!" />
            <div className="row-md">
                {tabs.map((item, i) => (
                    <div className={`w-full stack-sm p-4 bg-white rounded-md shadow-sm ${tab === item && "!bg-gradient-to-r from-orange-50 to-yellow-50"}`} key={i}>
                        <div className="flex justify-between">
                            <div className="text-sm font-semibold">{ item } Summary</div>
                            <button><Info className="w-4 h-4" /></button>
                        </div>
                        <div className="text-gray text-sm">
                            <span className="inline-block scale-x-120 origin-left text-xl text-dark mr-6 font-semibold">{ formatToPeso(45000) }</span> 
                            as of { formatDateToWords(yesterday) }
                        </div>
                        <Button 
                            className={`!bg-darkbrown opacity-50 ${item === tab && "opacity-100"}`}
                            size="sm"
                            onClick={ () => setTab(item) }
                        >
                            View Details
                        </Button>
                    </div>
                ))}
         
            </div>
        </section>
    )
}