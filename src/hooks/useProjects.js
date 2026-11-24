import { useState, useEffect } from 'react'
import { PROJECTS } from '../data/projects'

const EXTRA_KEY = 'portfolio-extra-projects'
const REMOVED_KEY = 'portfolio-removed-project-ids'
const EDITED_KEY = 'portfolio-edited-projects'
const HISTORY_KEY = 'portfolio-project-history'

function loadList(key) {
  try {
    const raw = localStorage.getItem(key)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        return parsed.filter((item) => {
          if (!item || typeof item !== 'object') return true
          const title = String(item.title || '').trim().toLowerCase()
          const desc = String(item.desc || '').trim().toLowerCase()
          return title !== 'desain villa' && desc !== 'wd we srfd'
        })
      }
      return parsed
    }
  } catch {
    /* empty */
  }
  return []
}

function loadMap(key) {
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw)
  } catch {
    /* empty */
  }
  return {}
}

function loadInitialHistory(initialExtras) {
  try {
    const raw = localStorage.getItem(HISTORY_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch {
    /* empty */
  }

  // Jika riwayat belum ada namun sudah ada project yang terupload sebelumnya, buat catatan awal
  if (Array.isArray(initialExtras) && initialExtras.length > 0) {
    return initialExtras.map((p) => {
      const match = String(p.id || '').match(/-(\d{10,})$/)
      const ts = match ? Number(match[1]) : Date.now()
      return {
        id: `hist-seed-${p.id}`,
        action: 'upload',
        projectId: p.id,
        projectTitle: p.title || 'Project',
        category: p.category || 'Website',
        timestamp: new Date(ts).toISOString(),
      }
    }).reverse()
  }

  return []
}

export default function useProjects() {
  const [extras, setExtras] = useState(() => loadList(EXTRA_KEY))
  const [removedIds, setRemovedIds] = useState(() => loadList(REMOVED_KEY))
  const [editedMap, setEditedMap] = useState(() => loadMap(EDITED_KEY))
  const [history, setHistory] = useState(() => loadInitialHistory(loadList(EXTRA_KEY)))

  useEffect(() => {
    try {
      localStorage.setItem(EXTRA_KEY, JSON.stringify(extras))
    } catch {
      /* private mode */
    }
  }, [extras])

  useEffect(() => {
    try {
      localStorage.setItem(REMOVED_KEY, JSON.stringify(removedIds))
    } catch {
      /* private mode */
    }
  }, [removedIds])

  useEffect(() => {
    try {
      localStorage.setItem(EDITED_KEY, JSON.stringify(editedMap))
    } catch {
      /* private mode */
    }
  }, [editedMap])

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
    } catch {
      /* private mode */
    }
  }, [history])

  // Merge default projects (with any edits applied) + custom extra projects
  const baseProjects = PROJECTS.filter((p) => !removedIds.includes(p.id)).map((p) => {
    return editedMap[p.id] ? { ...p, ...editedMap[p.id] } : p
  })

  const customProjects = extras
    .filter((p) => {
      const title = String(p.title || '').trim().toLowerCase()
      const desc = String(p.desc || '').trim().toLowerCase()
      return title !== 'desain villa' && desc !== 'wd we srfd'
    })
    .map((p) => {
      return editedMap[p.id] ? { ...p, ...editedMap[p.id] } : p
    })

  const projects = [...baseProjects, ...customProjects]

  const appendHistory = (entry) => {
    setHistory((prev) => [
      {
        id: `hist-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        timestamp: new Date().toISOString(),
        ...entry,
      },
      ...prev,
    ].slice(0, 100))
  }

  const addProject = (project) => {
    const id =
      project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') +
      '-' +
      Date.now()
    const newProject = {
      category: 'Website',
      role: 'UI/UX Designer',
      tools: [],
      accent: '#2563EB',
      tint: '#080B16',
      variant: 'custom',
      frame: 'browser',
      ...project,
      id,
    }
    setExtras((prev) => [...prev, newProject])
    appendHistory({
      action: 'upload',
      projectId: id,
      projectTitle: newProject.title,
      category: newProject.category,
    })
    return id
  }

  const updateProject = (id, updatedFields) => {
    setEditedMap((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        ...updatedFields,
      },
    }))
  }

  const deleteProject = (id) => {
    const target = projects.find((p) => p.id === id)
    appendHistory({
      action: 'delete',
      projectId: id,
      projectTitle: target?.title || 'Project',
      category: target?.category || '-',
    })

    setExtras((prev) => prev.filter((p) => p.id !== id))
    setRemovedIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
    setEditedMap((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  const clearHistory = () => {
    setHistory([])
    try {
      localStorage.removeItem(HISTORY_KEY)
    } catch {
      /* empty */
    }
  }

  const resetProjects = () => {
    setExtras([])
    setRemovedIds([])
    setEditedMap({})
    try {
      localStorage.removeItem(EXTRA_KEY)
      localStorage.removeItem(REMOVED_KEY)
      localStorage.removeItem(EDITED_KEY)
    } catch {
      /* empty */
    }
  }

  const getProject = (id) => projects.find((p) => p.id === id) || null

  return {
    projects,
    history,
    addProject,
    updateProject,
    deleteProject,
    clearHistory,
    resetProjects,
    getProject,
  }
}
