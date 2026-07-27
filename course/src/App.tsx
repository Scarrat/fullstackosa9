import Part from './components/Part';
import { courseParts } from './types';
import type { CoursePart } from './types';

const Header = (props: HeaderProps) => {
  return <h1>{props.name}</h1>;
};

const Content = ({ parts }: ContentProps) => {
  return (
    <div>
      {parts.map((part) => (
        <Part key={part.name} part={part} />
      ))}
    </div>
  );
};

const Total = (props: TotalProps) => {
  return <p>Number of exercises {props.totalExercises}</p>;
};

interface HeaderProps {
  name: string;
}

interface ContentProps {
  parts: CoursePart[];
}

interface TotalProps {
  totalExercises: number;
}

const App = () => {
  const courseName = 'Half Stack application development';

  const totalExercises = courseParts.reduce(
    (sum, part) => sum + part.exerciseCount,
    0,
  );

  return (
    <div>
      <Header name={courseName} />
      <Content parts={courseParts} />
      <Total totalExercises={totalExercises} />
    </div>
  );
};

export default App;
