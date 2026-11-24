import { useEffect, useRef, useState } from 'react'
import vinesPhoto from '../assets/vines-idcard.jpg'

const ANCHOR_HEIGHT = 26
const ANCHOR_Y = 18
const REST_STRAP_HEIGHT = 175
const BUCKLE_ATTACH_OFFSET = 18
const REST_END_Y = REST_STRAP_HEIGHT + 14 // 189px

export default function KokardeLanyard({ className = '' }) {
  const cardAssemblyRef = useRef(null)
  const leftRibbonRef = useRef(null)
  const rightRibbonRef = useRef(null)
  const leftStitchRef = useRef(null)
  const rightStitchRef = useRef(null)
  const loopRibbonRef = useRef(null)
  const loopStitchRef = useRef(null)

  const [isDragging, setIsDragging] = useState(false)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    const cardEl = cardAssemblyRef.current
    if (!cardEl) return

    // State fisika pegas & bandul 2D (koordinat relatif terhadap titik diam)
    let x = 22
    let y = -260
    let vx = -45
    let vy = 120
    let angle = -12
    let angVel = 36

    let dragging = false
    let dragStartPointerX = 0
    let dragStartPointerY = 0
    let dragStartX = 0
    let dragStartY = 0
    let targetX = 0
    let targetY = 0
    let idleTime = 0
    let lastTime = performance.now()
    let rafId

    // Konstanta fisika elastisitas tali lanyard
    const STIFFNESS_X = 115
    const STIFFNESS_Y = 185
    const DAMPING_X = 6.2
    const DAMPING_Y = 8.4
    const ANGLE_STIFFNESS = 145
    const ANGLE_DAMPING = 6.8

    function updateStrapSVG(endX, endY, curY) {
      const safeEndY = Math.max(ANCHOR_Y + 24, endY)
      // Tali sedikit menegang menyempit saat ditarik ke bawah, melonggar saat memantul ke atas
      const spread = Math.max(12, Math.min(34, 24 - curY * 0.08))
      const midX = endX * 0.48
      const midY = ANCHOR_Y + (safeEndY - ANCHOR_Y) * 0.52

      const leftD = `M -3 ${ANCHOR_Y} Q ${midX - spread} ${midY} ${endX - 9} ${safeEndY}`
      const rightD = `M 3 ${ANCHOR_Y} Q ${midX + spread} ${midY} ${endX + 9} ${safeEndY}`
      const loopD = `M ${endX - 9} ${safeEndY} Q ${endX} ${safeEndY + 14} ${endX + 9} ${safeEndY}`

      leftRibbonRef.current?.setAttribute('d', leftD)
      leftStitchRef.current?.setAttribute('d', leftD)
      rightRibbonRef.current?.setAttribute('d', rightD)
      rightStitchRef.current?.setAttribute('d', rightD)
      loopRibbonRef.current?.setAttribute('d', loopD)
      loopStitchRef.current?.setAttribute('d', loopD)
    }

    function renderFrame(curX, curY, curAngle) {
      cardEl.style.transform = `translate3d(${curX.toFixed(2)}px, ${curY.toFixed(2)}px, 0) rotate(${curAngle.toFixed(2)}deg)`
      updateStrapSVG(curX, REST_END_Y + curY, curY)
    }

    function stepPhysics(now) {
      const rawDt = Math.min((now - lastTime) / 1000, 0.035)
      lastTime = now
      const subSteps = 2
      const dt = rawDt / subSteps

      for (let i = 0; i < subSteps; i++) {
        const endY = REST_END_Y + y
        const strapAngle =
          -Math.atan2(x, Math.max(40, endY - ANCHOR_Y)) * (180 / Math.PI)

        if (dragging) {
          // Ikuti tarikan kursor secara responsif sambil menghitung kecepatan lemparan
          const prevX = x
          const prevY = y
          const follow = 1 - Math.exp(-28 * dt)
          x += (targetX - x) * follow
          y += (targetY - y) * follow

          const instVx = (x - prevX) / Math.max(dt, 0.001)
          const instVy = (y - prevY) / Math.max(dt, 0.001)
          vx = vx * 0.65 + instVx * 0.35
          vy = vy * 0.65 + instVy * 0.35

          // Kartu miring mengikuti arah tarikan dan momentum gerak
          const dragTilt = Math.max(-24, Math.min(24, -vx * 0.022))
          const targetAngle = strapAngle + dragTilt
          const angAcc = ANGLE_STIFFNESS * (targetAngle - angle) - ANGLE_DAMPING * angVel
          angVel += angAcc * dt
          angle += angVel * dt
          idleTime = 0
        } else {
          // Fisika pegas 2D saat dilepas (memantul kembali ke posisi gantung)
          const ax = -STIFFNESS_X * x - DAMPING_X * vx
          const ay = -STIFFNESS_Y * y - DAMPING_Y * vy

          vx += ax * dt
          vy += ay * dt
          x += vx * dt
          y += vy * dt

          // Ayunan sudut bandul terkopel dengan percepatan horizontal
          const angAcc =
            ANGLE_STIFFNESS * (strapAngle - angle) -
            ANGLE_DAMPING * angVel -
            ax * 0.042
          angVel += angAcc * dt
          angle += angVel * dt

          // Ayunan halus alami ketika sudah tenang
          const speed = Math.hypot(vx, vy)
          const dist = Math.hypot(x, y)
          if (dist < 0.6 && speed < 3 && Math.abs(angle) < 0.6 && Math.abs(angVel) < 3) {
            idleTime += dt
          } else {
            idleTime = 0
          }
        }
      }

      if (!dragging && idleTime > 0) {
        const blend = Math.min(1, idleTime / 0.6)
        const idleAngle = Math.sin(idleTime * 1.5) * 1.6 * blend
        const idleY = Math.sin(idleTime * 2.8) * 1.2 * blend
        renderFrame(x, y + idleY, angle + idleAngle)
      } else {
        renderFrame(x, y, angle)
      }

      rafId = requestAnimationFrame(stepPhysics)
    }

    function applyElasticBounds(rawX, rawY) {
      const maxX = 155
      const maxDown = 135
      const maxUp = 36

      const boundedX = maxX * Math.tanh(rawX / maxX)
      const boundedY =
        rawY >= 0
          ? maxDown * Math.tanh(rawY / maxDown)
          : -maxUp * Math.tanh(-rawY / maxUp)

      return { boundedX, boundedY }
    }

    function onPointerDown(e) {
      if (e.button !== undefined && e.button !== 0) return
      e.preventDefault()
      dragging = true
      setIsDragging(true)

      dragStartPointerX = e.clientX
      dragStartPointerY = e.clientY
      dragStartX = x
      dragStartY = y
      targetX = x
      targetY = y
    }

    function onPointerMove(e) {
      if (!dragging) return
      const rawX = dragStartX + (e.clientX - dragStartPointerX)
      const rawY = dragStartY + (e.clientY - dragStartPointerY)
      const { boundedX, boundedY } = applyElasticBounds(rawX, rawY)
      targetX = boundedX
      targetY = boundedY
    }

    function onPointerUp() {
      if (!dragging) return
      dragging = false
      setIsDragging(false)
    }

    cardEl.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)

    lastTime = performance.now()
    rafId = requestAnimationFrame(stepPhysics)

    return () => {
      cancelAnimationFrame(rafId)
      cardEl.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
    }
  }, [])

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Fixed Top Anchor Mount (Titik tumpu tali di atas tetap diam saat kartu ditarik) */}
      <div
        className="relative z-20 flex flex-col items-center pointer-events-none"
        style={{ height: `${ANCHOR_HEIGHT}px` }}
      >
        <div className="h-3 w-16 rounded-full bg-linear-to-b from-slate-200 to-slate-300 shadow-md border border-slate-200" />
        <div className="h-3.5 w-6 rounded-b-md bg-linear-to-b from-slate-400 to-slate-600 shadow-sm" />
      </div>

      {/* 1. Dynamic Elastic Lanyard Fabric Strap (Mengikuti posisi tarikan kartu 60fps) */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-px w-px overflow-visible z-10"
        style={{ filter: 'drop-shadow(0 12px 16px rgba(0, 0, 0, 0.24))' }}
      >
        <defs>
          <linearGradient id="vinesStrapGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1D4ED8" />
            <stop offset="25%" stopColor="#2563EB" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="75%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1E40AF" />
          </linearGradient>
        </defs>

        {/* Left & Right Ribbons */}
        <path
          ref={leftRibbonRef}
          d={`M -3 ${ANCHOR_Y} Q -24 95 -9 ${REST_END_Y}`}
          stroke="url(#vinesStrapGradient)"
          strokeWidth="18"
          fill="none"
          strokeLinecap="round"
        />
        <path
          ref={rightRibbonRef}
          d={`M 3 ${ANCHOR_Y} Q 24 95 9 ${REST_END_Y}`}
          stroke="url(#vinesStrapGradient)"
          strokeWidth="18"
          fill="none"
          strokeLinecap="round"
        />

        {/* Stitching Lines */}
        <path
          ref={leftStitchRef}
          d={`M -3 ${ANCHOR_Y} Q -24 95 -9 ${REST_END_Y}`}
          stroke="rgba(255,255,255,0.72)"
          strokeWidth="1.4"
          fill="none"
          strokeDasharray="4 4"
          strokeLinecap="round"
        />
        <path
          ref={rightStitchRef}
          d={`M 3 ${ANCHOR_Y} Q 24 95 9 ${REST_END_Y}`}
          stroke="rgba(255,255,255,0.72)"
          strokeWidth="1.4"
          fill="none"
          strokeDasharray="4 4"
          strokeLinecap="round"
        />

        {/* Bottom convergence loop */}
        <path
          ref={loopRibbonRef}
          d={`M -9 ${REST_END_Y} Q 0 ${REST_END_Y + 14} 9 ${REST_END_Y}`}
          stroke="url(#vinesStrapGradient)"
          strokeWidth="18"
          fill="none"
          strokeLinecap="round"
        />
        <path
          ref={loopStitchRef}
          d={`M -9 ${REST_END_Y} Q 0 ${REST_END_Y + 14} 9 ${REST_END_Y}`}
          stroke="rgba(255,255,255,0.72)"
          strokeWidth="1.4"
          fill="none"
          strokeDasharray="4 4"
          strokeLinecap="round"
        />
      </svg>

      {/* Movable Card & Buckle Assembly (Dapat ditarik ke segala arah & memantul elastis) */}
      <div
        ref={cardAssemblyRef}
        className={`relative z-20 flex flex-col items-center ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{
          marginTop: `${REST_STRAP_HEIGHT - ANCHOR_HEIGHT - 6}px`,
          transformOrigin: `50% ${BUCKLE_ATTACH_OFFSET}px`,
          touchAction: 'none',
          willChange: 'transform',
        }}
      >
        {/* 2. Plastic Release Buckle */}
        <div className="relative z-20 flex h-9.5 w-9.5 flex-col items-center justify-between rounded-md bg-linear-to-b from-[#1E293B] to-[#0F172A] p-1 shadow-[0_4px_10px_rgba(0,0,0,0.35)] border border-slate-700/60 pointer-events-none">
          <div className="h-1.5 w-4 rounded-sm bg-black/60 shadow-inner" />
          <div className="h-0.5 w-full bg-white/20" />
          <div className="h-1 w-3 rounded-full bg-slate-600" />
        </div>

        {/* 3. Metal Ring (O-Ring) */}
        <div className="relative z-20 -mt-2 -mb-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-slate-400 bg-linear-to-br from-slate-200 via-slate-400 to-slate-600 shadow-[0_3px_8px_rgba(0,0,0,0.3)] pointer-events-none">
          <div className="h-3.5 w-3.5 rounded-full bg-slate-800 shadow-inner" />
        </div>

        {/* 4. Swivel Carabiner Clip */}
        <div className="relative z-20 -mt-1 flex h-8 w-5 flex-col items-center rounded-t-sm bg-linear-to-b from-slate-200 via-slate-300 to-slate-500 shadow-md border-x border-slate-400 pointer-events-none">
          <div className="mt-1 h-3.5 w-2.5 rounded-xs border border-slate-600 bg-white/40 shadow-xs" />
          <div className="mt-auto h-2 w-3.5 rounded-b-sm bg-slate-700" />
        </div>

        {/* 5. Clear ID Card Holder Slot */}
        <div className="relative z-10 -mt-1 flex h-6 w-28 items-center justify-center rounded-t-lg border border-slate-300/80 bg-white/70 backdrop-blur-md shadow-xs pointer-events-none">
          <div className="h-2 w-9 rounded-full bg-slate-800/80 shadow-inner" />
        </div>

        {/* 6. THE MINIMALIST KOKARDE ID BADGE CARD */}
        <div
          className={`relative z-10 -mt-1 flex h-105 w-[295px] flex-col items-center justify-between overflow-hidden rounded-2xl border bg-linear-to-b from-[#0F172A] to-[#0A0D1A] p-6 text-white backdrop-blur-xl transition-all duration-200 ${
            isDragging
              ? 'scale-103 border-indigo-light/60 shadow-[0_28px_60px_rgba(37,99,235,0.35),0_20px_40px_rgba(0,0,0,0.5)]'
              : 'border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.45)] hover:border-white/30'
          }`}
        >
          {/* Subtle top glare sheen */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-linear-to-b from-white/10 to-transparent z-10" />

          {/* Top School Header */}
          <div className="relative z-20 flex w-full items-center justify-center border-b border-white/10 pb-3 text-center">
            <span className="font-heading text-[0.9rem] font-black uppercase tracking-wider text-white">
              SMK BAGIMU NEGERIKU
            </span>
          </div>

          {/* Center: Clean Portrait & Name */}
          <div className="relative z-20 flex flex-col items-center text-center my-auto">
            <div className="relative mb-3.5 h-42 w-42 overflow-hidden rounded-full border-3 border-white/35 bg-[#161F38] shadow-2xl ring-4 ring-white/10">
              {!imageError ? (
                <img
                  src={vinesPhoto}
                  alt="Vines Fernando"
                  draggable="false"
                  className="h-full w-full object-cover filter contrast-105 scale-140 origin-[68%_28%]"
                  style={{ objectPosition: '68% 28%' }}
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-[#2563EB] to-[#1D4ED8] font-heading text-4xl font-black text-white">
                  VF
                </div>
              )}
            </div>

            {/* Nama: Vines Fernando */}
            <h3 className="font-heading text-[1.48rem] font-extrabold text-white tracking-tight leading-tight">
              Vines Fernando
            </h3>

            {/* Profesi: UI/UX Designer */}
            <p className="mt-1 text-[0.94rem] font-semibold tracking-wide text-[#60A5FA]">
              UI/UX Designer
            </p>
          </div>

          {/* Bottom: Clean Skill Badges */}
          <div className="relative z-20 flex w-full flex-wrap items-center justify-center gap-2 border-t border-white/10 pt-3.5">
            <span className="rounded-full bg-white/5 px-3 py-1 text-[0.74rem] font-medium text-slate-300 border border-white/10">
              Web &amp; Mobile
            </span>
            <span className="rounded-full bg-white/5 px-3 py-1 text-[0.74rem] font-medium text-slate-300 border border-white/10">
              Design System
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
