import TableComponent, {TableRow} from './TableComponent.tsx';
import {CrudField} from './CrudManager.tsx';
import {useTranslation} from 'react-i18next';
import {SelectOption} from './SelectComponent.tsx';
import {getInitialGroupedData} from '../utils/taskUtils.ts';
import {useState} from 'react';

interface GroupedTableComponentProps {
  columns: CrudField[];
  data: TableRow[];
  onEdit?: (updatedData: TableRow[]) => Promise<void> | void;
  onDelete?: (id: number | string) => void;
  onCreate?: (itemToAdd?: TableRow) => void | boolean;
  groupedBy: string;
}

const GroupedTableComponent = ({
  columns,
  data,
  groupedBy,
  onEdit,
  onDelete,
  onCreate,
}: GroupedTableComponentProps) => {
  const {t} = useTranslation();
  const [itemToAdd, setItemToAdd] = useState<TableRow>({});

  const initialGroups = columns.filter(
    (column: CrudField) => column.type === 'select' && column.options
  );

  const groupedData: Record<string, TableRow[]> = data.reduce(
    (acc: Record<string, TableRow[]>, cur: TableRow) => {
      const group = cur[groupedBy] || '';
      acc[group] = acc[group] || [];

      acc[group].push(cur);

      return acc;
    },
    getInitialGroupedData(groupedBy)
  );

  const selectedGroupOptions = (initialGroups.find(
    (column) => column.key === groupedBy
  )?.options || []) as SelectOption[];

  return (
    <div>
      {Object.keys(groupedData).map((groupName) => (
        <div className='p-2'>
          <div className='pb-1 px-3 flex items-center space-x-2 border-t border-x border-zinc-300 w-fit'>
            <div className='text-zinc-600 font-medium'>
              {t(
                (selectedGroupOptions.find((o) => o.value === groupName)
                  ?.label as string) || groupName
              )}
            </div>
          </div>
          {!groupedData[groupName].length && (
            <div className='bg-white px-4 py-2'>
              There are no tasks for this group.
            </div>
          )}
          {!!groupedData[groupName].length && (
            <TableComponent
              data={groupedData[groupName]}
              columns={columns}
              onEdit={onEdit}
              onDelete={onDelete}
              onCreate={onCreate}
              itemToAdd={itemToAdd}
              setItemToAdd={setItemToAdd}
              noSearch={true}
              pagination={false}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default GroupedTableComponent;
