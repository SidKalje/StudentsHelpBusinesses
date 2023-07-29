import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { doc, setDoc, getFirestore } from "firebase/firestore";
import { auth } from "../../firebase";
import { useState, useEffect } from "react";
import { Col, Button, Row, Container, Card, Form } from "react-bootstrap";
import { Link, redirect, useNavigate } from "react-router-dom";
import "../../styles/RegisterPage.css";

export default function Registration() {
  const [password, setPassword] = useState("");
  const [secondPassword, setSecondPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [username, setUsername] = useState("");
  const [student, setStudent] = useState(false);
  const [passwordShows, setPasswordShows] = useState(false);

  const navigate = useNavigate();

  const handleRegistration = async (e: any) => {
    e.preventDefault();
    if (password !== secondPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("Registration successful");

      // Create a Firestore reference
      const db = getFirestore();
      const docRef = doc(db, "users", userCredential.user.uid);

      // Set the data
      await setDoc(docRef, {
        username: username,
        phoneNumber: phoneNumber,
        email: email,
        student: student,
        starredJobs: [],
      });

      console.log("Document written with ID: ", userCredential.user.uid);
      navigate("/login");
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("Error happened:", errorMessage);
      alert(errorMessage);
    }
  };

  const handleRoleChange = (e: any) => {
    setStudent(e.target.value === "student");
  };

  return (
    <>
      <Form onSubmit={handleRegistration}>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="Username"
            placeholder="Enter UserName"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="PhoneNumber"
            placeholder="Enter Phone #"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <Form.Text className="text-muted">
            We'll never share your phone # with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type={passwordShows ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Verify Password</Form.Label>
          <Form.Control
            type={passwordShows ? "text" : "password"}
            placeholder="Password"
            value={secondPassword}
            onChange={(e) => setSecondPassword(e.target.value)}
          />
        </Form.Group>
        <div className="middleHolder">
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check
              type="checkbox"
              label="Show Password"
              checked={!!passwordShows}
              onChange={() => setPasswordShows(!passwordShows)}
            />
          </Form.Group>
          <Form.Select
            aria-label="Default select example"
            className="sbselector"
            onChange={handleRoleChange}
          >
            <option value="student">Student</option>
            <option value="business">Business</option>
          </Form.Select>
        </div>
        <Button variant="primary" type="submit">
          Sign Up
        </Button>
      </Form>
      <p>
        Already Have An Account? <Link to="/">Login</Link>
      </p>
    </>
  );
}
