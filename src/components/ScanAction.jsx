import { useNavigate } from 'react-router-dom'
import ScanGridButton from './originkit/ui/scan-grid-button.tsx'

const TONES = {
  solid: {
    colors: { fill: '#00ff66', hoverFill: '#0d0d0d', textColor: '#0d0d0d', hoverTextColor: '#fff8e7' },
    borderColor: '#00ff66',
  },
  ghost: {
    colors: { fill: '#0d0d0d', hoverFill: '#00ff66', textColor: '#fff8e7', hoverTextColor: '#0d0d0d' },
    borderColor: '#fff8e7',
  },
}

export default function ScanAction({
  label,
  to,
  href,
  newTab = false,
  onClick,
  tone = 'solid',
  compact = false,
  square = false,
  fullWidth = false,
  className,
  ariaLabel,
  style,
}) {
  const navigate = useNavigate()
  const palette = TONES[tone] || TONES.solid

  const handleClick = (event) => {
    onClick?.(event)
    if (to && !event.defaultPrevented) navigate(to)
  }

  return (
    <ScanGridButton
      label={label}
      link={href || ''}
      newTab={newTab}
      onClick={href ? undefined : handleClick}
      className={className}
      ariaLabel={ariaLabel}
      padding={square ? '0' : compact ? '9px 12px' : '13px 18px'}
      font={{
        fontFamily: "'Space Mono', monospace",
        fontSize: square ? 16 : compact ? 10 : 13,
        fontWeight: 700,
        letterSpacing: compact ? 1.2 : 1.5,
      }}
      colors={palette.colors}
      scan={{ color: '#00ff66', speed: 64 }}
      border={{ borderWidth: 2, borderStyle: 'solid', borderColor: palette.borderColor }}
      glitchIntensity={compact ? 0.7 : 1.2}
      style={{
        minWidth: square ? 42 : undefined,
        width: square ? 42 : fullWidth ? '100%' : undefined,
        height: square ? 42 : undefined,
        ...style,
      }}
    />
  )
}
