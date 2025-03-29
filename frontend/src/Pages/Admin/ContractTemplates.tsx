import {useApi} from '../../hooks/useApi.ts';
import {useState} from 'react';
import TemplateModal, {
  Template,
} from '../../components/contracts/TemplateModal.tsx';
import TableComponent from '../../components/TableComponent.tsx';

const ContractTemplates = () => {
  const {
    data: templates,
    createMutation,
    updateMutation,
    deleteMutation,
  } = useApi('contract-templates');
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null);

  const handleSave = async (template: Template) => {
    if (template.id) {
      await updateMutation.mutateAsync(
        template as Record<string, any> & {id: number}
      );
    } else {
      await createMutation.mutateAsync(template);
    }
    setCurrentTemplate(null);
  };

  const handleDelete = async (id: number) => {
    await deleteMutation.mutateAsync(id);
  };

  return (
    <div className="p-2 bg-zinc-50">
      <TableComponent
        columns={[
          {key: 'name', label: 'Template Name', type: 'text', editable: true},
          {key: 'path', label: 'Template Path', type: 'text'},
        ]}
        data={templates || []}
        onDelete={(id) => handleDelete(id as number)}
        onCreate={() => {
          setCurrentTemplate({fields:[]});
        }}
      />

      {currentTemplate && (
        <TemplateModal
          onClose={() => setCurrentTemplate(null)}
          template={currentTemplate!}
          setTemplate={setCurrentTemplate}
          onSave={() => handleSave(currentTemplate!)}
        />
      )}
    </div>
  );
};

export default ContractTemplates;
