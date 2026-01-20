import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import LandingPage from './pages/landing';
import Authentication from './pages/authentication';
import { AuthProvider } from './contexts/AuthContext';
import VideoMeetComponent from './pages/VideoMeet';
import HomeComponent from './pages/home';
import History from './pages/history';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Layout from './components/layout/Layout';

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AuthProvider>
            <Layout>
              <Routes>
                <Route path='/' element={<LandingPage />} />
                <Route path='/auth' element={<Authentication />} />
                <Route path='/home' element={<HomeComponent />} />
                <Route path='/history' element={<History />} />
                <Route path='/:url' element={<VideoMeetComponent />} />
              </Routes>
            </Layout>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;