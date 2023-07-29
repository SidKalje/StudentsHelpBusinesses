import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import {
  doc,
  updateDoc,
  getDoc,
  serverTimestamp,
  getFirestore,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { auth } from "../../firebase";
import "../../styles/listing.css";
import "../../App.css";
import NavBarComponent from "./NavBar";

function EditProfile() {
  const [resume, setResume] = useState<File | null>(null);
  const [resumeTitle, setResumeTitle] = useState<string | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) {
        return;
      }

      const db = getFirestore();
      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData && userData.resume) {
          setResumeUrl(userData.resume);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleResumeChange = (e: { target: { files: any[] } }) => {
    const file = e.target.files[0];
    if (file) {
      const extension = file.name.split(".").pop();
      if (extension !== "pdf") {
        alert("Please upload a PDF file");
        return;
      }
      setResume(file);
      setResumeTitle(file.name);
    } else {
      setResume(null);
      setResumeTitle(null);
    }
  };

  const handleProfileSubmission = async (e) => {
    e.preventDefault();
    // Adjust this condition as per your fields
    if (resume) {
      try {
        const user = auth.currentUser;
        if (!user) {
          throw new Error("User is not signed in");
        }

        const storage = getStorage();
        const storageRef = ref(storage, `users/${user.uid}/resume.pdf`);
        const uploadTask = uploadBytesResumable(storageRef, resume);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
          },
          (error) => {
            console.error("Error uploading resume:", error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                console.log("File available at", downloadURL);
                const db = getFirestore();
                const userRef = doc(db, "users", user.uid);
                await updateDoc(userRef, {
                  resume: downloadURL,
                  updatedAt: serverTimestamp(),
                  // Add other fields to update here...
                });

                setResume(null);
                // Reset other state variables here...
                alert("Profile updated successfully!");
              }
            );
          }
        );
      } catch (error) {
        console.error("Error updating profile:", error);
        alert(
          "An error occurred while updating your profile. Please try again later."
        );
      }
    } else {
      alert("Please fill in all the required fields.");
    }
  };

  return (
    <>
      <NavBarComponent />
      <div className="Listing">
        <div className="AboutCreateListing">
          <Form onSubmit={handleProfileSubmission}>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>
                <span className="titleNames">Resume</span>
              </Form.Label>
              <Form.Control type="file" onChange={handleResumeChange} />
              {resumeTitle && (
                <Form.Text className="text-muted">{resumeTitle}</Form.Text>
              )}
            </Form.Group>
            {resumeUrl && (
              <div>
                <h3>Current Resume:</h3>
                <iframe src={resumeUrl} width="100%" height="500px"></iframe>
              </div>
            )}
            {/* Add more form controls here as per your fields */}
            <Button
              variant="primary"
              type="submit"
              className="lightblue-button"
            >
              Update Profile
            </Button>
          </Form>
        </div>
      </div>
    </>
  );
}

export default EditProfile;
