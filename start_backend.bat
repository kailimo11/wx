@echo off
rem 姓名：温馨 | 学号：24001010328 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash
rem 文件说明：一键启动后端服务（Node.js + Express，端口 8328）
chcp 65001 >nul
title 知乎的模仿与制作 - 后端服务 (端口 8328)
cd /d "%~dp0backend"

if not exist node_modules (
  echo [提示] 未检测到依赖，正在安装...
  call npm i --no-audit --no-fund
  if errorlevel 1 (
    echo [错误] 依赖安装失败，请手动执行：cnpm i 或 npm i
    pause
    exit /b 1
  )
)

echo ============================================
echo   知乎的模仿与制作 - 后端服务
echo   地址：http://localhost:8328
echo   前端首页：http://localhost:8328/index.html
echo   按 Ctrl + C 可停止服务
echo ============================================
node app.js
pause
