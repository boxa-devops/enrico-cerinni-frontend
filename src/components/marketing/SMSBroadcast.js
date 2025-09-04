'use client';

import { useState } from 'react';
import { Smartphone, Send, Users, UserCheck, AlertCircle, MessageSquare } from 'lucide-react';
import { Button, Card } from '../ui';

// Predefined SMS templates
const SMS_TEMPLATES = [
  {
    id: 'welcome',
    name: 'Xush kelibsiz',
    category: 'Umumiy',
    message: 'Hurmatli mijoz! Bizning do\'konimizga xush kelibsiz. Siz uchun maxsus takliflarimiz mavjud.',
    variables: []
  },
  {
    id: 'promotion',
    name: 'Chegirma e\'loni',
    category: 'Reklama',
    message: 'Maxsus taklifimiz! Barcha mahsulotlarga 20% chegirma. Muddati: 3 kun. Do\'konimizga tashrif buyuring!',
    variables: []
  },
  {
    id: 'new_collection',
    name: 'Yangi kolleksiya',
    category: 'Reklama',
    message: 'Yangi kiyim kolleksiyamiz keldi! Eng so\'nggi moda tendensiyalari va qulay narxlar. Bizni ko\'rib chiqing!',
    variables: []
  },
  {
    id: 'payment_reminder',
    name: 'To\'lov eslatmasi',
    category: 'Moliyaviy',
    message: 'Hurmatli mijoz! Sizning {amount} UZS miqdoridagi qarzingiz mavjud. Iltimos, imkon bo\'lgan vaqtda to\'lab qo\'ying.',
    variables: ['amount']
  },
  {
    id: 'debt_warning',
    name: 'Qarz ogohlantirishi',
    category: 'Moliyaviy',
    message: 'Diqqat! Sizning qarzingiz {amount} UZS ni tashkil qiladi. Iltimos, zudlik bilan to\'lab qo\'ying.',
    variables: ['amount']
  },
  {
    id: 'thank_you',
    name: 'Rahmat xabari',
    category: 'Umumiy',
    message: 'Xaridingiz uchun rahmat! Sizning ishonchingiz bizning eng katta mukofotimiz. Yana ko\'rishguncha!',
    variables: []
  },
  {
    id: 'birthday',
    name: 'Tug\'ilgan kun',
    category: 'Maxsus',
    message: 'Tug\'ilgan kuningiz muborak! Sizga maxsus 15% chegirma taqdim etamiz. Kod: BIRTHDAY2024',
    variables: []
  },
  {
    id: 'seasonal_sale',
    name: 'Mavsumiy sotuv',
    category: 'Reklama',
    message: 'Mavsumiy chegirma! Qishki kiyimlarga 30% chegirma. Faqat 5 kun davomida. Shoshiling!',
    variables: []
  },
  {
    id: 'store_hours',
    name: 'Ish vaqti',
    category: 'Ma\'lumot',
    message: 'Bizning ish vaqtimiz: Dushanba-Shanba 9:00-20:00, Yakshanba 10:00-18:00. Tel: +998901234567',
    variables: []
  },
  {
    id: 'custom',
    name: 'Boshqa xabar',
    category: 'Maxsus',
    message: '',
    variables: [],
    isCustom: true
  }
];

const TEMPLATE_CATEGORIES = [
  { id: 'all', name: 'Barchasi' },
  { id: 'Umumiy', name: 'Umumiy' },
  { id: 'Reklama', name: 'Reklama' },
  { id: 'Moliyaviy', name: 'Moliyaviy' },
  { id: 'Ma\'lumot', name: 'Ma\'lumot' },
  { id: 'Maxsus', name: 'Maxsus' }
];

