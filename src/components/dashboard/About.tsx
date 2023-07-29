import React from "react";
import NavBarComponent from "./NavBar";
import "../../styles/AboutPage.css";
function AboutPage() {
  return (
    <>
      <NavBarComponent />
      <div className="about">
        <h1 id="aboutus">About Us</h1>
        <p>
          Connect with businesses and industry professionals. Build your
          network, gain insights, and forge valuable connections for your future
          career.
        </p>
        <p>
          StudentsHelpBusinesses is the ultimate platform designed specifically
          to help small businesses and high schoolers. Local Businesses often
          have trouble budgeting tasks such as setting up websites, managing
          marketing, or making posters, and often have to pay extravagant sums
          to accomplish these tasks. It connects students with businesses for
          internship opportunities, providing a valuable learning experience and
          a head start in their professional journey, while also empowering
          local businesses and helping them survive. Our mission is to empower
          high schoolers and open doors to a world of opportunities for local
          businesses.
        </p>
      </div>
    </>
  );
}

export default AboutPage;
