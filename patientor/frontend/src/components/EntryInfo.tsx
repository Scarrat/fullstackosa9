import { Entry, Diagnosis, HealthCheckRating } from '../types';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import WorkIcon from '@mui/icons-material/Work';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import FavoriteIcon from '@mui/icons-material/Favorite';

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`,
  );
};
const HealthCheckRatingHeart = ({ rating }: { rating: HealthCheckRating }) => {
  let color = 'gray';

  switch (rating) {
    case HealthCheckRating.Healthy:
      color = 'green';
      break;
    case HealthCheckRating.LowRisk:
      color = 'yellow';
      break;
    case HealthCheckRating.HighRisk:
      color = 'orange';
      break;
    case HealthCheckRating.CriticalRisk:
      color = 'red';
      break;
  }

  return <FavoriteIcon style={{ color }} />;
};

interface Props {
  entry: Entry;
  diagnoses: Diagnosis[];
}

const EntryInfo = ({ entry, diagnoses }: Props) => {
  const renderDiagnosisCodes = (codes?: string[]) => {
    if (!codes || codes.length === 0) return null;
    return (
      <ul>
        {codes.map((c) => {
          const diagnosis = diagnoses.find((d: Diagnosis) => d.code === c);
          return (
            <li key={c}>
              {c} {diagnosis ? diagnosis.name : ''}
            </li>
          );
        })}
      </ul>
    );
  };

  switch (entry.type) {
    case 'Hospital':
      return (
        <div>
          <p>
            {entry.date} <LocalHospitalIcon />
          </p>
          <p>
            <i>{entry.description}</i>
          </p>
          {renderDiagnosisCodes(entry.diagnosisCodes)}
          {entry.discharge && (
            <p>
              Discharge: {entry.discharge.date} - {entry.discharge.criteria}
            </p>
          )}
          <p>diagnose by {entry.specialist}</p>
        </div>
      );

    case 'OccupationalHealthcare':
      return (
        <div>
          <p>
            {entry.date} <WorkIcon /> <i>{entry.employerName}</i>
          </p>
          <p>
            <i>{entry.description}</i>
          </p>
          {renderDiagnosisCodes(entry.diagnosisCodes)}
          {entry.sickLeave && (
            <p>
              Sick leave: {entry.sickLeave.startDate} to{' '}
              {entry.sickLeave.endDate}
            </p>
          )}
          <p>diagnose by {entry.specialist}</p>
        </div>
      );

    case 'HealthCheck':
      return (
        <div>
          <p>
            {entry.date} <MedicalServicesIcon />
          </p>
          <p>
            <i>{entry.description}</i>
          </p>
          <HealthCheckRatingHeart rating={entry.healthCheckRating} />
          {renderDiagnosisCodes(entry.diagnosisCodes)}
          <p>diagnose by {entry.specialist}</p>
        </div>
      );

    default:
      return assertNever(entry);
  }
};

export default EntryInfo;
