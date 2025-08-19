import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // You can also log the error to an error reporting service
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    } else {
      console.error('Error caught by ErrorBoundary:', error, errorInfo);
    }
  }

  resetErrorBoundary = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });

    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { 
      fallback, 
      fallbackRender,
      FallbackComponent,
      showDetails = false,
      children 
    } = this.props;

    if (hasError) {
      // You can render any custom fallback UI
      if (fallbackRender) {
        return fallbackRender({ error, errorInfo, resetErrorBoundary: this.resetErrorBoundary });
      }

      if (FallbackComponent) {
        return <FallbackComponent error={error} errorInfo={errorInfo} resetErrorBoundary={this.resetErrorBoundary} />;
      }

      if (fallback) {
        return fallback;
      }

      // Default error UI
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <h2 className="error-boundary-title">Something went wrong</h2>
            <p className="error-boundary-message">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            
            {showDetails && (
              <details className="error-boundary-details">
                <summary>Error Details</summary>
                <p>{error && error.toString()}</p>
                <div className="error-boundary-stack">
                  {errorInfo && errorInfo.componentStack}
                </div>
              </details>
            )}
            
            <button 
              className="error-boundary-reset" 
              onClick={this.resetErrorBoundary}
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    // If there's no error, render children normally
    return children;
  }
}

// Functional component wrapper for ErrorBoundary
export const withErrorBoundary = (Component, errorBoundaryProps) => {
  const displayName = Component.displayName || Component.name || 'Component';
  
  const WrappedComponent = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${displayName})`;
  
  return WrappedComponent;
};

export default ErrorBoundary;