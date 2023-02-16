import { Component, createEffect, Show, createSignal, For, createResource } from 'solid-js';
import { Container, Row, Col, OverlayTrigger, Tooltip } from "solid-bootstrap";
import { useParams } from "@solidjs/router"
import Airtable, { FieldSet, Records } from 'airtable';

import { Email } from '../../Email'
import { Campaign } from '../../Campaign'
import CampaignCompanies from './companies';

export const Details: Component = () => {

  const base = new Airtable({apiKey: ''}).base('appls7XVxwxuDkhMg');

  const params = useParams();

  const fetchDrips = async (company: string): Promise<Campaign> => {
    console.log(`Fetching ${company}`)
    let records = await base('Emails').select({filterByFormula: `{Company}='${company}'`, sort:[{field: "ReceivedDate", direction: "asc"}]}).all()
    const emails = records.map( r=> {
      let mail = new Email( 
        r.get('From')?.toString(),
        r.get('Subject')?.toString(),
        r.get('RenderedImageUrl')?.toString(),
        r.get('Company')?.toString(),
        r.get('ReceivedDate')?.toString()
      );
      return mail;      
    });
    console.log(emails)
    return new Campaign(emails);    
  };

  const [company, setCompany] = createSignal<string>('');
  const [campaignDateRange, setCampaignDateRange] = createSignal<Date[]>([]);
  const [activeEmail, setActiveEmail] = createSignal<Email>(new Email());
  const [campaign, {mutate, refetch}] = createResource(company, fetchDrips);

  createEffect(() => { 
    setCompany(params.company);     
    if (campaign() && campaign().Emails && campaign().Emails.length>0) {
     setActiveEmail(campaign().Emails[0]);
    } else {
     setActiveEmail(new Email());
    }
  });

  createEffect(() => {
    if (campaign() && campaign()?.Emails && campaign()?.hasReceivedDate()) {
      setCampaignDateRange(dateRange(campaign().tryGetFirstEmailDate()[1], campaign().tryGetLastEmailDate()[1]))
    }
  })

  function dateRange(startDate: Date, endDate: Date, steps = 1, pad = 7) {
    const dateArray = [];
    let currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate()-pad);
    endDate.setDate(endDate.getDate()+pad);

    while (currentDate <= new Date(endDate)) {
      dateArray.push(new Date(currentDate));
      // Use UTC date to prevent problems with time zones and DST
      currentDate.setUTCDate(currentDate.getUTCDate() + steps);
    }
    return dateArray;
  }

  let currentMonth:Number = -1;
  let showMonth:Boolean = false;
  const checkMonth = (m:Number) => { 
    if (m!=currentMonth) {
      currentMonth = m;
      showMonth = true;
    } else {
      showMonth = false;
    }
  }

  const selectImage = (url:string|undefined) => {
    console.log(url)
  }

  return (

    <Row>
      <Col xs={2}>
          <CampaignCompanies />
      </Col>
      <Col xs={10}>
        <Container>
          <h1>{params.company}</h1>
          <Container>
            <div>Homepage</div>
            <div>Signup (isSubdomain) (screenCapture) (dateCaptured) </div>
            <div>Docs (isSubdomain) (screenCapture) (dateCaptured)</div>
            <div>Blog (isSubdomain) (screenCapture) (dateCaptured)</div>
          </Container>
          <h2>Signup Emails</h2>
          <Container>
            <Show when={campaign()?.hasReceivedDate()} fallback="No emails found.">
              <Row style="font-size:small">
                <Col>
                  <div style="display: flex; align-items:center;justify-content:center">
                      <div style="margin:5px 10px;"><strong>First Email:</strong> {campaign()?.tryGetFirstEmailDate()[1].toLocaleString('en-us')}</div>
                      <div style="margin:5px 10px;"><strong>Last Email: </strong> {campaign()?.tryGetLastEmailDate()[1].toLocaleString('en-us')}</div>
                      <div style="margin:5px 10px;"><strong>Total Emails Sent: </strong>{campaign()?.Emails.length}</div>
                      <div style="margin:5px 10px;"><strong>Total Days: </strong>{campaign()?.getTotalCampaignDays()}</div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col style="margin-bottom: 5px;">
                    <div style="display:flex; height:110px;border: 0px solid red; overflow:auto;font-family: Arial, Helvetica, sans-serif;font-size:11px; ">
                      <For each={campaignDateRange()}>{ (d)=> <>
                        {checkMonth(d.getMonth())}
                        <div style="border: 0px blue solid; align-self: flex-end; flex-basis:30px">
                          <div style="text-align:center;margin:3px">
                              <For each={campaign()?.Emails.filter(email => (email.getReceivedDate().getMonth() == d.getMonth()) && (email.getReceivedDate().getDate() == d.getDate()))}>{ (email) =>
                              <>
                                <OverlayTrigger
                                  placement="right"
                                  delay={{ show: 250, hide: 250 }}
                                  overlay={<Tooltip id="button-tooltip">
                                      <div style="text-align:left">
                                        <div>Received: {email.getReceivedDate().toLocaleString()}</div>
                                        <div>Subject: {email.subject?.toString()}</div>
                                      </div>
                                  </Tooltip>}>
                                    <div><button onClick={() => selectImage(setActiveEmail(email).renderedImageUrl)}></button></div>
                                </OverlayTrigger>
                              </>
                              }
                              </For>

                          </div>
                          <div style="border-top: 1px solid black; text-align:center">{d.getDate()}</div>
                          <div style="border-top: 0px solid green; text-align:center">
                          <Show when={showMonth}>
                            {d.toLocaleString('en-us', { month: 'short'})}
                          </Show>&nbsp;
                          </div>
                        </div>
                      </>}
                      </For>
                    </div>
                </Col>
              </Row>
            </Show>
          </Container>

          <Show when={activeEmail().renderedImageUrl}>
            <Container style="background:lightgray;border: 1px solid black;">
              <Row>
                  <Col xs={12} style="font-family:monospace;">
                      <span>From: {activeEmail().from}</span><br />
                      <span>Subject: {activeEmail().subject}</span><br />
                      <span>Received: 
                        <Show when={activeEmail().hasReceivedDate()} fallback={'Undefined'}>
                          {activeEmail().getReceivedDate()?.toLocaleString('en-us')}
                        </Show>
                      </span>
                  </Col>  
              </Row>
              <Row>
                  <Col xs={12} style="margin:5px;padding:0px">
                      <img src={activeEmail().renderedImageUrl} style="max-width:99%;height:auto" />
                  </Col>
              </Row>
              </Container>
              <br />
          </Show>
        </Container>
      </Col>
    </Row>
  );
};

export default Details;
