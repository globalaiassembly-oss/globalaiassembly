import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Calendar, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';

type NewsItem = {
  id: string;
  title: string;
  summary: string | null;
  topics: string[] | null;
  source_url: string | null;
  published_at: string | null;
};

const AIBriefingsSection = () => {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('ai_news').select('*').order('published_at', { ascending: false }).limit(12).then(({ data }) => {
      setItems(data || []);
      setLoading(false);
    });
  }, []);

  return (
    <section id='briefings' className='section-padding bg-background'>
      <div className='container mx-auto max-w-6xl'>
        <p className='text-sm font-semibold uppercase tracking-widest text-primary mb-4 text-center'>Stay Informed</p>
        <h2 className='text-3xl md:text-5xl font-heading font-bold text-foreground mb-6 text-center'>Latest AI Briefings</h2>
        <p className='text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-16'>Curated civic AI intelligence — updated continuously.</p>
        {loading && <div className='flex justify-center'><Loader2 className='w-8 h-8 animate-spin text-primary' /></div>}
        {!loading && items.length === 0 && <p className='text-center text-muted-foreground'>No briefings yet.</p>}
        {!loading && items.length > 0 && (
          <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {items.map((item, i) => (
              <motion.a key={item.id} href={item.source_url || '#'} target='_blank' rel='noopener noreferrer' initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.05}} className='glass-card p-6 flex flex-col hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 transition-all cursor-pointer group'>
                <div className='flex flex-wrap gap-1 mb-3'>{(item.topics || []).map(t => <Badge key={t} variant='secondary' className='text-xs'>{t}</Badge>)}</div>
                <h3 className='font-heading font-semibold text-lg mb-2 group-hover:text-primary transition-colors'>{item.title}</h3>
                <p className='text-sm text-muted-foreground line-clamp-3 flex-1 mb-4'>{item.summary}</p>
                <div className='flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border'>
                  <span className='flex items-center gap-1'><Calendar className='w-3 h-3' />{item.published_at ? new Date(item.published_at).toLocaleDateString() : ''}</span>
                  <span className='flex items-center gap-1 group-hover:text-primary'>Read<ExternalLink className='w-3 h-3' /></span>
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AIBriefingsSection;
