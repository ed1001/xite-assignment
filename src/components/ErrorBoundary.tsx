import React, { ErrorInfo, FC, PropsWithChildren } from "react";
import styles from "./EmptyList.module.scss";
import { TbMoodSad } from "react-icons/tb";

type Props = PropsWithChildren<{}>;
type State = { hasError: boolean };

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.container}>
          <TbMoodSad />
          <p>Something went wrong...</p>
          <br />
          <p>Sorry about that, try refreshing the page</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export const ErrorBoundaryWrapped =
  (Component: FC) =>
  ({ ...props }) => {
    return (
      <ErrorBoundary>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
