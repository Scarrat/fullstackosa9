interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

interface ExerciseValues {
  target: number;
  dailyHours: number[];
}

const parseExerciseArguments = (args: string[]): ExerciseValues => {
  if (args.length < 4) throw new Error('Not enough arguments');

  const target = Number(args[2]);
  if (isNaN(target)) {
    throw new Error('Target value was not a number!');
  }

  const dailyHours: number[] = [];
  for (let i = 3; i < args.length; i++) {
    const hours = Number(args[i]);
    if (isNaN(hours)) {
      throw new Error('Provided values were not numbers!');
    }
    dailyHours.push(hours);
  }

  return {
    target,
    dailyHours,
  };
};

export const calculateExercises = (
  dailyHours: number[],
  target: number,
): Result => {
  const periodLength = dailyHours.length;
  const trainingDays = dailyHours.filter((hours) => hours > 0).length;
  const totalHours = dailyHours.reduce((sum, hours) => sum + hours, 0);
  const average = totalHours / periodLength;

  const success = average >= target;

  let rating: number;
  let ratingDescription: string;

  if (average >= target) {
    rating = 3;
    ratingDescription = 'Amazing job!';
  } else if (average >= target * 0.5) {
    rating = 2;
    ratingDescription = 'Could try a bit harder.';
  } else {
    rating = 1;
    ratingDescription = 'Now that is just lazy.';
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};

if (process.argv[1] === import.meta.filename) {
  try {
    const { target, dailyHours } = parseExerciseArguments(process.argv);
    console.log(calculateExercises(dailyHours, target));
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong: ';
    if (error instanceof Error) {
      errorMessage += error.message;
    }
    console.log(errorMessage);
  }
}
