/*globals self, async, caches, fetch */
"use strict";
self.importScripts("/assets/js/async.js");

const SITE_CACHE = "skeleton-v1";

self.addEventListener("install", (ev) => {
  const resources = [
    "/",
    "/assets/css/map.css",
    "/assets/css/newtpac2016.css",
    "/assets/css/schedule.css",
    "/assets/css/tpac2016.css",
    "/assets/img/bottom_nav_about_icon.svg",
    "/assets/img/bottom_nav_activity_icon.svg",
    "/assets/img/bottom_nav_calendar_icon.svg",
    "/assets/img/bottom_nav_notification_icon.svg",
    "/assets/img/close-btn-white.svg",
    "/assets/img/cover.svg",
    "/assets/img/dropdown-arrow.svg",
    "/assets/img/first_floor.svg",
    "/assets/img/ground_floor.svg",
    "/assets/img/icon-close.svg",
    "/assets/img/icon-close.svg",
    "/assets/img/icon-schedule.svg",
    "/assets/img/icon-sidenav.svg",
    "/assets/img/location-icon.png",
    "/assets/img/menu-icon-white.svg",
    "/assets/img/myschedule_placeholder.svg",
    "/assets/img/myschedule_placeholder.svg",
    "/assets/img/side_nav_calendar_icon.svg",
    "/assets/img/side_nav_calendar_icon.svg",
    "/assets/img/side_nav_home_icon.svg",
    "/assets/img/side_nav_home_icon.svg",
    "/assets/img/side_nav_location_icon.svg",
    "/assets/img/side_nav_location_icon.svg",
    "/assets/js/app.js",
    "/assets/js/hammer.js",
    "/assets/js/map.js",
    "/assets/js/myschedule.js",
    "/assets/js/schedule.js",
    "/assets/js/side-nav.js",
    "/assets/js/sidenav.js",
    "/assets/js/sidenav.js",
    "/assets/js/svg-pan-zoom.min.js",
    "/assets/js/sw_registration.js",
    "/index",
    "/manifest.json",
    "/overview",
    "/schedule/",
    "/sw.js",
    "/map/",
    "https://fonts.googleapis.com/css?family=Open+Sans:400,100,300,700,900",
  ];
  ev.waitUntil(async.task(function*() {
    const cache = yield caches.open(SITE_CACHE);
    yield cache.addAll(resources);
  }));
});

self.addEventListener("activate", () => {
  async.task(function*() {
    const keys = yield caches.keys();
    yield keys
      .filter(key => key !== SITE_CACHE)
      .map(key => caches.delete(key));
  });
});

self.addEventListener("message", ({ data: { action } }) => {
  switch (action) {
    case "skipWaiting":
      self.skipWaiting();
      break;
  }
});

self.addEventListener("fetch", (ev) => {
  if(new URL(ev.request.url).origin !== self.location.origin){
    return;
  }
  ev.respondWith(async.task(function*() {
    const response = yield caches.match(ev.request);
    if (response) {
      return response;
    }
    console.warn("No caches match for?:", ev.request.url);
    // go to network instead
    try {
      const netResponse = yield fetch(ev.request);
      if (netResponse.ok) {
        return netResponse;
      }
    } catch (err) {
      // just return the index if all goes bad.
      console.error(err, ev.request.url);
    }
    return yield caches.match("/");
  }));
});
