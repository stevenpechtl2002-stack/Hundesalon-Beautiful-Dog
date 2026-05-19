export default {
  name: 'gallery',
  title: 'Galerie / Bilder',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Bildtitel',
      type: 'string',
    },
    {
      name: 'image',
      title: 'Bild',
      type: 'image',
      options: { hotspot: true },
      validation: Rule => Rule.required(),
    },
    {
      name: 'alt',
      title: 'Bildbeschreibung (Alt-Text)',
      type: 'string',
      description: 'Für Barrierefreiheit und SEO',
    },
    {
      name: 'section',
      title: 'Bereich',
      type: 'string',
      options: {
        list: [
          { title: 'Hero Bereich', value: 'hero' },
          { title: 'Über uns', value: 'about' },
          { title: 'Galerie', value: 'gallery' },
          { title: 'Allgemein', value: 'general' },
        ],
        layout: 'radio',
      },
      initialValue: 'gallery',
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
    select: { title: 'title', media: 'image', subtitle: 'section' },
  },
}
