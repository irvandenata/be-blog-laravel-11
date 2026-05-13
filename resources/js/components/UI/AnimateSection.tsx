import React, { useEffect, useRef, useState } from "react";

const AnimateSection: React.FC<{
    children: React.ReactNode;
    id: string;
    parentId?: string;
    className?: string;
    outAnimate?: string;
    inAnimate?: string;
    bottom?: number;
}> = ({
    children,
    id,
    parentId,
    className = "",
    outAnimate = "",
    inAnimate = "animate-fade-in",
    bottom = 0,
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const componentRef = React.useRef<HTMLDivElement>(null);
    const height = useRef(0);
    useEffect(() => {
        const handleScroll = () => {
            height.current = document.getElementById(
                parentId || id
            )?.offsetHeight!;
            const top = height.current - 200;
            if (!parentId){
                setIsVisible(true);
                return;
            }
            const section = document.getElementById(parentId);
            const rect = section!.getBoundingClientRect();
            const isInViewport =
                rect.top + top >= 0 && rect.bottom - bottom <= window.innerHeight ;
            if (isInViewport) {
                //remove hidden
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        handleScroll(); // Initial check on component mount
        return () => window.removeEventListener("scroll", handleScroll);
    }, [parentId,top,bottom]);

    return (
        <div
            id={id}
            ref={componentRef}
            className={` ${className} ${
                isVisible ? `  ${inAnimate} ` : ` ${outAnimate}`
            }   opacity-0`}
        >
            {children}
        </div>
    );
};

export default AnimateSection;
