import { Component, createResource, createSignal, For } from 'solid-js';
import { Container, Row, Col, Navbar, Nav, NavDropdown } from "solid-bootstrap";

import logo from './logo.svg';
import styles from './App.module.css';

export const Footer: Component = () => {
  return (
    <footer>
      <Container>
        <hr />
        <div style="text-align: right">By Devin Rader.  2022.</div>
      </Container>
    </footer>
  );
};

export default Footer;