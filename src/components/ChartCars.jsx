import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Sedan", value: 8 },
  { name: "SUV", value: 5 },
  { name: "Station", value: 3 },
];

const COLORS = ["#4f46e5", "#3b82f6", "#6366f1"];

const ChartCars = () => (
  <div className="bg-white rounded-2xl shadow-xl p-6">
    <h3 className="font-bold mb-4">Carros por Categoria</h3>
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={60}
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export default ChartCars;
