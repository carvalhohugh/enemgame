import { Component, type ErrorInfo, type ReactNode } from 'react';

interface AppErrorBoundaryProps {
  children: ReactNode;
  onReset?: () => void;
}

interface AppErrorBoundaryState {
  hasError: boolean;
}

export default class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Dashboard render error:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false });
    this.props.onReset?.();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <section className="mx-auto mt-6 w-full max-w-4xl rounded-3xl border border-red-400/40 bg-red-500/10 p-6 text-white">
          <h3 className="font-poppins text-2xl font-bold">Ocorreu um erro na visualizacao</h3>
          <p className="mt-2 text-sm text-white/80">
            Recarregue essa aba. Se continuar, use a aba de Questoes e Redacao enquanto ajustamos este modulo.
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="mt-4 rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold transition hover:border-white/40"
          >
            Tentar novamente
          </button>
        </section>
      );
    }

    return this.props.children;
  }
}
