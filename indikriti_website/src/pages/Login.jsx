import { useAuth } from '../context/AuthContext.jsx';
import AuthFlow from '../components/auth/AuthFlow.jsx';

const Login = ({ onNavigate, requiredForAction }) => {
  const { isAuthenticated } = useAuth();

  // If already authenticated, redirect to intended page
  if (isAuthenticated) {
    if (requiredForAction) {
      onNavigate?.(requiredForAction);
    } else {
      onNavigate?.('home');
    }
    return null;
  }

  const handleAuthComplete = () => {
    // After successful authentication, redirect based on context
    if (requiredForAction) {
      onNavigate?.(requiredForAction);
    } else {
      onNavigate?.('home');
    }
  };

  const handleClose = () => {
    // Allow users to close auth modal and return to browsing
    onNavigate?.('home');
  };

  return (
    <AuthFlow 
      onComplete={handleAuthComplete}
      onClose={handleClose}
    />
  );
};

export default Login;
