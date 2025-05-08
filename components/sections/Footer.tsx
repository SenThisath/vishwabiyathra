import { Facebook, Instagram } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer
            className={`bg-black text-white w-full py-16 px-6 md:px-12 transition-opacity duration-700`}
        >
            <div className="max-w-7xl mx-auto">
                <div className="relative pb-12">
                    <div className="h-px w-full bg-gray-800 relative overflow-hidden">
                        <div
                            className="h-px bg-white absolute left-0 top-0 animate-lineMove"
                            style={{ width: "30%" }}
                        ></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                    <div className="md:col-span-4">
                        <h2 className="text-3xl font-bold tracking-tighter mb-3">
                            VISHWABHIYATHRA
                        </h2>
                        <p className="text-gray-400 mb-8 text-sm">
                            A Paradise Where Legends Are Born.
                        </p>
                        <div className="flex items-center">
                            <span className="inline-block h-3 w-3 rounded-full bg-green-400 animate-pulse mr-2"></span>
                            <span className="text-xs uppercase tracking-wider">
                                Now on Live.
                            </span>
                        </div>
                    </div>

                    <div className="md:col-span-4">
                        <h3 className="text-sm uppercase tracking-widest mb-6 font-medium text-gray-400">
                            Navigation
                        </h3>
                        <ul className="space-y-4">
                            {["Home", "About", "Leader Board", "Competitions", "Contact Us"].map(
                                (item, index) => (
                                    <li key={index}>
                                        <Link
                                            href={`#${item.toLowerCase()}`}
                                            className="text-2xl font-light hover:text-white transition-colors duration-300 block relative overflow-hidden group"
                                        >
                                            <span>{item}</span>
                                            <span className="w-0 h-px bg-white absolute bottom-0 left-0 group-hover:w-full transition-all duration-300"></span>
                                        </Link>
                                    </li>
                                )
                            )}
                        </ul>
                    </div>

                    <div className="md:col-span-4">
                        <h3 className="text-sm uppercase tracking-widest mb-6 font-medium text-gray-400">
                            Connect
                        </h3>
                        <div className="flex flex-col space-y-4">
                            {[
                                {
                                    title: "Instagram",
                                    link: "https://instagram.com",
                                    icon: Instagram,
                                },
                                {
                                    title: "Facebook",
                                    link: "https://instagram.com",
                                    icon: Facebook,
                                },
                            ].map((item, index) => (
                                <Link
                                    key={index}
                                    href={item.link}
                                    className="text-2xl font-light hover:text-white transition-colors duration-300 relative overflow-hidden group flex items-center"
                                >
                                    <item.icon className="mr-2 text-xl" />
                                    <span>{item.title}</span>
                                    <span className="ml-2 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                        →
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-20 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center">
                    <p className="text-sm text-gray-500">
                        &copy; Bandarayanayaka Collage Science Society. All
                        rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
