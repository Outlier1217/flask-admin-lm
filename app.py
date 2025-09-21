from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import os
from datetime import datetime
import logging
import mimetypes

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.config['SECRET_KEY'] = 'd97250b610fa28d9c8edbe431f532f4e549b95b45dd60fb4abd7419b14df1ebb'

# HARDCODED RENDER DATABASE URL - No environment variables needed!
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://admin_lm_user:KTqfHzwSnyqN3R8PLUN1UycX0tKUycUZ@dpg-d37qinffte5s73bgjok0-a.oregon-postgres.render.com/admin_lm'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'mp4'}
app.config['ALLOWED_MIMETYPES'] = {'image/png', 'image/jpeg', 'video/mp4'}

db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'

# Ensure upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Models
class Admin(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    thumbnail = db.Column(db.String(200), nullable=False)
    client = db.Column(db.String(100))
    location = db.Column(db.String(100))
    site_area = db.Column(db.String(50))
    built_up_area = db.Column(db.String(50))
    cost = db.Column(db.String(50))
    duration = db.Column(db.String(50))
    dwelling_units = db.Column(db.String(50))
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class ProjectMedia(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)
    file_path = db.Column(db.String(200), nullable=False)
    file_type = db.Column(db.String(20), nullable=False)  # 'image' or 'video'

class Blog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    thumbnail = db.Column(db.String(255))
    headline = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

@login_manager.user_loader
def load_user(user_id):
    return db.session.get(Admin, int(user_id))

# Helper function
def allowed_file(filename, mimetype):
    return ('.' in filename and
            filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS'] and
            mimetype in app.config['ALLOWED_MIMETYPES'])

# Normalize path to use forward slashes
def normalize_path(path):
    return path.replace(os.sep, '/')

# Mobile detection function
def is_mobile_request():
    user_agent = request.headers.get('User-Agent', '').lower()
    mobile_indicators = ['iphone', 'android', 'blackberry', 'windows phone']
    return any(indicator in user_agent for indicator in mobile_indicators)

# Initialize database (only runs once on startup)
def init_db():
    try:
        with app.app_context():
            db.create_all()
            logger.info("Database tables created/initialized successfully")
    except Exception as e:
        logger.error(f"Database initialization error: {str(e)}")

# Run database initialization on startup
init_db()

# Debug route to list uploaded files
@app.route('/debug/uploads')
@login_required
def debug_uploads():
    upload_dir = app.config['UPLOAD_FOLDER']
    files = os.listdir(upload_dir) if os.path.exists(upload_dir) else []
    return jsonify({'upload_folder': upload_dir, 'files': files})

# Service routes
@app.route('/architecture')
def architecture():
    return render_template('architecture.html', is_mobile=is_mobile_request())

@app.route('/interior')
def interior():
    return render_template('interior.html', is_mobile=is_mobile_request())

@app.route('/vastu')
def vastu():
    return render_template('vastu.html', is_mobile=is_mobile_request())

@app.route('/pencil-portraits')
def pencil_portraits():
    return render_template('pencil_portraits.html', is_mobile=is_mobile_request())

@app.route('/oil-portraits')
def oil_portraits():
    return render_template('oil_portraits.html', is_mobile=is_mobile_request())

@app.route('/paintings')
def paintings():
    return render_template('paintings.html', is_mobile=is_mobile_request())

# Admin Routes
@app.route('/admin')
def index():
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        admin = Admin.query.filter_by(email=email).first()
        if admin and check_password_hash(admin.password_hash, password):
            login_user(admin)
            return redirect(url_for('dashboard'))
        flash('Invalid email or password')
    return render_template('login.html', is_mobile=is_mobile_request())

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))

@app.route('/dashboard')
@login_required
def dashboard():
    projects = Project.query.all()
    blogs = Blog.query.all()
    for project in projects:
        project.media = ProjectMedia.query.filter_by(project_id=project.id).all()
        logger.debug(f"Project {project.id}: Name: {project.name}, Thumbnail: {project.thumbnail}")
        for media in project.media:
            logger.debug(f"Media {media.id}: Project {project.id}, Path: {media.file_path}, Type: {media.file_type}")
    for blog in blogs:
        logger.debug(f"Blog {blog.id}: Headline: {blog.headline}, Thumbnail: {blog.thumbnail}")
    return render_template('dashboard.html', projects=projects, blogs=blogs, is_mobile=is_mobile_request())

@app.route('/change_credentials', methods=['GET', 'POST'])
@login_required
def change_credentials():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        admin = db.session.get(Admin, current_user.id)
        if email:
            admin.email = email
        if password:
            admin.password_hash = generate_password_hash(password)
        db.session.commit()
        flash('Credentials updated successfully')
        return redirect(url_for('dashboard'))
    return render_template('change_credentials.html', is_mobile=is_mobile_request())

