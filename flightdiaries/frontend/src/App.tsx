import { useState, useEffect } from 'react';
import type { DiaryEntry, Visibility, Weather } from './types';
import { getAllDiaries, addDiaryEntry } from './services/diaryService';
import axios from 'axios';

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [date, setDate] = useState('');
  const [visibility, setVisibility] = useState('');
  const [weather, setWeather] = useState('');
  const [comment, setComment] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    getAllDiaries().then((data) => {
      setDiaries(data);
    });
  }, []);

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    const newEntry = {
      date,
      visibility: visibility as Visibility,
      weather: weather as Weather,
      comment,
    };

    try {
      const data = await addDiaryEntry(newEntry);
      setDiaries(diaries.concat(data));
      setDate('');
      setVisibility('');
      setWeather('');
      setComment('');
      setErrorMessage('');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as
          | string
          | { error?: Array<{ message?: string }> }
          | undefined;

        if (typeof data === 'string') {
          setErrorMessage(data);
          return;
        }

        if (data && typeof data === 'object' && Array.isArray(data.error)) {
          const message = data.error
            .map((issue) => issue.message)
            .filter((message): message is string => Boolean(message))
            .join(', ');

          setErrorMessage(message || 'Empty or invalid fields.');
          return;
        }

        setErrorMessage('Empty or invalid fields.');
        return;
      }

      setErrorMessage('An unexpected error occurred.');
    }
  };

  const visibilityOptions: Visibility[] = ['great', 'good', 'ok', 'poor'];
  const weatherOptions: Weather[] = [
    'sunny',
    'rainy',
    'cloudy',
    'stormy',
    'windy',
  ];

  return (
    <div>
      <h2>Add new entry</h2>
      {errorMessage && <p>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          date{' '}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          visibility{' '}
          {visibilityOptions.map((o) => (
            <label key={o}>
              <input
                type="radio"
                name="visibility"
                value={o}
                checked={visibility === o}
                onChange={() => setVisibility(o)}
              />
              {o}{' '}
            </label>
          ))}
        </div>
        <div>
          weather{' '}
          {weatherOptions.map((o) => (
            <label key={o}>
              <input
                type="radio"
                name="weather"
                value={o}
                checked={weather === o}
                onChange={() => setWeather(o)}
              />
              {o}{' '}
            </label>
          ))}
        </div>
        <div>
          comment{' '}
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <button type="submit">add</button>
      </form>

      <h2>Diary entries</h2>
      {diaries.map((e) => (
        <div key={e.id}>
          <strong>{e.date}</strong>
          <p>visibility: {e.visibility}</p>
          <p>weather: {e.weather}</p>
          {e.comment && <p>comment: {e.comment}</p>}
        </div>
      ))}
    </div>
  );
};

export default App;
