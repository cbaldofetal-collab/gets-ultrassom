export interface UserProfile {
    id: string
    name: string
    email: string
    last_menstrual_period: string // ISO date
    due_date: string // ISO date (calculated)
    weeks_pregnant: number
    phone?: string
    created_at: string
    updated_at: string
}

export interface ExamDefinition {
    id: string
    title: string
    description: string
    start_week: number
    end_week: number
    preparation?: string
    info_params?: string
    order: number
}

export interface ExamRecord {
    id: string
    user_id: string
    exam_id: string
    status: ExamStatus
    scheduled_date?: string // ISO date
    completed_date?: string // ISO date
    notes?: string
    created_at: string
    updated_at: string
}

export enum ExamStatus {
    PENDING = 'pending',
    SCHEDULED = 'scheduled',
    COMPLETED = 'completed',
    MISSED = 'missed',
}

export interface ExamInstance extends ExamDefinition {
    status: ExamStatus
    window_start_date: Date
    window_end_date: Date
    scheduled_date?: Date
    completed_date?: Date
    record_id?: string
    file_path?: string // Caminho no Storage
    file_url?: string // URL pública para visualização
}
