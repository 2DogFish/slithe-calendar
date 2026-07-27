Slithe Calendar
A live static website for the Slithe civil calendar.
Rules implemented
Cena Standard Time (CST) is permanently UTC+09:00, with no daylight saving time.
Wholga 1 is the Wholga containing 6 August 1945.
Earlier years are Morgra 1, Morgra 2, and so on; there is no year zero.
Ardanna is the Winter Solstice and the first day of each Wholga.
Elcetre runs from Ardanna until the first Molo.
Arrovona is the final day of Elcetre.
Carpanya is the Summer Solstice.
Each New Moon begins the next Molo.
Days 1–28 form four seven-day weeks: Menar, Munare, Thundrin, Sarathra, Shivonte, Siolo, and Ziar.
Days after Day 28 are Manewe and lie outside the weekly cycle.
Glepto is the first Manewe day; Glepta is the second, when present.
A thirteenth Molo is Zebar.
Run
Open `index.html` in a modern browser with internet access. The page loads Astronomy Engine 2.1.19 from jsDelivr.
For production, vendor `astronomy.browser.min.js` locally and replace the CDN script tag.
Astronomical boundary rule
Astronomical events are converted into CST, then their entire CST civil date is treated as the applicable calendar day. This keeps legal dates from changing during the middle of a civil day.
