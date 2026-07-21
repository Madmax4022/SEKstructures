/** Etiqueta de build visible en la UI para diagnosticar versiones en caché. */
export const BUILD_TAG: string = (import.meta.env.VITE_BUILD_TAG as string | undefined) ?? 'dev';
