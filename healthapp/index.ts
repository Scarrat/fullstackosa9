import express from 'express';
import { calculateBmi } from './bmiCalculator.ts';
import { calculateExercises } from './exerciseCalculator.ts';

const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const { height, weight } = req.query;

  if (!height || !weight || isNaN(Number(height)) || isNaN(Number(weight))) {
    return res.status(400).json({
      error: 'malformatted parameters',
    });
  }

  const heightNum = Number(height);
  const weightNum = Number(weight);
  const bmi = calculateBmi(heightNum, weightNum);

  return res.json({
    weight: weightNum,
    height: heightNum,
    bmi,
  });
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;

  if (!daily_exercises || target === undefined || target === null) {
    return res.status(400).json({
      error: 'parameters missing',
    });
  }

  if (
    isNaN(Number(target)) ||
    !Array.isArray(daily_exercises) ||
    daily_exercises.length === 0 ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    daily_exercises.some((item: any) => isNaN(Number(item)))
  ) {
    return res.status(400).json({
      error: 'malformatted parameters',
    });
  }

  const targetNum = Number(target);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dailyExercisesNums = daily_exercises.map((item: any) => Number(item));

  const result = calculateExercises(dailyExercisesNums, targetNum);
  return res.json(result);
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
