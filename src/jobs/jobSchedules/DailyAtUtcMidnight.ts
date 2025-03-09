import cron, { ScheduledTask } from 'node-cron'
import Logger from '../../internal/Logger.js'
import DailySummaryTask from '../jobTasks/DailySummaryTask.js'

export default function DailyAtUtcMidnight(): ScheduledTask {
  return cron.schedule('0 0 * * *', async () => {
    try {
      await DailySummaryTask()
    } catch (error) {
      Logger().exception(`[DailySummaryJob] ${JSON.stringify(error)}`)
    }
  }, { scheduled: true, timezone: 'UTC' })
}