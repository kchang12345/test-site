import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import type { SyntheticEvent } from "react";
import type { LoaderFunction } from "@remix-run/node";

import * as gtag from "~/utils/gtags.client";
import * as amplitude from "@amplitude/analytics-browser";
import mixpanel from "mixpanel-browser";
import * as FullStory from "@fullstory/browser";

type LoaderData = {
  gaTrackingId: string | undefined;
  amplitudeTrackingId: string | undefined;
};

export const loader: LoaderFunction = async () => {
  return json<LoaderData>({
    gaTrackingId: process.env.GA_TRACKING_ID,
    amplitudeTrackingId: process.env.AMPLITUDE_TRACKING_ID,
  });
};

export const action: ActionFunction = () => {
  return json({});
};

export default function Contact() {
  const { amplitudeTrackingId } = useLoaderData<LoaderData>();

  if (amplitudeTrackingId) {
    amplitude.init(amplitudeTrackingId);
  }

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    const target = e.target as typeof e.target & {
      message: { value: string };
    };

    console.log(`event.target.message value is: '${target.message.value}'`);
    console.log(`event object is:`, e);

    // Amplitude event
    amplitude.track("Form Submitted");

    // Mixpanel event
    mixpanel.track("Form Submitted");

    // Fullstory event
    if (typeof window !== "undefined") {
      FullStory.event("Form Submitted", {
        uid_str: "750948353",
        plan_name_str: "Professional",
        plan_price_real: 299,
        plan_users_int: 10,
        days_in_trial_int: 42,
        feature_packs: ["MAPS", "DEV", "DATA"],
      });
    }

    // Google Analytics event
    gtag.event({
      action: "submit_form",
      category: "Contact",
      label: target.message.value,
    });
  };

  return (
    <main>
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-2xl">This is the Contact page</h1>
        <p>Submit the form to track an event!</p>
        <Form
          className="w-1/2 max-w-md	flex flex-col"
          onSubmit={handleSubmit}
          replace={false}
          id="contact-form"
        >
          <label className="flex flex-col mt-5">
            <span>Message:</span>
            <textarea className="border border-slate-700" name="message" />
          </label>
          <button
            className="bg-blue-700 text-white p-1 rounded-md mt-5"
            type="submit"
          >
            Submit
          </button>
        </Form>
      </div>

      {/* Fun fact: if you want to use your button outside the form element you can as long as you associate the button with a form attribute targeting the id of the form */}
      {/* <button type="submit" form="contact-form">submit</button> */}
    </main>
  );
}
