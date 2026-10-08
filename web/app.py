from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
import json
import os

app = Flask(__name__, template_folder='templates', static_folder='static')
CORS(app)

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
DATA_FILE = os.path.join(BASE_DIR, 'data', 'state.json')
LOGS_FILE = os.path.join(BASE_DIR, 'data', 'logs.json')
ENTRIES_FILE = os.path.join(BASE_DIR, 'data', 'entries.json')

def load_json(path):
    try:
        with open(path) as f:
            return json.load(f)
    except Exception:
        return {}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/state')
def get_state():
    return jsonify(load_json(DATA_FILE))

@app.route('/api/logs')
def get_logs():
    data = load_json(DATA_FILE)
    logs = data.get('logs', [])
    limit = int(request.args.get('limit', 100))
    return jsonify(logs[-limit:])

@app.route('/api/logs/all')
def get_logs_all():
    data = load_json(DATA_FILE)
    return jsonify(data.get('logs', []))

@app.route('/api/entries')
def get_entries():
    return jsonify(load_json(ENTRIES_FILE))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
