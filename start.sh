#!/bin/bash
cd /workspace/app
node index.js &
NODE_PID=$!
python3 web/app.py &
PY_PID=$!
trap "kill $NODE_PID $PY_PID 2>/dev/null; exit" SIGINT SIGTERM
wait $NODE_PID $PY_PID
