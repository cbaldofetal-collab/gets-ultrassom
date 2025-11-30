import Link from 'next/link'
import { HeartPulse, Calendar, Shield, Clock } from 'lucide-react'
import { CLINIC_NAME } from '@/lib/constants/exams'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-6xl">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <HeartPulse className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Gest Ultrassom</h1>
              <p className="text-xs text-slate-500">{CLINIC_NAME}</p>
            </div>
          </div>
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 transition"
          >
            Entrar
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center space-y-6">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-800 leading-tight">
                Sua gestação,{' '}
                <span className="text-primary">organizada</span> e{' '}
                <span className="text-secondary">tranquila</span>.
              </h2>
              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Agendamento inteligente de ultrassons com calendário personalizado, lembretes automáticos e WhatsApp integrado.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition shadow-lg hover:shadow-xl"
                >
                  Começar Agora
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition"
                >
                  Já tenho conta
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-white/60">
          <div className="container mx-auto px-4 max-w-6xl">
            <h3 className="text-3xl font-bold text-center mb-12 text-slate-800">
              Como funciona?
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Calendar className="w-8 h-8" />}
                title="Calendário Personalizado"
                description="Cronograma automático baseado na sua DUM com as 5 ultrassonografias essenciais."
                color="primary"
              />
              <FeatureCard
                icon={<Clock className="w-8 h-8" />}
                title="Lembretes Inteligentes"
                description="Notificações no momento certo para agendar cada exame na janela ideal."
                color="secondary"
              />
              <FeatureCard
                icon={<Shield className="w-8 h-8" />}
                title="WhatsApp Integrado"
                description="Agende direto com a clínica via WhatsApp com mensagem pré-formatada."
                color="accent"
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-8 px-4">
        <div className="container mx-auto text-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} {CLINIC_NAME}</p>
          <p className="mt-2">Cuidando de você e do seu bebê 💕</p>
        </div>
      </footer>
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  color: 'primary' | 'secondary' | 'accent'
}

function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
  const colorClasses = {
    primary: 'text-primary bg-primary/10',
    secondary: 'text-secondary bg-secondary/10',
    accent: 'text-accent bg-accent/10',
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-100 hover:shadow-lg transition">
      <div className={`inline-flex p-3 rounded-lg ${colorClasses[color]} mb-4`}>
        {icon}
      </div>
      <h4 className="font-bold text-xl mb-2 text-slate-800">{title}</h4>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  )
}
