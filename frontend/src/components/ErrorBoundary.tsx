import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    // Here you would send errors to a monitoring service (Sentry, LogRocket, etc.)
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 font-sans text-center">
          <div className="max-w-md w-full p-8 bg-white border border-gray-200 rounded-2xl shadow-xl">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-widest mb-3">
              Something went wrong
            </h1>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Khalad la filaynayn ayaa dhacay. Fadlan dib u cusboonaysii bogga ama la xiriir caawinaada maamulka.
            </p>

            {this.state.error && (
              <div className="bg-gray-100 p-3 rounded-lg text-left text-xs font-mono text-red-600 mb-6 max-h-32 overflow-y-auto border border-gray-200">
                {this.state.error.toString()}
              </div>
            )}

            <Button
              onClick={this.handleReload}
              className="w-full rounded-xl gap-2 uppercase tracking-widest text-xs h-12 bg-black text-white hover:bg-gray-800"
            >
              <RefreshCw className="h-4 w-4" /> Reload Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
