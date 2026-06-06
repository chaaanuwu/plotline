import { createCanvas, loadImage, registerFont } from 'canvas';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

/**
 * =========================
 * __dirname FOR ESM
 * =========================
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * =========================
 * FONT REGISTRATION
 * =========================
 */
const fontDir = path.join(__dirname, '..', 'fonts');

const regularFont = path.join(fontDir, 'Arial Regular.ttf');
const boldFont = path.join(fontDir, 'Arial Bold.ttf');

try {
    if (fs.existsSync(regularFont)) {
        registerFont(regularFont, { family: 'NotoSans' });
        console.log('✅ Regular font loaded');
    } else {
        console.log('⚠️ Regular font not found:', regularFont);
    }

    if (fs.existsSync(boldFont)) {
        registerFont(boldFont, { family: 'NotoSans', weight: 'bold' });
        console.log('✅ Bold font loaded');
    } else {
        console.log('⚠️ Bold font not found:', boldFont);
    }
} catch (err) {
    console.error('Font registration error:', err.message);
}

/**
 * =========================
 * HELPERS
 * =========================
 */
function wrapText(ctx, text, maxWidth) {
    const words = text.split(' ');
    let line = '';
    const lines = [];

    for (let i = 0; i < words.length; i++) {
        const testLine = line + words[i] + ' ';
        const metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth && i > 0) {
            lines.push(line.trim());
            line = words[i] + ' ';
        } else {
            line = testLine;
        }
    }

    if (line.trim()) lines.push(line.trim());
    return lines;
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

function drawCircularImage(ctx, img, x, y, radius) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(img, x, y, radius * 2, radius * 2);
    ctx.restore();
}

/**
 * =========================
 * MAIN IMAGE GENERATOR
 * =========================
 */
export default async function generateReviewImage(data) {
    try {
        const {
            backdropUrl = "",
            posterUrl = "",
            title = "Untitled",
            reviewText = "No review text provided",
            year = "2025",
            rating = "8.5",
            genres = ["Action", "Adventure"],
            username = "Reviewer",
            userAvatarUrl = "https://via.placeholder.com/200",
            reviewDate = "Today",
            likeCount = "0",
            commentCount = "0",
            linkToReview = "#",
            qrCodeToReview
        } = data;

        const width = 1920;
        const height = 1080;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        const safeLoad = async (url) => {
            try {
                return await loadImage(url);
            } catch {
                return await loadImage(
                    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
                );
            }
        };

        const [bg, poster, avatar] = await Promise.all([
            safeLoad(backdropUrl),
            safeLoad(posterUrl),
            safeLoad(userAvatarUrl)
        ]);

        const paddingLeft = 140;
        const posterWidth = 470;
        const posterHeight = 700;
        const posterY = (height - posterHeight) / 2;
        const contentX = paddingLeft + posterWidth + 100;
        const maxContentWidth = width - contentX - 140;

        /**
         * BACKGROUND
         */
        ctx.drawImage(bg, 0, 0, width, height);

        const overlay = ctx.createLinearGradient(0, 0, 0, height);
        overlay.addColorStop(0, 'rgba(0,0,0,0.5)');
        overlay.addColorStop(1, 'rgba(0,0,0,0.9)');
        ctx.fillStyle = overlay;
        ctx.fillRect(0, 0, width, height);

        /**
         * POSTER
         */
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 60;
        ctx.shadowOffsetY = 30;
        drawRoundedRect(ctx, paddingLeft, posterY, posterWidth, posterHeight, 25);
        ctx.clip();
        ctx.drawImage(poster, paddingLeft, posterY, posterWidth, posterHeight);
        ctx.restore();

        /**
         * TITLE + YEAR
         */
        const titleY = posterY + 10;

        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 100px "NotoSans"';
        ctx.fillText(title, contentX, titleY);

        const titleWidth = ctx.measureText(title).width;
        let currentX = contentX + titleWidth + 30;

        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.font = '300 100px "NotoSans"';
        ctx.fillText(year, currentX, titleY);

        const yearWidth = ctx.measureText(year).width;

        /**
         * GENRES
         */
        const genresY = titleY + 130;
        let genresX = contentX;

        genres.forEach(g => {
            ctx.font = '30px "NotoSans"';

            const textWidth = ctx.measureText(g).width;
            const boxW = textWidth + 40;
            const boxH = 55;

            ctx.fillStyle = 'rgba(255,255,255,0.1)';
            drawRoundedRect(ctx, genresX, genresY, boxW, boxH, 12);
            ctx.fill();

            ctx.fillStyle = '#fff';
            ctx.textBaseline = 'middle';
            ctx.fillText(g, genresX + 20, genresY + boxH / 2);

            genresX += boxW + 15;
        });

        ctx.textBaseline = 'top';

        /**
         * USER
         */
        const userY = genresY + 110;

        drawCircularImage(ctx, avatar, contentX, userY, 45);

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 40px "NotoSans"';
        ctx.fillText(username, contentX + 115, userY + 8);

        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font = '28px "NotoSans"';
        ctx.fillText(reviewDate, contentX + 115, userY + 55);

        /**
         * REVIEW TEXT
         */
        const reviewY = userY + 130;
        const lineSpacing = 55;

        ctx.font = '34px "NotoSans"';
        ctx.fillStyle = 'rgba(255,255,255,0.9)';

        let lines = wrapText(ctx, reviewText, maxContentWidth);
        const maxLines = 4;

        lines.slice(0, maxLines).forEach((line, i) => {
            let text = line;

            if (i === maxLines - 1 && lines.length > maxLines) {
                while (ctx.measureText(text + '...').width > maxContentWidth) {
                    text = text.slice(0, -1);
                }
                text += '...';
            }

            ctx.fillText(text, contentX, reviewY + i * lineSpacing);
        });

        /**
         * INTERACTION BAR (FIXED ICONS)
         */
        const barY = posterY + posterHeight - 90;

        const drawButton = (label, count, x) => {
            const text = `${label} ${count}`;

            ctx.font = 'bold 30px "NotoSans"';
            const w = ctx.measureText(text).width + 60;

            ctx.fillStyle = 'rgba(255,255,255,0.08)';
            drawRoundedRect(ctx, x, barY, w, 90, 45);
            ctx.fill();

            ctx.fillStyle = '#fff';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, x + 30, barY + 45);

            ctx.textBaseline = 'top';

            return w + 20;
        };

        let btnX = contentX;
        btnX += drawButton('LIKES', likeCount, btnX);

        /**
         * FOOTER
         */
        ctx.font = '18px "NotoSans"';
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fillText(`LINK: ${linkToReview}`, paddingLeft, height - 80);

        if (qrCodeToReview) {
            const qrImg = await loadImage(qrCodeToReview);
            ctx.drawImage(qrImg, width - paddingLeft - 125, height - 205, 125, 125);
        }

        return canvas.toBuffer('image/png');

    } catch (err) {
        console.error('Error generating image:', err);
        throw err;
    }
}