@app.route('/add_project', methods=['GET', 'POST'])
@login_required
def add_project():
    if request.method == 'POST':
        name = request.form['name']
        client = request.form['client']
        location = request.form['location']
        site_area = request.form['site_area']
        built_up_area = request.form['built_up_area']
        cost = request.form['cost']
        duration = request.form['duration']
        dwelling_units = request.form['dwelling_units']
        description = request.form['description']

        thumbnail = request.files['thumbnail']
        if thumbnail and allowed_file(thumbnail.filename, thumbnail.mimetype):
            thumbnail_filename = secure_filename(thumbnail.filename)
            thumbnail_path = os.path.join(app.config['UPLOAD_FOLDER'], thumbnail_filename)
            thumbnail_rel_path = normalize_path(os.path.join('uploads', thumbnail_filename))
            logger.debug(f"Saving thumbnail: {thumbnail_path}, MIME: {thumbnail.mimetype}")
            try:
                thumbnail.save(thumbnail_path)
                if not os.path.exists(thumbnail_path):
                    logger.error(f"Thumbnail failed to save: {thumbnail_path}")
                    flash('Failed to save thumbnail file')
                    return render_template('add_project.html')
                logger.debug(f"Thumbnail saved successfully: {thumbnail_path}, Stored as: {thumbnail_rel_path}")
            except Exception as e:
                logger.error(f"Error saving thumbnail: {str(e)}")
                flash('Error saving thumbnail file')
                return render_template('add_project.html')

            project = Project(
                name=name,
                thumbnail=thumbnail_rel_path,
                client=client,
                location=location,
                site_area=site_area,
                built_up_area=built_up_area,
                cost=cost,
                duration=duration,
                dwelling_units=dwelling_units,
                description=description
            )
            db.session.add(project)
            db.session.commit()

            media_files = request.files.getlist('media')
            for file in media_files:
                if file and allowed_file(file.filename, file.mimetype):
                    filename = secure_filename(file.filename)
                    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                    file_rel_path = normalize_path(os.path.join('uploads', filename))
                    logger.debug(f"Saving media: {file_path}, MIME: {file.mimetype}")
                    try:
                        file.save(file_path)
                        if not os.path.exists(file_path):
                            logger.error(f"Media failed to save: {file_path}")
                            flash(f"Failed to save media file: {filename}")
                            continue
                        file_type = 'image' if file.mimetype.startswith('image') else 'video'
                        media = ProjectMedia(project_id=project.id, file_path=file_rel_path, file_type=file_type)
                        db.session.add(media)
                        logger.debug(f"Media saved: {file_path}, Type: {file_type}, Stored as: {file_rel_path}")
                    except Exception as e:
                        logger.error(f"Error saving media: {str(e)}")
                        flash(f"Error saving media file: {filename}")
                        continue
            db.session.commit()
            flash('Project added successfully')
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid thumbnail file or MIME type')
    return render_template('add_project.html', is_mobile=is_mobile_request())

@app.route('/edit_project/<int:id>', methods=['GET', 'POST'])
@login_required
def edit_project(id):
    project = db.session.get(Project, id)
    if not project:
        flash('Project not found')
        return redirect(url_for('dashboard'))
    if request.method == 'POST':
        project.name = request.form['name']
        project.client = request.form['client']
        project.location = request.form['location']
        project.site_area = request.form['site_area']
        project.built_up_area = request.form['built_up_area']
        project.cost = request.form['cost']
        project.duration = request.form['duration']
        project.dwelling_units = request.form['dwelling_units']
        project.description = request.form['description']

        if 'thumbnail' in request.files and request.files['thumbnail'].filename:
            thumbnail = request.files['thumbnail']
            if thumbnail and allowed_file(thumbnail.filename, thumbnail.mimetype):
                thumbnail_filename = secure_filename(thumbnail.filename)
                thumbnail_path = os.path.join(app.config['UPLOAD_FOLDER'], thumbnail_filename)
                thumbnail_rel_path = normalize_path(os.path.join('uploads', thumbnail_filename))
                logger.debug(f"Saving thumbnail: {thumbnail_path}, MIME: {thumbnail.mimetype}")
                try:
                    thumbnail.save(thumbnail_path)
                    if not os.path.exists(thumbnail_path):
                        logger.error(f"Thumbnail failed to save: {thumbnail_path}")
                        flash('Failed to save thumbnail file')
                        return render_template('edit_project.html', project=project)
                    project.thumbnail = thumbnail_rel_path
                    logger.debug(f"Thumbnail updated: {thumbnail_path}, Stored as: {thumbnail_rel_path}")
                except Exception as e:
                    logger.error(f"Error saving thumbnail: {str(e)}")
                    flash('Error saving thumbnail file')
                    return render_template('edit_project.html', project=project)

        if 'media' in request.files:
            media_files = request.files.getlist('media')
            for file in media_files:
                if file and allowed_file(file.filename, file.mimetype):
                    filename = secure_filename(file.filename)
                    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                    file_rel_path = normalize_path(os.path.join('uploads', filename))
                    logger.debug(f"Saving media: {file_path}, MIME: {file.mimetype}")
                    try:
                        file.save(file_path)
                        if not os.path.exists(file_path):
                            logger.error(f"Media failed to save: {file_path}")
                            flash(f"Failed to save media file: {filename}")
                            continue
                        file_type = 'image' if file.mimetype.startswith('image') else 'video'
                        media = ProjectMedia(project_id=project.id, file_path=file_rel_path, file_type=file_type)
                        db.session.add(media)
                        logger.debug(f"Media saved: {file_path}, Type: {file_type}, Stored as: {file_rel_path}")
                    except Exception as e:
                        logger.error(f"Error saving media: {str(e)}")
                        flash(f"Error saving media file: {filename}")
                        continue

        db.session.commit()
        flash('Project updated successfully')
        return redirect(url_for('dashboard'))
    return render_template('edit_project.html', project=project, is_mobile=is_mobile_request())

