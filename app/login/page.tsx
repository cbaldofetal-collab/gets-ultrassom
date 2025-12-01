'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, Mail, Lock, Calendar, User } from 'lucide-react'
import Link from 'next/link'
import { calculateDPP, calculateWeeksPregnant } from '@/lib/utils/dateUtils'

export default function LoginPage() {
    const router = useRouter()
    const [isSignUp, setIsSignUp] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        lmp: '', // last menstrual period
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        const supabase = createClient()

        try {
            if (isSignUp) {
                // Cadastro
                const { data: authData, error: signUpError } = await supabase.auth.signUp({
                    email: formData.email,
                    password: formData.password,
                })

                if (signUpError) throw signUpError
                if (!authData.user) throw new Error('Erro ao criar usuário')

                // Calcular DPP e semanas
                const lmpDate = new Date(formData.lmp)
                const dueDate = calculateDPP(lmpDate)
                const weeksPregnant = calculateWeeksPregnant(lmpDate)

                // Criar perfil
                const { error: profileError } = await supabase.from('profiles').insert({
                    id: authData.user.id,
                    name: formData.name,
                    email: formData.email,
                    last_menstrual_period: formData.lmp,
                    due_date: dueDate.toISOString().split('T')[0],
                    weeks_pregnant: weeksPregnant,
                })

                if (profileError) throw profileError

                router.push('/dashboard')
            } else {
                // Login
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email: formData.email,
                    password: formData.password,
                })

                if (signInError) throw signInError

                router.push('/dashboard')
            }
        } catch (err: any) {
            setError(err.message || 'Erro ao processar requisição')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 mb-6 transition">
                    <ArrowLeft className="w-4 h-4" />
                    Voltar
                </Link>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-slate-800">{isSignUp ? 'Criar Conta' : 'Entrar'}</h1>
                        <p className="text-slate-500 mt-2">
                            {isSignUp ? 'Comece a organizar sua gestação' : 'Acesse sua conta'}
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {isSignUp && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Nome Completo</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                                            placeholder="Maria Silva"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Data da Última Menstruação (DUM)
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="date"
                                            value={formData.lmp}
                                            onChange={(e) => setFormData({ ...formData, lmp: e.target.value })}
                                            required
                                            max={new Date().toISOString().split('T')[0]}
                                            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">Usaremos para calcular seu cronograma</p>
                                </div>
                            </>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                                    placeholder="seu@email.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Senha</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    minLength={6}
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {!isSignUp && (
                            <div className="flex justify-end">
                                <Link
                                    href="/recuperar-senha"
                                    className="text-sm text-primary hover:text-primary/80 transition font-medium"
                                >
                                    Esqueci minha senha
                                </Link>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        >
                            {isLoading ? 'Processando...' : isSignUp ? 'Criar Conta' : 'Entrar'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-slate-600">
                        {isSignUp ? 'Já tem uma conta?' : 'Não tem uma conta?'}{' '}
                        <button
                            onClick={() => {
                                setIsSignUp(!isSignUp)
                                setError('')
                            }}
                            className="text-primary font-medium hover:text-primary/80 transition"
                        >
                            {isSignUp ? 'Entrar' : 'Criar conta'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
