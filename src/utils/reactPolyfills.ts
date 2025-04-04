// React 18 Polyfills and Shims
import { useEffect, useLayoutEffect } from 'react'

// useLayoutEffect SSR warning fix
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

// Safe window object access
export const isBrowser = typeof window !== 'undefined'

export const getWindow = (): Window | undefined =>
  isBrowser ? window : undefined

export const getDocument = (): Document | undefined =>
  isBrowser ? document : undefined

// Safe localStorage access
export const getLocalStorage = (): Storage | undefined => {
  if (!isBrowser) return undefined
  try {
    return window.localStorage
  } catch (e) {
    console.warn('localStorage is not available:', e)
    return undefined
  }
}

// Safe sessionStorage access
export const getSessionStorage = (): Storage | undefined => {
  if (!isBrowser) return undefined
  try {
    return window.sessionStorage
  } catch (e) {
    console.warn('sessionStorage is not available:', e)
    return undefined
  }
}

// Safe matchMedia access
export const getMatchMedia = (query: string): MediaQueryList | undefined => {
  if (!isBrowser) return undefined
  try {
    return window.matchMedia(query)
  } catch (e) {
    console.warn('matchMedia is not available:', e)
    return undefined
  }
}

// Safe requestAnimationFrame access
export const safeRequestAnimationFrame = (
  callback: FrameRequestCallback
): number => {
  if (!isBrowser) return 0
  return window.requestAnimationFrame(callback)
}

// Safe cancelAnimationFrame access
export const safeCancelAnimationFrame = (handle: number): void => {
  if (!isBrowser) return
  window.cancelAnimationFrame(handle)
}