@app.route('/add_project_media/<int:id>', methods=['POST'])
@login_required
def add_project_media(id):
    project = db.session.get(Project, id)
    if not project:
        flash('Project not found')
        return redirect(url_for('dashboard'))
    if request.method == 'POST':
        media_files = request.files.getlist('media')
        for file in media_files:
            if file and allowed_file(file.filename, file.mimetype):
                filename = secure_filename(file.filename)
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file_rel_path = normalize_path(os.path.join('uploads', filename))
                logger.debug(f"Saving media: {file_path}, MIME: {file.mimetype}")
                try:
                    file.save(file_path)
                    if not os.path.exists(file_path):
                        logger.error(f"Media failed to save: {file_path}")
                        flash(f"Failed to save media file: {filename}")
                        continue
                    file_type = 'image' if file.mimetype.startswith('image') else 'video'
                    media = ProjectMedia(project_id=project.id, file_path=file_rel_path, file_type=file_type)
                    db.session.add(media)
                    logger.debug(f"Media saved: {file_path}, Type: {file_type}, Stored as: {file_rel_path}")
                except Exception as e:
                    logger.error(f"Error saving media: {str(e)}")
                    flash(f"Error saving media file: {filename}")
                    continue
        db.session.commit()
        flash('Media added successfully')
        return redirect(url_for('dashboard'))
    return render_template('dashboard.html')

@app.route('/delete_project/<int:id>')
@login_required
def delete_project(id):
    project = db.session.get(Project, id)
    if not project:
        flash('Project not found')
        return redirect(url_for('dashboard'))
    ProjectMedia.query.filter_by(project_id=id).delete()
    db.session.delete(project)
    db.session.commit()
    flash('Project deleted successfully')
    return redirect(url_for('dashboard'))

@app.route('/add_blog', methods=['GET', 'POST'])
@login_required
def add_blog():
    if request.method == 'POST':
        headline = request.form['headline']
        content = request.form['content']
        thumbnail = request.files.get('thumbnail')

        thumbnail_rel_path = None
        if thumbnail and allowed_file(thumbnail.filename, thumbnail.mimetype):
            thumbnail_filename = secure_filename(thumbnail.filename)
            thumbnail_path = os.path.join(app.config['UPLOAD_FOLDER'], thumbnail_filename)
            thumbnail_rel_path = normalize_path(os.path.join('uploads', thumbnail_filename))
            logger.debug(f"Saving thumbnail: {thumbnail_path}, MIME: {thumbnail.mimetype}")
            try:
                thumbnail.save(thumbnail_path)
                if not os.path.exists(thumbnail_path):
                    logger.error(f"Thumbnail failed to save: {thumbnail_path}")
                    flash('Failed to save thumbnail file')
                    return render_template('add_blog.html')
                logger.debug(f"Thumbnail saved successfully: {thumbnail_path}, Stored as: {thumbnail_rel_path}")
            except Exception as e:
                logger.error(f"Error saving thumbnail: {str(e)}")
                flash('Error saving thumbnail file')
                return render_template('add_blog.html')

        blog = Blog(
            headline=headline,
            content=content,
            thumbnail=thumbnail_rel_path
        )
        db.session.add(blog)
        db.session.commit()
        flash('Blog added successfully')
        return redirect(url_for('dashboard'))
    return render_template('add_blog.html', is_mobile=is_mobile_request())

