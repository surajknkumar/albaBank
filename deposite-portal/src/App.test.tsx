import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { persistor, store } from './app/store';
import App from './App';
import React from 'react';
import { PersistGate } from 'redux-persist/integration/react';

test('renders learn react link', () => {
  const { getByText } = render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  );

  expect(getByText(/learn/i)).toBeInTheDocument();
});
