import type {
  LoaderFunction,
  LinksFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
} from "@remix-run/react";
import tailwind from "~/tailwind.css";
import { useEffect } from "react";

import * as gtag from "~/utils/gtags.client";
import * as FullStory from "@fullstory/browser";
import mixpanel from "mixpanel-browser";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwind },
];

/**
 * @description
 * If you would like to include the development env values in your browser bundle AKA
 * set some global values on the window object, take a look at these docs here:
 * https://remix.run/docs/en/v1/guides/envvars#server-environment-variables
 */
// export async function loader() {
//   return json({
//     ENV: {
//       APP_ENV: process.env.NODE_ENV,
//     },
//   });
// }

type LoaderData = {
  gaTrackingId: string | undefined;
  amplitudeTrackingId: string | undefined;
  hotjarTrackingId: string | undefined;
  fullstoryOrgId: string | undefined;
  pendoId: string | undefined;
  mixpanelToken: string | undefined;
  taplyticsKey: string | undefined;
};

// Load tracking ids from the .env
export const loader: LoaderFunction = async () => {
  return json<LoaderData>({
    gaTrackingId: process.env.GA_TRACKING_ID,
    amplitudeTrackingId: process.env.AMPLITUDE_TRACKING_ID,
    hotjarTrackingId: process.env.HOTJAR_TRACKING_ID,
    fullstoryOrgId: process.env.FULLSTORY_ORG_ID,
    pendoId: process.env.PENDO_ID,
    mixpanelToken: process.env.MIXPANEL_TOKEN,
    taplyticsKey: process.env.TAPLYTICS_KEY,
  });
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  const location = useLocation();
  const {
    gaTrackingId,
    amplitudeTrackingId,
    hotjarTrackingId,
    fullstoryOrgId,
    pendoId,
    mixpanelToken,
    taplyticsKey,
  } = useLoaderData<LoaderData>();

  useEffect(() => {
    if (gaTrackingId?.length) {
      gtag.pageview(location.pathname, gaTrackingId);
    }
  }, [location, gaTrackingId]);

  if (fullstoryOrgId && typeof window !== "undefined") {
    FullStory.init({ orgId: fullstoryOrgId });
  }

  if (mixpanelToken) {
    mixpanel.init(mixpanelToken, { debug: true });
  }

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        {/* Google Analytics */}
        {!gaTrackingId ? null : (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`}
            />
            <script
              async
              id="gtag-init"
              dangerouslySetInnerHTML={{
                __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', '${gaTrackingId}', {
                  page_path: window.location.pathname,
                });
              `,
              }}
            />
          </>
        )}
        {/* Crazy Egg */}
        <script
          async
          type="text/javascript"
          src={"//script.crazyegg.com/pages/scripts/0113/9198.js"}
        />
        {/* Hotjar */}
        <script
          async
          dangerouslySetInnerHTML={{
            __html: `
              (function(h,o,t,j,a,r){
                  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                  h._hjSettings={hjid:${hotjarTrackingId},hjsv:6};
                  a=o.getElementsByTagName('head')[0];
                  r=o.createElement('script');r.async=1;
                  r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                  a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`,
          }}
        />
        {/* Pendo */}
        <script
          async
          dangerouslySetInnerHTML={{
            __html: `
              (function(apiKey){
                (function(p,e,n,d,o){var v,w,x,y,z;o=p[d]=p[d]||{};o._q=o._q||[];
                v=['initialize','identify','updateOptions','pageLoad','track'];for(w=0,x=v.length;w<x;++w)(function(m){
                    o[m]=o[m]||function(){o._q[m===v[0]?'unshift':'push']([m].concat([].slice.call(arguments,0)));};})(v[w]);
                    y=e.createElement(n);y.async=!0;y.src='https://cdn.pendo.io/agent/static/'+apiKey+'/pendo.js';
                    z=e.getElementsByTagName(n)[0];z.parentNode.insertBefore(y,z);})(window,document,'script','pendo');
            })('${pendoId}');
            
            pendo.initialize({
            visitor: {
                id: 'VISITOR-UNIQUE-ID'   // Required if user is logged in, default creates anonymous ID
                // email: // Recommended if using Pendo Feedback, or NPS Email
                // full_name: // Recommended if using Pendo Feedback
                // role: // Optional

                // You can add any additional visitor level key-values here,
                // as long as it's not one of the above reserved names.
            },

            account: {
                id: 'ACCOUNT-UNIQUE-ID' // Required if using Pendo Feedback, default uses the value 'ACCOUNT-UNIQUE-ID'
                // name:         // Optional
                // is_paying:    // Recommended if using Pendo Feedback
                // monthly_value:// Recommended if using Pendo Feedback
                // planLevel:    // Optional
                // planPrice:    // Optional
                // creationDate: // Optional

                // You can add any additional account level key-values here,
                // as long as it's not one of the above reserved names.
            }
        });
            `,
          }}
        />
        {/* Matomo */}
        <script
          async
          dangerouslySetInnerHTML={{
            __html: `
              var _paq = window._paq = window._paq || [];
              /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
              _paq.push(['trackPageView']);
              _paq.push(['enableLinkTracking']);
              (function() {
                var u="https://astoundingsnickerdoodle24b5fenetlifyapp.matomo.cloud/";
                _paq.push(['setTrackerUrl', u+'matomo.php']);
                _paq.push(['setSiteId', '1']);
                var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
                g.async=true; g.src='//cdn.matomo.cloud/astoundingsnickerdoodle24b5fenetlifyapp.matomo.cloud/matomo.js'; s.parentNode.insertBefore(g,s);
              })();
            `,
          }}
        />
        {/* Amplitude */}
        {amplitudeTrackingId && (
          <script
            type="text/javascript"
            dangerouslySetInnerHTML={{
              __html: `
               !function(){"use strict";!function(e,t){var r=e.amplitude||{_q:[]};if(r.invoked)e.console&&console.error&&console.error("Amplitude snippet has been loaded.");else{r.invoked=!0;var n=t.createElement("script");n.type="text/javascript",n.integrity="sha384-GS6YJWyepBi+TL3uXx5i7xx1UTA9iHaZr9q+5uNsuhzMb8c1SfkKW4Wee/IxZOW5",n.crossOrigin="anonymous",n.async=!0,n.src="https://cdn.amplitude.com/libs/analytics-browser-1.0.0-min.js.gz",n.onload=function(){e.amplitude.runQueuedFunctions||console.log("[Amplitude] Error: could not load SDK")};var s=t.getElementsByTagName("script")[0];function v(e,t){e.prototype[t]=function(){return this._q.push({name:t,args:Array.prototype.slice.call(arguments,0)}),this}}s.parentNode.insertBefore(n,s);for(var o=function(){return this._q=[],this},i=["add","append","clearAll","prepend","set","setOnce","unset","preInsert","postInsert","remove","getUserProperties"],a=0;a<i.length;a++)v(o,i[a]);r.Identify=o;for(var u=function(){return this._q=[],this},c=["getEventProperties","setProductId","setQuantity","setPrice","setRevenue","setRevenueType","setEventProperties"],l=0;l<c.length;l++)v(u,c[l]);r.Revenue=u;var p=["getDeviceId","setDeviceId","regenerateDeviceId","getSessionId","setSessionId","getUserId","setUserId","setOptOut","setTransport"],d=["init","add","remove","track","logEvent","identify","groupIdentify","setGroup","revenue"];function f(e){function t(t,r){e[t]=function(){var n={promise:new Promise((r=>{e._q.push({name:t,args:Array.prototype.slice.call(arguments,0),resolve:r})}))};if(r)return n}}for(var r=0;r<p.length;r++)t(p[r],!1);for(var n=0;n<d.length;n++)t(d[n],!0)}f(r),e.amplitude=r}}(window,document)}();

              amplitude.init('${amplitudeTrackingId}');
              `,
            }}
          />
        )}
        {/* Taplytics */}
        <script
          async
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              !function(){var t=window.Taplytics=window.Taplytics||[];if(window._tlq=window._tlq||[],!t.identify&&!t.loaded){t.loaded=!0,t.funcs=["init","identify","track","page","reset","propertiesLoaded","runningExperiments","variable","codeBlock"],t.mock=function(n){return function(){var e=Array.prototype.slice.call(arguments);return e.unshift(n),window._tlq.push(e),t}};for(var n=0;n<t.funcs.length;n++){var e=t.funcs[n];t[e]=t.mock(e)}t.load=function(){var t=document.createElement("script");t.type="text/javascript",t.async=!0,t.src="//cdn.taplytics.com/taplytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n)},t.load()}}();

              Taplytics.init("${taplyticsKey}");
          `,
          }}
        />

        <header>
          <nav className="p-5">
            <ul className="flex gap-x-4">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
              <li>
                <Link to="/profile">Profile</Link>
              </li>
            </ul>
          </nav>
        </header>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
