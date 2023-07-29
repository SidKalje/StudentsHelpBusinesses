import { useContext, useState } from "react";
import { auth } from "../../firebase";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { Link, redirect, useNavigate } from "react-router-dom";
import {
  isLoggedIn,
  UserUID,
  UserEmail,
  UserDisplayName,
  isUserStudent,
} from "../../AuthContext";

function Login() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [passwordShows, setPasswordShows] = useState(false); // [1

  const { loggedIn, setLoggedIn } = useContext(isLoggedIn); // [1]
  const { userUID, setUserUID } = useContext(UserUID); // [1]
  const { userEmail, setUserEmail } = useContext(UserEmail); // [1]
  const { userDisplayName, setUserDisplayName } = useContext(UserDisplayName); // [1]
  const { userStudent, setUserStudent } = useContext(isUserStudent); // [1]
  const navigate = useNavigate();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      console.log("error didn't happen");
      setLoggedIn(true);
      setUserUID(user?.uid);
      setUserEmail(user?.email);

      const db = getFirestore();

      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          setUserDisplayName(docSnap.data().username);
          setUserStudent(docSnap.data().student);
          // do something with displayName
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      }

      console.log(userDisplayName);
      navigate("/");
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("Error happened:", errorMessage);
      alert(errorMessage);
    }
  };

  return (
    <>
      <div className="business-name">Students4Business</div>
      <Form onSubmit={handleLogin}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email Address</Form.Label>
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
          <Form.Label>Password</Form.Label>
          <Form.Control
            type={passwordShows ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check
            type="checkbox"
            label="Show Password"
            checked={!!passwordShows}
            onChange={() => setPasswordShows(!passwordShows)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Login
        </Button>
      </Form>
      <p>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </>
  );
}

export default Login;
