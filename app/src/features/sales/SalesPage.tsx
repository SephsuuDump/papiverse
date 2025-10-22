"use client"

import { PapiverseLoading } from "@/components/ui/loader";
import { useFetchData } from "@/hooks/use-fetch-data";
import { useFetchOne } from "@/hooks/use-fetch-one";
import { brownColors, sales, topSelling } from "@/lib/data-array";
import { formatCustomDate, formatDateTime, formatDateToWords, formatToPeso } from "@/lib/formatter"
import { SalesService } from "@/services/sales.service";
import { NotepadText } from "lucide-react";
import { Fragment, useState } from "react";
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const chartTabs = ['Daily', 'Weekly', 'Monthly']

const columns = [
    { title: 'Product Name', style: '' },
    { title: 'Total Sales', style: '' },
    { title: 'Total Orders', style: '' },
]

export function SalesPage() {
    const [chartTab, setChartTab] = useState('Daily');

    const { data, loading, error } = useFetchOne(SalesService.getOverallSummary, [], ['2025-08-20', '2025-08-20']);
    console.log(data);
    if (loading) return <PapiverseLoading />
    
    const summary = [
        { title: 'Total Orders', date: formatCustomDate('2025-08-21 22:45:19'), count: data.totalOrders  },
        { title: 'Payment Methods', date: formatCustomDate('2025-08-21 22:45:19'), count: formatToPeso(data.totalCash), type: "Cash"  },
        { title: 'Payment Methods', date: formatCustomDate('2025-08-21 22:45:19'), count: formatToPeso(data.totalGcash), type: "G-cash"  },
        { title: 'Type of Orders', date: formatCustomDate('2025-08-21 22:45:19'), count: 78, type: "Dine in"  },
        { title: 'Type of Orders', date: formatCustomDate('2025-08-21 22:45:19'), count: 78, type: "Take out"  },
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

            <div className="grid grid-cols-10 gap-2">
                <div className="col-span-7 border-1 bg-white shadow-sm rounded-md px-2 overflow-hidden">
                    <div className="text-lg scale-x-110 font-semibold origin-left p-2">Top Selling Products</div>
                    <div className="shadow-[0_3px_8px_rgba(0,0,0,0.25)]">
                        <div className="thead flex">
                            <div className="border-r-1 border-r-white w-15 flex-center">#</div>
                            <div className="grid grid-cols-3 w-full">
                                {columns.map((item, _) => (
                                    <div key={_} className={`th ${item.style}`}>{ item.title }</div>
                                ))}
                            </div>
                        </div>
                        {data.topProducts.map((item: any, index: number) => (
                            <div className="tdata flex">
                                <div className="w-15 flex-center font-bold">{ index + 1 }</div>
                                <div 
                                    key={ index }
                                    className={`w-full grid grid-cols-3`}
                                >
                                    <div className="td">{ item.productName }</div>
                                    <div className="td">{ formatToPeso(item.amount) }</div>
                                    <div className="td">{ item.quantity }</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-span-7 border-1 bg-white shadow-sm rounded-md px-2">
                    <div className="text-lg scale-x-110 font-semibold origin-left p-2">Top Selling Products</div>
                    <div className="thead flex">
                        <div className="border-r-1 border-r-white w-15 flex-center">#</div>
                        <div className="grid grid-cols-3 w-full">
                            {columns.map((item, _) => (
                                <div key={_} className={`th ${item.style}`}>{ item.title }</div>
                            ))}
                        </div>
                    </div>
                    {data.topProducts.map((item: any, index: number) => (
                        <div className="tdata flex">
                            <div className="w-15 flex-center font-bold">{ index + 1 }</div>
                            <div 
                                key={ index }
                                className={`w-full grid grid-cols-3`}
                            >
                                <div className="td">{ item.productName }</div>
                                <div className="td">{ formatToPeso(item.amount) }</div>
                                <div className="td">{ item.quantity }</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}