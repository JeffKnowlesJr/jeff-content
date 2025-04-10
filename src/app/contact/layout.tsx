import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact | Jeff Knowles Jr.',
  description:
    'Get in touch with Jeff Knowles Jr. for collaboration opportunities, consulting, or just to say hello.'
}

export default function ContactLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
