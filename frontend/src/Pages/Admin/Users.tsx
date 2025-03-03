import React from 'react';
import CrudManager, {CrudField} from "../../components/CrudManager.tsx";

type UserRole = 'admin' | 'member' | 'viewer'

export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  role: UserRole
}

const userFields: CrudField[] = [
  { key: 'image', label: 'Avatar', type: 'image', editable: false },
  { key: 'name', label: 'Name', type: 'text', editable: true, sortable: true },
  { key: 'email', label: 'Email', type: 'text', editable: false, sortable: true },
  { key: 'password', label: 'Password', type: 'password', editable: false, visible: false },
  { key: 'password_confirmation', label: 'Password Confirmation', type: 'password', editable: false, visible: false },
  { key: 'role', label: 'Role', type: 'select', editable: true, options: [{ value: 'admin', label: 'Admin' }, { value: 'member', label: 'User' }, { value: 'viewer', label: 'Viewer' }] },
  { key: 'created_at', label: 'Created At', type: 'datetime-local', editable: false, creatable: false },
];


const Users: React.FC = () => {
  return (
    <div>
      <CrudManager
        title="Users"
        apiEndpoint="users"
        fields={userFields}
      />
    </div>
  );
};

export default Users;
