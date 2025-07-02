declare module 'pdfmake/build/pdfmake' {
  import type { TDocumentDefinitions, TCreatedPdf } from 'pdfmake/interfaces'

  interface PdfMake {
    createPdf: (docDefinition: TDocumentDefinitions) => TCreatedPdf
    vfs: Record<string, string>
  }

  const pdfMake: PdfMake
  export default pdfMake
}

declare module 'pdfmake/build/vfs_fonts' {
  const vfsFonts: {
    pdfMake: {
      vfs: Record<string, string>
    }
  }
  export = vfsFonts
}
