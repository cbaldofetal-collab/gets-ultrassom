'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function ResetPasswordPage() {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')
        setSuccess(false)

        const supabase = createClient()

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/atualizar-senha`,
            })

            if (error) throw error

            setSuccess(true)
        } catch (err: any) {
            setError(err.message || 'Erro ao enviar email de recuperação')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Link href="/login" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 mb-6 transition">
                    <ArrowLeft className="w-4 h-4" />
                    Voltar para Login
                </Link>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-slate-800">Recuperar Senha</h1>
                        <p className="text-slate-500 mt-2">
                            Digite seu email para receber o link de redefinição
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    {success ? (
                        <div className="text-center py-4">
                            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-2">Email Enviado!</h3>
                            <p className="text-slate-600 mb-6">
                                Verifique sua caixa de entrada (e spam) para redefinir sua senha.
                            </p>
                            <Link
                                href="/login"
                                className="block w-full bg-slate-100 text-slate-700 py-3 rounded-lg font-semibold hover:bg-slate-200 transition"
                            >
                                Voltar para Login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                                        placeholder="seu@email.com"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                            >
                                {isLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
