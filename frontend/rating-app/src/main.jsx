import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from "@react-oauth/google";
import { UserProvider } from './components/userContext.jsx';

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <GoogleOAuthProvider clientId="161556439720-4on12j7bcmkfi6euges80mohvhtavvjf.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </UserProvider>
  </StrictMode>,
)