const SMSBroadcast = ({
  loading,
  clients,
  smsForm,
  setSmsForm,
  handleSMSBroadcast,
  telegramStatus,
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [customMessage, setCustomMessage] = useState('');
  const [templateVariables, setTemplateVariables] = useState({});

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    if (template.isCustom) {
      setSmsForm(prev => ({
        ...prev,
        message: customMessage
      }));
    } else {
      // Replace variables in template message
      let message = template.message;
      template.variables.forEach(variable => {
        const value = templateVariables[variable] || `{${variable}}`;
        message = message.replace(`{${variable}}`, value);
      });
      setSmsForm(prev => ({
        ...prev,
        message: message
      }));
    }
  };

  const handleCustomMessageChange = (e) => {
    const value = e.target.value;
    setCustomMessage(value);
    if (selectedTemplate?.isCustom) {
      setSmsForm(prev => ({
        ...prev,
        message: value
      }));
    }
  };

  const handleVariableChange = (variable, value) => {
    const newVariables = { ...templateVariables, [variable]: value };
    setTemplateVariables(newVariables);
    
    if (selectedTemplate && !selectedTemplate.isCustom) {
      let message = selectedTemplate.message;
      selectedTemplate.variables.forEach(variable => {
        const varValue = newVariables[variable] || `{${variable}}`;
        message = message.replace(`{${variable}}`, varValue);
      });
      setSmsForm(prev => ({
        ...prev,
        message: message
      }));
    }
  };

  const handleSendToAllChange = (e) => {
    setSmsForm(prev => ({
      ...prev,
      sendToAll: e.target.checked,
      selectedClients: e.target.checked ? [] : prev.selectedClients
    }));
  };

  const handleClientSelection = (clientId) => {
    setSmsForm(prev => ({
      ...prev,
      selectedClients: prev.selectedClients.includes(clientId)
        ? prev.selectedClients.filter(id => id !== clientId)
        : [...prev.selectedClients, clientId]
    }));
  };

  const handleSelectAllClients = () => {
    setSmsForm(prev => ({
      ...prev,
      selectedClients: clients.map(client => client.id),
      sendToAll: false
    }));
  };

  const handleClearSelection = () => {
    setSmsForm(prev => ({
      ...prev,
      selectedClients: []
    }));
  };

  const selectedClientsCount = smsForm.selectedClients.length;
  const totalClients = clients.length;

  // Filter templates by category
  const filteredTemplates = selectedCategory === 'all' 
    ? SMS_TEMPLATES 
    : SMS_TEMPLATES.filter(template => template.category === selectedCategory);

  return (
    <div className="space-y-4">
      {/* Template Selection */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="text-blue-600" size={20} />
            <h3 className="text-lg font-semibold text-gray-900">SMS Shablon tanlash</h3>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {TEMPLATE_CATEGORIES.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
            {filteredTemplates.map(template => (
              <div
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedTemplate?.id === template.id
                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 text-sm">{template.name}</h4>
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                    {template.category}
                  </span>
                </div>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {template.isCustom ? 'O\'zingizning xabaringizni yozing' : template.message}
                </p>
                {template.variables.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {template.variables.map(variable => (
                      <span key={variable} className="text-xs px-1 py-0.5 bg-yellow-100 text-yellow-700 rounded">
                        {`{${variable}}`}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Template Variables */}
      {selectedTemplate && selectedTemplate.variables.length > 0 && (
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">O'zgaruvchilar</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedTemplate.variables.map(variable => (
              <div key={variable}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {variable === 'amount' ? 'Miqdor (UZS)' : variable}
                </label>
                <input
                  type={variable === 'amount' ? 'number' : 'text'}
                  value={templateVariables[variable] || ''}
                  onChange={(e) => handleVariableChange(variable, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder={`${variable} qiymatini kiriting`}
                />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Custom Message Input */}
      {selectedTemplate?.isCustom && (
        <Card className="p-4">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Maxsus xabar matni</label>
            <div className="relative">
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                value={customMessage}
                onChange={handleCustomMessageChange}
                placeholder="O'zingizning xabar matnini kiriting..."
                rows={4}
                maxLength={160}
              />
              <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white px-2 py-1 rounded border">
                {customMessage.length}/160 belgi
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Message Preview */}
      {selectedTemplate && smsForm.message && (
        <Card className="p-4 bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Xabar ko'rinishi</h3>
          <div className="p-3 bg-white border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-800">{smsForm.message}</p>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Uzunligi: {smsForm.message.length}/160 belgi
          </div>
        </Card>
      )}

      {/* Recipients Selection */}
      <Card className="p-4">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Qabul qiluvchilar</label>
          
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={smsForm.sendToAll}
                onChange={handleSendToAllChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-900">Barcha mijozlarga yuborish ({totalClients} ta)</span>
            </label>
          </div>

          {!smsForm.sendToAll && (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Tanlangan mijozlar: {selectedClientsCount} ta</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAllClients}
                    disabled={selectedClientsCount === totalClients}
                  >
                    Hammasini tanlash
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearSelection}
                    disabled={selectedClientsCount === 0}
                  >
                    Tozalash
                  </Button>
                </div>
              </div>

              <div className="max-h-48 overflow-y-auto space-y-2 border border-gray-200 rounded-lg p-2">
                {clients.map(client => (
                  <label key={client.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors duration-200">
                    <input
                      type="checkbox"
                      checked={smsForm.selectedClients.includes(client.id)}
                      onChange={() => handleClientSelection(client.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <span className="block text-sm font-medium text-gray-900">
                        {client.first_name} {client.last_name}
                      </span>
                      <span className="block text-xs text-gray-500">{client.phone}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Send Button */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Users size={16} />
              <span>Jami mijozlar: {totalClients} ta</span>
            </div>
            {!smsForm.sendToAll && (
              <div className="flex items-center gap-2">
                <UserCheck size={16} />
                <span>Tanlangan: {selectedClientsCount} ta</span>
              </div>
            )}
          </div>
          <Button
            onClick={handleSMSBroadcast}
            disabled={loading || (!smsForm.sendToAll && selectedClientsCount === 0) || !smsForm.message.trim() || !selectedTemplate}
            loading={loading}
            className="flex items-center gap-2"
          >
            <Send size={20} />
            <span>SMS Yuborish</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SMSBroadcast;