@app.route('/edit_blog/<int:id>', methods=['GET', 'POST'])
@login_required
def edit_blog(id):
    blog = db.session.get(Blog, id)
    if not blog:
        flash('Blog not found')
        return redirect(url_for('dashboard'))
    if request.method == 'POST':
        blog.headline = request.form['headline']
        blog.content = request.form['content']

        if 'thumbnail' in request.files and request.files['thumbnail'].filename:
            thumbnail = request.files['thumbnail']
            if thumbnail and allowed_file(thumbnail.filename, thumbnail.mimetype):
                thumbnail_filename = secure_filename(thumbnail.filename)
                thumbnail_path = os.path.join(app.config['UPLOAD_FOLDER'], thumbnail_filename)
                thumbnail_rel_path = normalize_path(os.path.join('uploads', thumbnail_filename))
                logger.debug(f"Saving thumbnail: {thumbnail_path}, MIME: {thumbnail.mimetype}")
                try:
                    thumbnail.save(thumbnail_path)
                    if not os.path.exists(thumbnail_path):
                        logger.error(f"Thumbnail failed to save: {thumbnail_path}")
                        flash('Failed to save thumbnail file')
                        return render_template('edit_blog.html', blog=blog)
                    blog.thumbnail = thumbnail_rel_path
                    logger.debug(f"Thumbnail updated: {thumbnail_path}, Stored as: {thumbnail_rel_path}")
                except Exception as e:
                    logger.error(f"Error saving thumbnail: {str(e)}")
                    flash('Error saving thumbnail file')
                    return render_template('edit_blog.html', blog=blog)

        db.session.commit()
        flash('Blog updated successfully')
        return redirect(url_for('dashboard'))
    return render_template('edit_blog.html', blog=blog, is_mobile=is_mobile_request())

@app.route('/delete_blog/<int:id>')
@login_required
def delete_blog(id):
    blog = db.session.get(Blog, id)
    if not blog:
        flash('Blog not found')
        return redirect(url_for('dashboard'))
    db.session.delete(blog)
    db.session.commit()
    flash('Blog deleted successfully')
    return redirect(url_for('dashboard'))

# Public Routes
@app.route('/')
def home():
    try:
        blogs = Blog.query.order_by(Blog.created_at.desc()).all()
        projects = Project.query.limit(3).all()
        return render_template('index.html', blogs=blogs, projects=projects, is_mobile=is_mobile_request())
    except Exception as e:
        logger.error(f"Error loading homepage: {str(e)}")
        return render_template('index.html', blogs=[], projects=[], is_mobile=is_mobile_request())

@app.route('/about')
def about():
    return render_template('about.html', is_mobile=is_mobile_request())

@app.route('/blog')
def blog():
    try:
        blogs = Blog.query.order_by(Blog.created_at.desc()).all()
        return render_template('blog.html', blogs=blogs, is_mobile=is_mobile_request())
    except Exception as e:
        logger.error(f"Error loading blog page: {str(e)}")
        return render_template('blog.html', blogs=[], is_mobile=is_mobile_request())

@app.route('/blog/<int:id>')
def blog_detail(id):
    try:
        blog = db.session.get(Blog, id)
        if not blog:
            flash('Blog not found')
            return redirect(url_for('blog'))
        return render_template('blog_detail.html', blog=blog, is_mobile=is_mobile_request())
    except Exception as e:
        logger.error(f"Error loading blog detail: {str(e)}")
        flash('Blog not found')
        return redirect(url_for('blog'))

@app.route('/store')
def store():
    return render_template('store.html', is_mobile=is_mobile_request())

@app.route('/projects')
def projects():
    try:
        projects = Project.query.all()
        for project in projects:
            project.media = ProjectMedia.query.filter_by(project_id=project.id).all()
        return render_template('projects.html', projects=projects, is_mobile=is_mobile_request())
    except Exception as e:
        logger.error(f"Error loading projects page: {str(e)}")
        return render_template('projects.html', projects=[], is_mobile=is_mobile_request())

@app.route('/project/<int:id>')
def project_detail(id):
    try:
        project = db.session.get(Project, id)
        if not project:
            flash('Project not found')
            return redirect(url_for('projects'))
        project.media = ProjectMedia.query.filter_by(project_id=project.id).all()
        return render_template('project_detail.html', project=project, is_mobile=is_mobile_request())
    except Exception as e:
        logger.error(f"Error loading project detail: {str(e)}")
        flash('Project not found')
        return redirect(url_for('projects'))

@app.route('/contact')
def contact():
    return render_template('contact.html', is_mobile=is_mobile_request())

if __name__ == '__main__':
    app.run(debug=True)