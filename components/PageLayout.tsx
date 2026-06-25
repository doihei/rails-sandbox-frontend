type Props = {
  children: React.ReactNode
}

export function PageLayout({ children }: Props) {
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '32px 16px' }}>
      {children}
    </main>
  )
}
