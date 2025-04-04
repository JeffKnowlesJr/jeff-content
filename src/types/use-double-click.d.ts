declare module 'use-double-click' {
  export interface UseDoubleClickOptions {
    latency?: number
    onSingleClick?: (e: MouseEvent) => void
    onDoubleClick?: (e: MouseEvent) => void
  }

  export default function useDoubleClick(
    ref: React.RefObject<HTMLElement>,
    options?: UseDoubleClickOptions
  ): void
}
