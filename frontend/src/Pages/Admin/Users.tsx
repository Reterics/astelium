import React, {useState, useEffect} from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    is_admin: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch users when the component mounts.
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          console.error('Failed to fetch users:', response.statusText);
          return;
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value, type, checked} = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // If your API uses CSRF tokens, make sure to send them too.
          // 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // On successful creation, get the new user from the response.
        const newUser = await response.json();
        setUsers((prev) => [...prev, newUser]);
        // Reset the form.
        setFormData({name: '', email: '', password: '', is_admin: false});
      } else {
        // Parse and display validation errors if available.
        const errorData = await response.json();
        setErrors(errorData.errors || {});
      }
    } catch (error) {
      console.error('Error creating user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>User Management</h2>

      <h3>User List</h3>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.name} ({user.email}) {user.is_admin && '[Admin]'}
            </li>
          ))}
        </ul>
      )}

      <h3>Add New User</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type='text'
            name='name'
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <div style={{color: 'red'}}>{errors.name}</div>}
        </div>
        <div>
          <label>Email:</label>
          <input
            type='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <div style={{color: 'red'}}>{errors.email}</div>}
        </div>
        <div>
          <label>Password:</label>
          <input
            type='password'
            name='password'
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && (
            <div style={{color: 'red'}}>{errors.password}</div>
          )}
        </div>
        <div>
          <label>
            <input
              type='checkbox'
              name='is_admin'
              checked={formData.is_admin}
              onChange={handleChange}
            />
            Admin?
          </label>
        </div>
        <button type='submit' disabled={loading}>
          {loading ? 'Creating...' : 'Create User'}
        </button>
      </form>
    </div>
  );
};

export default Users;
