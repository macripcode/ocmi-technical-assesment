import { ThemeProvider } from '../context/ThemeContext';
import { AppLayout } from '../layout/AppLayout';

export function App() {
  return (
    <ThemeProvider>
      <AppLayout />
    </ThemeProvider>
  );
}

export default App;
