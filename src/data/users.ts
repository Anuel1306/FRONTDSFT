import { AppUser } from '../types/user';

export const INITIAL_USERS: AppUser[] = [
  { id: '1', fullName: 'Laura Gómez', email: 'laura.gomez@universidad.edu', role: 'Admin', status: 'Active', registeredAt: '2024-02-14' },
  { id: '2', fullName: 'Andrés Restrepo', email: 'andres.restrepo@universidad.edu', role: 'Committee Member', status: 'Active', registeredAt: '2024-05-03' },
  { id: '3', fullName: 'Camila Ortiz', email: 'camila.ortiz@universidad.edu', role: 'Author', status: 'Active', registeredAt: '2024-07-21' },
  { id: '4', fullName: 'Julián Herrera', email: 'julian.herrera@universidad.edu', role: 'Author', status: 'Inactive', registeredAt: '2024-09-09' },
  { id: '5', fullName: 'Sofía Mendoza', email: 'sofia.mendoza@universidad.edu', role: 'Committee Member', status: 'Active', registeredAt: '2025-01-27' },
  { id: '6', fullName: 'Mateo Valencia', email: 'mateo.valencia@universidad.edu', role: 'Author', status: 'Active', registeredAt: '2025-03-11' },
  { id: '7', fullName: 'Valentina Cruz', email: 'valentina.cruz@universidad.edu', role: 'Admin', status: 'Inactive', registeredAt: '2025-06-02' },
  { id: '8', fullName: 'Diego Ramírez', email: 'diego.ramirez@universidad.edu', role: 'Committee Member', status: 'Active', registeredAt: '2025-08-18' },
];

/** Password accepted by the prototype login for any seeded account. Replace with the real API. */
export const PROTOTYPE_PASSWORD_MIN_LENGTH = 8;
