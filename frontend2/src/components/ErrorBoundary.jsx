import React from 'react';
import { FiAlertTriangle, FiRefreshCw, FiHome } from 'react-icons/fi';
import { Button } from './ui';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console and potentially to an error reporting service
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // In production, you might want to log this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: logErrorToService(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
  };

  handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <div className="text-center">
                <FiAlertTriangle className="mx-auto h-12 w-12 text-red-500" />
                <h2 className="mt-4 text-lg font-medium text-gray-900">
                  Something went wrong
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  We're sorry, but something unexpected happened. Please try refreshing the page or contact support if the problem persists.
                </p>
                
                {/* Show error details in development */}
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="mt-4 text-left">
                    <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                      Error Details (Development)
                    </summary>
                    <div className="mt-2 p-3 bg-red-50 rounded-md">
                      <pre className="text-xs text-red-800 whitespace-pre-wrap overflow-auto max-h-32">
                        {this.state.error.toString()}
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  </details>
                )}
                
                <div className="mt-6 flex flex-col space-y-3">
                  <Button
                    onClick={this.handleRetry}
                    className="w-full flex justify-center items-center"
                  >
                    <FiRefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                  
                  <Button
                    onClick={this.handleGoHome}
                    variant="outline"
                    className="w-full flex justify-center items-center"
                  >
                    <FiHome className="w-4 h-4 mr-2" />
                    Go to Dashboard
                  </Button>
                </div>
                
                {this.state.retryCount > 0 && (
                  <p className="mt-3 text-xs text-gray-500">
                    Retry attempts: {this.state.retryCount}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
