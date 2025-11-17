"use client"

import { PapiverseLoading, SectionLoading } from "@/components/ui/loader";
import { useAuth } from "@/hooks/use-auth";
import { useFetchData } from "@/hooks/use-fetch-data";
import { useFetchOne } from "@/hooks/use-fetch-one";
import { brownColors, sales, topSelling } from "@/lib/data-array";
import { formatCustomDate, formatDateTime, formatDateToWords, formatToPeso } from "@/lib/formatter"
import { SalesService } from "@/services/sales.service";
import { NotepadText } from "lucide-react";
import { Fragment, useState } from "react";
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DateRangePicker } from "../dashboard/components/DataRangePicker";
import { format } from "date-fns";

const chartTabs = ['Daily', 'Weekly', 'Monthly']

const productColumns = [
    { title: 'Product Name', style: '' },
    { title: 'Total Sales', style: '' },
    { title: 'Total Orders', style: '' },
]

const branchesColumns = [
    { title: 'Branch Name', style: '' },
    { title: 'Total Sales', style: '' },
]

const today = format(new Date(), "yyyy-MM-dd");

export function SalesPage({ branchId }: {
    branchId?: number;
}) {
    const { claims, loading: authLoading } = useAuth();
    const [chartTab, setChartTab] = useState("Daily");
    const [startDate, setStartDate] = useState<string>(today);
    const [endDate, setEndDate] = useState<string>(today);

    const params = branchId
        ? [branchId, startDate, endDate]
        : [startDate, endDate];

    const service = branchId
        ? SalesService.getSalesByBranch
        : SalesService.getOverallSummary;

    const { data, loading, error } = useFetchOne(
        service,
        params,
        params
    );

    if (loading || authLoading) return <SectionLoading />
    
    const summary = [
        { title: 'Total Orders', date: formatCustomDate('2025-08-21 22:45:19'), count: data.totalOrders  },
        { title: 'Payment Methods', date: formatCustomDate('2025-08-21 22:45:19'), count: formatToPeso(data.totalCash), type: "Cash"  },
        { title: 'Payment Methods', date: formatCustomDate('2025-08-21 22:45:19'), count: formatToPeso(data.totalGcash), type: "G-cash"  },
        { title: 'Type of Orders', date: formatCustomDate('2025-08-21 22:45:19'), count: data.totalDineIn ?? 0, type: "Dine in"  },
        { title: 'Type of Orders', date: formatCustomDate('2025-08-21 22:45:19'), count: data.totalTakeAway ?? 0, type: "Take out"  },
        { title: 'Total Income', date: formatCustomDate('2025-08-21 22:45:19'), count: formatToPeso(data.totalIncome)  },
    ]

    const grouped = summary.reduce((acc, item) => {
        if (!acc[item.title]) {
            acc[item.title] = [];
        }
        acc[item.title].push(item);
        return acc;
    }, {} as Record<string, typeof summary>);

    return (
        <section className="stack-md animate-fade-in-up">
            <DateRangePicker 
                startDate={ startDate }
                endDate={ endDate }
                setStartDate={ setStartDate }
                setEndDate={ setEndDate }
            />

            <div className="flex items-stretch gap-2">
                {Object.entries(grouped).map(([key, value]) => (
                    <div 
                        className="flex flex-col gap-2 flex-1 w-full p-4 bg-white shadow-sm rounded-md"
                        key={key}
                    >
                        <div className="font-semibold flex items-center justify-between">
                            <div className="text-sm">{ key }</div>
                            <div className="w-6 h-6 flex justify-center items-center rounded-full bg-darkorange text-light"><NotepadText className="w-4 h-4"/></div>
                        </div>
                        <div className="grid grid-cols-2 flex-1">
                        {value.map((item, index) => (
                            <Fragment key={ index }>
                                {item.type ? (
                                    <div>
                                        <div className="text-xs">{ item.type }</div>
                                        <div className={`${["Cash", "G-cash"].includes(item.type) && "text-[15px]"} ml-3 text-2xl font-semibold scale-x-120 text-darkbrown`}>
                                            {item.count}
                                        </div>
                                    </div>                                            
                                ) : (<div className="ml-3 text-2xl font-semibold scale-x-120 text-darkbrown">{item.count}</div>)}
                            </Fragment>
                        ))}
                        </div>
                       <div className="text-xs text-gray">As of { grouped[key][0].date }</div>
                    </div>
                ))}
            </div>

            <div className="relative rounded-md shadow-sm bg-white p-4">
                <div className="absolute z-50 top-3 left-5 w-full flex items-center justify-between">
                    <div className="text-lg scale-x-110 font-semibold">Sales Revenue</div>
                    <div className="flex items-center gap-4 mr-12">
                        {chartTabs.map((item, index) => (
                            <button
                                onClick={ () => setChartTab(item) }
                                className={`text-sm text-gray ${chartTab === item && "!text-dark font-semibold"}`}
                                key={ index }
                            >
                                { item }
                            </button>
                        ))}
                    </div>
                    
                </div>
                <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={sales} margin={{ top: 40, right: 10, left: 10, bottom: 0 }}>
                        <XAxis 
                            dataKey="date" 
                            tickFormatter={(dateStr) => {
                                const date = new Date(dateStr);
                                const monthName = date.getMonth() + 1
                                const day = date.getDate();
                                return `${monthName}/${day}`; 
                            }}
                            tick={
                                {fontSize: 12}
                            }
                        />
                        <YAxis 
                            tickFormatter={(sales) => (sales === 0 ? "" : formatToPeso(sales))}
                            tick={
                                {fontSize: 12}
                            }
                        />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip 
                            formatter={(value: number) => [`${formatToPeso(value)}`, "Sales"]} 
                            labelFormatter={(date: string) => formatDateToWords(date) }
                            contentStyle={{ fontSize: 12, backgroundColor: "#fff", border: "1px solid #ccc" }} 
                            itemStyle={{ fontSize: 12, color: "#8884d8" }}
                        />
                        <defs>
                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#8884d8" stopOpacity={0.8} />
                                <stop offset="100%" stopColor="#8884d8" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Area 
                            type="linear" 
                            dataKey="sales" 
                            stroke="#8884d8"     
                            strokeWidth={3} 
                            fill="url(#colorSales)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-4">
                <div className="bg-white shadow-sm rounded-lg overflow-hidden border">
                    <div className="px-4 py-3 border-b flex items-center justify-between">
                        <h3 className="text-lg font-semibold tracking-tight text-darkbrown">
                            Top Selling Products
                        </h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 text-darkbrown text-sm">
                                <tr>
                                    <th className="py-2 px-3 text-left w-10">#</th>
                                    <th className="py-2 px-3 text-left">Product Name</th>
                                    <th className="py-2 px-3 text-left">Total Sales</th>
                                    <th className="py-2 px-3 text-left">Total Orders</th>
                                </tr>
                            </thead>

                            <tbody className="text-sm">
                                {data.topProducts.map((item: any, index: number) => (
                                    <tr key={index} className="border-b hover:bg-gray-50 transition">
                                        <td className="py-2 px-3 font-semibold">{index + 1}</td>
                                        <td className="py-2 px-3">{item.productName}</td>
                                        <td className="py-2 px-3 font-semibold text-darkbrown">
                                            {formatToPeso(item.amount)}
                                        </td>
                                        <td className="py-2 px-3">{item.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ---------------------- */}
                {/* TOP BRANCHES */}
                {/* ---------------------- */}
                {!branchId && (
                    <div className="bg-white shadow-sm rounded-lg overflow-hidden border">
                        <div className="px-4 py-3 border-b flex items-center justify-between">
                            <h3 className="text-lg font-semibold tracking-tight text-darkbrown">
                                Top Branches
                            </h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 text-darkbrown text-sm">
                                    <tr>
                                        <th className="py-2 px-3 text-left w-10">#</th>
                                        <th className="py-2 px-3 text-left">Branch Name</th>
                                        <th className="py-2 px-3 text-left">Total Sales</th>
                                    </tr>
                                </thead>

                                <tbody className="text-sm">
                                    {data.topBranches.map((item: any, index: number) => (
                                        <tr key={index} className="border-b hover:bg-gray-50 transition">
                                            <td className="py-2 px-3 font-semibold">{index + 1}</td>
                                            <td className="py-2 px-3">{item.branchName}</td>
                                            <td className="py-2 px-3 font-semibold text-darkbrown">
                                                {formatToPeso(item.totalSales)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

        </section>
    )
}