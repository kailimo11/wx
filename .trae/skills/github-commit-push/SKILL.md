---
name: github-commit-push
description: Commit current work and push this repository to GitHub using the configured SSH key. Use when the user asks to commit, push, 提交到 GitHub, or sync to the wx repository. Do not use for pull, merge, or force pushes.
---

<!--
姓名：温馨 | 学号：24001010328 | 时间：2026-11-19 | 大模型：DeepSeek-V4.1-Flash
-->

# 提交到 GitHub（commit + push）

把当前工作区改动提交并推送到 `https://github.com/kailimo11/wx.git`，使用本机已配置的 SSH 公钥（免密）。

## 固定信息

- 远程仓库（SSH）：`git@github.com:kailimo11/wx.git`
- 远程名：`origin`
- 禁止：`push --force`、提交 `backend/.env`、提交 `node_modules`

## 步骤

### 1. 检查环境

```powershell
git remote -v
git status --short
git branch --show-current
ssh -T git@github.com
```

- 无 `origin` 时先添加：`git remote add origin git@github.com:kailimo11/wx.git`
- 若 `origin` 是 HTTPS 地址，改为 SSH：`git remote set-url origin git@github.com:kailimo11/wx.git`
- `ssh -T git@github.com` 返回 `Hi <user>! You've successfully authenticated` 即公钥可用；失败先排查 `~/.ssh` 密钥与 ssh-agent，不要退回密码方式
- 若私钥文件名不是默认的 `id_ed25519` / `id_rsa`（本机为 `id_ed25519_1261609462`），ssh 默认不会加载，需为仓库指定：
  `git config core.sshCommand "ssh -i ~/.ssh/<私钥文件名> -o IdentitiesOnly=yes"`

### 2. 暂存改动

按文件名逐个添加，禁止 `git add -A` / `git add .`：

```powershell
git add AGENTS.md readme.md start_backend.bat wenxin_prompt.md frontend backend
```

确认 `.env` 未被暂存：`git status --short` 中不得出现 `backend/.env`。

### 3. 提交

PowerShell 5 不支持 heredoc，中文提交信息必须写入 UTF-8 临时文件后提交：

```powershell
$msg = "提交信息标题`r`n`r`n- 要点一`r`n- 要点二"
$f = "$env:TEMP\wenxin_commit.txt"
[System.IO.File]::WriteAllText($f, $msg, (New-Object System.Text.UTF8Encoding($false)))
git commit -F $f
```

提交信息用中文，写清楚「为什么改」而不是逐条罗列文件。

### 4. 推送

```powershell
git push -u origin <当前分支>
```

首次推送用 `-u` 建立跟踪；分支名用上一步 `git branch --show-current` 的实际值（本项目为 `master` 或 `main`）。

### 5. 汇报

输出三行即可：提交 hash 与标题、远程仓库地址、分支跟踪状态。推送失败时保留本地提交并说明原因，不要强推。
