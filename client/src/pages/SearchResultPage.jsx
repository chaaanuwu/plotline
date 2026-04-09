import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MagnifyingGlassIcon, UserGroupIcon, FilmIcon } from "@heroicons/react/24/outline";

import MovieCard from "../components/ui/MovieCard";
import { searchUsers } from "../api/user.api";
import Loader from "../components/ui/Loader";
// import { searchMovies } from "../api/movie.api"; 

export default function SearchResultPage() {
    const [movies, setMovies] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all"); // 'all' | 'movies' | 'users'

    const location = useLocation();
    const searchQuery = new URLSearchParams(location.search).get("q");

    useEffect(() => {
        const fetchResults = async () => {
            if (!searchQuery) return;
            setLoading(true);
            try {
                const [usersRes] = await Promise.all([
                    searchUsers(searchQuery),
                    // searchMovies(searchQuery),
                ]);

                setUsers(usersRes.users || []);
                setMovies([]);
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [searchQuery]);

    if (loading) return <Loader
    //  text={`Searching the archives for "${searchQuery}"`}
      />;

    return (
        <div className="min-h-screen bg-stone-50 pt-28 pb-20">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                
                {/* 1. SEARCH HEADER */}
                <header className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-0.5 w-8 bg-amber-500/40" />
                        <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">Search Results</h5>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-stone-900 tracking-tighter">
                        Showing results for <span className="text-amber-600">"{searchQuery}"</span>
                    </h1>

                    {/* Filter Pills */}
                    <div className="flex gap-2 mt-8">
                        {["all", "movies", "users"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                    activeTab === tab 
                                    ? "bg-stone-900 text-white shadow-lg" 
                                    : "bg-white border border-stone-200 text-stone-400 hover:text-stone-900"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </header>

                <main className="space-y-20">
                    {/* 2. MOVIES SECTION */}
                    {(activeTab === "all" || activeTab === "movies") && (
                        <section>
                            <SectionHeader title="Movies" count={movies.length} icon={<FilmIcon className="size-5" />} />
                            {movies.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
                                    {movies.map((m) => (
                                        <MovieCard key={m.id} title={m.title} poster={m.posterPath} rating={m.voteAverage} releaseDate={m.releaseDate} />
                                    ))}
                                </div>
                            ) : (
                                <EmptyResult message="No movies found matching your request." />
                            )}
                        </section>
                    )}

                    {/* 3. USERS SECTION */}
                    {(activeTab === "all" || activeTab === "users") && (
                        <section>
                            <SectionHeader title="Community" count={users.length} icon={<UserGroupIcon className="size-5" />} />
                            {users.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {users.map((u) => (
                                        <UserResultCard key={u._id} user={u} />
                                    ))}
                                </div>
                            ) : (
                                <EmptyResult message="No critics or members found with that name." />
                            )}
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
}

/** * UI SUB-COMPONENTS 
 */

function SectionHeader({ title, count, icon }) {
    return (
        <div className="flex items-center gap-4 mb-8 border-b border-stone-200 pb-4">
            <div className="text-amber-600">{icon}</div>
            <h2 className="text-2xl font-black tracking-tight text-stone-900">{title}</h2>
            <span className="bg-stone-200 text-stone-600 text-[10px] font-black px-2 py-0.5 rounded-md">
                {count}
            </span>
        </div>
    );
}

function UserResultCard({ user }) {
    return (
        <Link to={`/user/${user._id}`}>
            <motion.div 
                whileHover={{ y: -4 }}
                className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-all group"
            >
                <img 
                    src={user.pfp} 
                    className="w-14 h-14 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                    alt={user.firstName}
                />
                <div className="flex-1">
                    <h4 className="font-black text-stone-900 tracking-tight">
                        {user.firstName} {user.lastName}
                    </h4>
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-0.5">
                        {user.followersCount || 0} Followers
                    </p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center text-stone-300 group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors">
                    <MagnifyingGlassIcon className="size-4" />
                </div>
            </motion.div>
        </Link>
    );
}

function EmptyResult({ message }) {
    return (
        <div className="py-12 px-8 rounded-3xl border-2 border-dashed border-stone-200 text-center">
            <p className="text-stone-400 font-serif italic">{message}</p>
        </div>
    );
}