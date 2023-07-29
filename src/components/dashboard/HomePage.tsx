import { useContext, useEffect, useState } from "react";
import { UserUID, isLoggedIn } from "../../AuthContext";
import { Card, Col, Form, Row } from "react-bootstrap";
import "../../styles/Navbar.css";
import "../../styles/HomePage.css";
import NavBarComponent from "./NavBar";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "../../firebase"; // assuming that you have a file where you setup your Firebase db.
import { Link } from "react-router-dom";
import { Star, StarFill } from "react-bootstrap-icons";

function HomePage() {
  const [jobListings, setJobListings] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [starredJobs, setStarredJobs] = useState([]);
  const userUID = useContext(UserUID); // retrieve userUID from context
  const loggedIn = useContext(isLoggedIn).loggedIn; // check if user is logged in

  const handleCategoryChange = (event) => {
    const category = event.target.name;
    if (event.target.checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(
        selectedCategories.filter((item) => item !== category)
      );
    }
  };

  useEffect(() => {
    // Get initial starred jobs from Firestore
    const fetchStarredJobs = async () => {
      const userDoc = doc(firestore, "users", userUID.userUID);
      const userDocData = await getDoc(userDoc);
      if (userDocData.exists()) {
        const data = userDocData.data();
        setStarredJobs(data.starredJobs || []);
      }
    };
    fetchStarredJobs();

    const jobListingsCollection = collection(firestore, "businesses");
    const unsubscribe = onSnapshot(jobListingsCollection, (snapshot) => {
      const data = snapshot.docs
        .map((doc) => {
          let jobData = doc.data();
          if (jobData.createdAt) {
            // check if the createdAt exists
            let createdAt = jobData.createdAt.toDate(); // Convert Firebase Timestamp to JavaScript Date
            jobData.createdAt = createdAt.toISOString().split("T")[0]; // Convert JavaScript Date to string
          }
          return { ...jobData, id: doc.id };
        })
        .filter(
          (job) =>
            job.image &&
            (selectedCategories.length === 0 ||
              selectedCategories.includes(job.category))
        ); // ignore jobs without image property
      setJobListings(data);
    });

    // Cleanup function
    return () => unsubscribe();
  }, [selectedCategories, userUID]); // Include both dependencies

  const handleStarItem = async (jobId) => {
    // Toggle job ID in starredJobs array
    console.log("starredJobs", starredJobs);
    console.log("jobId", jobId);
    let newStarredJobs;
    if (starredJobs.includes(jobId)) {
      newStarredJobs = starredJobs.filter((job) => job !== jobId);
    } else {
      newStarredJobs = [...starredJobs, jobId];
    }
    setStarredJobs(newStarredJobs);
    console.log("starredJobsnew", starredJobs);
    // Update starredJobs in Firestore
    console.log(typeof firestore, firestore);
    console.log(typeof "users", "users");
    console.log(typeof userUID, userUID);
    if (!userUID) return console.log("userUID is null");
    const userDoc = doc(firestore, "users", userUID.userUID); // replace "users" with your Firebase collection name
    await updateDoc(userDoc, { starredJobs: newStarredJobs }).then(() => {
      console.log("Document successfully updated!");
    });
  };
  // List of categories
  const categories = [
    "Software Development",
    "Marketing",
    "Graphic Design",
    "Writing & Content Creation",
    "Business Development",
    "Sales",
    "Customer Service",
    "Project Management",
    "IT & Networking",
    "Engineering & Architecture",
    "Data Science & Analytics",
    "Legal",
    "Human Resources",
    "Finance & Accounting",
    "Product Management",
    "Video & Animation",
    "Music & Audio",
  ];

  return (
    <>
      <NavBarComponent />
      <div className="homePage">
        <div className="sidebar">
          <h3 className="sidebar-title">Categories</h3>
          <Form className="categories-form">
            {categories.map((category, index) => (
              <Form.Check
                className="category"
                type="checkbox"
                id={`category-${index}`}
                label={category}
                key={index}
                name={category}
                onChange={handleCategoryChange}
              />
            ))}
          </Form>
        </div>
        <div className="listings">
          <>
            {jobListings.map((job, index) => (
              <>
                <div key={index} className="job-listing">
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
                  {loggedIn && (
                    <div className="star">
                      {starredJobs.includes(job.id) ? (
                        <StarFill
                          size={30}
                          onClick={() => handleStarItem(job.id)}
                        />
                      ) : (
                        <Star
                          size={30}
                          onClick={() => handleStarItem(job.id)}
                        />
                      )}
                    </div>
                  )}
                </div>
              </>
            ))}
          </>
        </div>
      </div>
    </>
  );
}

export default HomePage;
