'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { UserProfile, ExamInstance, ExamStatus } from '@/lib/types'
import { PRENATAL_EXAMS, CLINIC_NAME } from '@/lib/constants/exams'
import { calculateExamWindowStart, calculateExamWindowEnd, formatDate, isInIdealWindow, isWindowPassed } from '@/lib/utils/dateUtils'
import { openWhatsApp } from '@/lib/utils/whatsapp'
import { HeartPulse, LogOut, Calendar as CalendarIcon, CheckCircle2, MessageCircle, Paperclip } from 'lucide-react'
import { WEEKLY_TIPS } from '@/lib/constants/tips'
import { WeeklyTipCard } from '@/components/WeeklyTipCard'
import { ExamUploadModal } from '@/components/ExamUploadModal'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [timeline, setTimeline] = useState<ExamInstance[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [selectedExam, setSelectedExam] = useState<ExamInstance | null>(null)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    const supabase = createClient()

    const { data: { user: authUser } } = await supabase.auth.getUser()

    if (!authUser) {
      router.push('/login')
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single()

    if (!profile) {
      router.push('/login')
      return
    }

    setUser(profile)

    // Gerar cronograma
    const exams: ExamInstance[] = PRENATAL_EXAMS.map(exam => {
      const windowStart = calculateExamWindowStart(profile.last_menstrual_period, exam.start_week)
      const windowEnd = calculateExamWindowEnd(profile.last_menstrual_period, exam.end_week)

      let status: ExamStatus = ExamStatus.PENDING
      if (isInIdealWindow(profile.weeks_pregnant, exam.start_week, exam.end_week)) {
        status = ExamStatus.PENDING
      } else if (isWindowPassed(profile.weeks_pregnant, exam.end_week)) {
        status = ExamStatus.MISSED
      }

      return {
        ...exam,
        status,
        window_start_date: windowStart,
        window_end_date: windowEnd,
      }
    })

    // Buscar registros de exames
    const { data: records } = await supabase
      .from('exam_records')
      .select('*')
      .eq('user_id', authUser.id)

    // Atualizar status baseado nos registros
    if (records) {
      records.forEach(record => {
        const examIndex = exams.findIndex(e => e.id === record.exam_id)
        if (examIndex !== -1) {
          exams[examIndex].status = record.status as ExamStatus
          exams[examIndex].record_id = record.id
          if (record.scheduled_date) {
            exams[examIndex].scheduled_date = new Date(record.scheduled_date)
          }
          if (record.completed_date) {
            exams[examIndex].completed_date = new Date(record.completed_date)
          }
          if (record.file_path) {
            exams[examIndex].file_path = record.file_path
          }
        }
      })
    }

    setTimeline(exams)
    setIsLoading(false)
  }

  const handleMarkComplete = async (examId: string) => {
    const supabase = createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) return

    const exam = timeline.find(e => e.id === examId)
    if (!exam) return

    if (exam.record_id) {
      // Atualizar existente
      await supabase
        .from('exam_records')
        .update({
          status: ExamStatus.COMPLETED,
          completed_date: new Date().toISOString().split('T')[0]
        })
        .eq('id', exam.record_id)
    } else {
      // Criar novo
      await supabase.from('exam_records').insert({
        user_id: authUser.id,
        exam_id: examId,
        status: ExamStatus.COMPLETED,
        completed_date: new Date().toISOString().split('T')[0]
      })
    }

    loadUserData()
  }

  const handleSchedule = (examTitle: string) => {
    if (user) {
      openWhatsApp(user.name, examTitle)
    }
  }

  const handleOpenUpload = (exam: ExamInstance) => {
    setSelectedExam(exam)
    setUploadModalOpen(true)
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-slate-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const completedCount = timeline.filter(e => e.status === ExamStatus.COMPLETED).length
  const progressPercentage = Math.round((completedCount / timeline.length) * 100)

  // Pegar a dica da semana atual
  const currentTip = WEEKLY_TIPS[user.weeks_pregnant] || WEEKLY_TIPS[40] || WEEKLY_TIPS[4]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <HeartPulse className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Gest Ultrassom</h1>
              <p className="text-xs text-slate-500">{CLINIC_NAME}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Profile Card */}
        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-6 text-white shadow-xl mb-6">
          <h2 className="text-2xl font-bold mb-2">Olá, {user.name}! 👋</h2>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
              {user.weeks_pregnant}ª Semana
            </span>
            <span className="text-sm opacity-90">DPP: {formatDate(user.due_date)}</span>
          </div>

          {/* Progress */}
          <div>
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-medium uppercase opacity-80">Jornada de Exames</span>
              <span className="text-sm font-bold">{progressPercentage}%</span>
            </div>
            <div className="h-2.5 bg-black/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-1000"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-xs opacity-70 mt-2">
              {completedCount} de {timeline.length} realizados
            </p>
          </div>
        </div>

        {/* Dica da Semana */}
        {currentTip && <WeeklyTipCard tip={currentTip} />}

        {/* Timeline */}
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-4">Seu Cronograma</h3>
          <div className="space-y-4">
            {timeline.map((exam) => (
              <ExamCard
                key={exam.id}
                exam={exam}
                onMarkComplete={handleMarkComplete}
                onSchedule={handleSchedule}
                onUpload={handleOpenUpload}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Upload Modal */}
      {selectedExam && (
        <ExamUploadModal
          isOpen={uploadModalOpen}
          onClose={() => {
            setUploadModalOpen(false)
            setSelectedExam(null)
          }}
          examId={selectedExam.id}
          examTitle={selectedExam.title}
          onUploadComplete={() => {
            loadUserData()
          }}
        />
      )}
    </div>
  )
}

