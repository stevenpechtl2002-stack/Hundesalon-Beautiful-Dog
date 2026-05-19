export default {
  name: 'service',
  title: 'Leistungen',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Leistungsname',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'description',
      title: 'Beschreibung',
      type: 'text',
      rows: 3,
    },
    {
      name: 'icon',
      title: 'Icon (Emoji)',
      type: 'string',
      description: 'z.B. 🚿 ✂️ 💅 👂',
    },
    {
      name: 'order',
      title: 'Reihenfolge',
      type: 'number',
      description: 'Niedrigere Zahl = weiter oben',
    },
  ],
  orderings: [
    {
      title: 'Reihenfolge',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'description', media: 'icon' },
    prepare({ title, subtitle, media }) {
      return { title: `${media || '🐾'} ${title}`, subtitle }
    },
  },
}
