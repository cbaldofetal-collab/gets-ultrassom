'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, Upload, Camera, FileText, Loader2 } from 'lucide-react'

interface ExamUploadModalProps {
    isOpen: boolean
    onClose: () => void
    examId: string
    examTitle: string
    onUploadComplete: () => void
}

export function ExamUploadModal({ isOpen, onClose, examId, examTitle, onUploadComplete }: ExamUploadModalProps) {
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    if (!isOpen) return null

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        const supabase = createClient()

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Usuário não autenticado')

            // 1. Upload do arquivo para o Storage
            const fileExt = file.name.split('.').pop()
            const fileName = `${user.id}/${examId}_${Date.now()}.${fileExt}`

            const { error: uploadError } = await supabase.storage
                .from('exams')
                .upload(fileName, file)

            if (uploadError) throw uploadError

            // 2. Salvar referência no banco de dados (exam_records)
            // Primeiro verificamos se já existe um registro para este exame
            const { data: existingRecord } = await supabase
                .from('exam_records')
                .select('id')
                .eq('user_id', user.id)
                .eq('exam_id', examId)
                .single()

            if (existingRecord) {
                // Atualiza registro existente com o caminho do arquivo
                await supabase
                    .from('exam_records')
                    .update({
                        file_path: fileName,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', existingRecord.id)
            } else {
                // Cria novo registro
                await supabase
                    .from('exam_records')
                    .insert({
                        user_id: user.id,
                        exam_id: examId,
                        status: 'PENDING', // Mantém pendente até marcar como feito
                        file_path: fileName
                    })
            }

            onUploadComplete()
            onClose()
        } catch (error) {
            console.error('Erro no upload:', error)
            alert('Erro ao enviar arquivo. Tente novamente.')
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Anexar Documento</h3>
                        <p className="text-sm text-slate-500">{examTitle}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="w-full flex items-center justify-center gap-3 bg-slate-50 border-2 border-dashed border-slate-200 hover:border-primary/50 hover:bg-primary/5 text-slate-600 py-8 rounded-xl transition group disabled:opacity-50"
                    >
                        {isUploading ? (
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        ) : (
                            <>
                                <div className="bg-white p-3 rounded-full shadow-sm group-hover:scale-110 transition">
                                    <Upload className="w-6 h-6 text-primary" />
                                </div>
                                <span className="font-medium">Toque para enviar foto</span>
                            </>
                        )}
                    </button>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept="image/*,application/pdf"
                        className="hidden"
                    />

                    <p className="text-xs text-center text-slate-400">
                        Aceita fotos (JPG, PNG) e PDF
                    </p>
                </div>
            </div>
        </div>
    )
}
