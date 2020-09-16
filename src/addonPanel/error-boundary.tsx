import React from 'react';

type Props = {
  FallbackComponent: React.ComponentType;
};
type State = {
  hasError: boolean;
};

export class ErrorBoundary extends React.Component<Props, State> {
  state = { hasError: false };

  static getDerivedStateFromError(_error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  render() {
    const { hasError } = this.state;
    const { children, FallbackComponent } = this.props;
    if (hasError) {
      return FallbackComponent || null;
    }

    return children;
  }
}
