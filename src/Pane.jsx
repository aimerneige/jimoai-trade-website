import { Box, Card, CardMedia, Chip, IconButton, Tooltip, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import InventoryIcon from '@mui/icons-material/Inventory2Outlined'
import Tri from './Tri.jsx'
import { CATEGORIES, ITEMS, MEMBERS, itemLabel } from './data.js'

export const SIDES = {
  offer: { ja: '譲', zh: '出', en: 'Offer', doneJa: '譲った', doneZh: '已出', doneEn: 'Given' },
  want: { ja: '求', zh: '求', en: 'Want', doneJa: 'ゲット', doneZh: '已收', doneEn: 'Got' },
}

function ItemTile({ item, count, side, editing, onChange, aspect }) {
  const member = MEMBERS[item.member]
  const empty = count === 0

  return (
    <Card
      variant="outlined"
      sx={{
        position: 'relative',
        overflow: 'visible',
        borderColor: editing && !empty ? `${side}.main` : 'divider',
        borderWidth: editing && !empty ? 2 : 1,
        transition: 'opacity .15s, border-color .15s',
      }}
    >
      <CardMedia
        component="img"
        image={item.src}
        alt={itemLabel(item)}
        loading="lazy"
        sx={{
          aspectRatio: aspect,
          objectFit: 'cover',
          borderTopLeftRadius: 11,
          borderTopRightRadius: 11,
          opacity: editing && empty ? 0.35 : 1,
          filter: editing && empty ? 'grayscale(1)' : 'none',
          transition: 'opacity .15s, filter .15s',
        }}
      />

      {!empty && (
        <Chip
          label={`×${count}`}
          color={side}
          size="small"
          sx={{ position: 'absolute', top: 6, right: 6, fontWeight: 800, fontSize: 14, boxShadow: 2 }}
        />
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 1, py: 0.5, minHeight: 36 }}>
        <Box sx={{ width: 4, alignSelf: 'stretch', borderRadius: 2, bgcolor: member?.color ?? 'grey.400', flexShrink: 0 }} />
        <Typography noWrap sx={{ fontSize: 12, fontWeight: 600, flex: 1, minWidth: 0 }}>
          {itemLabel(item)}
        </Typography>
        {!editing && (
          <Tooltip title={`${SIDES[side].doneJa} −1 · ${SIDES[side].doneZh} · ${SIDES[side].doneEn}`}>
            <IconButton size="small" color={side} onClick={() => onChange(item, -1, true)} sx={{ mr: -0.5 }}>
              <TaskAltIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {editing && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: 1,
            borderColor: 'divider',
            px: 0.5,
            py: 0.25,
          }}
        >
          <IconButton size="small" disabled={empty} onClick={() => onChange(item, -1)}>
            <RemoveIcon fontSize="small" />
          </IconButton>
          <Typography sx={{ fontWeight: 800, fontSize: 16, color: empty ? 'text.disabled' : `${side}.main` }}>
            {count}
          </Typography>
          <IconButton size="small" color={side} onClick={() => onChange(item, +1)}>
            <AddIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Card>
  )
}

export default function Pane({ side, counts, editing, onChange }) {
  const meta = SIDES[side]
  const total = ITEMS.reduce((sum, i) => sum + (counts[i.id] ?? 0), 0)

  const sections = CATEGORIES.map((cat) => ({
    cat,
    items: ITEMS.filter((i) => i.category === cat.key && (editing || (counts[i.id] ?? 0) > 0)),
  })).filter((s) => s.items.length > 0)

  return (
    <Box sx={{ flex: 1, minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
      {/* 大标题：一眼区分 譲 / 求 */}
      <Box
        sx={{
          bgcolor: `${side}.main`,
          color: `${side}.contrastText`,
          px: { xs: 2, sm: 3 },
          py: { xs: 1, sm: 1.5 },
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          flexShrink: 0,
        }}
      >
        <Tri ja={meta.ja} zh={meta.zh} en={meta.en} size="xl" inline />
        <Box sx={{ flex: 1 }} />
        <Typography sx={{ fontWeight: 800, fontSize: 'clamp(18px, 2.2vw, 26px)', opacity: 0.95 }}>
          {total}
          <Typography component="span" sx={{ fontSize: '0.6em', ml: 0.5, opacity: 0.8 }}>
            点 · 件 · pcs
          </Typography>
        </Typography>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', px: { xs: 1.5, sm: 2 }, pb: 3, bgcolor: `${side}.light` }}>
        {sections.length === 0 && (
          <Box
            sx={{
              height: '100%',
              minHeight: 160,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              color: 'text.secondary',
            }}
          >
            <InventoryIcon sx={{ fontSize: 48, opacity: 0.4 }} />
            <Tri ja="ありません" zh="暂无" en="None" size="lg" align="center" />
          </Box>
        )}

        {sections.map(({ cat, items }) => (
          <Box key={cat.key} sx={{ mt: 2 }}>
            <Box sx={{ mb: 1, color: `${side}.main` }}>
              <Tri ja={cat.ja} zh={cat.zh} en={cat.en} size="md" inline />
            </Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(96px, 10vw, 160px), 1fr))',
                gap: { xs: 1, sm: 1.5 },
              }}
            >
              {items.map((item) => (
                <ItemTile
                  key={item.id}
                  item={item}
                  side={side}
                  aspect={cat.aspect}
                  count={counts[item.id] ?? 0}
                  editing={editing}
                  onChange={onChange}
                />
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
