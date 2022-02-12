interface OptionsProps<T> {
  options: T;
  onChange: (value: T) => void;
}

export default OptionsProps;