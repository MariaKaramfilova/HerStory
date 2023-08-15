import React from "react"
import Posts from "../../components/Posts/Posts.jsx"

/**
 * The Home component displays the home page of the application.
 *
 * @returns {JSX.Element} - JSX representing the Home component.
 */
export default function Home() {
    return (
        <>
        <div style={{ maxWidth: "100%" }}>
        <h3>Welcome to HerStory</h3>
        <p>Women`s Human Rights Forum: A place to connect, learn and act for gender equality. Join us today and be part of the change. 💜</p>
    </div>
         <Posts />
         
         </>
         )
}