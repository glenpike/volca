import './ToggleButton.css'


export interface ToggleButtonProps {
  /** Primary or secondary style */
  primary?: boolean;
  /** Background colour override - defaults to primary / secondary colour*/
  backgroundColor?: string;
  /** set to true if we are on a light background! */
  lightBackground?: boolean;
  /** Label colour override - defaults to primary / secondary or 'lightBackground' colour*/
  labelColor?: string;
  /** The label text next to the button */
  label: string;
  /** Aria label - defaults to the label text */
  ariaLabel?: string;
  /** Label text for 'on' state - default 'on' */
  onLabel?: string;
  /** Label text for 'off' state - default 'off' */
  offLabel?: string;
  /** How large should the button be? */
  size?: 'small' | 'medium' | 'large';
  /** if true, displays the 'on' state */
  checked?: boolean;
  /** Optional click handler */
  onClick?: () => void;
  /** Optional disabled state */
  disabled?: boolean;
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
  disabled,
  ...props
}: ToggleButtonProps) => {
  const primaryOrSecondaryStyle = primary ? 'toggle-button--primary' : 'toggle-button--secondary';
  const labelColorClass = lightBackground ? 'toggle-button--light' : '';
  const arialLabelledBy = ariaLabel || label.toLowerCase().replace(' ', '-') || 'toggle';
  const onSpanColor = checked === true ? backgroundColor : '';
  const offSpanColor = checked === false ? backgroundColor : '';
  return (
    <div className={['toggle-button-wrapper', `toggle-button--${size}`, primaryOrSecondaryStyle, labelColorClass].join(' ')}
    >
      <span
        className="toggle-button-label"
        id={arialLabelledBy}
        style={{ color: labelColor }}
      >
        {label}
      </span>
      <button
        className="toggle-button"
        role="switch"
        aria-checked={checked ? 'true' : 'false'}
        aria-labelledby={arialLabelledBy}
        style={{ backgroundColor }}
        onClick={onClick}
        disabled={disabled}
        {...props}
      >
        <span style={{ color: onSpanColor }}>{onLabel || 'on'}</span>
        <span style={{ color: offSpanColor }}>{offLabel || 'off'}</span>
      </button>
    </div>
  )
}

export default ToggleButton