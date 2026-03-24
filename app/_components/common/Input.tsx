interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
  labelClassName?: string;
  inputClassName?: string;
}

export default function Input({
  label,
  id,
  labelClassName,
  inputClassName,
  ...rest
}: InputProps) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className={labelClassName}>
          {label}
        </label>
      )}
      <input id={id} className={inputClassName} {...rest} />
    </div>
  );
}
