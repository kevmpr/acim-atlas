import { useEffect, useState, useCallback, useRef } from 'react'
import { createPortal } from 'react-dom'
import { buildAtlasSteps, type AtlasStep } from '../../lib/atlasSteps'

// ─── Types ────────────────────────────────────────────────────────────────────

interface SpotlightRect {
  x: number
  y: number
  width: number
  height: number
}

// ─── Tooltip positioning ──────────────────────────────────────────────────────

const TOOLTIP_WIDTH = 288
const TOOLTIP_MARGIN = 16
const PADDING = 12

function getTooltipStyle(
  rect: SpotlightRect | null,
  position: AtlasStep['position'],
  measuredHeight: number,
): React.CSSProperties {
  const W = window.innerWidth
  const H = window.innerHeight
  const CARD_W = TOOLTIP_WIDTH

  if (!rect) {
    return {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 9001,
      width: CARD_W,
      overflowY: 'auto',
      maxHeight: 'calc(100vh - 16px)',
      pointerEvents: 'all',
    }
  }

  const { x, y, width, height } = rect
  let tx: number
  let ty: number

  switch (position) {
    case 'right': {
      tx = x + width + PADDING + TOOLTIP_MARGIN
      ty = y + height / 2 - measuredHeight / 2
      if (ty < 8 || ty + measuredHeight > H - 8) {
        ty = Math.max(8, H / 2 - measuredHeight / 2)
      }
      break
    }
    case 'left': {
      tx = x - PADDING - TOOLTIP_MARGIN - CARD_W
      ty = y + height / 2 - measuredHeight / 2
      if (ty < 8 || ty + measuredHeight > H - 8) {
        ty = Math.max(8, H / 2 - measuredHeight / 2)
      }
      break
    }
    case 'bottom': {
      const spaceBelow = H - (y + height + PADDING + TOOLTIP_MARGIN)
      if (spaceBelow < measuredHeight + 8) {
        ty = y - PADDING - TOOLTIP_MARGIN - measuredHeight
      } else {
        ty = y + height + PADDING + TOOLTIP_MARGIN
      }
      tx = x + width / 2 - CARD_W / 2
      break
    }
    case 'top':
    default: {
      const spaceAbove = y - PADDING - TOOLTIP_MARGIN
      if (spaceAbove < measuredHeight + 8) {
        ty = y + height + PADDING + TOOLTIP_MARGIN
      } else {
        ty = y - PADDING - TOOLTIP_MARGIN - measuredHeight
      }
      tx = x + width / 2 - CARD_W / 2
      break
    }
  }

  // Clamp to viewport
  tx = Math.max(8, Math.min(tx, W - CARD_W - 8))
  ty = Math.max(8, Math.min(ty, H - measuredHeight - 8))

  return {
    position: 'fixed',
    top: ty,
    left: tx,
    zIndex: 9001,
    width: CARD_W,
    overflowY: 'auto',
    maxHeight: 'calc(100vh - 16px)',
    pointerEvents: 'all',
  }
}

// ─── Overlay ──────────────────────────────────────────────────────────────────

