import { Filter, Download, RefreshCw } from 'lucide-react';
import Button from '../ui/Button';

export default function SalesHeader({ 
  showFilters, 
  onToggleFilters, 
  onExport, 
  onRefresh 
}) {
  return (
    <div className="">
      <div className="">
        <h1>Moliya</h1>
        <p>Barcha sotuvlarni ko'ring va boshqaring</p>
      </div>
      <div className="">
        <Button
          variant="secondary"
          onClick={onToggleFilters}
          className=""
        >
          <Filter size={16} />
          Filtrlar
        </Button>
        <Button
          variant="secondary"
          onClick={onExport}
          className=""
        >
          <Download size={16} />
          Eksport
        </Button>
        <Button
          variant="primary"
          onClick={onRefresh}
          className=""
        >
          <RefreshCw size={16} />
        </Button>
      </div>
    </div>
  );
} 