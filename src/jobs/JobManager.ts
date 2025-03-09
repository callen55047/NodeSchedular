import DailyAtUtcMidnight from './jobSchedules/DailyAtUtcMidnight.js'
import { ScheduledTask } from 'node-cron'

/*
* Cron Job Manager
* This class manages our recurring jobs.
* One example below would be a daily summary of client requests sent to artists
 */
export default class JobManager {
  dailySummary: ScheduledTask | null = null

  initializeJobs() {
    this.dailySummary = DailyAtUtcMidnight()
  }

  cleanup() {
    this.dailySummary?.stop()
  }

}