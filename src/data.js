// 商品数据：从 assets/goods 下的文件名自动生成
// badge/{成员序号}_{款式}.jpg   card/{成员序号}.jpg

export const MEMBERS = {
  1: { ja: '高海千歌', zh: '高海千歌', en: 'Chika', color: '#ff9547' },
  2: { ja: '桜内梨子', zh: '樱内梨子', en: 'Riko', color: '#ff9eac' },
  3: { ja: '松浦果南', zh: '松浦果南', en: 'Kanan', color: '#27c1b7' },
  4: { ja: '黒澤ダイヤ', zh: '黑泽黛雅', en: 'Dia', color: '#db0839' },
  5: { ja: '渡辺曜', zh: '渡边曜', en: 'You', color: '#66c0ff' },
  6: { ja: '津島善子', zh: '津岛善子', en: 'Yoshiko', color: '#c1cad4' },
  7: { ja: '国木田花丸', zh: '国木田花丸', en: 'Hanamaru', color: '#ffd010' },
  8: { ja: '小原鞠莉', zh: '小原鞠莉', en: 'Mari', color: '#c252c6' },
  9: { ja: '黒澤ルビィ', zh: '黑泽露比', en: 'Ruby', color: '#ff6fbe' },
}

export const CATEGORIES = [
  { key: 'badge', ja: '缶バッジ', zh: '吧唧', en: 'Badge', aspect: '1 / 1' },
  { key: 'card', ja: 'カード', zh: '卡片', en: 'Card', aspect: '354 / 555' },
]

const files = import.meta.glob('./assets/goods/*/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
})

function parse(path, src) {
  const m = path.match(/goods\/(\w+)\/(\d+)(?:_(\d+))?\.\w+$/)
  if (!m) return null
  const [, category, member, variant] = m
  return {
    id: `${category}-${member}${variant ? `-${variant}` : ''}`,
    category,
    member: Number(member),
    variant: variant ? Number(variant) : null,
    src,
  }
}

export const ITEMS = Object.entries(files)
  .map(([p, src]) => parse(p, src))
  .filter(Boolean)
  .sort((a, b) => a.member - b.member || (a.variant ?? 0) - (b.variant ?? 0))

export const itemLabel = (item) =>
  `${MEMBERS[item.member]?.ja ?? item.member}${item.variant ? ` ${'ABCDEFG'[item.variant - 1]}` : ''}`
