import { z } from 'zod';
import { Gender, type NewPatientEntry } from './types.ts';

export const NewPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.string().date(), // Validates YYYY-MM-DD date format
  ssn: z.string(),
  gender: z.nativeEnum(Gender),
  occupation: z.string(),
});

const toNewPatientEntry = (object: unknown): NewPatientEntry => {
  return NewPatientSchema.parse(object);
};

export default toNewPatientEntry;
