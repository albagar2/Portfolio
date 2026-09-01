import { describe, it, expect } from 'vitest';
import { translations } from '../constants/translations';

describe('Translations Core', () => {
  it('debe tener las entradas para es y en', () => {
    expect(translations).toHaveProperty('es');
    expect(translations).toHaveProperty('en');
  });

  it('debe tener paridad de secciones principales entre es y en', () => {
    const esKeys = Object.keys(translations.es).sort();
    const enKeys = Object.keys(translations.en).sort();
    expect(esKeys).toEqual(enKeys);
  });

  it('debe contener claves críticas de navegación en ambos idiomas', () => {
    ['boot', 'skills', 'projects', 'experience', 'education', 'posts', 'signal'].forEach(key => {
      expect(translations.es.nav).toHaveProperty(key);
      expect(translations.en.nav).toHaveProperty(key);
    });
  });

  it('debe contener información completa sobre mí en ambos idiomas', () => {
    ['title', 'subtitle', 'bio'].forEach(key => {
      expect(translations.es.about).toHaveProperty(key);
      expect(translations.en.about).toHaveProperty(key);
      expect(translations.es.about[key].length).toBeGreaterThan(0);
      expect(translations.en.about[key].length).toBeGreaterThan(0);
    });
  });
});
