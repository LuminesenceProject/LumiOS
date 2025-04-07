import { useEffect, useState, MouseEvent, CSSProperties } from "react";

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className, disabled = false, style = {} }) => {
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: -1, y: -1 });
  const [isRippling, setIsRippling] = useState(false);
  
  useEffect(() => {
    if (coords.x !== -1 && coords.y !== -1) {
      setIsRippling(true);
      setTimeout(() => setIsRippling(false), 300);
    } else setIsRippling(false);
  }, [coords]);
  
  useEffect(() => {
    if (!isRippling) setCoords({ x: -1, y: -1 });
  }, [isRippling]);  
  
  return (
    <button
      disabled={disabled}
      className={`ripple-button ${className} ${disabled && "!cursor-not-allowed !bg-secondary-light !opacity-75 !transition-none !scale-100"}`}
      onClick={(e: MouseEvent<HTMLButtonElement>) => {
        const rect = (e.target as HTMLButtonElement).getBoundingClientRect();
        setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        onClick && onClick(e);
      }}
      style={style}
    >
      {isRippling ? (
        <span
          className="ripple pointer-events-none"
          style={{
            left: coords.x,
            top: coords.y
          }}
        />
      ) : (
        ''
      )}
      <span className="content">{children}</span>
    </button>
  );
}

export default Button;