interface ExamCardProps {
  exam: ExamInstance
  onMarkComplete: (examId: string) => void
  onSchedule: (examTitle: string) => void
  onUpload: (exam: ExamInstance) => void
}

function ExamCard({ exam, onMarkComplete, onSchedule, onUpload }: ExamCardProps) {
  const statusColors = {
    [ExamStatus.COMPLETED]: 'bg-green-50 border-green-200',
    [ExamStatus.SCHEDULED]: 'bg-blue-50 border-blue-200',
    [ExamStatus.PENDING]: 'bg-orange-50 border-orange-200',
    [ExamStatus.MISSED]: 'bg-red-50 border-red-200',
  }

  const statusLabels = {
    [ExamStatus.COMPLETED]: 'Realizado',
    [ExamStatus.SCHEDULED]: 'Agendado',
    [ExamStatus.PENDING]: 'Pendente',
    [ExamStatus.MISSED]: 'Janela Perdida',
  }

  return (
    <div className={`rounded-xl p-5 border ${statusColors[exam.status]} transition`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-bold text-slate-800 text-lg">{exam.title}</h4>
          <p className="text-sm text-slate-600 mt-1">{exam.description}</p>
        </div>
        <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-slate-700 whitespace-nowrap">
          {statusLabels[exam.status]}
        </span>
      </div>

      <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
        <CalendarIcon className="w-4 h-4" />
        <span>
          {exam.start_week}-{exam.end_week} semanas ({formatDate(exam.window_start_date)} - {formatDate(exam.window_end_date)})
        </span>
      </div>

      {exam.preparation && (
        <p className="text-xs text-slate-500 mb-4 bg-white/60 p-3 rounded-lg">
          <strong>Preparo:</strong> {exam.preparation}
        </p>
      )}

      {/* File Indicator */}
      {exam.file_path && (
        <div className="mb-3 flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg">
          <Paperclip className="w-4 h-4" />
          <span className="font-medium">Documento anexado</span>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {exam.status !== ExamStatus.COMPLETED && (
          <button
            onClick={() => onSchedule(exam.title)}
            className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white py-2.5 rounded-lg font-medium hover:bg-green-600 transition"
          >
            <MessageCircle className="w-4 h-4" />
            Agendar via WhatsApp
          </button>
        )}

        <button
          onClick={() => onUpload(exam)}
          className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-600 transition"
        >
          <Paperclip className="w-4 h-4" />
          {exam.file_path ? 'Trocar' : 'Anexar'}
        </button>

        <button
          onClick={() => onMarkComplete(exam.id)}
          disabled={exam.status === ExamStatus.COMPLETED}
          className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-lg font-medium hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CheckCircle2 className="w-4 h-4" />
          {exam.status === ExamStatus.COMPLETED ? 'Concluído' : 'Marcar como feito'}
        </button>
      </div>
    </div>
  )
}
