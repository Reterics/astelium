import {useApi} from '../../hooks/useApi.ts';
import TemplateModal, {
  Template,
} from '../../components/contracts/TemplateModal.tsx';
import TableComponent from '../../components/TableComponent.tsx';
import mountComponent from '../../components/mounter.tsx';

const ContractTemplates = () => {
  const {
    data: templates,
    createMutation,
    updateMutation,
    deleteMutation,
  } = useApi('contract-templates');

  const handleSave = async (template: Template) => {
    if (template.id) {
      await updateMutation.mutateAsync(
        template as Record<string, any> & {id: number}
      );
    } else {
      await createMutation.mutateAsync(template);
    }
  };

  const handleDelete = async (id: number) => {
    await deleteMutation.mutateAsync(id);
  };

  return (
    <div className='p-2'>
      <TableComponent
        columns={[
          {key: 'name', label: 'Template Name', type: 'text', editable: true},
          {key: 'path', label: 'Template Path', type: 'text'},
        ]}
        data={templates || []}
        onDelete={(id) => handleDelete(id as number)}
        onCreate={async () => {
          const currentTemplate = await mountComponent(TemplateModal, {
            initialTemplate: {fields: []},
          });
          if (currentTemplate) {
            await handleSave(currentTemplate as unknown as Template);
          }
        }}
      />
    </div>
  );
};

export default ContractTemplates;
