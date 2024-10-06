
import { SignUpForm, SignInForm, FrontPage, ResetPasswordForm,MainPage} from './AFunctions';
import { BrowserRouter as Router, Route, Routes,Navigate } from 'react-router-dom';
import { useGlobalState } from './GlobalVars';

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const [isAuthenticated]=useGlobalState('authenticated')
  return isAuthenticated ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/Login" />
  );
};
function App() { 
     
    return ( 
      

      
        <div >
          
          <Router>
            <Routes>
              <Route path="/" element={<FrontPage />} />
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
