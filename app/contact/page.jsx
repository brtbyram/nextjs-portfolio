
"use client";

import React, { useState } from "react";

import DualLayerLayout from "@/components/layout/DualLayerLayout";

import { useCursor } from "../../lib/context/CursorContext";
import { Mail, Phone } from "lucide-react";
import Link from "next/link";
import TextInput from "@/components/ui/TextInput";

export default function ContactPage() {
    const [contactForm, setContactForm] = useState({
        name: '',
        interestedIn: [],
        email: '',
        message: ''
    });


    const { setVariant, setMaskSize } = useCursor();

    return (
        <DualLayerLayout
            revealChildren={
                <div className="bg-black">
                    <div className="min-h-screen flex flex-col items-start justify-start pt-48 space-y-16 container mx-auto max-w-[950px] px-4 md:px-0">

                        <h1 className="text-neutral-100 sm:font-semibold tracking-[-0.02em] text-6xl lg:text-7xl xl:text-9xl w-[90%] max-w-[950px]" >And We will get in touch</h1>

                        <div className="contact-informations space-y-8" >
                            <div className='text-white font-semibold space-y-8 '>
                                <div className="contact-address text-xl tracking-tight">Osman Dilek Cd. Kardeş sok. no:1/A<br />
                                    Beşikdüzü - Trabzon
                                </div>
                                <div className="contact-meta text-sm md:text-base font-semibold space-y-2">
                                    <div className="flex items-center ">
                                        <Mail className="meta-icon mr-2" size={20} />
                                        <div className="meta-data pl-2 border-l border-neutal-100 p-1 "><Link href="mailto:contact@bemubastudio.com">contact@bemubastudio.com</Link></div>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Phone className="meta-icon mr-1" size={20} />
                                        <div className="meta-data border-l p-1 "><Link href="tel:+90 534 927 5261">+90 534 927 5261</Link></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        >
            <div className="bg-neutral-100 min-h-screen">
                <div className="text-black flex flex-col items-start justify-start pt-48 space-y-16 container mx-auto max-w-[950px] px-4 md:px-0">

                    <h1 onMouseEnter={() => {
                        setVariant("mask")
                        setMaskSize(400)
                    }}
                        onMouseLeave={() => {
                            setVariant("default")
                            setMaskSize(0)
                        }}
                        className="text-[#2B2F31] font-semibold tracking-[-0.02em] text-5xl lg:text-7xl xl:text-9xl w-[90%] max-w-[950px]"
                    >
                        <span className="font-extrabold">Hey!</span> Tell us all the things
                    </h1>


                    <div className="contact-informations space-y-8" >
                        <div className='text-black font-semibold space-y-8 '>
                            <div className="contact-address text-lg md:text-xl tracking-tight">Osman Dilek Cd. Kardeş sok. no:1/A<br />
                                Beşikdüzü - Trabzon
                            </div>
                            <div className="contact-meta text-base font-medium md:font-semibold space-y-3 ">
                                <div className="flex items-center ">
                                    <Mail className="meta-icon mr-2" size={20} />
                                    <div className="meta-data pl-2 border-l border-black px-2 "><Link href="mailto:contact@bemubastudio.com">contact@bemubastudio.com</Link></div>
                                </div>
                                <div className="flex items-center space-x-1 ">
                                    <Phone className="meta-icon mr-1" size={20} />
                                    <div className="meta-data border-l border-black px-2 "><Link href="tel:+90 534 927 5261">+90 534 927 5261</Link></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='contact-form flex flex-col space-y-4 text-black  '>
                        <div className='text-neutral-300 text-2xl '> I&apos;m interested in...</div>
                        <div className='grid grid-cols-2 md:grid-cols-4 gap-2 text-md '>
                            {["Site from strach", "App from strach", "UX/UI design", "Branding", "Animation 2D", "Animation 3D", "Illustration", "Motion Graphics"].map((item, index) => (<div
                                onClick={
                                    () => {
                                        if (contactForm.interestedIn.includes(item)) {
                                            setContactForm({
                                                ...contactForm,
                                                interestedIn: contactForm.interestedIn.filter(i => i !== item)
                                            });
                                        } else {
                                            setContactForm({
                                                ...contactForm,
                                                interestedIn: [...contactForm.interestedIn, item]
                                            });
                                        }
                                    }
                                }
                                key={index}
                                className={contactForm.interestedIn.includes(item) ? 'border rounded-full p-3 px-5 text-center bg-black text-white transition-all' : 'border rounded-full p-3 px-5 text-center hover:bg-neutral-600 hover:text-neutral-200'}>{item}</div>))}
                        </div>

                        <section className='flex flex-col space-y-4'>

                            <TextInput
                                label="Your name"
                                value={contactForm.name}
                                onChange={(e) => {
                                    setContactForm({ ...contactForm, name: e.target.value });
                                    if (errors.name) setErrors({ ...errors, name: "" }); // Yazarken hatayı temizle
                                }}
                            />

                            <TextInput
                                label="Your email"
                                type="email"
                                value={contactForm.email}
                                onChange={(e) => {
                                    setContactForm({ ...contactForm, email: e.target.value });
                                    if (errors.email) setErrors({ ...errors, email: "" }); // Yazarken hatayı temizle
                                }}
                            />

                            <TextInput
                                label="Text us about your project"
                                type="textarea"
                                value={contactForm.message}
                                onChange={(e) => {
                                    setContactForm({ ...contactForm, message: e.target.value });
                                    if (errors.message) setErrors({ ...errors, message: "" }); // Yazarken hatayı temizle
                                }}
                            />

                        </section>
                    </div>

                    <div className="contact-form-submit ">
                        <button className="px-6 py-3 bg-black text-white font-semibold rounded-full hover:bg-neutral-800 transition-colors">
                            Submit
                        </button>
                    </div>
                </div>
                <div className="bg-black h-96 w-screen mt-10">
                    sdfsdf
                </div>
            </div>
        </DualLayerLayout>
    );
}