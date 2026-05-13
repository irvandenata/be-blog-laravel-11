"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import AnimateSection from "../UI/AnimateSection";
import toast from "react-hot-toast";
import { sendMessage } from "@/services/landing";

const generateCaptcha = () => Math.random().toString(36).substring(2, 7);

const CardGetInTouch = () => {
    const [captchaText, setCaptchaText] = useState(generateCaptcha);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
        captcha: "",
    });

    const refreshCaptcha = () => {
        setCaptchaText(generateCaptcha());
        setFormData((current) => ({
            ...current,
            captcha: "",
        }));
    };

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (formData.captcha !== captchaText) {
            toast.error("Captcha is not correct !");
            refreshCaptcha();
            return;
        }

        setIsSubmitting(true);

        try {
            await toast.promise(
                sendMessage({
                    name: formData.name,
                    email: formData.email,
                    subject: formData.subject,
                    message: formData.message,
                }),
                {
                    loading: "Sending message...",
                    success: "Message sent successfully",
                    error: "Failed to send message",
                },
                {
                    duration: 3000,
                }
            );

            setFormData({
                name: "",
                email: "",
                subject: "",
                message: "",
                captcha: "",
            });
            setCaptchaText(generateCaptcha());
        } catch {
            refreshCaptcha();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full lg:p-10  ">
            <AnimateSection
                className=""
                id="content-get-in-touch"
                parentId="get-in-touch"
                inAnimate="animate-fade-on"
                outAnimate="animate-go-away"
                bottom={1000}
            >
                <div className="flex justify-center">
                    <h1 className="text-3xl font-bold">
                        Get <span className="text-primary">In</span> Touch
                    </h1>
                </div>
                <div className="flex justify-center text-center mt-4">
                    <p>
                        Feel free to reach out to me <br /> if you'd like to
                        discuss further or collaborate on a project
                    </p>
                </div>
            </AnimateSection>
            <AnimateSection
                className=""
                id="content-get-in-touch"
                parentId="get-in-touch"
                inAnimate="animate-fade-in"
                outAnimate="animate-go-away"
                bottom={200}
            >
                <form
                    className="mt-6 lg:w-8/12 sm:w-full text-black dark:bg-dark dark:border-gray-dark bg-slate-50 border-2 border-bodydark  p-6 rounded-lg mx-auto"
                    id="form-get-in-touch"
                    onSubmit={handleSubmit}
                >
                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white ">
                            Your Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            autoComplete="off"
                            value={formData.name}
                            onChange={handleChange}
                            className="bg-gray-50 border-2 border-bodydark  text-gray-900 text-sm rounded-lg focus:outline-primary  block w-full p-2.5 dark:bg-gray-700 dark:border-bodydark -600 dark:placeholder-gray-400 dark:text-dark dark:focus:border-bodydark  "
                            placeholder="your name"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Your email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            autoComplete="off"
                            value={formData.email}
                            onChange={handleChange}
                            className="bg-gray-50 border-2 border-bodydark  text-gray-900 text-sm rounded-lg focus:outline-primary  block w-full p-2.5 dark:bg-gray-700 dark:border-bodydark -600 dark:placeholder-gray-400 dark:text-dark dark:focus:border-bodydark  "
                            placeholder="your@email.com"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Subject
                        </label>
                        <input
                            type="text"
                            id="subject"
                            name="subject"
                            autoComplete="off"
                            value={formData.subject}
                            onChange={handleChange}
                            className="bg-gray-50 border-2 border-bodydark  text-gray-900 text-sm rounded-lg focus:outline-primary  block w-full p-2.5 dark:bg-gray-700 dark:border-bodydark -600 dark:placeholder-gray-400 dark:text-dark dark:focus:border-bodydark  "
                            placeholder="What would you like to discuss?"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Your Message
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            className=" bg-gray-50 border-2 border-bodydark  text-gray-900 text-sm rounded-lg focus:outline-primary focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-bodydark -600 dark:placeholder-gray-400 dark:text-dark dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            spellCheck="false"
                            required
                        ></textarea>
                    </div>

                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            Captcha
                        </label>
                        <div className="text-dark flex  my-2 dark:text-white text-center">
                            <div className="text-lg font-bold p-2 bg-bodydark rounded-lg dark:text-white">
                                {captchaText}
                            </div>
                        </div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white ">
                            Type the captcha shown above to continue.
                        </label>
                        <input
                            type="text"
                            id="captcha"
                            name="captcha"
                            autoComplete="off"
                            value={formData.captcha}
                            onChange={handleChange}
                            className="bg-gray-50 border-2 border-bodydark  text-gray-900 text-sm rounded-lg focus:outline-primary  block w-full p-2.5 dark:bg-gray-700 dark:border-bodydark -600 dark:placeholder-gray-400 dark:text-dark dark:focus:border-bodydark  "
                            placeholder="Type the captcha"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="text-white dark:bg-slate-400  dark:text-white bg-blue-700 hover:bg-blue-800 bg-background focus:ring-4 dark:hover:bg-primary hover:bg-primary focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        {isSubmitting ? "Sending..." : "Send"} &nbsp;
                        <svg
                            className="w-3.5 h-3.5 inline-block"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 10"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M1 5h12m0 0L9 1m4 4L9 9"
                            ></path>
                        </svg>
                    </button>
                </form>
            </AnimateSection>
        </div>
    );
};

export default CardGetInTouch;
