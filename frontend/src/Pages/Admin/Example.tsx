import TableComponent, {
  TableColumn,
  TableRow,
} from '../../components/TableComponent.tsx';
import {useState} from 'react';

const columns: TableColumn[] = [
  {key: 'id', label: 'ID', sortable: true},
  {key: 'name', label: 'Name', sortable: true, editable: true, type: 'text'},
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    editable: true,
    type: 'select',
    options: ['Active', 'Inactive'],
  },
  {key: 'age', label: 'Age', sortable: true, editable: true, type: 'number'},
  {
    key: 'role',
    label: 'Role',
    sortable: true,
    editable: true,
    type: 'select',
    options: ['Admin', 'User', 'Guest'],
  },
  {
    key: 'permissions',
    label: 'Permissions',
    sortable: false,
    editable: true,
    type: 'multiselect',
    options: ['Admin', 'User', 'Guest'],
  },
];

const initialData = [
  {
    id: 1,
    name: 'Example Item',
    status: 'Active',
    age: 30,
    role: 'Admin',
    permissions: [],
  },
  {
    id: 2,
    name: 'Another Item',
    status: 'Inactive',
    age: 25,
    role: 'User',
    permissions: [],
  },
];

const MainContent = () => {
  const [data, setData] = useState<TableRow[]>(initialData);

  const handleDelete = (id: number | string) => {
    setData(data.filter((row) => row.id !== id));
  };
  return (
    <div className='p-6 bg-zinc-100 text-zinc-700 flex flex-col space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <div className='p-4 shadow-md bg-zinc-50 rounded-lg'>Box 1/4</div>
        <div className='p-4 shadow-md bg-zinc-50 rounded-lg'>Box 2/4</div>
        <div className='p-4 shadow-md bg-zinc-50 rounded-lg'>Box 3/4</div>
        <div className='p-4 shadow-md bg-zinc-50 rounded-lg'>Box 4/4</div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='p-4 shadow-md bg-zinc-50 rounded-lg'>Box 1/2</div>
        <div className='p-4 shadow-md bg-zinc-50 rounded-lg'>Box 2/2</div>
      </div>
      <div className='p-4 shadow-md bg-zinc-50 rounded-lg'>Box 1/1</div>

      <TableComponent
        columns={columns}
        data={data}
        onEdit={setData}
        onDelete={handleDelete}
      />

      <div className='p-4 shadow-md bg-zinc-50 rounded-lg'>
        <h3 className='font-semibold mb-2'>Options</h3>
        <div className='space-y-2'>
          <label className='flex items-center space-x-2'>
            <input type='checkbox' className='form-checkbox' />
            <span>Option 1</span>
          </label>
          <label className='flex items-center space-x-2'>
            <input type='checkbox' className='form-checkbox' />
            <span>Option 2</span>
          </label>
          <label className='flex items-center space-x-2'>
            <input type='checkbox' className='form-checkbox' />
            <span>Option 3</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
