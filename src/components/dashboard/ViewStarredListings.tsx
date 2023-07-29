// In viewStarred.js
import { useState, useEffect, useContext } from "react";
import { collection, doc, getDoc } from "firebase/firestore";
import { firestore } from "../../firebase";
import { UserUID, isLoggedIn } from "../../AuthContext";
import { Card, Row, Col, Spinner, Nav } from "react-bootstrap";
import { StarFill, Star } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import NavBarComponent from "./NavBar";
import "../../styles/StarredListings.css";
import "../../styles/HomePage.css";

function ViewStarred() {
  const [starredJobs, setStarredJobs] = useState([]);
  const [jobListings, setJobListings] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const userUID = useContext(UserUID).userUID;

  useEffect(() => {
    const fetchStarredJobs = async () => {
      const userDoc = doc(firestore, "users", userUID);
      const userData = (await getDoc(userDoc)).data();
      const jobIds = userData.starredJobs || [];
      const jobsData = [];
      for (const id of jobIds) {
        const jobDoc = doc(firestore, "businesses", id);
        const jobData = (await getDoc(jobDoc)).data();
        if (jobData.createdAt) {
          // check if the createdAt exists
          let createdAt = jobData.createdAt.toDate();
          jobData.createdAt = createdAt.toISOString().split("T")[0];
        }
        jobsData.push({ ...jobData, id: id });
      }
      setStarredJobs(jobsData);
    };

    fetchStarredJobs();
  }, []);

  return (
    <>
      <NavBarComponent />
      <div className="viewlistingspage">
        <h1 id="StarredJobsTitle">Starred Jobs</h1>
        <div className="listingsStarred">
          {starredJobs.length === 0 ? (
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : null}
          {starredJobs.map((job, index) => (
            <>
              {console.log(job)}
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

export default ViewStarred;
