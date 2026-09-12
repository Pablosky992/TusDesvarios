export function getRelatoImage(r: { slug: string; imagen?: string }): string {
  if (r.imagen) return r.imagen;
  if (r.slug === 'el-susurro-en-el-desvan-de-los-relojes') return 'el-susurro-relojes.jpg';
  if (r.slug === 'el-ultimo-eco-de-andromeda') return 'el-ultimo-eco-andromeda.jpg';
  if (r.slug === 'la-taberna-del-cuervo-ciego') return 'la-taberna-cuervo-ciego.jpg';
  if (r.slug === 'el-coleccionista-de-silencios') return 'el-coleccionista-silencios.jpg';
  if (r.slug === 'microrrelatos-de-impacto') return 'microrrelatos-impacto.jpg';
  return 'el-susurro-relojes.jpg';
}
