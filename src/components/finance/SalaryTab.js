import { Plus, Eye, Edit, Trash2, Users } from 'lucide-react';

const SalaryTab = ({ 
  employees, 
  formatCurrency, 
  formatDate,
  onAddEmployee, 
  onEditEmployee, 
  onDeleteEmployee,
  onViewEmployee
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Xodimlar</h2>
            <p className="text-sm text-gray-600">Barcha xodimlarni boshqaring</p>
          </div>
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 text-sm font-medium shadow-sm hover:shadow-md"
            onClick={onAddEmployee}
          >
            <Plus size={16} />
            Yangi xodim
          </button>
        </div>
        
        <div className="bg-gray-50 rounded-lg border border-gray-200">
          {employees.length === 0 ? (
            <div className="p-8 text-center">
              <Users size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-sm">Hali xodimlar qo'shilmagan</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ism</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lavozim</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefon</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Maosh</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qabul sanasi</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Holat</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amallar</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users size={14} className="text-blue-600" />
                          </div>
                          {employee.name}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {employee.position}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {employee.phone ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {employee.phone}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{employee.email || '-'}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-blue-600">{formatCurrency(employee.salary)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{formatDate(employee.hire_date)}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          employee.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {employee.is_active ? 'Faol' : 'Nofaol'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-1">
                          {onViewEmployee && (
                            <button 
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors hover:scale-105 transform"
                              onClick={() => onViewEmployee(employee)}
                              title="Ko'rish"
                            >
                              <Eye size={14} />
                            </button>
                          )}
                          <button 
                            className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors hover:scale-105 transform"
                            onClick={() => onEditEmployee(employee)}
                            title="Tahrirlash"
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors hover:scale-105 transform"
                            onClick={() => onDeleteEmployee(employee.id)}
                            title="O'chirish"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalaryTab; 