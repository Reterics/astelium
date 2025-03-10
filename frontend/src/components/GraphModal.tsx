import React, { useState, useRef, useEffect } from 'react';
import { FiX, FiMaximize } from 'react-icons/fi';
import SelectComponent from './SelectComponent';
import MultiSelectComponent from './MultiSelectComponent';

interface GraphModalProps {
  data: any;
  component: React.FC<any>;
  title: string;
  onClose: () => void;
  onMaximize: () => void;
}

interface GraphOption {
  key: string,
  label: string,
  type: string,
  options: string[],
}

const getNumericKeys = (data: any[]) => {
  return Object.keys(data[0] || {}).filter(
    (key) => typeof data[0]?.[key] === 'number'
  );
};

const getDateKeys = (data: any[]) => {
  return Object.keys(data[0] || {}).filter(
    (key) => data[0]?.[key] instanceof Date || !isNaN(Date.parse(data[0]?.[key]))
  );
};

const getGraphOptions = (data: any[], options: Record<string, any>): Record<string, GraphOption[]> => ({
  LineChart: [
    { key: 'xAxis', label: 'X Axis', type: 'select', options: getDateKeys(data) },
    { key: 'yAxis', label: 'Y Axis', type: 'select', options: getNumericKeys(data) },
    { key: 'scaleType', label: 'Scale Type', type: 'select', options: ['linear', 'log'] },
    { key: 'mouseLine', label: 'Mouse Line', type: 'select', options: ['target' , 'horizontal' , 'vertical' , 'none'] },
  ],
  ScatterChart: [
    { key: 'xAxisType', label: 'X Axis Type', type: 'select', options: ['number', 'time', 'log'] },
    { key: 'xAxisValue', label: 'X Axis', type: 'select', options: options.xAxisType === 'time' ? getDateKeys(data) : getNumericKeys(data) },
    { key: 'yAxisType', label: 'Y Axis Type', type: 'select', options: ['number', 'time', 'log'] },
    { key: 'yAxisValue', label: 'Y Axis', type: 'select', options: options.yAxisType === 'time' ? getDateKeys(data) : getNumericKeys(data) },
  ],
  SunburstChart: [
    { key: 'nestKeys', label: 'Nest Keys', type: 'multiselect', options: Object.keys(data[0] || {}) },
  ],
  TreeMapVisualization: [
    { key: 'nestKeys', label: 'Nest Keys', type: 'multiselect', options: Object.keys(data[0] || {}) },
  ],
  SankeyChart: [
    { key: 'nestKeys', label: 'Nest Keys', type: 'multiselect', options: Object.keys(data[0] || {}) }
  ]
});


const useModalDimensions = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const height = width * 0.5;
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return { containerRef, dimensions };
};

const GraphModal: React.FC<GraphModalProps> = ({ data, component: Component, title, onClose, onMaximize }) => {
  const { containerRef, dimensions } = useModalDimensions();
  const [options, setOptions] = useState<Record<string, any>>({ xAxisType: 'time', yAxisType: 'number' });
  const [nestKeys, setNestKeys] = useState<string[]>([]);

  const handleOptionChange = (key: string, value: any) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  const graphOptions = getGraphOptions(data, options);

  return (
    <div className='flex flex-col w-full h-full bg-zinc-100 text-zinc-700 p-4 rounded-md shadow-md'>
      <div className='flex items-center justify-between w-full space-x-4 border-b border-zinc-300 pb-2 mb-3'>
        <div className='flex-grow flex space-x-4'>
          {graphOptions[Component.name]?.map((opt) => (
            opt.type === 'select' ? (
              <SelectComponent
                key={opt.key}
                defaultLabel={`Select ${opt.label}`}
                column={{ key: opt.key, label: opt.label, type: 'select', options: opt.options }}
                filters={{ [opt.key]: options[opt.key] }}
                handleFilterChange={(_col, value) => handleOptionChange(opt.key, value)}
              />
            ) : (
              <MultiSelectComponent
                key={opt.key}
                defaultLabel={`Select ${opt.label}`}
                column={{ key: opt.key, label: opt.label, type: 'multiselect', options: opt.options }}
                filters={{ [opt.key]: nestKeys }}
                handleFilterChange={(_col, value) => setNestKeys(value)}
              />
            )
          ))}
        </div>
        <h2 className='text-lg font-semibold text-zinc-800 flex-shrink-0'>{title}</h2>
        <div className='flex space-x-2'>
          <button className='text-zinc-400 hover:text-zinc-600 transition cursor-pointer' onClick={onMaximize}>
            <FiMaximize size={20} />
          </button>
          <button className='text-zinc-400 hover:text-zinc-600 transition cursor-pointer' onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>
      </div>
      <div ref={containerRef} className='bg-white rounded-b-md shadow flex-grow'>
        <Component data={data} {...options} nestKeys={nestKeys} width={dimensions.width} height={dimensions.height} />
      </div>
    </div>
  );
};

export default GraphModal;
