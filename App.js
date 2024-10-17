
import { SignUpForm, SignInForm, FrontPage, ResetPasswordForm,MainPage, FrontPageMobile} from './AFunctions';
import { BrowserRouter as Router, Route, Routes,Navigate } from 'react-router-dom';
import { useGlobalState } from './GlobalVars';
import { useState } from 'react';

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const [isAuthenticated]=useGlobalState('authenticated')
  return isAuthenticated ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/Login" />
  );
};

function App() { 
    const [mediaOption] = useState(window.innerWidth>600)
    return ( 
      

      
        <div >
          
          <Router>
            <Routes>
              {
                (mediaOption) && <Route path="/" element={<FrontPage />} />
              }
              {
                (!mediaOption) && <Route path="/" element={<FrontPageMobile />} />
              }
              
              <Route path="/Register" element={<SignUpForm />} />
              <Route path="/Login" element={<SignInForm />} />
              <Route path="/resetPassword" element={<ResetPasswordForm />} />
              <Route
                path="/mainPage"
                element={<ProtectedRoute element={MainPage} />}
              /><Route path="/mainPage" element={<MainPage />} />
            </Routes>
          </Router>
         </div>
      
      
    ); 
} 
  
export default App; 
