import { Injectable } from '@angular/core';
import { Payment } from '../interfaces/payment';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType } from 'docx';
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
      children: [new TextRun({ text: `Actualizado hasta el ${downloadedDate}`, size: 14 })],
    });

    // Cabecera de la tabla
    const tableHeader = new TableRow({
      children: ['Nombre', 'Monto Bs.', 'Fecha (Dia,Mes,Año)', 'Decripcion'].map((text) =>
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text, bold: true })] })],
          width: { size: 25, type: WidthType.PERCENTAGE },
        })
      ),
    });

    // Filas con los datos de los pagos
    const tableRows = payments.map(
      (payment) =>
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph(payment.student_name)] }),
            new TableCell({ children: [new Paragraph(payment.amount.toString())] }),
            new TableCell({ children: [new Paragraph(spanishFormat(payment.date))] }),
            new TableCell({ children: [new Paragraph(payment.comment)] }),
          ],
        })
    );

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
