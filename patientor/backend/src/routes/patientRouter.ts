import express from 'express';
import type { Request, Response } from 'express';
import patientService from '../services/patientService.ts';
import type { Patient } from '../types.ts';
import { z } from 'zod';
import toNewPatientEntry, { parseNewEntry } from '../utils.ts';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(patientService.getPatients());
});

router.post('/', (req: Request, res: Response) => {
  try {
    const newPatient = toNewPatientEntry(req.body);
    const addedPatient = patientService.addPatient(newPatient);
    return res.json(addedPatient);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return res.status(400).send({ error: error.issues });
    }
    return res.status(400).send({ error: 'Something went wrong' });
  }
});

router.get('/:id', (req, res: Response<Patient | { error: string }>) => {
  const patient = patientService.getPatient(req.params.id);

  if (patient) {
    res.send(patient);
  } else {
    res.status(404).send({ error: 'Patient not found' });
  }
});

router.post('/:id/entries', (req: Request<{ id: string }>, res: Response) => {
  try {
    const newEntry = parseNewEntry(req.body);
    const addedEntry = patientService.addEntry(req.params.id, newEntry);

    if (!addedEntry) {
      return res.status(404).send({ error: 'Patient not found' });
    }

    return res.status(201).json(addedEntry);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return res.status(400).send({ error: error.issues });
    }
    return res.status(400).send({ error: 'Something went wrong' });
  }
});

export default router;
