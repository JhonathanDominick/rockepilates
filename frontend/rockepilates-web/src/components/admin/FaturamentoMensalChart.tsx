"use client";

import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

type FaturamentoMensal = {
    mes: string;
    valor: number;
};

type FaturamentoMensalChartProps = {
    data: FaturamentoMensal[];
};

function formatarMoeda(valor: number) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(valor);
}

export function FaturamentoMensalChart({
                                           data,
                                       }: FaturamentoMensalChartProps) {
    return (
        <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="mes" />
                    <YAxis tickFormatter={(value) => `R$ ${value}`} />
                    <Tooltip
                        formatter={(value) =>
                            formatarMoeda(Number(value))
                        }
                    />
                    <Bar
                        dataKey="valor"
                        radius={[12, 12, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}