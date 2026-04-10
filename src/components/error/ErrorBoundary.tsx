"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { ErrorFallback } from "./ErrorFallback";

type Props = {
  children: ReactNode;
  title?: string;
  variant?: "compact" | "embedded";
};

type State = {
  error: (Error & { digest?: string }) | null;
};

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("[ErrorBoundary]", error, errorInfo.componentStack);
  }

  private reset = (): void => {
    this.setState({ error: null });
  };

  render(): ReactNode {
    const { error } = this.state;
    if (error) {
      return (
        <ErrorFallback
          error={error}
          reset={this.reset}
          variant={this.props.variant ?? "compact"}
          title={this.props.title}
        />
      );
    }
    return this.props.children;
  }
}
