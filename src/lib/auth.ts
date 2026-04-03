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

const DEPARTMENTS = [
  'Operations',
  'Quality Control',
  'Procurement',
  'Animal Husbandry',
  'Sales',
  'Finance',
  'HR',
  'IT',
  'Logistics'
];

const FIRST_NAMES_MALE = [
  'Bharatbhai', 'Shankarbhai', 'Hiteshbhai', 'Valabhai', 'Karshanbhai', 'Amratbhai', 'Mavjibhai',
  'Ashokbhai', 'Parsottambhai', 'Bhavanbhai', 'Devjibhai', 'Ganpatbhai', 'Harjibhai', 'Ishwarbhai',
  'Jethabhai', 'Kanjibhai', 'Laljibhai', 'Maganbhai', 'Nanjibhai', 'Popatbhai', 'Ramjibhai',
  'Shamjibhai', 'Thakarshibhai', 'Virjibhai', 'Veljibhai', 'Khengarbhai', 'Dineshbhai', 'Pravinbhai',
  'Rajeshbhai', 'Sureshbhai', 'Maheshbhai', 'Pareshbhai', 'Mukeshbhai', 'Vinodbhai', 'Rameshbhai'
];

const FIRST_NAMES_FEMALE = [
  'Rekhaben', 'Pinkiben', 'Manishaben', 'Sitaben', 'Gitaben', 'Hansaben', 'Kokilaben', 'Pushpaben',
  'Savitaben', 'Lilaben', 'Jasudben', 'Kamlaben', 'Diwaliben', 'Jiviben', 'Ratanben', 'Premilaben',
  'Shardaben', 'Madhuben', 'Kusumben', 'Anilaben', 'Sunitaben', 'Ritaben', 'Naynaben'
];

function generateMockUsers(): User[] {
  const users: User[] = [
    {
      id: '1',
      name: 'Rekhaben Chaudhary',
      email: 'superadmin@banasdairy.coop',
      role: 'SuperAdmin',
      department: 'Executive',
      designation: 'Managing Director',
      joiningDate: '2015-01-01',
    },
    {
      id: '2',
      name: 'Bharatbhai Chaudhary',
      email: 'admin@banasdairy.coop',
      role: 'Admin',
      department: 'IT',
      designation: 'Senior System Admin',
      joiningDate: '2018-06-15',
    },
    {
      id: '3',
      name: 'Pinkiben Chaudhary',
      email: 'hr@banasdairy.coop',
      role: 'HR',
      department: 'HR',
      designation: 'HR Manager',
      joiningDate: '2019-03-10',
    },
    {
      id: '4',
      name: 'Shankarbhai Chaudhary',
      email: 'manager@banasdairy.coop',
      role: 'Manager',
      department: 'Sales',
      designation: 'Regional Sales Manager',
      joiningDate: '2017-11-20',
    },
    {
      id: '5',
      name: 'Hiteshbhai Chaudhary',
      email: 'employee@banasdairy.coop',
      role: 'Employee',
      department: 'Sales',
      designation: 'Sales Executive',
      joiningDate: '2023-05-01',
    }
  ];

  const roles: Role[] = ['Manager', 'Employee'];
  
  for (let i = 6; i <= 100; i++) {
    const isMale = Math.random() > 0.3;
    const firstName = isMale 
      ? FIRST_NAMES_MALE[Math.floor(Math.random() * FIRST_NAMES_MALE.length)]
      : FIRST_NAMES_FEMALE[Math.floor(Math.random() * FIRST_NAMES_FEMALE.length)];
    
    const dept = DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)];
    const role = i % 15 === 0 ? 'Manager' : 'Employee';
    
    let designation = 'Staff Member';
    if (dept === 'Operations') designation = role === 'Manager' ? 'Plant Manager' : 'Plant Supervisor';
    else if (dept === 'Quality Control') designation = role === 'Manager' ? 'Chief Technologist' : 'Lab Technician';
    else if (dept === 'Procurement') designation = role === 'Manager' ? 'Procurement Head' : 'Collection Officer';
    else if (dept === 'Animal Husbandry') designation = role === 'Manager' ? 'Chief Vet' : 'Veterinary Assistant';
    else if (dept === 'Finance') designation = role === 'Manager' ? 'Finance Controller' : 'Accountant';
    else if (dept === 'IT') designation = role === 'Manager' ? 'IT Head' : 'Technical Support';
    else if (dept === 'Logistics') designation = role === 'Manager' ? 'Logistics Manager' : 'Fleet Supervisor';

    const year = 2018 + Math.floor(Math.random() * 6);
    const month = String(1 + Math.floor(Math.random() * 12)).padStart(2, '0');
    const day = String(1 + Math.floor(Math.random() * 28)).padStart(2, '0');

    users.push({
      id: String(i),
      name: `${firstName} Chaudhary`,
      email: `${firstName.toLowerCase()}.${i}@banasdairy.coop`,
      role: role as Role,
      department: dept,
      designation: designation,
      joiningDate: `${year}-${month}-${day}`
    });
  }

  return users;
}

export const MOCK_USERS: User[] = generateMockUsers();

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
