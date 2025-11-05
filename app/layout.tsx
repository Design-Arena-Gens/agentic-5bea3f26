import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Construtor de Prompts Complexos',
  description: 'Assistente interativo e dinâmico para construção de prompts robustos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
