import { Component, createResource, For } from 'solid-js';
import { Container, Row, Col } from "solid-bootstrap";
import { A } from "@solidjs/router"

import Airtable from 'airtable';

const base = new Airtable({apiKey: import.meta.env.VITE_AIRTABLE_KEY}).base('appls7XVxwxuDkhMg');

const fetchCompanies = async () => {
  let allCompanies = await base('Companies').select({sort:[{field: "Name", direction: "asc"}]}).all();
  return allCompanies;
};

export const Companies: Component = () => {

  const [companies] = createResource(fetchCompanies);

  return (
    <Container style="margin:5px">
      <For each={companies()}>{(company) =>
      <Row><Col><A href={`/${company.get('Name')?.toString()}`} end={true} >{company.get('Name')?.toString()}</A></Col></Row>
      }</For>
    </Container>
  );
};

export default Companies;