import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { BsFillCaretDownFill } from "react-icons/bs";
import { UserContext } from "../UserContext";
import axios from "axios";

export default function Header() {
    const { user, setUser } = useContext(UserContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const logout = async () => {
        await axios.post("/logout");
        setUser(null);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="flex items-center justify-between px-6 py-4 border-b bg-white shadow-md">
            {/* Логотип */}
            <Link to="/">
                <img src="../src/assets/logo.png" alt="Logo" className="h-10" />
            </Link>

            {/* Центральная часть с кнопками Home, Create Event и Calendar для десктопа */}
            <div className="hidden md:flex space-x-6">
                <Link
                    to="/"
                    className="text-lg text-gray-800 px-4 py-2 rounded-lg hover:bg-blue-500 hover:text-white transition duration-300"
                >
                    Home
                </Link>
                <Link
                    to="/createEvent"
                    className="text-lg text-gray-800 px-4 py-2 rounded-lg hover:bg-blue-500 hover:text-white transition duration-300"
                >
                    Create Event
                </Link>
                <Link
                    to="/calendar"
                    className="text-lg text-gray-800 px-4 py-2 rounded-lg hover:bg-blue-500 hover:text-white transition duration-300"
                >
                    Calendar
                </Link>
            </div>

            {/* Мобильное меню */}
            <div className="md:hidden flex items-center">
                <button
                    onClick={toggleMenu}
                    className="text-gray-800 p-2 focus:outline-none"
                >
                    <BsFillCaretDownFill className="w-6 h-6" />
                </button>
            </div>

            {/* Профиль и выпадающее меню */}
            <div className="relative">
                {user ? (
                    <div className="relative">
                        <button
                            className="flex items-center space-x-2 text-gray-800"
                            onClick={toggleMenu}
                        >
                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white">
                                {user.name?.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium">{user.name}</span>
                            <BsFillCaretDownFill className="w-4 h-4 text-gray-600" />
                        </button>

                        {/* Выпадающее меню */}
                        {isMenuOpen && (
                            <div className="absolute z-10 flex flex-col w-48 bg-white right-2 rounded-lg shadow-lg">
                                <nav className="block">
                                    <div className="flex flex-col font-semibold text-[16px]">
                                        <Link
                                            className="flex hover:bg-background hover:shadow py-2 pt-3 pl-6 pr-8 rounded-lg"
                                            to="/createEvent"
                                        >
                                            Create Event
                                        </Link>
                                        {/*<Link*/}
                                        {/*    className="flex hover:bg-background hover:shadow py-2 pl-6 pr-8 rounded-lg"*/}
                                        {/*    to="/wallet"*/}
                                        {/*>*/}
                                        {/*    <div>Wallet</div>*/}
                                        {/*</Link>*/}
                                        <Link
                                            className="flex hover:bg-background hover:shadow py-2 pl-6 pr-8 rounded-lg"
                                            to="/calendar"
                                        >
                                            <div>Calendar</div>
                                        </Link>
                                        <Link
                                            className="flex hover:bg-background hover:shadow py-2 pl-6 pb-3 pr-8 rounded-lg"
                                            onClick={logout}
                                        >
                                            Log out
                                        </Link>
                                    </div>
                                </nav>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to="/login">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            Sign In
                        </button>
                    </Link>
                )}
            </div>
        </header>
    );
}
