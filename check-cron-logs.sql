-- Check recent cron job executions
SELECT 
  jobid,
  runid,
  status,
  return_message,
  start_time,
  end_time
FROM cron.job_run_details 
WHERE jobid = 4
ORDER BY start_time DESC 
LIMIT 10;
