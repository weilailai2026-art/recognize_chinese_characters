import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hbojueszbpyeyaqssplt.supabase.co'
const supabaseKey = 'sb_publishable_VaJiUD-gBChAai5DgJAzOg_Zih7Q2Pu'

export const supabase = createClient(supabaseUrl, supabaseKey)
