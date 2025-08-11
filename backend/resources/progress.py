# resources/progress.py
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime, timedelta
from models import db, Task, Habit, HabitCheckin

class Progress(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        today = datetime.utcnow().date()

        # === Task statistics ===
        completed = Task.query.filter_by(user_id=user_id, status="complete").count()
        pending = Task.query.filter_by(user_id=user_id, status="pending").count()
        overdue = Task.query.filter(
            Task.user_id == user_id,
            Task.status == "pending",
            Task.due_date < datetime.utcnow()
        ).count()

        def task_trend(days):
            trend = []
            for i in range(days):
                day = today - timedelta(days=days - i - 1)
                count = Task.query.filter(
                    Task.user_id == user_id,
                    Task.status == "complete",
                    db.func.date(Task.due_date) == day
                ).count()
                trend.append({"date": day.isoformat(), "completed": count})
            return trend

        trend_last_7 = task_trend(7)
        trend_last_30 = task_trend(30)
        trend_last_90 = task_trend(90)

        # === Habit statistics ===
        habit_summaries = []
        habits = Habit.query.filter_by(user_id=user_id).all()

        for habit in habits:
            checkins = HabitCheckin.query.filter_by(habit_id=habit.id).all()
            checkin_dates = sorted([c.checkin_date.date() for c in checkins], reverse=True)

            current_streak = 0
            longest_streak = 0
            streak = 0
            prev_date = None

            for date in checkin_dates:
                if prev_date is None:
                    streak = 1
                elif (prev_date - date).days == 1:
                    streak += 1
                else:
                    longest_streak = max(longest_streak, streak)
                    streak = 1
                prev_date = date

            longest_streak = max(longest_streak, streak)
            last_checkin = checkin_dates[0] if checkin_dates else None
            if last_checkin and (today - last_checkin).days <= 1:
                current_streak = streak
            else:
                current_streak = 0

            days_active = (today - habit.created_at.date()).days + 1
            completion_rate = int(len(checkins) / days_active * 100) if days_active > 0 else 0

            habit_summaries.append({
                "id": habit.id,
                "name": habit.name,
                "current_streak": current_streak,
                "longest_streak": longest_streak,
                "completion_rate": completion_rate,
            })

        return {
            "tasks": {
                "completed": completed,
                "pending": pending,
                "overdue": overdue,
                "trend_last_7": trend_last_7,
                "trend_last_30": trend_last_30,
                "trend_last_90": trend_last_90,
            },
            "habits": {
                "per_habit": habit_summaries
            }
        }
