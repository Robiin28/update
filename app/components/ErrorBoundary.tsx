"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "50px", background: "#ff0000", color: "#ffffff", zIndex: 999999, position: "relative", minHeight: "100vh" }}>
          <h1>Client-Side Crash Detected</h1>
          <pre style={{ whiteSpace: "pre-wrap", marginTop: "20px" }}>{this.state.error?.message}</pre>
          <pre style={{ whiteSpace: "pre-wrap", marginTop: "20px", fontSize: "12px" }}>{this.state.error?.stack}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}
