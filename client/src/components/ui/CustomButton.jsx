export default function CustomButton({
    children,
    onClick,
    className = "",
    style = {},
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={className}
            style={style}
        >
            {children}
        </button>
    );
}