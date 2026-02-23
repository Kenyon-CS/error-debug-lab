import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || 'Unknown error' };
  }

  componentDidCatch(error, info) {
    // Developer-focused logging
    console.error('[UI ERROR]', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ border: '1px solid #ccc', padding: 12 }}>
          <h2>Something went wrong.</h2>
          <p>Try reloading, or contact support.</p>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            <summary>Details (dev)</summary>
            {this.state.message}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}
