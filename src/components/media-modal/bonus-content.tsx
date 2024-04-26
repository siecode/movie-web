import { fetchTMDB } from '@/actions/fetch-tmdb';
import { DomContextProvider } from '@/providers/dom-provider';
import { SliderProvider } from '@/providers/slider-provider';

import { ContentRouteParams, TODO } from '@/lib/types';
import { MediaHeader } from '@/components/fonts';
import Slider from '@/components/slider/slider';

export default async function Trailers({ id, mediaType }: ContentRouteParams) {
  const videos = await fetchTMDB({ category: 'videos', mediaType, id });

  const bonusContent = videos.results.filter(
    (video: TODO) => video.type === 'Featurette' && video.site === 'YouTube'
  );

  if (!bonusContent.length) return null;

  return (
    <section>
      <SliderProvider content={bonusContent} mediaType='bonus'>
        <DomContextProvider>
          <MediaHeader>Bonus Content</MediaHeader>
          <Slider />
        </DomContextProvider>
      </SliderProvider>
    </section>
  );
}