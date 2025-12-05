import { WeeklyTip } from '@/lib/constants/tips'
import { Lightbulb, Ruler, Weight } from 'lucide-react'

interface WeeklyTipCardProps {
    tip: WeeklyTip
}

export function WeeklyTipCard({ tip }: WeeklyTipCardProps) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 border-b border-pink-100">
                <div className="flex items-center gap-3 mb-2">
                    <span className="bg-white p-2 rounded-full shadow-sm text-xl">
                        👶
                    </span>
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg">Semana {tip.week}</h3>
                        <p className="text-sm text-slate-600 font-medium">Tamanho: {tip.babySize}</p>
                    </div>
                </div>

                <div className="flex gap-4 mt-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-white/60 px-2 py-1 rounded-md">
                        <Weight className="w-3.5 h-3.5 text-slate-400" />
                        <span>~{tip.babyWeight}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-white/60 px-2 py-1 rounded-md">
                        <Ruler className="w-3.5 h-3.5 text-slate-400" />
                        <span>~{tip.babyLength}</span>
                    </div>
                </div>
            </div>

            <div className="p-5">
                <p className="text-slate-700 mb-4 leading-relaxed">
                    {tip.description}
                </p>

                <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 flex gap-3 items-start">
                    <Lightbulb className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-bold text-yellow-800 mb-1">Dica da Semana</h4>
                        <p className="text-sm text-yellow-700 leading-snug">
                            {tip.tip}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
