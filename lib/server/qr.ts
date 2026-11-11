import qrcodegen from '../qrcodegen'

/** Renders text as a QR code SVG string (dark modules on a light quiet zone, as authenticator scanners expect). */
export function qrSvg(text: string, scale = 6, border = 3): string {
  const qr = qrcodegen.QrCode.encodeText(text, qrcodegen.QrCode.Ecc.MEDIUM)
  const n = qr.size + border * 2
  let path = ''
  for (let y = 0; y < qr.size; y++) {
    for (let x = 0; x < qr.size; x++) {
      if (qr.getModule(x, y)) path += 'M' + (x + border) + ',' + (y + border) + 'h1v1h-1z'
    }
  }
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + n + ' ' + n + '" width="' + n * scale + '" height="' + n * scale + '" shape-rendering="crispEdges">' +
    '<rect width="100%" height="100%" fill="#e9ffe9"/><path d="' + path + '" fill="#021002"/></svg>'
}
