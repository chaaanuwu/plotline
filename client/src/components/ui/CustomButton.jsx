// CustomButton.jsx
import React from "react";

export default function CustomButton({
    children,
    bgColor = "#6366f1",    // background
    textColor = "#fff",      // text/icon color
    border = "none",         // border CSS
    size,                    // number (px) for circle/square button
    rounded = "xl",          // "full", "xl", "md", "none", etc.
    padding,                 // custom padding (overrides default)
    fontSize = "1rem",       // font size
    fontWeight = 500,        // font weight
    onClick,
    hoverShadow = true,      // add shadow on hover
    className = "",          // extra classes
    style = {},              // extra inline styles
}) {
    // Base styles
    const baseStyle = {
        backgroundColor: bgColor,
        color: textColor,
        border,
        fontSize,
        fontWeight,
        padding: size ? 0 : padding || "0.625em 1.5em",
        width: size || "auto",
        height: size || "auto",
        minWidth: size || "auto",
        minHeight: size || "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: size ? "9999px" : rounded === "full" ? "9999px" : rounded === "xl" ? "1rem" : rounded === "md" ? "0.5rem" : "0",
        cursor: "pointer",
        transition: "all 0.3s ease",
        ...style
    };

    return (
        <button
            onClick={onClick}
            className={`${hoverShadow ? "hover:shadow-lg" : ""} ${className}`}
            style={baseStyle}
        >
            {children}
        </button>
    );
}