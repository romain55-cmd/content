import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught an error:", error, info);
  }
  reset = () => {
    this.setState({ hasError: false, error: null });
  };
  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" className="min-h-[60vh] flex items-center justify-center">
          <div className="max-w-lg w-full bg-white/10 border border-white/20 rounded-xl p-6 text-white text-center">
            <h2 className="text-2xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-white/70 mb-4">An unexpected error occurred. You can try reloading the page.</p>
            <div className="flex gap-2 justify-center">
              <Button onClick={this.reset} variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                Reset view
              </Button>
              <Button onClick={() => window.location.reload()} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <RefreshCw className="w-4 h-4 mr-2" /> Reload
              </Button>
            </div>
            {this.state.error && (
              <pre className="mt-4 text-left text-xs bg-black/30 rounded p-3 overflow-auto max-h-40">{String(this.state.error?.message || this.state.error)}</pre>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}