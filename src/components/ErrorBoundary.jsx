import { Component } from 'react';
import { AlertCircle } from 'lucide-react';

export class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[40vh] flex flex-col items-center justify-center p-6 bg-surface rounded-xl border border-muted mx-4 my-8">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" aria-hidden />
          <h2 className="font-display font-bold text-xl text-text mb-2">Something went wrong</h2>
          <p className="text-textMuted text-center max-w-md">{this.state.error?.message || 'An unexpected error occurred.'}</p>
        </div>
      );
    }
    return this.props.children;
  }
}
