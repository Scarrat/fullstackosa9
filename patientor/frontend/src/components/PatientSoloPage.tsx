import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@mui/material';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import axios from 'axios';

import patientService from '../services/patients';
import { Gender, Patient, Diagnosis, EntryWithoutId } from '../types';
import EntryInfo from './EntryInfo';
import AddEntryForm from './NewEntryForm';

const GenderIcon = ({ gender }: { gender: Gender }) => {
  switch (gender) {
    case Gender.Male:
      return <MaleIcon />;
    case Gender.Female:
      return <FemaleIcon />;
    default:
      return null;
  }
};

const PatientPage = ({ diagnoses }: { diagnoses: Diagnosis[] }) => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchPatient = async () => {
      if (id) {
        const fetchedPatient = await patientService.getOne(id);
        setPatient(fetchedPatient);
      }
    };
    void fetchPatient();
  }, [id]);

  if (!patient) {
    return <div>Loading...</div>;
  }

  const submitNewEntry = async (values: EntryWithoutId) => {
    if (!id) return;

    try {
      const addedEntry = await patientService.createEntry(id, values);

      setPatient({
        ...patient,
        entries: patient.entries.concat(addedEntry),
      });
      setShowForm(false);
      setError(undefined);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e.response?.data?.error) {
          const backendError = e.response.data.error;
          if (Array.isArray(backendError)) {
            const formatted = backendError
              .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
              .join(', ');
            setError(formatted);
          } else {
            setError(String(backendError));
          }
        } else {
          setError('Failed to add entry. Please check your inputs.');
        }
      } else {
        setError('An unexpected error occurred.');
      }
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h2>
        {patient.name} <GenderIcon gender={patient.gender} />
      </h2>
      <p>ssn: {patient.ssn}</p>
      <p>occupation: {patient.occupation}</p>
      <p>date of birth: {patient.dateOfBirth}</p>

      {showForm ? (
        <AddEntryForm
          onSubmit={submitNewEntry}
          onCancel={() => {
            setShowForm(false);
            setError(undefined);
          }}
          error={error}
          diagnoses={diagnoses}
        />
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowForm(true)}
        >
          ADD NEW ENTRY
        </Button>
      )}

      <h3>entries</h3>
      {patient.entries &&
        patient.entries.map((entry) => (
          <EntryInfo key={entry.id} entry={entry} diagnoses={diagnoses} />
        ))}
    </div>
  );
};

export default PatientPage;
