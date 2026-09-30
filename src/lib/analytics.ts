import { hasStatsConsent } from './consent';

/**
 * Analytics-ready event layer. Events are only pushed to `window.dataLayer`
 * after statistics consent; no analytics vendor is loaded in this presentation.
 */
export type TrackEvent =
  | 'call_click'
  | 'email_click'
  | 'route_click'
  | 'cta_click'
  | 'vehicle_view'
  | 'vehicle_favorite'
  | 'vehicle_compare'
  | 'vehicle_inquiry_submit'
  | 'filter_apply'
  | 'finder_complete'
  | 'ankauf_step'
  | 'ankauf_submit'
  | 'workshop_request_submit'
  | 'contact_submit'
  | 'job_apply_submit'
  | 'rental_booking_click'
  | 'tour_start'
  | 'video_play'
  | 'map_load';

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function track(event: TrackEvent | string, params: Record<string, unknown> = {}): void {
  if (!hasStatsConsent()) return;
  window.dataLayer ??= [];
  window.dataLayer.push({ event, ...params, page: location.pathname });
}

export function bindTrackAttributes(root: ParentNode = document): void {
  root.addEventListener?.('click', (e) => {
    const el = (e.target as Element | null)?.closest<HTMLElement>('[data-track]');
    if (!el) return;
    track(el.dataset.track ?? 'click', {
      location: el.dataset.trackLocation,
      label: el.dataset.trackLabel ?? el.textContent?.trim().slice(0, 80),
    });
  });
}
