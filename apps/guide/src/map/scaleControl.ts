// =============================================================================
// The scale bar, updated when the camera settles instead of every frame.
//
// MapLibre's ScaleControl unprojects two screen points on every 'move'. With
// 3D terrain on, each unproject reads the terrain's coordinate framebuffer
// back from the GPU (`gl.readPixels`), a synchronous stall, so the scale bar
// alone flushed the GPU pipeline twice a frame: in the September 2026
// profile it was the largest remaining main-thread cost of a pan once the
// pin readbacks were gone (see map/pinMarker.ts). The bar is approximate on
// a tilted view anyway, so in 3D it is redrawn on moveend; the flat map has
// no framebuffer to read and keeps the live bar.
// =============================================================================

import maplibregl from 'maplibre-gl'

export class SettledScaleControl extends maplibregl.ScaleControl {
  private onMoveLive = () => {
    if (!this._map?.terrain) this._onMove()
  }

  override onAdd(map: maplibregl.Map): HTMLElement {
    const container = super.onAdd(map)
    map.off('move', this._onMove)
    map.on('move', this.onMoveLive)
    map.on('moveend', this._onMove)
    map.on('terrain', this._onMove)
    return container
  }

  override onRemove(): void {
    const map = this._map
    map?.off('move', this.onMoveLive)
    map?.off('moveend', this._onMove)
    map?.off('terrain', this._onMove)
    super.onRemove()
  }
}
