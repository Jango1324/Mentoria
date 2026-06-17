export type UserRole = 'student' | 'admin'

export type DNAType = 'Explorer' | 'Builder' | 'Competitor' | 'Researcher' | 'Strategist' | 'Creator'

export interface LearningDNA {
  id: string
  user_id: string
  dna_type: DNAType
  dna_score_breakdown: Record<DNAType, number>
  completed_at: string
  created_at: string
}

export interface Profile {
  id: string
  full_name: string | null
  grade: number | null
  country: string | null
  interests: string[]
  avatar_url: string | null
  role: UserRole
  onboarded: boolean
  created_at: string
}

export interface Opportunity {
  id: string
  title: string
  description: string | null
  category: string
  tags: string[]
  deadline: string | null
  url: string | null
  is_active: boolean
  created_at: string
}

export interface SavedOpportunity {
  id: string
  user_id: string
  opportunity_id: string
  created_at: string
}

export interface Course {
  id: string
  title: string
  description: string | null
  category: string
  thumbnail_url: string | null
  is_published: boolean
  created_at: string
}

export interface Lesson {
  id: string
  course_id: string
  title: string
  content_url: string | null
  order_index: number
  created_at: string
}

export interface LessonProgress {
  id: string
  user_id: string
  lesson_id: string
  completed: boolean
  completed_at: string | null
  created_at: string
}

export interface SavedOpportunityWithDetails extends SavedOpportunity {
  opportunity: Opportunity
}

export interface LessonProgressWithLesson extends LessonProgress {
  lesson: Lesson
}

export interface CourseWithProgress extends Course {
  lessons: Lesson[]
  completed_count: number
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Partial<Profile> & { id: string }
        Update: Partial<Profile>
      }
      opportunities: {
        Row: Opportunity
        Insert: Omit<Opportunity, 'id' | 'created_at'>
        Update: Partial<Omit<Opportunity, 'id' | 'created_at'>>
      }
      saved_opportunities: {
        Row: SavedOpportunity
        Insert: Omit<SavedOpportunity, 'id' | 'created_at'>
        Update: never
      }
      courses: {
        Row: Course
        Insert: Omit<Course, 'id' | 'created_at'>
        Update: Partial<Omit<Course, 'id' | 'created_at'>>
      }
      lessons: {
        Row: Lesson
        Insert: Omit<Lesson, 'id' | 'created_at'>
        Update: Partial<Omit<Lesson, 'id' | 'created_at'>>
      }
      lesson_progress: {
        Row: LessonProgress
        Insert: Omit<LessonProgress, 'id' | 'created_at'>
        Update: Partial<Omit<LessonProgress, 'id' | 'created_at'>>
      }
      learning_dna: {
        Row: LearningDNA
        Insert: Omit<LearningDNA, 'id' | 'created_at'>
        Update: Partial<Omit<LearningDNA, 'id' | 'user_id' | 'created_at'>>
      }
    }
  }
}
