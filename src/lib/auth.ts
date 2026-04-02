
export type Role = 'SuperAdmin' | 'Admin' | 'HR' | 'Manager' | 'Employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  designation: string;
  joiningDate: string;
}

export const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Sarah Connor',
    email: 'superadmin@worknest.com',
    role: 'SuperAdmin',
    department: 'Executive',
    designation: 'CEO',
    joiningDate: '2020-01-01',
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'admin@worknest.com',
    role: 'Admin',
    department: 'Administration',
    designation: 'System Administrator',
    joiningDate: '2021-06-15',
  },
  {
    id: '3',
    name: 'Jane Smith',
    email: 'hr@worknest.com',
    role: 'HR',
    department: 'Human Resources',
    designation: 'HR Manager',
    joiningDate: '2022-03-10',
  },
  {
    id: '4',
    name: 'Michael Scott',
    email: 'manager@worknest.com',
    role: 'Manager',
    department: 'Sales',
    designation: 'Regional Manager',
    joiningDate: '2019-11-20',
  },
  {
    id: '5',
    name: 'Jim Halpert',
    email: 'employee@worknest.com',
    role: 'Employee',
    department: 'Sales',
    designation: 'Sales Representative',
    joiningDate: '2023-05-01',
  },
];

export function getSession() {
  if (typeof window === 'undefined') return null;
  const session = localStorage.getItem('worknest_session');
  return session ? JSON.parse(session) as User : null;
}

export function setSession(user: User) {
  localStorage.setItem('worknest_session', JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem('worknest_session');
}
