import bbBg from "../../assets/bb-bg.jpg"; // backdrop
import poster from "../../assets/bb-bg.jpg"; // poster image

export default function ReviewCard({
    firstName,
    lastName,
    pfp,
    reviewDate,
    posterUrl,
    backdropUrl,
    reviewText,
    rating
}) {
    return (
        <div className="m-4 bg-[var(--surface-color)] border border-[var(--border-color)] rounded-lg shadow-sm overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                    <img
                        src={pfp}
                        alt="Profile"
                        className="w-12 h-12 object-cover rounded-full"
                        draggable="false"
                    />

                    <div className="flex flex-col leading-tight">
                        <h3 className="font-semibold text-[var(--primary-text)]">
                            {firstName} {lastName}
                        </h3>
                        <small className="text-[var(--secondary-text-color)]">
                            Posted on {new Date().toLocaleDateString()}
                        </small>
                    </div>
                </div>

                <span className="material-symbols-outlined cursor-pointer text-[var(--secondary-text-color)]">
                    more_horiz
                </span>
            </div>

            <hr className="mx-4 border-[var(--border-color)]" />

            {/* Review Content with images */}
            <div className="px-4 pb-4">

                <div className="relative w-full flex flex-col gap-4">

                    {/* Backdrop (desktop/tablet only) */}
                    <div className="hidden md:block w-full relative rounded-md overflow-hidden">
                        <img
                            src={bbBg}
                            alt="Backdrop"
                            className="w-full h-64 object-cover" // full width, restricted height
                            draggable="false"
                        />

                        {/* Poster over backdrop */}
                        <img
                            src={poster}
                            alt="Poster"
                            className="absolute bottom-2 left-2 w-40 h-56 object-cover rounded-md shadow-lg"
                            draggable="false"
                        />
                    </div>

                    {/* Mobile view: poster only */}
                    <div className="block md:hidden w-full h-48 rounded-md overflow-hidden">
                        <img
                            src={poster}
                            alt="Poster"
                            className="w-full h-full object-cover"
                            draggable="false"
                        />
                    </div>

                    {/* Review text */}
                    <div className="flex-1">
                        <p className="text-[var(--primary-text)] leading-relaxed mt-2 md:mt-0">
                            Breaking Bad still holds up as one of the greatest TV shows ever made.
                            The storytelling, character development, and tension are unmatched.
                        </p>
                    </div>

                </div>
            </div>

            {/* Interaction */}
            <div className="flex justify-between px-4 py-3 border-t border-[var(--border-color)] text-[var(--secondary-text-color)]">
                <button className="flex items-center gap-1 hover:text-[var(--interaction-color)] transition">
                    <span className="material-symbols-outlined text-base">thumb_up</span>
                    Like
                </button>

                <button className="flex items-center gap-1 hover:text-[var(--interaction-color)] transition">
                    <span className="material-symbols-outlined text-base">comment</span>
                    Comment
                </button>
            </div>

        </div>
    );
}