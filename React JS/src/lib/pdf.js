import * as pdfjsLib from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

let workerConfigured = false;

function ensureWorker() {
  if (!workerConfigured) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
    workerConfigured = true;
  }
}

export function loadPdf(url) {
  ensureWorker();
  const task = pdfjsLib.getDocument({ url, isEvalSupported: false });
  return { task, promise: task.promise };
}

export async function renderPageToCanvas(doc, pageNumber, scale, background = '#ffffff') {
  const page = await doc.getPage(pageNumber);
  const vp = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  canvas.width = Math.floor(vp.width);
  canvas.height = Math.floor(vp.height);
  await page.render({ canvasContext: canvas.getContext('2d'), viewport: vp, canvas, background }).promise;
  return canvas;
}

export const RENDER_SCALE = Math.min(1.5, Math.max(1, 0.9 * (window.devicePixelRatio || 1)));
export const THUMB_SCALE = 0.22;
export const MAX_CACHE = 24;
export const PRE_RENDER_AHEAD = 12;

const coverCache = new Map();

export function getCoverCanvas(url, scale = 0.55) {
  const key = url + '@' + scale;
  if (coverCache.has(key)) return coverCache.get(key);
  const promise = (async () => {
    const { promise } = loadPdf(url);
    const doc = await promise;
    try {
      return await renderPageToCanvas(doc, 1, scale);
    } finally {
      doc.destroy();
    }
  })();
  coverCache.set(key, promise);
  return promise;
}
