import QRCode from 'qrcode';

export const generateQR = async (link) => {
    try {
        const qrCode = await QRCode.toDataURL(link, { errorCorrectionLevel: 'H' });

        if (!qrCode) {
            throw new Error("Failed to generate QR code.");
        }

        return qrCode;
        
    } catch (error) {
        console.error("Generate QR code error:", error);
        throw error;
    }
};