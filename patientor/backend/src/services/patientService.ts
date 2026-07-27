import patientData from '../data/patients.ts';
import type {
  Patient,
  NonSensitivePatient,
  NewPatientEntry,
  Entry,
  EntryWithoutId,
} from '../types.ts';
import { v1 as uuid } from 'uuid';

const patients: Patient[] = patientData;

const getPatients = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const getPatient = (id: string): Patient | undefined => {
  return patients.find((p) => p.id === id);
};

const addPatient = (entry: NewPatientEntry): Patient => {
  const newPatient: Patient = {
    id: uuid(),
    entries: [],
    ...entry,
  };

  patients.push(newPatient);
  return newPatient;
};

const addEntry = (
  patientId: string,
  entry: EntryWithoutId,
): Entry | undefined => {
  const patient = patients.find((p) => p.id === patientId);
  if (!patient) return undefined;

  const newEntry: Entry = {
    id: uuid(),
    ...entry,
  };

  patient.entries.push(newEntry);
  return newEntry;
};

export default {
  getPatients,
  getPatient,
  addPatient,
  addEntry,
};
