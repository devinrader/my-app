import { Component, createResource, createSignal, For } from 'solid-js';
import { Container, Row, Col, Navbar, Nav, NavDropdown } from "solid-bootstrap";

import logo from './logo.svg';
import styles from './App.module.css';

export const Header: Component = () => {
  return (
    <Container>
      <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
              <Navbar.Brand href="/">[unnamed]</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
              <Nav class="me-auto">
                  
              </Nav>
              </Navbar.Collapse>
          </Container>
      </Navbar>
    </Container>
  );
};

export default Header;