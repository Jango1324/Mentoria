'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Profile } from '@/types'

export interface OnboardingData {
  full_name: string
  grade: number
  country: string
  interests: string[]
}

export async function saveOnboarding(data: OnboardingData) {
  const supabase = (await createClient()) as any

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: 'Not authenticated. Please sign in again.' }
  }

 const profileUpdate: Partial<Profile> = {
  full_name: data.full_name,
  grade: data.grade,
  country: data.country,
  interests: data.interests,
  onboarded: true,
}

const { error } = await supabase
  .from('profiles')
  .update(profileUpdate)
  .eq('id', user.id)

  if (error) return { error: error.message }

  redirect('/dashboard')
}
