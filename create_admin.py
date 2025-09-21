from app import db, Admin
from werkzeug.security import generate_password_hash
from flask import Flask

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:root@localhost/admin_lm'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

with app.app_context():
    # Check if admin already exists
    if not Admin.query.filter_by(email='admin@example.com').first():
        # Create a new admin user
        admin = Admin(
            email='admin@example.com',
            password_hash=generate_password_hash('adminpassword')
        )
        db.session.add(admin)
        db.session.commit()
        print("Admin user created successfully!")
    else:
        print("Admin user already exists!")