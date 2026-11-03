@echo off
echo ========================================================
echo  Judiciary Records Deployment Engine - Git Push
echo ========================================================
set "GIT_PATH=%LOCALAPPDATA%\MinGit\cmd\git.exe"
if exist "%GIT_PATH%" (
    "%GIT_PATH%" push -u origin main
) else (
    git push -u origin main
)
pause

