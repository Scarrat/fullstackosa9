import { useState, SyntheticEvent } from 'react';
import {
  TextField,
  Button,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Box,
  SelectChangeEvent,
} from '@mui/material';
import { EntryWithoutId, Diagnosis } from '../types';

interface Props {
  onSubmit: (values: EntryWithoutId) => void;
  onCancel: () => void;
  error?: string;
  diagnoses: Diagnosis[];
}

type EntryType = 'HealthCheck' | 'Hospital' | 'OccupationalHealthcare';

const NewEntryForm = ({ onSubmit, onCancel, error, diagnoses }: Props) => {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [healthCheckRating, setHealthCheckRating] = useState<number>(0);
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [entryType, setEntryType] = useState<EntryType>('HealthCheck');
  const [dischargeDate, setDischargeDate] = useState('');
  const [dischargeCriteria, setDischargeCriteria] = useState('');
  const [employerName, setEmployerName] = useState('');
  const [sickLeaveStartDate, setSickLeaveStartDate] = useState('');
  const [sickLeaveEndDate, setSickLeaveEndDate] = useState('');

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();

    const baseEntry = {
      description,
      date,
      specialist,
      diagnosisCodes: diagnosisCodes.length > 0 ? diagnosisCodes : undefined,
    };

    switch (entryType) {
      case 'HealthCheck':
        onSubmit({
          ...baseEntry,
          type: 'HealthCheck',
          healthCheckRating: Number(healthCheckRating),
        });
        break;

      case 'Hospital':
        onSubmit({
          ...baseEntry,
          type: 'Hospital',
          discharge: {
            date: dischargeDate,
            criteria: dischargeCriteria,
          },
        });
        break;

      case 'OccupationalHealthcare':
        onSubmit({
          ...baseEntry,
          type: 'OccupationalHealthcare',
          employerName,
          sickLeave:
            sickLeaveStartDate && sickLeaveEndDate
              ? { startDate: sickLeaveStartDate, endDate: sickLeaveEndDate }
              : undefined,
        });
        break;
    }
  };

  const handleDiagnosisCodesChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setDiagnosisCodes(typeof value === 'string' ? value.split(',') : value);
  };
  return (
    <div>
      <h3>New {entryType} Entry</h3>
      {error && <Alert severity="error">{error}</Alert>}

      <form onSubmit={addEntry}>
        <TextField
          select
          label="Entry Type"
          slotProps={{ inputLabel: { shrink: true } }}
          fullWidth
          margin="normal"
          value={entryType}
          onChange={({ target }) => setEntryType(target.value as EntryType)}
        >
          <MenuItem value="HealthCheck">HealthCheck</MenuItem>
          <MenuItem value="Hospital">Hospital</MenuItem>
          <MenuItem value="OccupationalHealthcare">
            OccupationalHealthcare
          </MenuItem>
        </TextField>
        <TextField
          label="Date"
          slotProps={{ inputLabel: { shrink: true } }}
          fullWidth
          margin="normal"
          type="date"
          value={date}
          onChange={({ target }) => setDate(target.value)}
        />
        <TextField
          label="Description"
          slotProps={{ inputLabel: { shrink: true } }}
          fullWidth
          margin="normal"
          value={description}
          onChange={({ target }) => setDescription(target.value)}
        />
        <TextField
          label="Specialist"
          slotProps={{ inputLabel: { shrink: true } }}
          fullWidth
          margin="normal"
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="diagnosis-codes-label">Diagnosis Codes</InputLabel>
          <Select
            labelId="diagnosis-codes-label"
            multiple
            label="Diagnosis Codes"
            value={diagnosisCodes}
            onChange={handleDiagnosisCodesChange}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((c) => (
                  <Chip key={c} label={c} />
                ))}
              </Box>
            )}
          >
            {diagnoses.map((d) => (
              <MenuItem key={d.code} value={d.code}>
                {d.code} - {d.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {entryType === 'HealthCheck' && (
          <TextField
            select
            fullWidth
            margin="normal"
            label="Health Check Rating"
            value={healthCheckRating}
            onChange={({ target }) =>
              setHealthCheckRating(Number(target.value))
            }
          >
            <MenuItem value={0}>0 - Healthy</MenuItem>
            <MenuItem value={1}>1 - Low Risk</MenuItem>
            <MenuItem value={2}>2 - High Risk</MenuItem>
            <MenuItem value={3}>3 - Critical Risk</MenuItem>
          </TextField>
        )}
        {entryType === 'Hospital' && (
          <>
            <TextField
              label="Discharge Date"
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
              margin="normal"
              type="date"
              value={dischargeDate}
              onChange={({ target }) => setDischargeDate(target.value)}
            />
            <TextField
              label="Discharge Criteria"
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
              margin="normal"
              value={dischargeCriteria}
              onChange={({ target }) => setDischargeCriteria(target.value)}
            />
          </>
        )}

        {entryType === 'OccupationalHealthcare' && (
          <>
            <TextField
              label="Employer Name"
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
              margin="normal"
              value={employerName}
              onChange={({ target }) => setEmployerName(target.value)}
            />
            <TextField
              label="Sick Leave Start Date"
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
              margin="normal"
              type="date"
              value={sickLeaveStartDate}
              onChange={({ target }) => setSickLeaveStartDate(target.value)}
            />
            <TextField
              label="Sick Leave End Date"
              slotProps={{ inputLabel: { shrink: true } }}
              fullWidth
              margin="normal"
              type="date"
              value={sickLeaveEndDate}
              onChange={({ target }) => setSickLeaveEndDate(target.value)}
            />
          </>
        )}
        <div>
          <Button type="submit">ADD</Button>
          <Button type="button" color="warning" onClick={onCancel}>
            CANCEL
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewEntryForm;
