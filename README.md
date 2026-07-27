# Slithe Calendar MVP

A live static website for the Slithe civil calendar.

## Rules implemented

- Cena Standard Time (CST) is permanently UTC+09:00.
- No daylight saving time.
- Wholga 1 is the Wholga containing 6 August 1945.
- There is no Wholga 0.
- A Wholga begins on the CST civil day containing the December Winter Solstice.
- Elcetre runs from that day until the first New Moon.
- Each New Moon begins the next Molo.
- Days 1–28 form four seven-day weeks.
- Days 29–30 are Manewe.
- A thirteenth Molo is Zebar.

## Run

Open `index.html` in a modern browser with internet access. The page loads Astronomy Engine 2.1.19 from jsDelivr.

For production, vendor `astronomy.browser.min.js` locally and replace the CDN script tag.

## Important specification decision

Astronomical events are converted into CST, then their entire CST civil date is treated as Day 1. This keeps legal dates from changing during the middle of a civil day.
