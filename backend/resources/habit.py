from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Habit, HabitCheckin
from datetime import date

class HabitList(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        habits = Habit.query.filter_by(user_id=user_id).all()

        data = []
        for h in habits:
            # Get latest check-in for this habit
            last_checkin = HabitCheckin.query.filter_by(habit_id=h.id).order_by(HabitCheckin.checkin_date.desc()).first()
            last_checkin_date = last_checkin.checkin_date.isoformat() if last_checkin else None

            data.append({
                "id": h.id,
                "name": h.name,
                "frequency": h.frequency,
                "created_at": h.created_at.isoformat(),
                "last_checkin": last_checkin_date
            })

        return data, 200

    @jwt_required()
    def post(self):
        data = request.get_json()
        user_id = get_jwt_identity()

        habit = Habit(
            name=data["name"],
            frequency=data.get("frequency", "daily"),
            user_id=user_id
        )

        db.session.add(habit)
        db.session.commit()
        return {"message": "Habit created"}, 201


class HabitDetail(Resource):
    @jwt_required()
    def put(self, habit_id):
        user_id = get_jwt_identity()
        habit = Habit.query.filter_by(id=habit_id, user_id=user_id).first_or_404()

        data = request.get_json()
        habit.name = data.get("name", habit.name)
        habit.frequency = data.get("frequency", habit.frequency)

        db.session.commit()
        return {"message": "Habit updated"}, 200

    @jwt_required()
    def delete(self, habit_id):
        user_id = get_jwt_identity()
        habit = Habit.query.filter_by(id=habit_id, user_id=user_id).first_or_404()

        db.session.delete(habit)
        db.session.commit()
        return {"message": "Habit deleted"}, 200


class HabitCheckinResource(Resource):
    @jwt_required()
    def post(self, habit_id):
        user_id = get_jwt_identity()
        habit = Habit.query.filter_by(id=habit_id, user_id=user_id).first_or_404()

        today = date.today()
        already_checked_in = HabitCheckin.query.filter_by(habit_id=habit.id, checkin_date=today).first()

        if already_checked_in:
            return {"message": "Already checked in today"}, 400

        checkin = HabitCheckin(habit_id=habit.id, checkin_date=today)
        db.session.add(checkin)
        db.session.commit()
        return {"message": "Check-in recorded"}, 201

    @jwt_required()
    def get(self, habit_id):
        user_id = get_jwt_identity()
        habit = Habit.query.filter_by(id=habit_id, user_id=user_id).first_or_404()

        # Fetch checkins from DB (ordered)
        checkins = HabitCheckin.query.filter_by(habit_id=habit.id).order_by(HabitCheckin.checkin_date.desc()).all()

        # Return list of checkin dates
        return [{"date": c.checkin_date.isoformat()} for c in checkins], 200


class ProgressResource(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        range_filter = request.args.get("range", "all")  # e.g. day, week, month

        habits = Habit.query.filter_by(user_id=user_id).all()
        progress_data = []

        for h in habits:
            # Use correct attribute here
            checkins = [c.checkin_date for c in h.checkins]

            progress_data.append({
                "habit_id": h.id,
                "habit_name": h.name,
                "checkins": [d.isoformat() for d in checkins]
            })

        return {"progress": progress_data}, 200
