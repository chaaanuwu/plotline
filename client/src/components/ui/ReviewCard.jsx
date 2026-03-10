import bbBg from "../../assets/bb-bg.jpg";

export default function ReviewCard() {
    return (
        <div className="m-4 bg-[var(--surface-color)] border border-[var(--border-color)] rounded-lg shadow-sm overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                    <img
                        src={bbBg}
                        alt="Profile"
                        className="w-12 h-12 object-cover rounded-full"
                        draggable="false"
                    />

                    <div className="flex flex-col leading-tight">
                        <h3 className="font-semibold text-[var(--primary-text)]">
                            John Doe
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

            {/* Review Content */}
            <div className="px-4 pb-4">
                <p className="text-[var(--primary-text)] leading-relaxed">
                    Breaking Bad still holds up as one of the greatest TV shows ever made.
                    The storytelling, character development, and tension are unmatched.
                </p>
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