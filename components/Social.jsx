import Link from 'next/link'
import React from 'react'
import { FaGithub, FaLinkedin, FaTwitter, FaYoutube } from 'react-icons/fa'



function Social({containerStyles, iconStyles}) {

    const socials = [
        { icon: <FaGithub />, path: "" },
        { icon: <FaLinkedin />, path: "" },
        { icon: <FaTwitter />, path: "" },
        { icon: <FaYoutube />, path: "" },
    ]

    return (
        <div className={containerStyles}>
            {socials.map((social, index) => (
                <Link key={index} href={social.path} className={iconStyles}> {social.icon} </Link>
            ))}
        </div>
    )
}

export default Social