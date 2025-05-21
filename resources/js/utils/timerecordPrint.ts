import { Students, TimeRecord } from '@/types';
import { format, parseISO } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface PrintArgs {
    user: { name: string };
    student: Students;
    timeRecords: { data: TimeRecord[] };
    required_hours: number;
}

interface ExtendedJsPDF extends jsPDF {
    lastAutoTable: {
        finalY: number;
    };
}

export async function printTimeRecord(args: PrintArgs) {
    const { user, student, timeRecords, required_hours } = args;

    // Load the logo image and convert to base64
    const logoUrl = '/images/lc.png'; // relative to public
    const toDataURL = (url: string) =>
        new Promise<string>((resolve, reject) => {
            const img = new window.Image();
            img.crossOrigin = 'Anonymous';
            img.onload = function () {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(img, 0, 0);
                    resolve(canvas.toDataURL('image/png'));
                } else {
                    reject('Canvas context not found');
                }
            };
            img.onerror = reject;
            img.src = url;
        });

    const logoDataUrl = await toDataURL(logoUrl);

    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' }) as ExtendedJsPDF;
    const pageWidth = doc.internal.pageSize.getWidth();
    let margin = 10;
    let y = 10;

    // --- Centered header block ---
    const logoWidth = 18;
    const logoHeight = 20;
    const startX = margin;

    // Draw logo
    doc.addImage(logoDataUrl, 'PNG', startX, y, logoWidth, logoHeight);

    // Draw text, aligned to the right of the logo
    let textY = y + 7;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('LEMERY COLLEGES', startX + logoWidth + 4, textY, { align: 'left' });
    textY += 6;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('A. Bonifacio St., Bagong Sikat, Lemery, Batangas 4209', startX + logoWidth + 4, textY, { align: 'left' });
    textY += 5;
    doc.setFont('helvetica', 'bold');
    doc.text('COLLEGE OF ARTS, SCIENCES AND TECHNOLOGY', startX + logoWidth + 4, textY, { align: 'left' });
    textY += 5;
    const longText = 'SOCIETY OF EXEMPLARY LEADERS AND ENABLERS OF COMPUTING AND TECHNOLOGY (CAST-SELECT)';
    const wrappedText = doc.splitTextToSize(longText, 120); // 120mm or adjust as needed
    doc.text(wrappedText, startX + logoWidth + 4, textY, { align: 'left' });
    textY += 20;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('ON-THE-JOB TRAINING TIME FRAME', pageWidth / 2, textY, { align: 'center' });
    y = textY + 8;

    // Student/trainee details (placeholders)
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const details = [
        ['Name Of Student-Trainee:', user?.name],
        ['Branch Department / Section:', student.department.name],
        ['Name Of Supervisor:', student.company_submission?.supervisor_name],
        ['Training Schedule (Hours And Days):', '8:00 AM – 5:00 PM | Monday to Friday'],
        ['Required Number Of Hours:', `${required_hours} Hours`],
        ['Effective Date Of Start:', 'June 1, 2025'],
    ];
    details.forEach(([label, value]) => {
        doc.text(`${label}  ${value}`, margin, y);
        y += 7;
    });
    y += 2;

    // Table columns
    const tableHead = [['Date', 'Time In', 'Time Out', 'No. of Hours', "Supervisor's Signature"]];
    const tableBody = timeRecords.data.map((record) => [
        format(parseISO(record.date), 'MM/dd/yyyy'),
        record.time_in ? format(parseISO(record.time_in), 'hh:mm a') : '',
        record.time_out ? format(parseISO(record.time_out), 'hh:mm a') : '',
        record.rendered_hours?.toString() || '',
        '', // Supervisor's signature left blank
    ]);

    // Add table
    autoTable(doc, {
        startY: y,
        head: tableHead,
        body: tableBody,
        theme: 'grid',
        headStyles: {
            fillColor: [200, 200, 200],
            textColor: 0,
            fontStyle: 'bold',
            halign: 'center',
        },
        styles: {
            fontSize: 10,
            cellPadding: 2,
            valign: 'middle',
            halign: 'center',
            minCellHeight: 8,
        },
        tableWidth: 'auto',
        margin: { left: margin, right: margin },
        didDrawPage: (data) => {
            if (data.cursor) {
                const totalHours = timeRecords.data.reduce((sum, record) => sum + (record.rendered_hours || 0), 0);
                doc.setFont('helvetica', 'bold');
                doc.text('Total No. of Hours:', pageWidth - margin - 60, data.cursor.y + 8);
                doc.setFont('helvetica', 'normal');
                doc.text(`${totalHours}`, pageWidth - margin - 20, data.cursor.y + 8);
            }
        },
    });

    // Certification/Signature section
    let certY = (doc.lastAutoTable?.finalY || y) + 20;
    doc.setFont('helvetica', 'normal');
    doc.text('Certified By:', margin, certY);
    certY += 18;
    margin += 5;
    doc.text('_________________________________', margin, certY);
    certY += 5;
    margin -= 1;
    doc.text("Supervisor's Signature Over Printed Name", margin, certY);

    const pdfUrl = doc.output('bloburl');
    const printWindow = window.open(pdfUrl, '_blank');
    if (printWindow) {
        printWindow.onload = function () {
            printWindow.focus();
            printWindow.print();
        };
    }
}
