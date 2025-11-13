<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

---

## Git Workflow Instructions

**ВАЖНО**: После выполнения следующих действий ВСЕГДА делай git push:

1. **После создания proposal change** (`/openspec:proposal`)
   - Создай коммит с изменениями
   - Запуши в GitHub: `git push`

2. **После имплементации** (`/openspec:apply`)
   - Создай коммит с изменениями
   - Запуши в GitHub: `git push`

3. **После архивации** (`/openspec:archive`)
   - Создай коммит с изменениями
   - Запуши в GitHub: `git push`

**Порядок действий**:
- Выполни задачу (proposal/apply/archive)
- Создай коммит с описательным сообщением
- Сразу же сделай `git push` для синхронизации с удаленным репозиторием