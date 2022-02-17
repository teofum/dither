interface InputProps<T> {
  value: T;
  onChange: (value: T) => void;
}

export default InputProps;