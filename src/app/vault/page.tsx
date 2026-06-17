import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AppNav from '@/components/AppNav'
import { getNotes } from '@/lib/data/vault'
import VaultClient from './VaultClient'

export default async function VaultPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const notes = await getNotes(user.id)

  return (
    <div style={{ background: 'var(--paper)' }}>
      <AppNav activePath="/vault" />
      <VaultClient initialNotes={notes} />
    </div>
  )
}
