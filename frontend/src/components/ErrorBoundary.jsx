import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary capturó un error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h2>😵 Algo salió mal</h2>
          <p>{this.state.error?.message || 'Error inesperado'}</p>
          <button className="btn btn--primary" onClick={() => window.location.reload()}>
            Recargar aplicación
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary