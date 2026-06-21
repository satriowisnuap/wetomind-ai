export interface WetonResult {
    hariJawa: string;
    pasaran: string;
    neptuHari: number;
    neptuPasaran: number;
    totalNeptu: number;
    tanggalLahir: string;
}

// Alias agar tetap kompatibel jika ada kode lama memakai WetonData
export type WetonData = WetonResult;

// 0 = Minggu, 1 = Senin, dst.
const HARI_NEPTU: Record<number, { hari: string; neptu: number }> = {
    0: { hari: 'Minggu', neptu: 5 },
    1: { hari: 'Senin', neptu: 4 },
    2: { hari: 'Selasa', neptu: 3 },
    3: { hari: 'Rabu', neptu: 7 },
    4: { hari: 'Kamis', neptu: 8 },
    5: { hari: 'Jumat', neptu: 6 },
    6: { hari: 'Sabtu', neptu: 9 },
};

const PASARAN_NEPTU = [
    { pasaran: 'Pahing', neptu: 9 },
    { pasaran: 'Pon', neptu: 7 },
    { pasaran: 'Wage', neptu: 4 },
    { pasaran: 'Kliwon', neptu: 8 },
    { pasaran: 'Legi', neptu: 5 },
] as const;

/**
 * Menghitung weton berdasarkan tanggal lahir.
 *
 * Referensi:
 * 1 Januari 1970 = Kamis Pahing
 */
export function getWeton(dateString: string): WetonResult {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        throw new Error('Tanggal tidak valid');
    }

    const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));

    const dayIndex = utcDate.getUTCDay();
    const hari = HARI_NEPTU[dayIndex];

    const epoch = new Date(Date.UTC(1970, 0, 1));

    const diffDays = Math.floor((utcDate.getTime() - epoch.getTime()) / (1000 * 60 * 60 * 24));

    const pasaranIndex = ((diffDays % 5) + 5) % 5;
    const pasaran = PASARAN_NEPTU[pasaranIndex];

    return {
        hariJawa: hari.hari,
        pasaran: pasaran.pasaran,
        neptuHari: hari.neptu,
        neptuPasaran: pasaran.neptu,
        totalNeptu: hari.neptu + pasaran.neptu,
        tanggalLahir: dateString,
    };
}

/**
 * Perhitungan kecocokan jodoh berdasarkan total neptu.
 */
export function getPaduanJodoh(neptu1: number, neptu2: number): string {
    const total = neptu1 + neptu2;
    const hasil = total % 9;

    switch (hasil) {
        case 1:
            return 'Pegat';

        case 2:
            return 'Ratu';

        case 3:
            return 'Jodoh';

        case 4:
            return 'Topo';

        case 5:
            return 'Tinari';

        case 6:
            return 'Padu';

        case 7:
            return 'Sujanan';

        case 8:
            return 'Pesthi';

        case 0:
            return 'Pesthi';

        default:
            return 'Pesthi';
    }
}
