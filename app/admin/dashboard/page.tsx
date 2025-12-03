'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import {
    Users,
    Calendar,
    FileText,
    LogOut,
    Search,
    ChevronRight,
    Eye
} from 'lucide-react'

export default function AdminDashboard() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [adminName, setAdminName] = useState('')

    useEffect(() => {
        checkAdmin()
    }, [])

    const checkAdmin = async () => {
        const supabase = createClient()

        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            router.push('/admin/login')
            return
        }

        const { data: adminData, error } = await supabase
            .from('admin_users')
            .select('name')
            .eq('id', user.id)
            .single()

        if (error || !adminData) {
            await supabase.auth.signOut()
            router.push('/admin/login')
            return
        }

        setAdminName(adminData.name)
        setIsLoading(false)
    }

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/admin/login')
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-100">
            {/* Top Bar */}
            <header className="bg-slate-900 text-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-500 p-1.5 rounded-lg">
                            <Users className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-lg">Gest Admin</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-slate-300 text-sm">Olá, {adminName}</span>
                        <button
                            onClick={handleLogout}
                            className="p-2 hover:bg-slate-800 rounded-full transition text-slate-400 hover:text-white"
                            title="Sair"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-slate-500 text-sm font-medium">Total de Pacientes</h3>
                            <Users className="w-5 h-5 text-blue-500" />
                        </div>
                        <p className="text-3xl font-bold text-slate-800">0</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-slate-500 text-sm font-medium">Exames Realizados</h3>
                            <Calendar className="w-5 h-5 text-green-500" />
                        </div>
                        <p className="text-3xl font-bold text-slate-800">0</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-slate-500 text-sm font-medium">Documentos Anexados</h3>
                            <FileText className="w-5 h-5 text-orange-500" />
                        </div>
                        <p className="text-3xl font-bold text-slate-800">0</p>
                    </div>
                </div>

                {/* Recent Patients Table */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h2 className="text-lg font-bold text-slate-800">Pacientes Recentes</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Buscar paciente..."
                                className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50 text-slate-700 font-medium border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4">Nome</th>
                                    <th className="px-6 py-4">Idade Gestacional</th>
                                    <th className="px-6 py-4">DUM</th>
                                    <th className="px-6 py-4">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <tr>
                                    <td className="px-6 py-8 text-center text-slate-400" colSpan={4}>
                                        Carregando dados...
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    )
}
