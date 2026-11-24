import { Box, Typography } from '@mui/material'

// 三语标签：日语为主，中文 / 英文为辅
export default function Tri({ ja, zh, en, size = 'md', color = 'inherit', align = 'left', inline = false }) {
  const s = {
    xl: { main: 'clamp(28px, 4.2vw, 44px)', sub: 'clamp(12px, 1.4vw, 15px)' },
    lg: { main: 20, sub: 12 },
    md: { main: 16, sub: 11 },
    sm: { main: 14, sub: 10 },
  }[size]
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: inline ? 'row' : 'column',
        alignItems: inline ? 'baseline' : align === 'center' ? 'center' : 'flex-start',
        gap: inline ? 1 : 0,
        color,
        lineHeight: 1.15,
        minWidth: 0,
      }}
    >
      <Typography component="span" sx={{ fontSize: s.main, fontWeight: 700, lineHeight: 1.15 }}>
        {ja}
      </Typography>
      <Typography component="span" sx={{ fontSize: s.sub, opacity: 0.75, lineHeight: 1.3, whiteSpace: 'nowrap' }}>
        {zh} · {en}
      </Typography>
    </Box>
  )
}
