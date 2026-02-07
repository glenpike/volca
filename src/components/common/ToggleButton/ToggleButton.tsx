import './ToggleButton.css'


export interface ToggleButtonProps {
  /** Primary or secondary style */
  primary?: boolean;
  /** How large should the button be? */
  size?: 'small' | 'medium' | 'large';
  /** What background color to use (overrides primary/secondary) */
  backgroundColor?: string;
  /** What label color to use */
  labelColor?: string;
  /** Button contents */
  label: string;
  /** Aria label */
  ariaLabel?: string;
  /** Label for 'on' state */
  onLabel?: string;
  /** Label for 'off' state */
  offLabel?: string;
  /** if true is 'on' */
  checked?: boolean;
  /** set to true if we are on a light background! */
  lightBackground?: boolean;
  /** Optional click handler */
  onClick?: () => void;
}

export const ToggleButton = ({
  primary = true,
  size = 'medium',
  backgroundColor,
  labelColor,
  label,
  onLabel,
  offLabel,
  ariaLabel,
  checked,
  lightBackground,
  onClick,
  ...props
}: ToggleButtonProps) => {
  const mode = primary ? 'toggle-button--primary' : 'toggle-button--secondary';
  const labelColorClass = lightBackground ? 'toggle-button--light' : '';
  const id = ariaLabel || label.toLowerCase().replace(' ', '-') || 'toggle';
  const onSpanColor = checked === true ? backgroundColor : '';
  const offSpanColor = checked === false ? backgroundColor : '';
  return (
    <div className={['toggle-button-wrapper', `toggle-button--${size}`, mode, labelColorClass].join(' ')}
    >
      <span
        className="toggle-button-label"
        id={id}
        style={{ color: labelColor }}
      >
        {label}
      </span>
      <button
        className="toggle-button"
        role="switch"
        aria-checked={checked ? 'true' : 'false'}
        aria-labelledby={id}
        style={{ backgroundColor }}
        onClick={onClick}
        {...props}
      >
        <span style={{ color: onSpanColor }}>{onLabel || 'on'}</span>
        <span style={{ color: offSpanColor }}>{offLabel || 'off'}</span>
      </button>
    </div>
  )
}

export default ToggleButton