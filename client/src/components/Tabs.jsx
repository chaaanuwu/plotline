import { useState } from "react";

export default function Tabs() {
  const [activeTab, setActiveTab] = useState("reviews");

  return (
    <div>
      {/* Tab Buttons */}
      <div className="mt-8 border-b border-slate-200 sticky top-16 bg-background-light/95 backdrop-blur-sm z-40">
        <div className="flex gap-8 px-4">
          <button
            className={`py-4 border-b-2 text-sm font-semibold ${
              activeTab === "reviews"
                ? "border-primary text-primary"
                : "border-transparent text-slate-500 hover:text-slate-900 transition-colors"
            }`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews
          </button>

          <button
            className={`py-4 border-b-2 text-sm font-semibold ${
              activeTab === "history"
                ? "border-primary text-primary"
                : "border-transparent text-slate-500 hover:text-slate-900 transition-colors"
            }`}
            onClick={() => setActiveTab("history")}
          >
            History
          </button>

          <button
            className={`py-4 border-b-2 text-sm font-semibold ${
              activeTab === "watchlist"
                ? "border-primary text-primary"
                : "border-transparent text-slate-500 hover:text-slate-900 transition-colors"
            }`}
            onClick={() => setActiveTab("watchlist")}
          >
            Watchlist
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 mt-4">
        {activeTab === "reviews" && <div>Reviews Content Here</div>}
        {activeTab === "history" && <div>History Content Here</div>}
        {activeTab === "watchlist" && <div>Watchlist Content Here</div>}
      </div>
    </div>
  );
}