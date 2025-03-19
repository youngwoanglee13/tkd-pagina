import { Injectable } from '@angular/core';
import { Payment } from '../interfaces/payment';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, ShadingType } from 'docx';
import { saveAs } from 'file-saver';
import { spanishFormat } from '../helpers/date_helper';

@Injectable({
  providedIn: 'root'
})
export class PaymentsDocxGeneratorService {

  constructor() { }
  generateDocx(payments: Payment[], inputDate: string) {
    const downloadedDate = new Date().toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    
    const inputDateTitle = inputDate? new Date(inputDate+"/01").toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
    }) : 'todos';

    const inputDateDocxName = inputDate? new Date(inputDate+"/01").toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
    }) : 'todos';

    // Título del documento
    const title = new Paragraph({
      children: [new TextRun({ text: `Pagos ${inputDateTitle}`, bold: true, size: 32 })],
    });
    // Fecha de generación del documento
    const genaratedDate = new Paragraph({
      children: [new TextRun({ text: `Actualizado hasta el ${downloadedDate}`, size: 15 })],
    });

    // Cabecera de la tabla
    const tableHeader = new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ indent: { left: 100 }, children: [new TextRun({ text: "Nombre", bold: true })],
          }),],
          width: { size: 38, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [new Paragraph({ indent: { left: 100 }, children: [new TextRun({ text: "Bs.", bold: true })] })],
          width: { size: 6, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [new Paragraph({ indent: { left: 100 }, children: [new TextRun({ text: "Fecha", bold: true })] })],
          width: { size: 16, type: WidthType.PERCENTAGE },
        }),
        new TableCell({
          children: [new Paragraph({ indent: { left: 100 }, children: [new TextRun({ text: "Nota", bold: true })] })],
          width: { size: 40, type: WidthType.PERCENTAGE },
        }),
      ],
    });

    // Filas con los datos de los pagos
    const tableRows = payments.map((payment, index) => {
      const isEven = index % 2 === 0;

      return new TableRow({
        height: { value: 400, rule: "atLeast" }, // Aumenta la altura de las filas
        children: [
          new TableCell({ 
            children: [new Paragraph({ text: payment.student_name, indent: { left: 100 } })], 
            width: { size: 38, type: WidthType.PERCENTAGE },
            verticalAlign: "center", // Centrado vertical
            shading: { type: ShadingType.CLEAR, fill: isEven ? "F8F4F4" : "FFFFFF" },
          }),
          new TableCell({ 
            children: [new Paragraph({ text: payment.amount.toString(), indent: { left: 100 } })], 
            width: { size: 6, type: WidthType.PERCENTAGE },
            verticalAlign: "center",
            shading: { type: ShadingType.CLEAR, fill: isEven ? "F8F4F4" : "FFFFFF" },
          }),
          new TableCell({ 
            children: [new Paragraph({ text: spanishFormat(payment.date), indent: { left: 100 } })], 
            width: { size: 16, type: WidthType.PERCENTAGE },
            verticalAlign: "center",
            shading: { type: ShadingType.CLEAR, fill: isEven ? "F8F4F4" : "FFFFFF" },
          }),
          new TableCell({ 
            children: [new Paragraph({ text: payment.comment, indent: { left: 100 } })], 
            width: { size: 40, type: WidthType.PERCENTAGE },
            verticalAlign: "center",
            shading: { type: ShadingType.CLEAR, fill: isEven ? "F8F4F4" : "FFFFFF" },
          }),
        ],
      });
    });

    // Crear la tabla
    const table = new Table({
      rows: [tableHeader, ...tableRows],
      width: { size: 100, type: WidthType.PERCENTAGE },
    });

    // Crear el documento
    const doc = new Document({
      sections: [{ children: [title,genaratedDate, new Paragraph(''), table] }],
    });

    // Guardar el archivo
    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `Pagos ${inputDateDocxName}.docx`);
    });
  }
}
