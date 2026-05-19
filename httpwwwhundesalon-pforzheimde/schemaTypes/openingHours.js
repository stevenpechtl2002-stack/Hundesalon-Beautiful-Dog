export default {
  name: 'openingHours',
  title: 'Öffnungszeiten',
  type: 'document',
  fields: [
    {
      name: 'days',
      title: 'Tage',
      type: 'string',
      description: 'z.B. "Mo – Do" oder "Samstag"',
      validation: Rule => Rule.required(),
    },
    {
      name: 'hours',
      title: 'Uhrzeit',
      type: 'string',
      description: 'z.B. "08:30 – 17:30" oder "Nach Absprache"',
      validation: Rule => Rule.required(),
    },
    {
      name: 'isOpen',
      title: 'Geöffnet?',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'order',
      title: 'Reihenfolge',
      type: 'number',
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
    select: { title: 'days', subtitle: 'hours' },
  },
}
