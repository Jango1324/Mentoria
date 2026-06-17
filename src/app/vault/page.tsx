import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AppNav from '@/components/AppNav'
import { getNotes, getNoteLinks } from '@/lib/data/vault'
import VaultClient from './VaultClient'

export default async function VaultPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [notes, links] = await Promise.all([
    getNotes(user.id),
    getNoteLinks(user.id),
  ])

  return (
    <div style={{ background: 'var(--paper)' }}>
      <AppNav activePath="/vault" />
      <VaultClient initialNotes={notes} initialLinks={links} />
    </div>
  )
}
