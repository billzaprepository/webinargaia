import React from 'react';
import { Calendar } from 'lucide-react';
import { WebinarSchedule as Schedule } from '../types/webinar';

interface WebinarScheduleProps {
  schedule: Schedule;
  onUpdate: (schedule: Schedule) => void;
}

const WebinarSchedule: React.FC<WebinarScheduleProps> = ({ schedule, onUpdate }) => {
  const formatDateTime = (date: Date) => {
    return new Date(date).toISOString().slice(0, 16);
  };

  const handleDateChange = (field: 'startTime' | 'endTime', value: string) => {
    const newDate = new Date(value);
    onUpdate({
      ...schedule,
      [field]: newDate,
      status: new Date() >= newDate ? 'live' : 'scheduled'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <Calendar size={24} />
        Agendamento do Webinar
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data e Hora de Início
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="datetime-local"
              value={formatDateTime(schedule.startTime)}
              onChange={(e) => handleDateChange('startTime', e.target.value)}
              className="w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data e Hora de Término
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="datetime-local"
              value={formatDateTime(schedule.endTime)}
              onChange={(e) => handleDateChange('endTime', e.target.value)}
              className="w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min={formatDateTime(schedule.startTime)}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Status do Webinar</h3>
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
          schedule.status === 'live' 
            ? 'bg-green-100 text-green-700'
            : schedule.status === 'ended'
            ? 'bg-gray-100 text-gray-700'
            : 'bg-yellow-100 text-yellow-700'
        }`}>
          <span className={`w-2 h-2 rounded-full ${
            schedule.status === 'live'
              ? 'bg-green-500'
              : schedule.status === 'ended'
              ? 'bg-gray-500'
              : 'bg-yellow-500'
          }`} />
          {schedule.status === 'live' ? 'Ao Vivo' : schedule.status === 'ended' ? 'Finalizado' : 'Agendado'}
        </div>
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-sm font-medium text-blue-700 mb-2">Link do Webinar</h3>
        <div className="flex items-center gap-2 bg-white p-3 rounded border border-blue-100">
          <code className="text-sm text-blue-700 flex-1">
            {window.location.origin}/webinar/{schedule.slug}
          </code>
          <button
            onClick={() => navigator.clipboard.writeText(`${window.location.origin}/webinar/${schedule.slug}`)}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
          >
            Copiar
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebinarSchedule;