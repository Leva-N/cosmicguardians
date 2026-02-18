declare module 'next' {
  export interface Metadata {
    title?: string | { default: string; template?: string }
    description?: string
    [key: string]: unknown
  }
  export interface Viewport {
    width?: string
    initialScale?: number
    maximumScale?: number
    [key: string]: unknown
  }
}

declare module 'next/link' {
  import type { ComponentProps } from 'react'
  const Link: React.ForwardRefExoticComponent<
    Omit<ComponentProps<'a'>, 'href'> & {
      href: string | { pathname: string; query?: Record<string, string> }
      prefetch?: boolean
      replace?: boolean
      scroll?: boolean
      shallow?: boolean
      locale?: string | false
    }
  >
  export default Link
}

declare module 'next/image' {
  import type { ImgHTMLAttributes, ComponentType } from 'react'
  interface StaticImageData {
    src: string
    height: number
    width: number
    blurDataURL?: string
  }
  interface ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
    src: string | StaticImageData
    alt: string
    width?: number
    height?: number
    fill?: boolean
    sizes?: string
    priority?: boolean
  }
  const Image: ComponentType<ImageProps>
  export default Image
}

declare module 'next/dynamic' {
  import type { ComponentType, ReactNode } from 'react'
  type DynamicOptions = { ssr?: boolean; loading?: () => ReactNode }
  const dynamic: <P = object>(
    loader: () => Promise<{ default: ComponentType<P> } | ComponentType<P>>,
    options?: DynamicOptions
  ) => ComponentType<P>
  export default dynamic
}

declare module 'next/navigation' {
  export function notFound(): never
  export function redirect(url: string): never
  export function useRouter(): {
    push: (url: string) => void
    replace: (url: string) => void
    back: () => void
    prefetch: (url: string) => void
    refresh: () => void
  }
  export function usePathname(): string
  export function useSearchParams(): URLSearchParams
}