export function AtlasTutorialOverlay() {
  const [isActive, setIsActive] = useState(false)
  const [steps, setSteps] = useState<AtlasStep[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [spotlightRect, setSpotlightRect] = useState<SpotlightRect | null>(null)
  const [measuredHeight, setMeasuredHeight] = useState(200)
  const tooltipRef = useRef<HTMLDivElement | null>(null)

  // Listen for postMessage from Shell
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      const shellUrl = (import.meta.env.VITE_SHELL_URL as string)?.trim()
      if (shellUrl && event.origin !== shellUrl) return
      if (event.data?.type === 'AUSTRAL_TUTORIAL_START') {
        setCurrentStep(0)
        setIsActive(true)
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  // Block scroll and interactions during tutorial
  useEffect(() => {
    if (isActive) {
      document.body.style.overflow = 'hidden'
      document.body.style.pointerEvents = 'none'
    } else {
      document.body.style.overflow = ''
      document.body.style.pointerEvents = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.pointerEvents = ''
    }
  }, [isActive])

  // Rebuild steps on every step change so newly visible elements are captured
  useEffect(() => {
    if (!isActive) return
    const timer = setTimeout(() => {
      setSteps(buildAtlasSteps())
    }, 100)
    return () => clearTimeout(timer)
  }, [isActive, currentStep])

  const measureTarget = useCallback(() => {
    if (!isActive || steps.length === 0) return
    const step = steps[currentStep]
    if (!step || step.target === 'body') {
      setSpotlightRect(null)
      return
    }
    const timer = setTimeout(() => {
      const el = document.querySelector(step.target)
      if (el && (el as HTMLElement).offsetParent !== null) {
        document.body.style.overflow = ''  // allow scroll temporarily
        el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' })
        // Wait for scroll to settle before measuring
        setTimeout(() => {
          const r = el.getBoundingClientRect()
          setSpotlightRect({ x: r.x, y: r.y, width: r.width, height: r.height })
          document.body.style.overflow = 'hidden'  // re-lock after measuring
        }, 350)
      } else {
        setSpotlightRect(null)
      }
    }, 100)
    return timer
  }, [isActive, currentStep, steps])

  // Measure real tooltip height after render
  useEffect(() => {
    if (tooltipRef.current) {
      const h = tooltipRef.current.getBoundingClientRect().height
      if (h > 0) setMeasuredHeight(h)
    }
  })

  // Spotlight measurement — scroll element into view then measure
  useEffect(() => {
    if (!isActive) return
    const timer = measureTarget()
    return () => { if (timer) clearTimeout(timer) }
  }, [isActive, currentStep, measureTarget])

  useEffect(() => {
    if (!isActive) return
    const handleResize = () => measureTarget()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isActive, measureTarget])

  const nextStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1)
    } else {
      setIsActive(false)
    }
  }, [currentStep, steps.length])

  const prevStep = useCallback(() => {
    if (currentStep > 0) setCurrentStep((s) => s - 1)
  }, [currentStep])

  const skipTutorial = useCallback(() => {
    setIsActive(false)
  }, [])

  if (!isActive || steps.length === 0) return null

  const step = steps[currentStep]
  const totalSteps = steps.length
  const isFirst = currentStep === 0
  const isLast = currentStep === totalSteps - 1
  const padding = PADDING

  const tooltipStyle = getTooltipStyle(spotlightRect, step.position, measuredHeight)

  const sr = spotlightRect
  const sx = sr ? sr.x - padding : 0
  const sy = sr ? sr.y - padding : 0
  const sw = sr ? sr.width + padding * 2 : 0
  const sh = sr ? sr.height + padding * 2 : 0

  return createPortal(
    <>
      {/* SVG overlay with spotlight cutout */}
      <svg
        style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', zIndex: 9000, pointerEvents: 'all' }}
        aria-hidden="true"
      >
        <style>{`@keyframes argus-pulse { 0%,100%{opacity:.3} 50%{opacity:.9} }`}</style>
        <defs>
          <mask id="argus-spotlight-mask">
            <rect width="100%" height="100%" fill="white" />
            {sr && (
              <rect
                x={sx}
                y={sy}
                width={sw}
                height={sh}
                rx="12"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="rgba(0,0,0,0.75)"
          mask="url(#argus-spotlight-mask)"
        />
        {sr && (
          <rect
            x={sx - 4} y={sy - 4} width={sw + 8} height={sh + 8} rx={16}
            fill="none"
            stroke="rgba(0,120,212,0.4)"
            strokeWidth={3}
            style={{ animation: 'argus-pulse 1.5s ease-in-out infinite' }}
          />
        )}
      </svg>

      {/* Tooltip card */}
      <div ref={tooltipRef} style={tooltipStyle}>
        <div className="bg-white dark:bg-slate-900 border border-border rounded-xl shadow-2xl p-5">
          {/* Step counter */}
          <p className="text-xs text-muted-foreground mb-1">
            Paso {currentStep + 1} de {totalSteps}
          </p>

          {/* Title */}
          <p className="text-base font-semibold text-foreground">{step.title}</p>

          {/* Description */}
          <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{step.description}</p>

          {/* Buttons */}
          <div className="flex items-center justify-between mt-4">
            {/* Skip — left aligned */}
            <button
              onClick={skipTutorial}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Saltar
            </button>

            {/* Prev + Next — right aligned */}
            <div className="flex items-center gap-2">
              {!isFirst && (
                <button
                  onClick={prevStep}
                  className="border border-border rounded-lg px-3 py-1.5 text-sm text-foreground hover:bg-accent transition-colors"
                >
                  Anterior
                </button>
              )}
              <button
                onClick={nextStep}
                className="bg-primary text-primary-foreground rounded-lg px-3 py-1.5 text-sm hover:bg-primary/90 transition-colors"
              >
                {isLast ? 'Finalizar' : 'Siguiente'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body,
  )
}