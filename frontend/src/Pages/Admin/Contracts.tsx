import CrudManager from '../../components/CrudManager';
import {useApi} from '../../hooks/useApi.ts';
import {FiEdit3} from 'react-icons/fi';
import {Template} from '../../components/contracts/TemplateModal.tsx';
import ContractModal from '../../components/contracts/ContractModal.tsx';
import mountComponent from '../../components/mounter.tsx';

export interface Contract {
  account_id?: number;
  data?: Record<string, string>;
  id: number;
  name: string;
  template_id: string;
  updated_at: string;
  template?: Template;
}

const Contracts = () => {
  const {data: contractTemplates, isLoading: isLoadingTemplates} =
    useApi('contract-templates');

  if (isLoadingTemplates) return <p>Loading...</p>;

  const templateOptions = contractTemplates.map((t) => ({
    value: t.id,
    label: t.name,
  }));

  return (
    <div>
      <CrudManager
        title='Contracts'
        apiEndpoint='contracts'
        fields={[
          {key: 'id', label: 'ID', type: 'text', creatable: false},
          {key: 'name', label: 'Contract Name', type: 'text'},
          {
            key: 'created',
            label: 'Created Date',
            type: 'date',
            creatable: false,
          },
          {
            key: 'template_id',
            label: 'Template',
            type: 'select',
            options: templateOptions,
          },
          {
            key: 'data',
            label: 'Contract Data',
            type: 'text',
            creatable: false,
            visible: false,
          },
        ]}
        actions={[
          {
            icon: <FiEdit3 />,
            isActive: (row) => {
              return !(row as Contract | null)?.data?.signature;
            },
            onClick: async (row) => {
              const contract = {
                ...row,
                template: {
                  ...(row.template || {}),
                  fields:
                    typeof row.template.fields === 'string'
                      ? JSON.parse(row.template.fields)
                      : row.template.fields,
                },
              } as unknown as Contract;

              const currentContract = await mountComponent(ContractModal, {
                initialContract: contract,
              });
              if (currentContract) {
                // TODO: Implement saving
              }
            },
          },
        ]}
      />
    </div>
  );
};

export default Contracts;
