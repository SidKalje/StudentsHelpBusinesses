import React from "react";
import { Link } from "react-router-dom";
import { UserEmail, UserUID, isLoggedIn } from "../../AuthContext";
import { getAuth, signOut } from "firebase/auth";
import { Container, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "../../styles/Navbar.css";
import { UserDisplayName, isUserStudent } from "../../AuthContext";
import { useContext } from "react";

function NavBar() {
  const lightblue = "#B0E0E6";

  const { loggedIn, setLoggedIn } = useContext(isLoggedIn);
  const { userUID, setUserUID } = useContext(UserUID);
  const { userEmail, setUserEmail } = useContext(UserEmail);
  const { userDisplayName, setUserDisplayName } = useContext(UserDisplayName);
  const { userStudent, setUserStudent } = useContext(isUserStudent);

  return (
    <Navbar
      style={{ backgroundColor: lightblue }}
      variant="light"
      expand="lg"
      fixed="top"
    >
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>StudentsHelpBusinesses</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto me-4">
            <LinkContainer to="/about">
              <Nav.Link>About</Nav.Link>
            </LinkContainer>
            {!userStudent && loggedIn && (
              <LinkContainer to="/createlisting">
                <Nav.Link>Create Listing</Nav.Link>
              </LinkContainer>
            )}
            <LinkContainer to="/login">
              <Nav.Link
                onClick={() => {
                  if (loggedIn) {
                    const auth = getAuth();
                    signOut(auth)
                      .then(() => {
                        setLoggedIn(false);
                        console.log("User signed out successfully");
                      })
                      .catch((error) => {
                        console.error("Error signing out:", error);
                      });
                    setLoggedIn(false);
                    setUserUID("");
                    setUserEmail("");
                  }
                }}
              >
                {loggedIn ? "Logout" : "Login"}
              </Nav.Link>
            </LinkContainer>
            <NavDropdown
              title={
                loggedIn && userDisplayName != null
                  ? "Hi " + userDisplayName + "!"
                  : "Profile"
              }
              id="basic-nav-dropdown"
              align="end"
            >
              {loggedIn ? (
                <>
                  <LinkContainer to="/editprofile">
                    <NavDropdown.Item>Edit Resume</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/viewlistings">
                    <NavDropdown.Item>View Saved Listings</NavDropdown.Item>
                  </LinkContainer>
                  {!userStudent && (
                    <LinkContainer to="/viewcreatedlistings">
                      <NavDropdown.Item>Edit Listings</NavDropdown.Item>
                    </LinkContainer>
                  )}
                </>
              ) : (
                <LinkContainer to="/login">
                  <NavDropdown.Item>Login</NavDropdown.Item>
                </LinkContainer>
              )}
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
