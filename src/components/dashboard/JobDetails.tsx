import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { auth, firestore } from "../../firebase";
import NavBarComponent from "./NavBar";
import "../../styles/JobDetails.css";
import { Container, Row, Col, Button } from "react-bootstrap";
import { isLoggedIn, UserUID } from "../../AuthContext";
import { collection, query, where } from "firebase/firestore";
import { CourierClient } from "@trycourier/courier";

function JobDetails() {
  let { id } = useParams();
  const [jobDetails, setJobDetails] = useState(null);
  const { loggedIn, setLoggedIn } = useContext(isLoggedIn);
  const courier = CourierClient({
    authorizationToken: "pk_prod_HF62V1AYE64SNFQTXTF3YE9MRD0F",
  }); // get from the Courier UI

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(firestore, "businesses", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setJobDetails(docSnap.data());
      } else {
        console.log("No such document!");
      }
    };

    fetchData();
  }, [id]);

  const handleResumeSubmission = async () => {
    const user = auth.currentUser;
    if (!user) return;

    // Check if the user has a resume attached
    const userRef = doc(firestore, "users", user.uid);
    const querySnapshot = await getDoc(userRef);

    if (querySnapshot.exists()) {
      const userData = querySnapshot.data();
      if (userData.resume) console.log("resume exists");
      if (userData && userData.resume) {
        try {
          const response = await fetch(
            "http://localhost:3000/send-resume-email",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                studentEmail: userData.email,
                businessEmail: jobDetails.email,
                phoneNumber: userData.phoneNumber,
                resume: userData.resume,
                roleTitle: jobDetails.roleTitle,
              }),
            }
          );
          if (response.status === 200) {
            alert("Resume sent successfully!");
          }
        } catch (error) {
          console.error(error);
        }
      } else {
        alert(
          "You don't have a resume attached to your profile. Please attach a resume before applying for jobs."
        );
      }
    }
  };
  // Display job details or a loading indicator
  return jobDetails ? (
    <>
      <NavBarComponent />
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            <div id="topBar">
              <h1>{jobDetails.roleTitle}</h1>
              <p>
                <strong>Email:</strong> {jobDetails.email}
              </p>
              <p>
                <strong>Category: </strong>
                {jobDetails.category}
              </p>
              <p>
                <strong>Business Name:</strong> {jobDetails.businessName}
              </p>
            </div>
            <div id="jobDescription">
              <p>
                <h3>
                  <strong>About:</strong>
                </h3>
                {jobDetails.businessAbout}
              </p>
              <p>
                <h3>
                  <strong>Service Description:</strong>{" "}
                </h3>
                {jobDetails.serviceDescription}
              </p>
              <p>
                <h3>
                  <strong>Qualifications:</strong>
                </h3>
                {jobDetails.qualifications}
              </p>
            </div>
          </Col>
        </Row>
      </Container>
      <div className="submitresumeholder">
        {loggedIn && (
          <Button
            className="submitresumebutton"
            onClick={handleResumeSubmission}
          >
            Submit Resume
          </Button>
        )}
      </div>
    </>
  ) : (
    <div>Loading...</div>
  );
}

export default JobDetails;
