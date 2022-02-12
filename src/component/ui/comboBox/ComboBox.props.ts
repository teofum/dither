export type ComboBoxOption<T> = { name: string, value: T, disabled?: boolean };

interface ComboBoxChangeEvent<T> {
  selected: ComboBoxOption<T>;
  previous?: ComboBoxOption<T>;
}

interface ComboBoxProps<T> {
  value?: T;
  options: ComboBoxOption<T>[];
  onChange: (ev: ComboBoxChangeEvent<T>) => void;

  disabled?: boolean;
}

export default ComboBoxProps;