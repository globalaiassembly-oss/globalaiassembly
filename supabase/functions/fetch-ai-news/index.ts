import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const apiKey = Deno.env.get('GNEWS_API_KEY')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const url = `https://gnews.io/api/v4/search?q=artificial+intelligence&lang=en&sortby=publishedAt&max=12&apikey=${apiKey}`
    const res = await fetch(url)
    const data = await res.json()

    if (!data.articles || data.articles.length === 0) {
      return new Response(JSON.stringify({ error: 'No articles', detail: data }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    let inserted = 0
    for (const a of data.articles) {
      const { error } = await supabase.from('ai_news').upsert({
        title: a.title,
        summary: a.description,
        topics: ['AI'],
        source_url: a.url,
        published_at: a.publishedAt
      }, { onConflict: 'source_url' })
      if (!error) inserted++
    }

    return new Response(JSON.stringify({ inserted, total: data.articles.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})