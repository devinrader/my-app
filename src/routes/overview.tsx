import { Component, createResource, For } from 'solid-js';
import { Container, Row, Col } from "solid-bootstrap";
import { A } from "@solidjs/router"

import Airtable from 'airtable';

const base = new Airtable({apiKey: ''}).base('appls7XVxwxuDkhMg');

const fetchCompanies = async () => {
  let allCompanies = await base('Companies').select({sort:[{field: "Name", direction: "asc"}]}).all();
  return allCompanies;
};

export const Overview: Component = () => {

  const [companies] = createResource(fetchCompanies);

  return (
    <div style="display: flex; flex-flow: row wrap;">
        <For each={companies()}>{(company) =>
          <div style="margin: 5px;"><A href={`/${company.get('Name')?.toString()}`} end={true} >{company.get('Name')?.toString()}</A></div>
        }</For>
    </div>
  );
};

export default Overview;