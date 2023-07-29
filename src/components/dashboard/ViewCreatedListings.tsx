import { useState, useEffect, useContext } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "../../firebase";
import { UserUID, isLoggedIn } from "../../AuthContext";
import { Card, Row, Col, Spinner, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import NavBarComponent from "./NavBar";
//import "../../styles/StarredListings.css";
import "../../styles/EditListing.css";
import "../../styles/HomePage.css";

function ViewListings() {
  const [businessJobs, setBusinessJobs] = useState([]);
  const userUID = useContext(UserUID).userUID;

  useEffect(() => {
    const fetchBusinessJobs = async () => {
      const jobsQuery = query(
        collection(firestore, "businesses"),
        where("uid", "==", userUID)
      );
      const querySnapshot = await getDocs(jobsQuery);
      const jobsData = [];

      querySnapshot.forEach((doc) => {
        let jobData = doc.data();
        if (jobData.createdAt) {
          let createdAt = jobData.createdAt.toDate();
          jobData.createdAt = createdAt.toISOString().split("T")[0];
        }
        jobsData.push({ ...jobData, id: doc.id });
      });

      setBusinessJobs(jobsData);
    };

    fetchBusinessJobs();
  }, []);

  return (
    <>
      <NavBarComponent />
      <div className="viewlistingspage">
        <h1 id="ListingsTitle">Your Listings</h1>
        <div className="listings">
          {businessJobs.length === 0 ? (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : null}
          {businessJobs.map((job, index) => (
            <>
              <Link to={`/job/${job.id}`}>
                <Card key={index} className="mb-4 job-card">
                  <Card.Body>
                    <Row>
                      <Col xs={2}>
                        <Card.Img
                          className="listingImg"
                          variant="right"
                          src={job.image}
                        />
                      </Col>
                      <Col xs={5}>
                        <Card.Title>
                          <span className="jobtitles">{job.roleTitle}</span>
                        </Card.Title>
                        <Card.Text className="listingBasicInfo">
                          <strong>{job.createdAt}</strong>
                          <br />
                          <strong>{job.businessName}</strong>
                          <br />
                          <span className="category">{job.category}</span>
                        </Card.Text>
                      </Col>
                      <Col xs={3} className="jobdesc">
                        <p>
                          Job Description: <br />
                          {job.serviceDescription}
                        </p>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Link>
            </>
          ))}
        </div>
      </div>
    </>
  );
}

export default ViewListings;
