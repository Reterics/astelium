import React from 'react';
import CrudManager, {CrudField} from '../../components/CrudManager.tsx';
import {FiEdit3} from 'react-icons/fi';
import FormModal from '../../components/FormModal.tsx';
import mountComponent from '../../components/mounter.tsx';
import {useApi} from '../../hooks/useApi.ts';
import {baseURL, getFetchOptions} from '../../utils/utils.ts';
import {TableRow} from '../../components/TableComponent.tsx';

type UserRole = 'admin' | 'member' | 'viewer';

export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  role: UserRole;
  image?: string;
  workingSchedule?: any;
  bio?: string;
  account_id?: number;
  title?: string;
}

const userFields: CrudField[] = [
  {key: 'image', label: 'Avatar', type: 'image', editable: true},
  {key: 'name', label: 'Name', type: 'text', editable: true, sortable: true},
  {key: 'title', label: 'Title', type: 'text', editable: true, sortable: true},
  {key: 'email', label: 'Email', type: 'text', editable: true, sortable: true},
  {
    key: 'password',
    label: 'Password',
    type: 'password',
    editable: false,
    visible: false,
  },
  {
    key: 'password_confirmation',
    label: 'Password Confirmation',
    type: 'password',
    editable: false,
    visible: false,
  },
  {
    key: 'role',
    label: 'Role',
    type: 'select',
    editable: true,
    options: [
      {value: 'admin', label: 'Admin'},
      {value: 'member', label: 'User'},
      {value: 'viewer', label: 'Viewer'},
    ],
  },
  {
    key: 'bio',
    label: 'Bio',
    type: 'textarea',
    editable: true,
  },
  {
    key: 'workingSchedule',
    label: 'Working Schedule',
    type: 'workingSchedule',
    editable: true,
  },
  {
    key: 'created_at',
    label: 'Created At',
    type: 'datetime-local',
    editable: false,
    creatable: false,
  },
];

const Users: React.FC = () => {
  const {isLoading, updateMutation} = useApi('users');

  if (isLoading) return <p>Loading...</p>;

  const handleEdit = async (row: User) => {
    const form = await mountComponent(FormModal, {
      title: 'Edit User',
      fields: userFields.filter((filter) => filter.editable !== false),
      data: row as unknown as Record<string, unknown>,
    });

    if (form) {
      // If there's an image, use the updateAvatar endpoint
      if (form['image'] && form['image'] instanceof File) {
        // Create a FormData object for the avatar update
        const formData = new FormData();
        formData.append('image', form['image']);

        // Call the updateAvatar endpoint directly
        const response = await fetch(`${baseURL}/api/user/avatar`, {
          ...getFetchOptions(true),
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('Failed to update avatar');

        // Remove the image from the form so it's not sent twice
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {image, ...restForm} = form;

        // Update the rest of the user data if there are other changes
        if (Object.keys(restForm).length > 1) {
          // > 1 because id is always present
          await updateMutation.mutateAsync(
            restForm as Record<string, any> & {id: number}
          );
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {image, ...restForm} = form;

        // No image, use the standard update mutation
        await updateMutation.mutateAsync(
          restForm as Record<string, any> & {id: number}
        );
      }
      return true;
    }
    return false;
  };

  const actions = [
    {
      onClick: (row: TableRow) => {
        void handleEdit(row as User);
      },
      icon: <FiEdit3 />,
      isActive: () => true,
    },
  ];

  return (
    <div>
      <CrudManager
        title='Users'
        apiEndpoint='users'
        fields={userFields}
        actions={actions}
      />
    </div>
  );
};

export default Users;
