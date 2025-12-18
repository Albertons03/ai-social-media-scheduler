-- Enable pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the Edge Function to run every 5 minutes
SELECT cron.schedule(
  'publish-scheduled-posts-job',
  '*/5 * * * *',
  $$
  SELECT
    net.http_post(
      url := 'https://zthibjgjsuyovieipddd.supabase.co/functions/v1/publish-scheduled-posts',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer sb_publishable_1z3BFJskSeBF8EfbXfHo1Q_8lPu5Qj6"}'::jsonb,
      body := '{}'::jsonb
    ) AS request_id;
  $$
);

-- Verify the cron job was created
SELECT * FROM cron.job WHERE jobname = 'publish-scheduled-posts-job';
