import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthContext';
import { useAuth } from './components/auth/AuthContext';
import { UserProfileProvider} from './components/UserProfileContext';
import { UserTasksProvider } from './components/UserTasksContext';
import { ToastProvider } from './components/ToastContext';
import Home from './Home';

// global styles
//import './styles/global.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppWithAuth />
      </AuthProvider>
    </BrowserRouter>
  );
}

function AppWithAuth() {
    return (
    <UserProfileProvider>
      <UserTasksProvider>
	  <ToastProvider>
	  
	  <Home />
	  
	  </ToastProvider>
      </UserTasksProvider>
    </UserProfileProvider>
  );
}

export default App;




