export const calculateBmi = (
  heightInput: number,
  weightInput: number,
): string => {
  const height = heightInput / 100;
  const bmi = weightInput / (height * height);

  if (bmi < 16) {
    return 'Severely Underweight';
  } else if (bmi < 17) {
    return 'Moderately Underweight';
  } else if (bmi < 18.5) {
    return 'Underweight';
  } else if (bmi < 25) {
    return 'Normal range';
  } else if (bmi < 30) {
    return 'Overweight';
  } else {
    return 'Obese';
  }
};
interface BmiValues {
  heightInput: number;
  weightInput: number;
}

const parseBmiArguments = (args: string[]): BmiValues => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      heightInput: Number(args[2]),
      weightInput: Number(args[3]),
    };
  } else {
    throw new Error('Provided values were not numbers!');
  }
};

if (process.argv[1] === import.meta.filename) {
  try {
    const { heightInput, weightInput } = parseBmiArguments(process.argv);
    console.log(calculateBmi(heightInput, weightInput));
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong: ';
    if (error instanceof Error) {
      errorMessage += error.message;
    }
    console.log(errorMessage);
  }
}
