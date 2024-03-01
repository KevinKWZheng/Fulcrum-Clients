@echo off
start ./env/node/npm install
echo %TIME% > ".setup"
echo "Setup complete"
exit