/**
 * Creates a custom map marker icon using canvas
 * Pure function for marker icon generation
 */

import type { MarkerIconOptions } from "../types/employeeMap"

// Border colors based on online/offline status (from Figma design)
export const BORDER_COLORS = {
  online: '#27A727',   // Green
  offline: '#980000'   // Dark red
} as const


const DEFAULT_OPTIONS: Required<MarkerIconOptions> = {
  size: 64,
  avatarRadius: 26,
  pinColor: '#1A2951',
  pinRadius: 6,
  borderWidth: 2
}

/**
 * Create a custom marker icon with avatar
 * @param avatarImg - The avatar image to display (optional)
 * @param isOnline - Whether the employee is online (affects border color)
 * @param options - Customization options
 * @returns Base64 data URL of the marker icon
 */
export function createMarkerIcon(
  avatarImg?: HTMLImageElement,
  isOnline: boolean = true,
  options: MarkerIconOptions = {}
): string {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  const borderColor = isOnline ? BORDER_COLORS.online : BORDER_COLORS.offline
  
  const canvas = document.createElement('canvas')
  canvas.width = opts.size
  canvas.height = opts.size + 12 // Extra space for pin
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''

  const centerX = opts.size / 2
  const avatarY = opts.avatarRadius + 2

  // Draw shadow under avatar
  ctx.fillStyle = 'rgba(13, 13, 18, 0.1)'
  ctx.beginPath()
  ctx.ellipse(centerX, avatarY + opts.avatarRadius + 4, 18, 5, 0, 0, 2 * Math.PI)
  ctx.fill()

  // Draw colored border circle (outer) - green for online, red for offline
  ctx.beginPath()
  ctx.arc(centerX, avatarY, opts.avatarRadius, 0, 2 * Math.PI)
  ctx.fillStyle = borderColor
  ctx.fill()

  // Draw white inner circle (background for avatar)
  ctx.beginPath()
  ctx.arc(centerX, avatarY, opts.avatarRadius - opts.borderWidth, 0, 2 * Math.PI)
  ctx.fillStyle = 'white'
  ctx.fill()

  // Add shadow to avatar circle
  ctx.shadowColor = 'rgba(13, 13, 18, 0.1)'
  ctx.shadowBlur = 8
  ctx.shadowOffsetY = 5

  // Draw avatar image (clipped to circle)
  const avatarInnerRadius = opts.avatarRadius - opts.borderWidth - 1
  if (avatarImg) {
    ctx.save()
    ctx.beginPath()
    ctx.arc(centerX, avatarY, avatarInnerRadius, 0, 2 * Math.PI)
    ctx.clip()
    ctx.drawImage(
      avatarImg,
      centerX - avatarInnerRadius,
      avatarY - avatarInnerRadius,
      avatarInnerRadius * 2,
      avatarInnerRadius * 2
    )
    ctx.restore()
  } else {
    // Fallback: draw colored background with placeholder
    ctx.beginPath()
    ctx.arc(centerX, avatarY, avatarInnerRadius, 0, 2 * Math.PI)
    ctx.fillStyle = '#E5E7EB'
    ctx.fill()
    ctx.fillStyle = '#6B7280'
    ctx.font = 'bold 16px Tajawal, Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('👤', centerX, avatarY)
  }

  // Reset shadow
  ctx.shadowColor = 'transparent'
  ctx.shadowBlur = 0
  ctx.shadowOffsetY = 0

  // Draw pin as a simple circle below avatar
  const pinY = avatarY + opts.avatarRadius + 12
  ctx.beginPath()
  ctx.arc(centerX, pinY, opts.pinRadius, 0, 2 * Math.PI)
  ctx.fillStyle = opts.pinColor
  ctx.fill()

  return canvas.toDataURL()
}

/**
 * Get marker size for Google Maps
 */
export function getMarkerSize(options: MarkerIconOptions = {}): { width: number; height: number } {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  return {
    width: opts.size - 8, // Slightly smaller for display
    height: opts.size + 6
  }
}

/**
 * Get marker anchor point for Google Maps
 */
export function getMarkerAnchor(options: MarkerIconOptions = {}): { x: number; y: number } {
  const size = getMarkerSize(options)
  return {
    x: size.width / 2,
    y: size.height
  }
}
