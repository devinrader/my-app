import { Component } from 'solid-js';
import { Container } from "solid-bootstrap";
import { Routes, Route } from "@solidjs/router"

import Header from './Header';
import Footer from './Footer';
import Layout from './routes/layout';
import Overview from './routes/overview';
import Details from './routes/company/details';

const App: Component = () => {

  return (
    <>
    <div class="main-wrap">
      <Header />
      <Container>
        <Routes>
          <Route path="/" component={Layout}>
            <Route path="/" component={Overview} />
            <Route path="/:company" component={Details} />
          </Route>
        </Routes>
      </Container>
      <Footer />
    </div>
    </>
  );
};

export default App;
