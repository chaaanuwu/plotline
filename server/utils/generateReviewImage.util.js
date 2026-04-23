import { createCanvas, loadImage } from 'canvas';

/**
 * Helper function to wrap text for the review body
 */
function wrapText(ctx, text, maxWidth) {
    const words = text.split(' ');
    let line = '';
    const lines = [];

    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && n > 0) {
            lines.push(line.trim());
            line = words[n] + ' ';
        } else {
            line = testLine;
        }
    }
    if (line.trim()) lines.push(line.trim());
    return lines;
}

/**
 * Draw rounded rectangle
 */
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

/**
 * Draw a circular image (Avatar)
 */
function drawCircularImage(ctx, img, x, y, radius) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(img, x, y, radius * 2, radius * 2);
    ctx.restore();
}

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
            linkToReview="#"
        } = data;

        const width = 1920;
        const height = 1080;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        const safeLoad = async (url) => {
            try { return await loadImage(url); }
            catch (e) { return await loadImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='); }
        };

        const [bg, poster, avatar] = await Promise.all([
            safeLoad(backdropUrl),
            safeLoad(posterUrl),
            safeLoad(userAvatarUrl)
        ]);

        // Layout Constants
        const paddingLeft = 140;
        const posterWidth = 470;
        const posterHeight = 700;
        const posterY = (height - posterHeight) / 2;
        const contentX = paddingLeft + posterWidth + 100;
        const maxContentWidth = width - contentX - 140;

        // --- 1. Background ---
        ctx.drawImage(bg, 0, 0, width, height);
        const overlay = ctx.createLinearGradient(0, 0, 0, height);
        overlay.addColorStop(0, 'rgba(0, 0, 0, 0.5)');
        overlay.addColorStop(1, 'rgba(0, 0, 0, 0.9)');
        ctx.fillStyle = overlay;
        ctx.fillRect(0, 0, width, height);

        // --- 2. Poster ---
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 60;
        ctx.shadowOffsetY = 30;
        drawRoundedRect(ctx, paddingLeft, posterY, posterWidth, posterHeight, 25);
        ctx.clip();
        ctx.drawImage(poster, paddingLeft, posterY, posterWidth, posterHeight);
        ctx.restore();

        // --- 3. Header Row (Title, Year, Rating) ---
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        const titleY = posterY + 10;

        // Title: Bold and White
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 100px "Arial", sans-serif';
        ctx.fillText(title, contentX, titleY);
        const titleWidth = ctx.measureText(title).width;

        // Year: Light and Faded
        let currentX = contentX + titleWidth + 30;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.font = '300 100px "Arial", sans-serif'; 
        ctx.fillText(year, currentX, titleY);
        const yearWidth = ctx.measureText(year).width;

        // Rating Badge
        const ratingX = currentX + yearWidth + 45;
        const ratingY = titleY + 20; 
        const ratingText = `⭐ ${rating}`;
        
        ctx.font = 'bold 36px "Arial", sans-serif';
        const badgeWidth = ctx.measureText(ratingText).width + 44;
        const badgeHeight = 70;

        ctx.fillStyle = 'rgba(255, 193, 7, 0.15)'; 
        drawRoundedRect(ctx, ratingX, ratingY, badgeWidth, badgeHeight, 15);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 193, 7, 0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#FFC107';
        ctx.textBaseline = 'middle';
        ctx.fillText(ratingText, ratingX + 22, ratingY + (badgeHeight / 2));
        ctx.textBaseline = 'top';

        // --- 4. Genres ---
        const genresY = titleY + 130;
        let genresX = contentX;
        genres.forEach(g => {
            ctx.font = '30px "Arial", sans-serif';
            const gTextWidth = ctx.measureText(g).width;
            const gW = gTextWidth + 40;
            const gH = 55;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            drawRoundedRect(ctx, genresX, genresY, gW, gH, 12);
            ctx.fill();
            ctx.fillStyle = '#FFFFFF';
            ctx.textBaseline = 'middle';
            ctx.fillText(g, genresX + 20, genresY + gH / 2);
            genresX += gW + 15;
        });
        ctx.textBaseline = 'top';

        // --- 5. User Profile ---
        const userY = genresY + 110;
        drawCircularImage(ctx, avatar, contentX, userY, 45);
        ctx.font = 'bold 40px "Arial", sans-serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(username, contentX + 115, userY + 8);
        ctx.font = '28px "Arial", sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillText(reviewDate, contentX + 115, userY + 55);

        // --- 6. Review Text (Limited to 4 lines with Ellipsis) ---
        const reviewY = userY + 130;
        const lineSpacing = 55;
        ctx.font = '34px "Arial", sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        
        let lines = wrapText(ctx, reviewText, maxContentWidth);
        const maxLines = 4;

        lines.slice(0, maxLines).forEach((line, i) => {
            let textToDraw = line;
            
            // If we are on the 4th line and there are more lines remaining
            if (i === maxLines - 1 && lines.length > maxLines) {
                // Remove characters until the line + "..." fits
                while (ctx.measureText(textToDraw + "...").width > maxContentWidth && textToDraw.length > 0) {
                    textToDraw = textToDraw.substring(0, textToDraw.length - 1);
                }
                textToDraw += "...";
            }
            
            ctx.fillText(textToDraw, contentX, reviewY + (i * lineSpacing));
        });

        // --- 7. Interaction Bar ---
        const barY = posterY + posterHeight - 90;
        const drawButton = (icon, count, x) => {
            const label = `${icon}  ${count}`;
            ctx.font = 'bold 30px "Arial", sans-serif';
            const bWidth = ctx.measureText(label).width + 60;
            ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
            drawRoundedRect(ctx, x, barY, bWidth, 90, 45);
            ctx.fill();
            ctx.fillStyle = '#FFFFFF';
            ctx.textBaseline = 'middle';
            ctx.fillText(label, x + 30, barY + 45);
            ctx.textBaseline = 'top';
            return bWidth + 20;
        };

        let btnX = contentX;
        btnX += drawButton('❤️', likeCount, btnX);
        btnX += drawButton('💬', commentCount, btnX);

        // --- 8. Link to Review (Small Text at the Bottom) ---
        ctx.font = '18px "Arial", sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillText(`🔗 ${linkToReview}`, paddingLeft, height - 80);

        return canvas.toBuffer('image/png');

    } catch (error) {
        console.error('Error generating image:', error);
        throw error;
    }
}