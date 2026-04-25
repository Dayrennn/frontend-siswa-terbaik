import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// ✅ EXPORT ke Excel
export function exportToExcel(tableData, pelajaranList) {
    const rows = tableData.map((siswa) => {
        const base = {
            No: siswa.no,
            'Nama Siswa': siswa.namaSiswa || '-',
            'Tanggal Lahir': siswa.tanggalLahir?.split('T')[0] || '-',
            Kelas: siswa.kelas || '-',
        };

        pelajaranList.forEach((p) => {
            const found = siswa.nilai?.find((n) => n.pelajaran.kodePelajaran === p.key);
            base[p.key] = found?.nilai ?? '-';
        });

        return base;
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Siswa');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'data-siswa.xlsx');
}

// ✅ DOWNLOAD Template Excel untuk Import
export function downloadTemplate() {
    const templateRows = [
        {
            namaSiswa: 'Contoh: Budi Santoso',
            tanggalLahir: '2005-08-17',
            kelas: '10A',
            // Tambah kolom nilai jika perlu, misal:
            // MTK: 85,
            // IPA: 90,
        },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateRows);

    // Optional: atur lebar kolom
    worksheet['!cols'] = [
        { wch: 25 }, // namaSiswa
        { wch: 15 }, // tanggalLahir
        { wch: 10 }, // kelas
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'template-import-siswa.xlsx');
}

// ✅ PARSE file Excel yang diupload user
export function parseImportedExcel(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const json = XLSX.utils.sheet_to_json(sheet);
            resolve(json);
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}
