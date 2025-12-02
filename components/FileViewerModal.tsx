'use client'

import { X, FileText, Image as ImageIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface FileViewerModalProps {
    isOpen: boolean
    onClose: () => void
    filePath: string
    fileName: string
}

export function FileViewerModal({ isOpen, onClose, filePath, fileName }: FileViewerModalProps) {
    const [fileUrl, setFileUrl] = useState<string>('')
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!isOpen || !filePath) return

        const loadFile = async () => {
            setIsLoading(true)
            setError('')
            const supabase = createClient()

            try {
                // Gerar URL pública temporária (válida por 1 hora)
                const { data, error } = await supabase.storage
                    .from('exams')
                    .createSignedUrl(filePath, 3600)

                if (error) throw error
                if (!data?.signedUrl) throw new Error('URL não gerada')

                setFileUrl(data.signedUrl)
            } catch (err: any) {
                console.error('Erro ao carregar arquivo:', err)
                setError('Não foi possível carregar o arquivo')
            } finally {
                setIsLoading(false)
            }
        }

        loadFile()
    }, [isOpen, filePath])

    if (!isOpen) return null

    const isPDF = filePath?.toLowerCase().endsWith('.pdf')

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                        {isPDF ? (
                            <FileText className="w-6 h-6 text-red-500" />
                        ) : (
                            <ImageIcon className="w-6 h-6 text-blue-500" />
                        )}
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Documento do Exame</h3>
                            <p className="text-sm text-slate-500">{fileName}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto bg-slate-50 flex items-center justify-center p-4">
                    {isLoading && (
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                            <p className="text-slate-600">Carregando documento...</p>
                        </div>
                    )}

                    {error && (
                        <div className="text-center">
                            <div className="bg-red-50 text-red-700 px-6 py-4 rounded-lg">
                                <p className="font-medium">{error}</p>
                            </div>
                        </div>
                    )}

                    {!isLoading && !error && fileUrl && (
                        <>
                            {isPDF ? (
                                <iframe
                                    src={fileUrl}
                                    className="w-full h-full min-h-[600px] rounded-lg border border-slate-200"
                                    title="Documento PDF"
                                />
                            ) : (
                                <img
                                    src={fileUrl}
                                    alt="Documento do exame"
                                    className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                                />
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-200 bg-white flex justify-end gap-3">
                    {!isLoading && !error && fileUrl && (
                        <a
                            href={fileUrl}
                            download={fileName}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition"
                        >
                            Baixar Documento
                        </a>
                    )}
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    )
}
