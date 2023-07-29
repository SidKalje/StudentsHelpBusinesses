import { Button, Dropdown, Form } from "react-bootstrap";
import { useContext, useState } from "react";
import React from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { auth } from "../../firebase";
import "../../styles/listing.css";
import "../../App.css";
import { isLoggedIn, isUserStudent } from "../../AuthContext";
import NavBarComponent from "./NavBar";

function RegisterABusiness() {
  const [image, setImage] = useState<File | null>(null);
  const [email, setEmail] = useState("");
  const [businessAbout, setBusinessAbout] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [category, setCategory] = useState("");

  const { userStudent, setUserStudent } = useContext(isUserStudent);
  const handleImageChange = (e: { target: { files: any[] } }) => {
    const file = e.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      const extension = file.name.split(".").pop();
      if (extension !== "png" && extension !== "jpg") {
        alert("Please upload a png or jpg image");
        return;
      }
      setImage(file); // Store the File object instead of the object URL
    } else {
      setImage(null);
    }
  };

  const handleCategoryChange = (
    eventKey: React.SetStateAction<string>,
    event: any
  ) => {
    setCategory(eventKey); // Update the category when a dropdown item is selected
  };

  const handleListingSubmission = async (e) => {
    e.preventDefault();

    if (
      image &&
      email &&
      businessAbout &&
      roleTitle &&
      serviceDescription &&
      qualifications &&
      category &&
      businessName &&
      businessEmail
    ) {
      try {
        // Ensure the user is signed in
        const user = auth.currentUser;
        if (!user) {
          throw new Error("User is not signed in");
        }

        // Get a reference to the Firebase storage
        const storage = getStorage();
        const storageRef = ref(storage, "business-logos/" + image.name);

        // Upload the image to Firebase Storage
        const uploadTask = uploadBytesResumable(storageRef, image);

        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
          },
          (error) => {
            // Handle unsuccessful uploads
            console.error("Error uploading image:", error);
          },
          () => {
            // Do something once upload is complete
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                console.log("File available at", downloadURL);

                // Get a reference to the Firestore database
                const db = getFirestore();

                // Create a new document in the "businesses" collection of Firestore
                const businessesCollectionRef = collection(db, "businesses");
                await addDoc(businessesCollectionRef, {
                  uid: user.uid,
                  image: downloadURL,
                  email,
                  businessAbout,
                  businessName,
                  roleTitle,
                  serviceDescription,
                  qualifications,
                  businessEmail,
                  category, // Store the category
                  createdAt: serverTimestamp(), // Store the date and time the listing was made
                });

                // Reset form fields and state variables after successful submission
                setImage(null);
                setEmail("");
                setBusinessAbout("");
                setRoleTitle("");
                setServiceDescription("");
                setQualifications("");

                alert("Business registered successfully!");
              }
            );
          }
        );
      } catch (error) {
        console.error("Error registering business:", error);
        alert(
          "An error occurred while registering the business. Please try again later."
        );
      }
    } else {
      alert("Please fill in all the required fields.");
    }
  };

  return (
    <>
      <NavBarComponent />
      {!userStudent && isLoggedIn && (
        <div className="Listing">
          <div className="AboutCreateListing">
            <Form onSubmit={handleListingSubmission}>
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>
                  <span className="titleNames">Business Logo</span>
                </Form.Label>
                <Form.Control type="file" onChange={handleImageChange} />
                {image && (
                  <div>
                    <img
                      src={URL.createObjectURL(image)} // Create an object URL from the File object
                      alt="preview"
                      style={{
                        width: "100px",
                        height: "100px",
                        margin: "10px auto",
                      }}
                    />
                    <button
                      onClick={() => setImage(null)}
                      style={{
                        display: "block",
                        margin: "10px auto",
                        fontSize: "14px",
                        padding: "5px 10px",
                      }}
                    >
                      Change Image
                    </button>
                  </div>
                )}
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>
                  <span className="titleNames">Business Email Address</span>
                </Form.Label>
                <Form.Control
                  type="email"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>
                  <span className="titleNames">Business Name</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Youtube Inc."
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>
                  <span className="titleNames">Business About</span>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={10}
                  value={businessAbout}
                  onChange={(e) => setBusinessAbout(e.target.value)}
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>
                  <span className="titleNames">Role Title:</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Software Engineering Intern"
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                />
                <Dropdown
                  className="category-dropdown lightblue-dropdown"
                  onSelect={handleCategoryChange}
                >
                  <Dropdown.Toggle variant="success" id="dropdown-basic">
                    {category ? category + "" : "Select a Category"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item eventKey="Software Development">
                      Software Development
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="Marketing">
                      Marketing
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="Graphic Design">
                      Graphic Design
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="Writing & Content Creation">
                      Writing & Content Creation
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="Business Development">
                      Business Development
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="Sales">Sales</Dropdown.Item>
                    <Dropdown.Item eventKey="Customer Service">
                      Customer Service
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="Project Management">
                      Project Management
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="IT & Networking">
                      IT & Networking
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="Engineering & Architecture">
                      Engineering & Architecture
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="Data Science & Analytics">
                      Data Science & Analytics
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="Legal">Legal</Dropdown.Item>
                    <Dropdown.Item eventKey="Human Resources">
                      Human Resources
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="Finance & Accounting">
                      Finance & Accounting
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="Product Management">
                      Product Management
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="Video & Animation">
                      Video & Animation
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="Music & Audio">
                      Music & Audio
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>
                  <span className="titleNames">
                    Description of Service Needed:
                  </span>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={10}
                  value={serviceDescription}
                  onChange={(e) => setServiceDescription(e.target.value)}
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>
                  <span className="titleNames">Qualifications Preferred:</span>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={10}
                  value={qualifications}
                  onChange={(e) => setQualifications(e.target.value)}
                />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>
                  <span className="titleNames">Contact Us(Email): </span>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={1}
                  value={businessEmail}
                  onChange={(e) => setBusinessEmail(e.target.value)}
                />
              </Form.Group>
              <Button
                variant="primary"
                type="submit"
                className="lightblue-button"
              >
                Submit Listing
              </Button>
            </Form>
          </div>
        </div>
      )}
    </>
  );
}

export default RegisterABusiness;
