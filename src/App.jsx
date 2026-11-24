import { useCallback, useEffect, useState } from 'react'
import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Snackbar,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import CheckIcon from '@mui/icons-material/Check'
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import Pane, { SIDES } from './Pane.jsx'
import Tri from './Tri.jsx'
import { itemLabel } from './data.js'

const STORAGE_KEY = 'jimoai-trade:v1'

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (raw && raw.counts) return raw
  } catch {
    /* ignore */
  }
  return { counts: { offer: {}, want: {} }, view: 'both' }
}

export default function App() {
  const [state, setState] = useState(load)
  const [editing, setEditing] = useState(false)
  const [toast, setToast] = useState(null) // { msg, undo }
  const [menuAnchor, setMenuAnchor] = useState(null)
  const [resetTarget, setResetTarget] = useState(null) // 'offer' | 'want' | 'all'
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  useEffect(() => {
    const h = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', h)
    return () => document.removeEventListener('fullscreenchange', h)
  }, [])

  const setCount = (side, id, value) =>
    setState((s) => ({ ...s, counts: { ...s.counts, [side]: { ...s.counts[side], [id]: Math.max(0, value) } } }))

  const makeChange = (side) => (item, delta, quick = false) => {
    const prev = state.counts[side][item.id] ?? 0
    const next = Math.max(0, prev + delta)
    if (next === prev) return
    setCount(side, item.id, next)
    if (quick) {
      const m = SIDES[side]
      setToast({
        key: Date.now(),
        msg: `${m.doneJa}：${itemLabel(item)}　残り ${next} · 剩余 ${next} · ${next} left`,
        undo: () => setCount(side, item.id, prev),
      })
    }
  }

  const doReset = useCallback(() => {
    const target = resetTarget
    const snapshot = state.counts
    setState((s) => ({
      ...s,
      counts: {
        offer: target === 'want' ? s.counts.offer : {},
        want: target === 'offer' ? s.counts.want : {},
      },
    }))
    setResetTarget(null)
    setToast({
      key: Date.now(),
      msg: 'リセットしました · 已重置 · Reset done',
      undo: () => setState((s) => ({ ...s, counts: snapshot })),
    })
  }, [resetTarget, state.counts])

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen?.()
    else Promise.resolve(document.documentElement.requestFullscreen?.()).catch(() => {})
  }

  const wantOnly = state.view === 'want'

  return (
    <Box sx={{ height: '100dvh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar variant="dense" sx={{ gap: 1, minHeight: 56, flexWrap: 'nowrap' }}>
          <Box sx={{ flex: 1, minWidth: 0, display: { xs: 'none', sm: 'block' } }}>
            <Tri ja="グッズ交換" zh="周边交换" en="Goods Trade" size="lg" />
          </Box>
          <Box sx={{ flex: 1, display: { xs: 'block', sm: 'none' } }} />

          <ToggleButtonGroup
            size="small"
            exclusive
            color="primary"
            value={state.view}
            onChange={(_, v) => v && setState((s) => ({ ...s, view: v }))}
          >
            <ToggleButton value="both" sx={{ px: 1.5, lineHeight: 1.1, flexDirection: 'column' }}>
              <span>譲＋求</span>
              <Typography component="span" sx={{ fontSize: 10, opacity: 0.7 }}>
                出+求 · Both
              </Typography>
            </ToggleButton>
            <ToggleButton value="want" sx={{ px: 1.5, lineHeight: 1.1, flexDirection: 'column' }}>
              <span>求のみ</span>
              <Typography component="span" sx={{ fontSize: 10, opacity: 0.7 }}>
                只求 · Want only
              </Typography>
            </ToggleButton>
          </ToggleButtonGroup>

          <Button
            variant={editing ? 'contained' : 'outlined'}
            startIcon={editing ? <CheckIcon /> : <EditIcon />}
            onClick={() => setEditing((e) => !e)}
            sx={{ lineHeight: 1.1, flexShrink: 0 }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span>{editing ? '完了' : '編集'}</span>
              <Typography component="span" sx={{ fontSize: 10, opacity: 0.75 }}>
                {editing ? '完成 · Done' : '编辑 · Edit'}
              </Typography>
            </Box>
          </Button>

          <Tooltip title="全画面 · 全屏 · Fullscreen">
            <IconButton onClick={toggleFullscreen} sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
              {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
          </Tooltip>
          <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)} edge="end">
            <MoreVertIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'row',
          gap: '1px',
          bgcolor: 'divider',
          '@media (orientation: portrait)': { flexDirection: 'column' },
        }}
      >
        {!wantOnly && (
          <Pane side="offer" counts={state.counts.offer} editing={editing} onChange={makeChange('offer')} />
        )}
        <Pane side="want" counts={state.counts.want} editing={editing} onChange={makeChange('want')} />
      </Box>

      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
        <MenuItem
          onClick={() => {
            setMenuAnchor(null)
            toggleFullscreen()
          }}
          sx={{ display: { xs: 'flex', sm: 'none' } }}
        >
          <ListItemIcon>{isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}</ListItemIcon>
          <ListItemText primary="全画面" secondary="全屏 · Fullscreen" />
        </MenuItem>
        {[
          ['offer', '譲をリセット', '清空出 · Reset offer'],
          ['want', '求をリセット', '清空求 · Reset want'],
          ['all', 'すべてリセット', '全部清空 · Reset all'],
        ].map(([key, ja, sub]) => (
          <MenuItem
            key={key}
            onClick={() => {
              setMenuAnchor(null)
              setResetTarget(key)
            }}
          >
            <ListItemIcon>
              <RestartAltIcon color={key === 'all' ? 'error' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary={ja} secondary={sub} />
          </MenuItem>
        ))}
      </Menu>

      <Dialog open={Boolean(resetTarget)} onClose={() => setResetTarget(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          <Tri
            ja={{ offer: '譲の数量をリセット？', want: '求の数量をリセット？', all: 'すべての数量をリセット？' }[resetTarget] ?? ''}
            zh={{ offer: '清空出的数量？', want: '清空求的数量？', all: '清空全部数量？' }[resetTarget] ?? ''}
            en={{ offer: 'Reset offer counts?', want: 'Reset want counts?', all: 'Reset all counts?' }[resetTarget] ?? ''}
            size="lg"
          />
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            数量が 0 になります。直後なら元に戻せます。
            <br />
            数量将归零，之后可立即撤销。 · Counts will be set to 0. You can undo right after.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetTarget(null)}>キャンセル · 取消</Button>
          <Button color="error" variant="contained" onClick={doReset}>
            リセット · 重置
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        key={toast?.key}
        open={Boolean(toast)}
        autoHideDuration={4000}
        onClose={(_, reason) => reason !== 'clickaway' && setToast(null)}
        message={toast?.msg}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        action={
          <Button
            size="small"
            onClick={() => {
              toast?.undo()
              setToast(null)
            }}
            sx={{ color: '#90caf9' }}
          >
            元に戻す · 撤销
          </Button>
        }
      />
    </Box>
  )
}
