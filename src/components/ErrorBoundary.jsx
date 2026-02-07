import React from 'react'
import styles from './ErrorBoundary.module.scss'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    })

    // Log error details for debugging
    console.error('Error caught by boundary:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.container}>
          <div className={styles.content}>
            <h1 className={styles.title}>Oops! Something went wrong</h1>
            <p className={styles.message}>
              We&apos;ve encountered an unexpected error. The error has been logged for our team to
              investigate.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className={styles.details}>
                <summary className={styles.summary}>Error Details (Development)</summary>
                <pre className={styles.errorText}>{this.state.error.toString()}</pre>
                {this.state.errorInfo && (
                  <pre className={styles.errorText}>{this.state.errorInfo.componentStack}</pre>
                )}
              </details>
            )}

            <button onClick={this.handleReset} className={styles.button}>
              Try Again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
