import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'candles/search/:searchTerm',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
       return [
          { searchTerm: 'searchTerm1' },
          { searchTerm: 'searchTerm2' },
          { searchTerm: 'searchTerm3' }
        ];
    }
  },
  {
    path: 'candles/tag/:tag',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return [
          { tag: 'tag1' },
          { tag: 'tag2' },
          { tag: 'tag3' }
        ];
    }
  },
  {
    path: 'candles/filter/:filter',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return [
          { filter: 'filter1' },
          { filter: 'filter2' },
          { filter: 'filter3' }
        ];
    }
  },
  {
    path: 'candle_information/:detail_product',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return [
          { detail_product: 'Amber_And_Vanilla' },
          { detail_product: 'Coconut_And_Sea_Salt' },
          { detail_product: 'Day_Party' }
        ];
    }
  }
];
