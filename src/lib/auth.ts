
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
    email: 'superadmin@banasdairy.coop',
    role: 'SuperAdmin',
    department: 'Executive',
    designation: 'CEO',
    joiningDate: '2020-01-01',
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'admin@banasdairy.coop',
    role: 'Admin',
    department: 'IT',
    designation: 'System Administrator',
    joiningDate: '2021-06-15',
  },
  {
    id: '3',
    name: 'Jane Smith',
    email: 'hr@banasdairy.coop',
    role: 'HR',
    department: 'Human Resources',
    designation: 'HR Manager',
    joiningDate: '2022-03-10',
  },
  {
    id: '4',
    name: 'Michael Scott',
    email: 'manager@banasdairy.coop',
    role: 'Manager',
    department: 'Sales',
    designation: 'Regional Manager',
    joiningDate: '2019-11-20',
  },
  {
    id: '5',
    name: 'Jim Halpert',
    email: 'employee@banasdairy.coop',
    role: 'Employee',
    department: 'Sales',
    designation: 'Sales Representative',
    joiningDate: '2023-05-01',
  },
  {
    id: '6',
    name: 'Oscar Martinez',
    email: 'oscar@banasdairy.coop',
    role: 'Employee',
    department: 'Finance',
    designation: 'Senior Accountant',
    joiningDate: '2020-04-12',
  },
  {
    id: '7',
    name: 'Toby Flenderson',
    email: 'toby@banasdairy.coop',
    role: 'Employee',
    department: 'Legal',
    designation: 'Legal Advisor',
    joiningDate: '2018-09-05',
  },
  {
    id: '8',
    name: 'Kelly Kapoor',
    email: 'kelly@banasdairy.coop',
    role: 'Employee',
    department: 'Customer Support',
    designation: 'Support Lead',
    joiningDate: '2021-02-28',
  },
  {
    id: '9',
    name: 'Darryl Philbin',
    email: 'darryl@banasdairy.coop',
    role: 'Manager',
    department: 'Operations',
    designation: 'Plant Manager',
    joiningDate: '2017-06-20',
  },
];

export function getSession() {
  if (typeof window === 'undefined') return null;
  const session = localStorage.getItem('banas_dairy_session');
  return session ? JSON.parse(session) as User : null;
}

export function setSession(user: User) {
  localStorage.setItem('banas_dairy_session', JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem('banas_dairy_session');
}
