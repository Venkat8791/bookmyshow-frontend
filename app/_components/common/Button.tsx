interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export default function Button({ children, className, ...rest }: ButtonProps) {
  return (
    <button className={className} {...rest}>
      {children}
    </button>
  );
}
