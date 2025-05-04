import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { BsArrowRightShort, BsArrowDownCircle } from "react-icons/bs";
import { BiLike } from "react-icons/bi";
import axios from "axios";

export default function IndexPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [events, setEvents] = useState([]);
    const [recommendedEvents, setRecommendedEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const eventsRef = useRef(null);

    useEffect(() => {
        axios
            .get("/createEvent")
            .then((response) => {
                setEvents(response.data);
            })
            .catch((error) => {
                console.error("Error fetching events:", error);
            });
    }, []);

    const scrollToEvents = () => {
        eventsRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleGenerate = async () => {
        try {
            setLoading(true);
            setRecommendedEvents([]);
            setResponse('');

            const result = await axios.post('http://localhost:4000/api/generate', {
                prompt
                // Больше не отправляем весь список событий
            });

            if (result.data.recommendedEvents && result.data.recommendedEvents.length > 0) {
                setRecommendedEvents(result.data.recommendedEvents);
                setResponse(result.data.response);
            } else {
                setResponse(result.data.response || "No matching events found based on your preferences.");
            }
        } catch (error) {
            console.error('Error generating AI response:', error);
            setResponse('Error generating recommendations. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleLike = (eventId) => {
        // Implement your like functionality here
        console.log("Liked event:", eventId);
    };

    // Function to render a single event card
    const renderEventCard = (event) => {
        const eventDate = new Date(event.eventDate);
        const currentDate = new Date();

        if (eventDate > currentDate || eventDate.toDateString() === currentDate.toDateString()) {
            return (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all transform hover:scale-105 hover:shadow-xl duration-300" key={event._id}>
                    <div className="relative w-full h-[300px]">
                        {event.image ? (
                            <img
                                src={`http://localhost:4000/api/${event.image}`}
                                alt={event.title}
                                className="w-full h-full object-cover rounded-t-xl"
                            />
                        ) : (
                            <img
                                src="../../src/assets/paduru.png"
                                alt="default image"
                                className="w-full h-full object-cover rounded-t-xl"
                            />
                        )}
                        <div className="absolute bottom-4 right-4 flex gap-4">
                            <button onClick={() => handleLike(event._id)} className="bg-white p-3 rounded-full shadow-lg transition-all hover:text-primary">
                                <BiLike className="text-2xl text-gray-800 hover:text-primary" />
                            </button>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-3">
                            <h1 className="font-bold text-xl text-gray-900">{event.title.toUpperCase()}</h1>
                            <div className="flex items-center text-red-600 gap-2">
                                <BiLike />
                                <span>{event.likes}</span>
                            </div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 mb-4">
                            <span>{event.eventDate.split("T")[0]}, {event.eventTime}</span>
                            <span>{event.ticketPrice === 0 ? 'Free' : 'Rs. ' + event.ticketPrice}</span>
                        </div>
                        <div className="text-xs text-gray-700 mb-4 line-clamp-3">{event.description}</div>
                        <div className="flex justify-between text-sm text-gray-600 mb-4">
                            <div>
                                <div className="font-semibold">Organized By:</div>
                                <span>{event.organizedBy}</span>
                            </div>
                            <div>
                                <div className="font-semibold">Created By:</div>
                                <span>{event.owner.toUpperCase()}</span>
                            </div>
                        </div>
                        <Link to={'/event/' + event._id} className="w-full">
                            <button className="w-full bg-primary text-white py-2 rounded-lg flex justify-center items-center hover:bg-primarydark transition-all">
                                <span className="text-lg font-semibold">Book Ticket</span>
                                <BsArrowRightShort className="w-6 h-6 ml-2" />
                            </button>
                        </Link>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <>
            {/* Hero Section */}
            <div className="mx-10 my-16 flex flex-col md:flex-row items-center justify-around gap-8">
                <div className="flex flex-col md:w-2/5 text-center md:text-left">
                    <h1 className="font-bold text-3xl md:text-4xl text-black mb-4">
                        Discover Amazing Events
                    </h1>
                    <p className="text-gray-700 text-md mb-6">
                        Find and book tickets for the best events happening in your area. From concerts to workshops,
                        we've got everything you're looking for.
                    </p>
                    <button
                        onClick={scrollToEvents}
                        className="bg-gray-800 text-white py-2 px-4 rounded-lg shadow-md hover:bg-gray-700 transition-all"
                    >
                        Explore Events <BsArrowDownCircle className="ml-1 text-white" />
                    </button>
                </div>
                <div className="md:w-1/5">
                    <img
                        src="../../src/assets/hero.webp"
                        alt="Event showcase"
                        className="w-full object-cover h-full"
                    />
                </div>
            </div>

            {/* AI Recommendation Section */}
            {/* Стильная секция AI-рекомендаций в черно-белом дизайне */}
            <div className="mx-4 md:mx-10 mt-12 mb-20">
                <div className="bg-zinc-50 p-6 md:p-10 rounded-2xl shadow-md border border-zinc-100">
                    <h2 className="font-bold text-2xl md:text-3xl text-black mb-6 flex items-center">
                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        Discover Your Perfect Events
                    </h2>

                    <div className="flex flex-col lg:flex-row items-start gap-8">
                        {/* Секция ввода запроса */}
                        <div className="w-full lg:w-3/5">
                            <div className="flex flex-col md:flex-row items-center w-full gap-4">
                                <div className="flex-1 min-h-[54px] w-full overflow-hidden rounded-xl border-2 border-zinc-200 bg-white transition-all duration-300 focus-within:border-zinc-400">
                                    <input
                                        type="text"
                                        placeholder="What kind of event are you looking for? (e.g., 'Jazz concerts' or 'Family events')"
                                        value={prompt}
                                        onChange={(e) => setPrompt(e.target.value)}
                                        className="flex h-14 w-full border-0 bg-transparent px-4 py-2 text-zinc-800 focus:outline-none focus:ring-0 placeholder:text-zinc-400"
                                    />
                                </div>

                                <button
                                    onClick={handleGenerate}
                                    disabled={loading}
                                    className="w-full md:w-auto min-h-[54px] bg-zinc-900 text-white py-3 px-8 rounded-xl hover:bg-black transition-all duration-200 disabled:bg-zinc-400 flex items-center justify-center"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Finding...
                                        </>
                                    ) : (
                                        <>
                                            Find Events
                                            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Секция ответа AI */}
                            {response && (
                                <div className="mt-6 text-zinc-700 p-6 border border-zinc-200 rounded-xl bg-white">
                                    <p className="text-lg font-medium mb-4 flex items-center text-zinc-800">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        AI Recommendations:
                                    </p>
                                    <p className="text-zinc-600 leading-relaxed">{response}</p>
                                </div>
                            )}
                        </div>

                        {/* Секция рекомендованных событий */}
                        {recommendedEvents.length > 0 && (
                            <div className="w-full lg:w-2/5 mt-6 lg:mt-0">
                                <div className="p-6 rounded-xl border border-zinc-200 bg-white">
                                    <h3 className="font-bold text-xl mb-6 text-zinc-800 flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                        </svg>
                                        Recommended Events
                                    </h3>
                                    <div className="space-y-4">
                                        {recommendedEvents.map(eventId => {
                                            const event = events.find(e => e._id === eventId);
                                            if (event) {
                                                return (
                                                    <Link key={event._id} to={'/event/' + event._id} className="block">
                                                        <div className="group overflow-hidden rounded-xl border border-zinc-100 hover:border-zinc-300 transition-all duration-300 hover:shadow-md">
                                                            {/* Изображение события */}
                                                            <div className="relative h-48 w-full overflow-hidden">
                                                                {event.image ? (
                                                                    <img
                                                                        src={`http://localhost:4000/api/${event.image}`}
                                                                        alt={event.title}
                                                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                                    />
                                                                ) : (
                                                                    <img
                                                                        src="../../src/assets/paduru.png"
                                                                        alt="default image"
                                                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                                    />
                                                                )}

                                                                {/* Индикатор цены */}
                                                                <div className="absolute top-4 right-4 bg-white/90 py-1 px-3 rounded-full text-sm font-semibold text-zinc-800 backdrop-blur-sm">
                                                                    {event.ticketPrice === 0 ? 'Free' : `Rs. ${event.ticketPrice}`}
                                                                </div>
                                                            </div>

                                                            {/* Информация о событии */}
                                                            <div className="p-4">
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <h4 className="font-semibold text-zinc-900 text-lg">{event.title}</h4>
                                                                    <div className="flex items-center text-red-500 gap-1">
                                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                                            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                                                                        </svg>
                                                                        <span>{event.likes || 0}</span>
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center text-sm text-zinc-500 mb-3">
                                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                    </svg>
                                                                    <span>
                                                            {event.eventDate.split("T")[0]}, {event.eventTime || 'TBA'}
                                                        </span>
                                                                </div>

                                                                {event.location && (
                                                                    <div className="flex items-center text-sm text-zinc-500 mb-3">
                                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                        </svg>
                                                                        <span>{event.location}</span>
                                                                    </div>
                                                                )}

                                                                <p className="text-sm text-zinc-600 mb-4 line-clamp-2">{event.description}</p>

                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-xs text-zinc-500">By {event.organizedBy || event.owner}</span>
                                                                    <span className="inline-flex items-center text-zinc-900 text-sm font-medium">
                                                            View details
                                                            <svg className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                            </svg>
                                                        </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                );
                                            }
                                            return null;
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Upcoming Events Section */}
            <div ref={eventsRef} className="mt-1 flex flex-col">
                <div className="py-10">
                    <h2 className="font-bold text-3xl text-black text-center mb-8">Upcoming Events</h2>

                    {/* Search Block */}
                    <div className="mx-10 mb-12">
                        <div className="flex-center min-h-[54px] w-full max-w-xl mx-auto overflow-hidden rounded-full bg-[#f6f6f6] px-6 py-3 transition-all duration-300">
                            <input
                                type="text"
                                placeholder="Search for events..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex h-10 w-full rounded-full border-0 bg-transparent px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-0 placeholder:text-gray-400 transition-all duration-200"
                            />
                        </div>

                        {searchQuery && (
                            <div className="w-full max-w-xl mx-auto max-h-40 overflow-auto mt-2 bg-[#f6f6f6] rounded-lg p-4">
                                {events
                                    .filter((event) =>
                                        event.title.toLowerCase().includes(searchQuery.toLowerCase())
                                    )
                                    .map((event) => (
                                        <div key={event._id} className="text-black py-2 hover:bg-gray-200 rounded-md">
                                            <Link to={"/event/" + event._id}>
                                                <div>{event.title}</div>
                                            </Link>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>

                    <div className="mx-10 my-5 grid gap-x-8 gap-y-10 justify-around grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:mx-5">
                        {events.length > 0 && events.map(renderEventCard)}
                    </div>
                </div>
            </div>
        </>
    );
}
