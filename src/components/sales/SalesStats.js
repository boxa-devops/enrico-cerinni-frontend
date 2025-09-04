import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react';

export default function SalesStats({ stats, formatCurrency }) {
  return (
    <div className="">
      <div className="">
        <div className="">
          <TrendingUp size={20} />
        </div>
        <div className="">
          <h3>{stats.total_sales}</h3>
          <p>Jami sotuvlar</p>
        </div>
      </div>
      <div className="">
        <div className="">
          <DollarSign size={20} />
        </div>
        <div className="">
          <h3>{formatCurrency(stats.total_revenue)}</h3>
          <p>Jami tushum</p>
        </div>
      </div>
      <div className="">
        <div className="">
          <BarChart3 size={20} />
        </div>
        <div className="">
          <h3>{formatCurrency(stats.avg_order_value)}</h3>
          <p>O'rtacha buyurtma</p>
        </div>
      </div>
      <div className="">
        <div className="">
          <TrendingDown size={20} />
        </div>
        <div className="">
          <h3>{stats.completed_sales}</h3>
          <p>Tugatilgan sotuvlar</p>
        </div>
      </div>
    </div>
  );
} 