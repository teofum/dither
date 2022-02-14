interface ClosablePanelProps {
  children?: React.ReactNode;

  title: string;
  onClosed: () => void;
}

export default ClosablePanelProps;