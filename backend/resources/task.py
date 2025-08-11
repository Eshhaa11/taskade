from flask import request
from flask_restful import Resource
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Task
from datetime import datetime

class TaskList(Resource):
    @jwt_required()
    def get(self):
        user_id = get_jwt_identity()
        status = request.args.get("status")      # e.g. ?status=pending
        sort_by = request.args.get("sort")       # e.g. ?sort=due_date

        query = Task.query.filter_by(user_id=user_id)

        if status:
            query = query.filter_by(status=status)

        if sort_by == "due_date":
            query = query.order_by(Task.due_date.asc())

        tasks = query.all()

        return [
            {
                "id": task.id,
                "title": task.title,
                "description": task.description,
                "due_date": task.due_date.isoformat() if task.due_date else None,
                "status": task.status,
            } for task in tasks
        ], 200

    @jwt_required()
    def post(self):
        data = request.get_json()
        user_id = get_jwt_identity()

        task = Task(
            title=data["title"],
            description=data.get("description"),
            due_date=datetime.fromisoformat(data["due_date"]) if data.get("due_date") else None,
            status=data.get("status", "pending"),
            user_id=user_id
        )

        db.session.add(task)
        db.session.commit()
        return {"message": "Task created successfully"}, 201


class TaskDetail(Resource):
    @jwt_required()
    def get(self, task_id):
        user_id = get_jwt_identity()
        task = Task.query.filter_by(id=task_id, user_id=user_id).first_or_404()

        return {
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "due_date": task.due_date.isoformat() if task.due_date else None,
            "status": task.status,
        }, 200

    @jwt_required()
    def put(self, task_id):
        user_id = get_jwt_identity()
        task = Task.query.filter_by(id=task_id, user_id=user_id).first_or_404()

        data = request.get_json()
        task.title = data.get("title", task.title)
        task.description = data.get("description", task.description)
        task.due_date = datetime.fromisoformat(data["due_date"]) if data.get("due_date") else task.due_date
        task.status = data.get("status", task.status)

        db.session.commit()
        return {"message": "Task updated successfully"}, 200

    @jwt_required()
    def delete(self, task_id):
        user_id = get_jwt_identity()
        task = Task.query.filter_by(id=task_id, user_id=user_id).first_or_404()

        db.session.delete(task)
        db.session.commit()
        return {"message": "Task deleted successfully"}, 200
