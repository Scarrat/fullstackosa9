import { z } from 'zod';
import { Gender, type NewPatientEntry, HealthCheckRating } from './types.ts';

export const NewPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.string().date(),
  ssn: z.string(),
  gender: z.nativeEnum(Gender),
  occupation: z.string(),
});

const toNewPatientEntry = (object: unknown): NewPatientEntry => {
  return NewPatientSchema.parse(object);
};

const baseEntrySchema = z.object({
  description: z.string().min(1, 'Description is required'),
  date: z.string().date('Invalid date format'),
  specialist: z.string().min(1, 'Specialist is required'),
  diagnosisCodes: z.array(z.string()).optional(),
});

const healthCheckEntrySchema = baseEntrySchema.extend({
  type: z.literal('HealthCheck'),
  healthCheckRating: z.nativeEnum(HealthCheckRating),
});

const hospitalEntrySchema = baseEntrySchema.extend({
  type: z.literal('Hospital'),
  discharge: z.object({
    date: z.string().date('Invalid discharge date'),
    criteria: z.string().min(1, 'Discharge criteria required'),
  }),
});

const occupationalHealthcareEntrySchema = baseEntrySchema.extend({
  type: z.literal('OccupationalHealthcare'),
  employerName: z.string().min(1, 'Employer name is required'),
  sickLeave: z
    .object({
      startDate: z.string().date('Invalid start date'),
      endDate: z.string().date('Invalid end date'),
    })
    .optional(),
});

export const newEntrySchema = z.discriminatedUnion('type', [
  healthCheckEntrySchema,
  hospitalEntrySchema,
  occupationalHealthcareEntrySchema,
]);

export const parseNewEntry = (object: unknown) => {
  return newEntrySchema.parse(object);
};

export default toNewPatientEntry;
