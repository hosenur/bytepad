import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/clerk-react";
import {
    animate,
    motion,
    useMotionTemplate,
    useMotionValue,
} from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];

export const Landing = () => {
    const { isSignedIn } = useAuth();
    const navigate = useNavigate()
    const color = useMotionValue(COLORS_TOP[0]);

    useEffect(() => {
        animate(color, COLORS_TOP, {
            ease: "easeInOut",
            duration: 10,
            repeat: Infinity,
            repeatType: "mirror",
        });
    }, []);

    const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;
    const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;

    return (
        <motion.section
            style={{
                backgroundImage,
            }}
            className="relative grid min-h-screen place-content-center overflow-hidden bg-gray-950 px-4 py-24 text-gray-200"
        >
            <div className="relative z-10 flex flex-col items-center">
                <h1 className="max-w-3xl bg-gradient-to-br from-white to-gray-400 bg-clip-text text-center text-3xl font-bold leading-tight text-transparent sm:text-5xl sm:leading-tight md:text-7xl md:leading-tight">
                    Your Byte Pad Awaits
                </h1>
                <p className="my-6 max-w-2xl text-center text-base leading-relaxed md:text-lg md:leading-relaxed">
                    Byte Pad is an online playground for developers. React, Next.js, Nuxt ? We got you covered. Start coding now. Choose from a plethora of templates and get started.
                </p>
                <Button
                    onClick={() => navigate(isSignedIn ? "/playgrounds" : "/login")}
                    variant={"default"}>
                    {
                        isSignedIn ? "Go to Playgrounds" : "Get Started"
                    }
                </Button>
                {/* <motion.button
                    style={{
                        boxShadow,
                    }}
                    whileHover={{
                        scale: 1.015,
                    }}
                    whileTap={{
                        scale: 0.985,
                    }}
                    className="group relative flex w-fit items-center gap-1.5 rounded-md bg-gray-950/10 px-4 py-2 text-gray-50 transition-colors hover:bg-gray-950/50"
                >
                    Get Started
                </motion.button> */}
            </div>

        </motion.section>
    );
};